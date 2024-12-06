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
    const handleRegister = () => {
        console.log(username
            , email
            , password
            , confirmPassword)
    }
    const handleLoginRedirect = () => {
        navigation.navigate("Login")
    }

  return (
    <Screen>
        <View style={styles.container}>
            <Text style={styles.headerText} >Create Your Account</Text>
            <TextInput style={styles.input} label="Username" value={username} onChangeText={setUsername} mode='outlined' placeholder='Enter Your Username' />
            <TextInput style={styles.input} label="Email" mode='outlined' placeholder='Enter Your Email' keyboardType="email-address" />
            <TextInput style={styles.input} label="Password" mode='outlined' placeholder='Enter Your Password' secureTextEntry={true} />
            <TextInput style={styles.input} label="Confirm Password" mode='outlined' placeholder='Confirm Your Password' secureTextEntry={true}  />
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