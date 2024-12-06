import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Screen from '../../components/screen'
import { Button, TextInput } from 'react-native-paper'
import { useNavigation } from "@react-navigation/native";



const RegisterScreen = () => {
    const navigation = useNavigation();

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [name, setName] = useState("")
    const [secondName, setSecondName] = useState("")

    const handleRegister = async () => {
        console.log(username
            , email
            , password
            , confirmPassword,
        name, secondName)

        const master_password_hash = password

        const requestData = {
            username: username,
            email: email,
            name: name,
            surname: secondName,
            master_password_hash: master_password_hash
        }

        const response = await fetch("192.168.223.153:5050", {
            method: "POST",
            body: JSON.stringify(requestData)
        });

        const data = await response.json()

        console.log(data)
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
        allignItems: 'center',
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