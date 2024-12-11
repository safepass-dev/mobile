import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import config from "../../../config.json";
import NativeCrypto from "../../../modules/native-crypto";

const API_URL = config.API_URL;

const LoginScreen = () => {
    const navigation = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")

    const [encryptedKeyData, setEncryptedKeyData] = useState("");

    const [loading, setLoading] = useState(false);

    const sendLoginRequest = async (masterPasswordHash, protectedSymmetricKey) => {
        const requestData = {
            email,
            masterPasswordHash
        };

        const response = await fetch(`http://${API_URL}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        const data = await response.json();
        console.log(response.status, response.statusText, data);

        setLoading(false);

        if (!response.ok) {
            // Kayıt başarısız. Ekrana bildirim basılacak.
            return
        }

        // Kayıt başarılı. Ekrana bildirim basıp token ve user id local db'ye kayıt edilecek.
    }

    const listener = ({ value: result }) => {
        setEncryptedKeyData(result);
    }

    useFocusEffect(
        React.useCallback(() => {
            NativeCrypto.addListener("onResult", listener);
    
            return () => {
                NativeCrypto.removeListener("onResult", listener);
            };
        }, [])
    )

    useEffect(() => {
        if (encryptedKeyData === "") {
            // Şifreleme sırasında bir hata var. Ekrana hata bildirimi basılacak.
            return
        }

        console.log(encryptedKeyData);
        
        const data = JSON.parse(encryptedKeyData);

        const masterPasswordHash = data.masterPasswordHash;
        const protectedSymmetricKey = data.protectedSymmetricKey;

        if (
            masterPasswordHash === "" ||
            masterPasswordHash ===  null ||
            protectedSymmetricKey === "" ||
            protectedSymmetricKey === null
        ) {
            // Şifreleme sırasında bir hata var. Ekrana hata bildirimi basılacak.
            return
        }

        sendLoginRequest(masterPasswordHash, protectedSymmetricKey);
    }, [encryptedKeyData]);

    const handleLogin = async () => {
        setLoading(true);
        NativeCrypto.createMph(password, email);
    }

    const handleSignUpRedirect = () => {
        navigation.navigate("Register");
    }
    return (
        <View style={styles.container}>
            {/* Logo */}
            <Image
                source={{ uri: "https://via.placeholder.com/100" }} // Logo URL'nizi buraya ekleyin
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
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={<TextInput.Icon icon="eye-off" />}
            />

            {/* Şifre Unutma */}
            <Text style={styles.forgotPassword}>Forgot Password?</Text>

            {/* Giriş Yap Butonu */}
            <Button mode="contained" style={styles.loginButton} onPress={handleLogin}>
                Log In
            </Button>

            {/* Alternatif */}
            <Text style={styles.orText}>Or</Text>
            {/* Kayıt Ol */}
            <Text style={styles.signUp}>
                Don’t have an account? <Text style={styles.signUpLink} onPress={handleSignUpRedirect}>Sign Up</Text>
            </Text>
        </View>
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
