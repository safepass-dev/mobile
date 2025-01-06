import LoadingScreen from "@/components/loadingScreen";
import { addUser } from "@/database/dbServices/usersDatabase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, PaperProvider, Text, TextInput } from "react-native-paper";
import config from "../../../config.json";
import NativeCrypto from "../../../modules/native-crypto";
import CustomModal from "../../components/customModal";

const API_URL = config.API_URL;

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [encryptedKeyData, setEncryptedKeyData] = useState("");

  const [loading, setLoading] = useState(false);
  const [isFirst, setIsFirst] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("default");

  const db = useSQLiteContext();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const showSuccess = (message) => {
    setModalType("success");
    setModalMessage(message);
    setModalVisible(true);
  };

  const showError = (message) => {
    setModalType("error");
    setModalMessage(message);
    setModalVisible(true);
  };

  const sendLoginRequest = async (masterPasswordHash, encryptionKeys) => {
    const requestData = {
      email,
      master_password_hash: masterPasswordHash,
    };

    const response = await fetch(`http://${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const data = await response.json();
    console.log(response.status, response.statusText, data);

    setLoading(false);

    if (!response.ok) {
      // Kayıt başarısız. Ekrana bildirim basılacak.
      showError("incorrect password or email");
      return;
    }

    const user_id = data.data.user_id;
    const token = data.data.token;

    // Giriş başarılı. Ekrana bildirim basıp token ve user id local db'ye kayıt edilecek.
    await addUser(db, user_id, token);

    navigation.navigate("Dashboard", { user_id, encryptionKeys });
  };

  const listener = ({ value: result }) => {
    setEncryptedKeyData(result);
  };

  useFocusEffect(
    React.useCallback(() => {
      NativeCrypto.addListener("onResult", listener);

      return () => {
        NativeCrypto.removeListener("onResult", listener);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isFirst) {
        setIsFirst(false);
        return;
      }

      if (encryptedKeyData === "") {
        // Şifreleme sırasında bir hata var. Ekrana hata bildirimi basılacak.
        // Burası login ekranına girildiği gibi tetikleniyor ve modal gösteriliyor.
        showError("Şifreleme sırasında bir hata var!");

        return;
      }

      console.log(encryptedKeyData);

      const data = JSON.parse(encryptedKeyData);

      const masterPasswordHash = data.masterPasswordHash;
      const encryptionKeys = data.encryptionKeys;

      if (
        masterPasswordHash === "" ||
        masterPasswordHash === null ||
        encryptionKeys === "" ||
        encryptionKeys === null
      ) {
        // Şifreleme sırasında bir hata var. Ekrana hata bildirimi basılacak.
        showError("Şifreleme sırasında bir hata var.!");
        return;
      }

      try {
        sendLoginRequest(masterPasswordHash, encryptionKeys);
      } catch (error) {
        setLoading(false);
        showError("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }, [encryptedKeyData])
  );

  const handleLogin = async () => {
    setLoading(true);
    NativeCrypto.createMph(password, email);
  };

  const handleSignUpRedirect = () => {
    navigation.navigate("Register");
  };
  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          style={styles.logo}
        />

        {/* Başlık */}
        <Text style={styles.title}>Sign in to your Account</Text>
        <Text style={styles.subtitle}>
          Enter your email and password to log in
        </Text>

        {/* Email ve Password Alanları */}
        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={styles.input}
          left={<TextInput.Icon icon="email" />}
        />
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        {/* Şifre Unutma */}
        <Text style={styles.forgotPassword}>Forgot Password?</Text>

        {/* Giriş Yap Butonu */}
        <Button
          mode="contained"
          style={styles.loginButton}
          onPress={handleLogin}
        >
          Log In
        </Button>

        {/* Alternatif */}
        <Text style={styles.orText}>Or</Text>
        {/* Kayıt Ol */}
        <Text style={styles.signUp}>
          Don’t have an account?{" "}
          <Text style={styles.signUpLink} onPress={handleSignUpRedirect}>
            Sign Up
          </Text>
        </Text>

        <CustomModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          type={modalType}
          message={modalMessage}
        />

        <Button onPress={() => showSuccess("DENEME")}>ShowModal</Button>
      </View>

      <LoadingScreen text={"UNLOCKING THE VAULT"} visible={loading} />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    alignSelf: "center",
    marginBottom: 20,
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#6200ee",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    borderRadius: 5,
  },
  orText: {
    textAlign: "center",
    marginVertical: 15,
    color: "#999",
  },
  socialButton: {
    borderColor: "#ddd",
    marginBottom: 15,
  },
  signUp: {
    textAlign: "center",
    marginTop: 15,
    color: "#666",
  },
  signUpLink: {
    color: "#6200ee",
    fontWeight: "bold",
  },
});

export default LoginScreen;
