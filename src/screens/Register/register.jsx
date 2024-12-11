import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Screen from '../../components/screen'
import { Button, TextInput } from 'react-native-paper'
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import config from "../../../config.json";
import NativeCrypto from "../../../modules/native-crypto";

const API_URL = config.API_URL;

const RegisterScreen = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [secondName, setSecondName] = useState("")

    const [encryptedKeyData, setEncryptedKeyData] = useState("");

    const [loading, setLoading] = useState(false);

    const sendRegisterRequest = async (masterPasswordHash, protectedSymmetricKey) => {
        const requestData = {
            username,
            email,
            name,
            surname: secondName,
            password,
            masterPasswordHash,
            protectedSymmetricKey
        };

        const response = await fetch(`http://${API_URL}/api/v1/auth/register`, {
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

        // Kayıt başarılı. Ekrana bildirim basıp logine yönlendirilecek.
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

        sendRegisterRequest(masterPasswordHash, protectedSymmetricKey);
    }, [encryptedKeyData]);

    const handleRegister = async () => {
        console.log({ username, email, password });

        if (password != confirmPassword) {
            // Şifreler eşleşmiyor. Ekrana hata mesajı basılacak.
            return
        }

        setLoading(true);
        NativeCrypto.createMphAndPsk(password, email);
    }
    const handleLoginRedirect = () => {
        navigation.navigate("Login")
    }

  return (
    <Screen>
        <View style={styles.container}>
            <Text style={styles.headerText} >Create Your Account</Text>
            <TextInput style={styles.input} label="Username" value={username} onChangeText={setUsername} mode='outlined' placeholder='Enter Your Username' />
            <TextInput style={styles.input} label="Email" mode='outlined' value={email} onChangeText={setEmail} placeholder='Enter Your Email' keyboardType="email-address" />
            <TextInput style={styles.input} label="Name" mode='outlined' value={name} onChangeText={setName} placeholder='Enter Your Name (optional)' />
            <TextInput style={styles.input} label="SecondName" mode='outlined' value={secondName} onChangeText={setSecondName} placeholder='Enter Your Second Name (optional)' />
            <TextInput style={styles.input} label="Password" mode='outlined' value={password} onChangeText={setPassword} placeholder='Enter Your Password' secureTextEntry={true} />
            <TextInput style={styles.input} label="Confirm Password" mode='outlined' value={confirmPassword} onChangeText={setConfirmPassword} placeholder='Confirm Your Password' secureTextEntry={true}  />
            <Button mode="contained" style={styles.registerButton} onPress={handleRegister}> Sign Up</Button>
            <Text style={styles.footerText} >Already have an account?{" "}
                <Text style={{color: '#6200ee' , fontWeight:"bold"}} onPress={handleLoginRedirect}  > Sign In</Text>
            </Text>
            
        </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      footerContainer:{
            marginTop: 25,
      },
      headerText:{
            fontSize: 28,
            fontWeight: 'bold',
            marginBottom: 30,
            color: "#6200ee",
            textAlign: 'center',
      },
      footerText:{
            fontSize: 14,
            color: '#333',
            textAlign: 'center',
            marginBottom: 20,
      },
      input:{
          marginBottom: 15,
          width: '100%',
      },
      registerButton:{
          width: '100%',
          backgroundColor: "#6200ee",
          paddingVertical: 8,
          borderRadius: 5,
          marginTop: 35,
          marginBottom: 15,
      }

})

export default RegisterScreen