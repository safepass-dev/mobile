package expo.modules.nativecrypto

import android.content.Context
import android.content.SharedPreferences
import androidx.core.os.bundleOf

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

import android.util.Base64
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import org.json.JSONObject
import java.security.SecureRandom
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.Mac
import javax.crypto.SecretKey
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.IvParameterSpec
import javax.crypto.spec.PBEKeySpec
import javax.crypto.spec.SecretKeySpec
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.security.MessageDigest

class NativeCryptoModule : Module() {
    private val randomGenerator = SecureRandom();
    private val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
    private val chacha20Cipher = Cipher.getInstance("ChaCha20/Poly1305/NoPadding");

    override fun definition() = ModuleDefinition {
        Name("NativeCrypto")

        Constants(
            "PI" to Math.PI
        )

        Events("onResult");

        Function("createMphAndPsk") { password: String, email: String ->
            createMphAndPsk(password, email);
        }

        Function("createMph") { password: String, email: String ->
            createMph(password, email);
        }

        Function("getEncryptionKey") {
            return@Function getPreferences().getString("encryptionKey", "");
        }

        Function("setEncryptionKey") { psk: String, keys: String ->
            return@Function saveEncryptionKeyFun(psk, keys);
        }

        Function("removeEncryptionKey") {
            val preferences = getPreferences();
            val editor = preferences.edit();
            editor.remove("encryptionKey");

            val isCleared = editor.commit();
            
            return@Function isCleared;
        }

        Function("encryptWithChaCha20") { data: String, key: String ->
            return@Function encryptChaCha20(data, key);
        }

        Function("decryptWithChaCha20") { data: String, key: String ->
            return@Function decryptChaCha20(data, key);
        }
    }

    private val context
    get() = requireNotNull(appContext.reactContext)

    private fun getPreferences(): SharedPreferences {
        return context.getSharedPreferences(context.packageName + ".vault", Context.MODE_PRIVATE)
    }

    private fun generateRandomBytes(length: Int): ByteArray {
        val nonce = ByteArray(length);
        randomGenerator.nextBytes(nonce);

        return nonce;
    }

    private fun pbkdf2(data: CharArray, salt: ByteArray, iterations: Int, dkLen: Int): SecretKey {
        val spec = PBEKeySpec(data, salt, iterations, dkLen);
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

        return factory.generateSecret(spec);
    }

    suspend fun pbkdf2Async(
        data: CharArray,
        salt: ByteArray,
        iterations: Int,
        dkLen: Int
    ): SecretKey {
        return withContext(Dispatchers.Default) {
            val spec = PBEKeySpec(data, salt, iterations, dkLen);
            val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

            spec.password
            factory.generateSecret(spec);
        }
    }

    private fun encryptWithAES256(data: ByteArray, key: SecretKey, iv: IvParameterSpec): ByteArray {
        cipher.init(Cipher.ENCRYPT_MODE, key, iv);

        return cipher.doFinal(data);
    }

    private fun decryptWithAES256(encryptedData: ByteArray, key: SecretKey, iv: IvParameterSpec): ByteArray {
        cipher.init(Cipher.DECRYPT_MODE, key, iv);

        return cipher.doFinal(encryptedData);
    }

    private fun hkdf(data: ByteArray, key: ByteArray, info: ByteArray?, outputSize: Int): ByteArray {
        val mac = Mac.getInstance("HmacSHA256");
        val keySpec = SecretKeySpec(key, "HmacSHA256");
        mac.init(keySpec);

        var previousBlock = ByteArray(0);
        mac.update(data);
        val prk = mac.doFinal();

        val okm = ByteArray(outputSize);
        var generatedBytes = 0;
        var blockIndex = 0;

        while (generatedBytes < outputSize) {
            blockIndex++;

            mac.init(SecretKeySpec(prk, "HmacSHA256"));
            mac.update(previousBlock);
            info?.let { mac.update(it) };
            mac.update(byteArrayOf(blockIndex.toByte()));

            previousBlock = mac.doFinal();
            val bytesToCopy = minOf(previousBlock.size, outputSize - generatedBytes);
            System.arraycopy(previousBlock, 0, okm, generatedBytes, bytesToCopy);
            generatedBytes += bytesToCopy;
        }

        return okm;
    }

    private fun createStretchedMasterKey(masterKey: ByteArray, email: ByteArray): ByteArray {
        val info = "safepass".toByteArray();
        val outputSize = 64;

        return hkdf(masterKey, email, info, outputSize);
    }

    fun createProtectedSymmetricKey(masterKey: ByteArray, email: ByteArray): String {
        val stretchedMasterKey = createStretchedMasterKey(masterKey, email);

        val secretKey = SecretKeySpec(stretchedMasterKey, 0, 32, "AES");
        val macKey = SecretKeySpec(stretchedMasterKey, 32, 32, "HmacSHA256");

        val keyGenerator = KeyGenerator.getInstance("AES");
        keyGenerator.init(256);
        val symmetricKey = keyGenerator.generateKey();

        val ivByteArray = generateRandomBytes(16);
        val iv = IvParameterSpec(ivByteArray);
        val ciphertext = encryptWithAES256(symmetricKey.encoded, secretKey, iv);

        val mergedData = ivByteArray + ciphertext

        val mac = Mac.getInstance("HmacSHA256");
        mac.init(macKey);
        mac.update(mergedData);

        val ciphertextMac = mac.doFinal();

        val ciphertextMacBase64 = Base64.encodeToString(ciphertextMac, Base64.NO_WRAP);
        val ciphertextBase64 = Base64.encodeToString(ivByteArray + ciphertext, Base64.NO_WRAP);

        return "$ciphertextMacBase64:$ciphertextBase64";
    }

    private fun _pbkdf2(
        password: ByteArray,
        salt: ByteArray,
        iterations: Int,
        keyLength: Int // Key length in bits
    ): ByteArray {
        val hmacAlgorithm = "HmacSHA256"
        val mac = Mac.getInstance(hmacAlgorithm)
        mac.init(SecretKeySpec(password, hmacAlgorithm))

        val hashLength = mac.macLength
        val numBlocks = Math.ceil(keyLength / 8.0 / hashLength).toInt()
        val derivedKey = ByteArray(numBlocks * hashLength)

        var offset = 0
        for (blockIndex in 1..numBlocks) {
            val block = generateBlock(mac, salt, iterations, blockIndex)
            System.arraycopy(block, 0, derivedKey, offset, block.size)
            offset += block.size
        }

        return derivedKey.copyOf(keyLength / 8) // Return the required key length
    }

    private fun generateBlock(mac: Mac, salt: ByteArray, iterations: Int, blockIndex: Int): ByteArray {
        val blockIndexBytes = ByteArray(4)
        blockIndexBytes[3] = (blockIndex and 0xFF).toByte()
        blockIndexBytes[2] = (blockIndex shr 8 and 0xFF).toByte()
        blockIndexBytes[1] = (blockIndex shr 16 and 0xFF).toByte()
        blockIndexBytes[0] = (blockIndex shr 24 and 0xFF).toByte()

        val initialInput = salt + blockIndexBytes
        var u = mac.doFinal(initialInput)
        val output = u.copyOf()

        for (i in 1 until iterations) {
            u = mac.doFinal(u)
            for (j in output.indices) {
                output[j] = (output[j].toInt() xor u[j].toInt()).toByte()
            }
        }

        return output
    }

    private fun performKeyDerivationAndEncryption(
        password: String,
        emailBytes: ByteArray,
        iterations: Int,
        dkLen: Int
    ): Deferred<String> {
        val passwordCharArray = password.toCharArray();

        return CoroutineScope(Dispatchers.Main).async {
            try {
                val masterKey = withContext(Dispatchers.Default) {
                    pbkdf2Async(passwordCharArray, emailBytes, iterations, dkLen)
                }

                val protectedSymmetricKey = createProtectedSymmetricKey(masterKey.encoded, emailBytes);

                val passwordBytes = password.toByteArray();
                val masterPasswordHash = _pbkdf2(masterKey.encoded, passwordBytes, 1, dkLen);

                val masterPasswordHashBase64 = Base64.encodeToString(masterPasswordHash, Base64.NO_WRAP);

                val jsonObject = JSONObject();
                jsonObject.put("masterPasswordHash", masterPasswordHashBase64);
                jsonObject.put("protectedSymmetricKey", protectedSymmetricKey);

                return@async jsonObject.toString();
            } catch (e: Exception) {
                return@async "";
            }
        }
    }

    private fun performKeyDerivation(
        password: String,
        emailBytes: ByteArray,
        iterations: Int,
        dkLen: Int
    ): Deferred<String> {
        val passwordCharArray = password.toCharArray();

        return CoroutineScope(Dispatchers.Main).async {
            try {
                val masterKey = withContext(Dispatchers.Default) {
                    pbkdf2Async(passwordCharArray, emailBytes, iterations, dkLen)
                }
                val masterKeyEncoded = masterKey.encoded;

                val passwordBytes = password.toByteArray();
                val masterPasswordHash = _pbkdf2(masterKeyEncoded, passwordBytes, 1, dkLen);

                val masterPasswordHashBase64 = Base64.encodeToString(masterPasswordHash, Base64.NO_WRAP);

                val stretchedMasterKey = createStretchedMasterKey(masterKeyEncoded, emailBytes);
                val secretKey = stretchedMasterKey.copyOfRange(0, 32);
                val macKey = stretchedMasterKey.copyOfRange(32, 64);

                val secretKeyBase64 = Base64.encodeToString(secretKey, Base64.NO_WRAP);
                val macKeyBase64 = Base64.encodeToString(macKey, Base64.NO_WRAP);

                val jsonObject = JSONObject();
                jsonObject.put("masterPasswordHash", masterPasswordHashBase64);
                jsonObject.put("encryptionKeys", "$secretKeyBase64:$macKeyBase64");

                return@async jsonObject.toString();
            } catch (e: Exception) {
                return@async "";
            }
        }
    }

    fun createMphAndPsk(password: String, email: String): String {
        val emailBytes: ByteArray = email.toByteArray();

        val iterations = 600000;
        val dkLen = 32 * 8;

        CoroutineScope(Dispatchers.Main).launch {
            val result = performKeyDerivationAndEncryption(password, emailBytes, iterations, dkLen).await();
            this@NativeCryptoModule.sendEvent("onResult", bundleOf("value" to result));
        }

        return "hello";
    }

    fun createMph(password: String, email: String): String {
        val emailBytes: ByteArray = email.toByteArray();

        val iterations = 600000;
        val dkLen = 32 * 8;

        CoroutineScope(Dispatchers.Main).launch {
            val result = performKeyDerivation(password, emailBytes, iterations, dkLen).await();
            this@NativeCryptoModule.sendEvent("onResult", bundleOf("value" to result));
        }

        return "hello";
    }

    fun saveEncryptionKeyFun(protectedSymmetricKeyBase64: String, keyBase64: String): String {
        var parts = protectedSymmetricKeyBase64.split(":");
        val mac = parts[0];
        val data = parts[1];

        parts = keyBase64.split(":");
        val enKeyBase64 = parts[0];
        val macKeyBase64 = parts[1];

        val protectedSymmetricKey = Base64.decode(data, Base64.NO_WRAP);
        val macBytes = Base64.decode(mac, Base64.NO_WRAP);
        val enKey = SecretKeySpec(Base64.decode(enKeyBase64, Base64.NO_WRAP), "AES");
        val macKey = Base64.decode(macKeyBase64, Base64.NO_WRAP);

        if (!verifyMac(macKey, protectedSymmetricKey, macBytes)) {
            return "error: invalid mac";
        }

        val iv = IvParameterSpec(protectedSymmetricKey.copyOfRange(0, 16));
        val ciphertext = protectedSymmetricKey.copyOfRange(16, protectedSymmetricKey.size);

        val encryptionKey = decryptWithAES256(ciphertext, enKey, iv);
        val encodedEncryptionKey = Base64.encodeToString(encryptionKey, Base64.NO_WRAP);

        getPreferences().edit().putString("encryptionKey", encodedEncryptionKey).apply()

        return encodedEncryptionKey;
    }

    private fun verifyMac(
        macKey: ByteArray,
        ciphertext: ByteArray,
        receivedMac: ByteArray
    ): Boolean {
        val mac = Mac.getInstance("HmacSHA256");
        mac.init(SecretKeySpec(macKey, "HmacSHA256"));
        mac.update(ciphertext);

        val calculatedMac = mac.doFinal();
        return MessageDigest.isEqual(receivedMac, calculatedMac);
    }

    fun encryptChaCha20(data: String, key: String): String {
        val keyBytes = Base64.decode(key, Base64.NO_WRAP);
        val dataBytes = data.toByteArray();

        val privateKey = SecretKeySpec(keyBytes, "ChaCha20");
        val nonce = ByteArray(12).apply { SecureRandom().nextBytes(this) };

        chacha20Cipher.init(Cipher.ENCRYPT_MODE, privateKey, IvParameterSpec(nonce));
        val ciphertext = chacha20Cipher.doFinal(dataBytes);

        val encodedCiphertext = Base64.encodeToString(nonce + ciphertext, Base64.NO_WRAP);

        return encodedCiphertext;
    }

    fun decryptChaCha20(encryptedData: String, key: String): String {
        val keyBytes = Base64.decode(key, Base64.NO_WRAP);
        val encryptedBytes = Base64.decode(encryptedData, Base64.NO_WRAP);

        val nonce = encryptedBytes.copyOfRange(0, 12);

        val ciphertext = encryptedBytes.copyOfRange(12, encryptedBytes.size);

        val privateKey = SecretKeySpec(keyBytes, "ChaCha20");
        chacha20Cipher.init(Cipher.DECRYPT_MODE, privateKey, IvParameterSpec(nonce));

        val decryptedData = chacha20Cipher.doFinal(ciphertext);

        return decryptedData.toString(Charsets.UTF_8);
    }
}