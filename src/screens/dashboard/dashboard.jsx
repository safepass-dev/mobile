import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Appbar, Button, PaperProvider } from "react-native-paper";
import PasswordCard from "../../components/passwordCard";
import AddPasswordModal from "../../components/passwordModal";
import { useSQLiteContext } from "expo-sqlite";
import { getUserFromId } from "@/database/dbServices/useDatabase";
import config from "../../../config.json";
import { useFocusEffect } from "@react-navigation/native";
import CustomModal from "@/components/customModal";
import NativeCrypto from "../../../modules/native-crypto";
import LoadingScreen from "@/components/loadingScreen";

const API_URL = config.API_URL;

const DashboardScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [passwords, setPasswords] = React.useState([]);

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("default");

  const showSuccess = (message) => {
    setModalType("success");
    setModalMessage(message);
    setInfoModalVisible(true);
  };

  const [token, setToken] = useState("");

  const db = useSQLiteContext();

  const { user_id } = route.params;

  const filteredPasswords = passwords.filter(
    (item) =>
      item.app_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const user = await getUserFromId(db, user_id);
          setToken(user.token);
        } catch (error) {
          console.log(error)
        }
      })();
    }, [])
  )

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          console.log(token)

          if (token === "") {
            return;
          }

          const response = await fetch(`http://${API_URL}/api/v1/vault/passwords`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
  
          const data = await response.json();
          console.log(data)
          
          if (!response.ok) {
            return;
          }

          const encryptionKey = NativeCrypto.getEncryptionKey();

          const decryptedData = data.data.map(item => {
            if (item.app_name && item.app_name != "") {
              item.app_name = decrypt(item.app_name, encryptionKey);
            }

            if (item.username && item.username != "") {
              item.username = decrypt(item.username, encryptionKey);
            }

            return item;
          });

          setPasswords(decryptedData);
        } catch (error) {
          console.log(error)
        }
      })();
    }, [token])
  )

  function encrypt(data, encryptionKey) {
    const encryptedData = NativeCrypto.encryptWithChaCha20(data, encryptionKey);

    return encryptedData;
  }

  function decrypt(data, encryptionKey) {
    const decryptedData = NativeCrypto.decryptWithChaCha20(data, encryptionKey);

    return decryptedData;
  }

  const addNewPassword = async (newPassword) => {
    const encryptionKey = NativeCrypto.getEncryptionKey();

    const encrypted_password = encrypt(newPassword.password, encryptionKey);
    const encrypted_title = newPassword.title != "" ? encrypt(newPassword.title, encryptionKey) : "";
    const encrypted_uri = newPassword.uri != "" ? encrypt(newPassword.uri, encryptionKey) : "";
    const encrypted_username = newPassword.username != "" ? encrypt(newPassword.username, encryptionKey) : "";

    const response = await fetch(`http://${API_URL}/api/v1/vault/password/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        app_name: encrypted_title,
        uri: encrypted_uri,
        username: encrypted_username,
        encrypted_password: encrypted_password
      })
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      return;
    }

    setPasswords((prevItems) => [...prevItems, data.data])
    showSuccess("Password successfully added");

    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content
            title="Safepass"
            titleStyle={styles.contentTitleText}
          />
          {/* <Avatar.Image size={36} source={require("./assets/avatar.png")} /> */}
          <Appbar.Action
            size={36}
            icon="plus-circle"
            onPress={() => setModalVisible(true)}
          />
        </Appbar.Header>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          style={styles.searchBar}
        />
        <Text style={styles.sectionHeader}>Passwords</Text>

        <FlatList
          data={filteredPasswords}
          renderItem={({ item }) => <PasswordCard item={item} />}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.navBar}>
          <Button icon="home" labelStyle={styles.navButton}>
            Home
          </Button>
          <Button icon="shield" labelStyle={styles.navButton}>
            Security
          </Button>
          <Button icon="dots-horizontal" labelStyle={styles.navButton}>
            Other
          </Button>
        </View>
      </View>

      <CustomModal
        visible={infoModalVisible}
        message={modalMessage}
        onDismiss={() => { setInfoModalVisible(false) }}
        type={modalType}
      />

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addNewPassword}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  searchBar: {
    margin: 16,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
  menu: { fontSize: 24, color: "#888" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navButton: { fontSize: 24 },
});

export default DashboardScreen;
