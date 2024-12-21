import { useNavigation } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import Screen from "../../components/screen";
import {
  addUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../database/dbServices/useDatabase";

const HomeScreen = () => {
  const db = useSQLiteContext();
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleAddUser = async () => {
    addUser(db, 2, "dummyToken");
  };

  const handleGetUsers = async () => {
    const users = await getUsers(db);
    console.log(users);
  };

  const handleDeleteUser = () => {
    deleteUser(db, 2);
  };

  const handleUpdateUser = () => {
    updateUser(db, 2, "updatedToken");
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.logoImage}
        />
        {/* Uygulamaya Hoş Geldiniz */}
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Text style={styles.appText}>SafePass</Text>
        {/* Butonlar */}
        <Button
          mode="contained"
          style={styles.loginButton}
          onPress={handleLogin}
        >
          {" "}
          Sign In
        </Button>
        <Button
          mode="outlined"
          style={styles.registerButton}
          onPress={handleRegister}
        >
          {" "}
          Create New Account
        </Button>
        <Button onPress={handleAddUser}> Add User To LocalDatabase </Button>
        <Button onPress={handleGetUsers}> Get Users From LocalDatabase </Button>
        <Button onPress={handleDeleteUser}>
          {" "}
          Delete User From LocalDatabase{" "}
        </Button>
        <Button onPress={handleUpdateUser}>
          {" "}
          Update User From LocalDatabase{" "}
        </Button>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  logoImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5,
  },
  appText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6200ee",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    width: "100%",
    borderRadius: 5,
    marginBottom: 15,
  },
  registerButton: {
    borderColor: "#6200ee",
    borderWidth: 2,
    paddingVertical: 8,
    width: "100%",
    borderRadius: 5,
  },
});

export default HomeScreen;
