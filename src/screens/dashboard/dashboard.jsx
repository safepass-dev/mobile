import CustomModal from "@/components/customModal";
import {
  dbSetPasswords,
  getPasswords,
} from "@/database/dbServices/passwordsDatabase";
import { getUserFromId } from "@/database/dbServices/usersDatabase";
import { getVault, setVault } from "@/database/dbServices/vaultsDatabase";
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Button,
  Dialog,
  PaperProvider,
  Paragraph,
  Portal,
} from "react-native-paper";
import config from "../../../config.json";
import NativeCrypto from "../../../modules/native-crypto";
import PasswordCard from "../../components/passwordCard";
import AddPasswordModal from "../../components/passwordModal";

const API_URL = config.API_URL;

const DashboardScreen = ({ route }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [passwords, setPasswords] = React.useState([]);
  const [token, setToken] = useState("");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [modalMessage, setModalMessage] = useState("default");
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener("ScreenTurnedOff", () => {
      console.log("Screen turned off!");
      // Hesaptan çıkış işlemleri burada yapılabilir
      logout();
    });

    return () => {
      listener.remove(); // Bileşen temizlenirken dinleyiciyi kaldırın
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          const user = await getUserFromId(db, user_id);

          const encryptionKey = NativeCrypto.getEncryptionKey();
          console.log(encryptionKey);
          if (encryptionKey !== "") {
            console.log("Girdi23");
            return;
          }

          await setEncryptionKey(user.token);
          setToken(user.token);
        } catch (error) {
          console.log(error);
        }
      })();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        try {
          if (token === "") {
            return;
          }

          const vault = await getVault(db, user_id);
          console.log(vault);
          const vault_id = vault.id;

          const passwords = await getPasswords(db, vault_id);
          console.log(passwords);

          if (passwords.length !== 0) {
            console.log("Girdi");
            setPasswords(passwords);
            return;
          }

          const decryptedData = await getPasswordsFromServer();

          await dbSetPasswords(db, decryptedData);
          setPasswords(decryptedData);
        } catch (error) {
          console.log(error);
        }
      })();
    }, [token])
  );

  const showSuccess = (message) => {
    setModalType("success");
    setModalMessage(message);
    setInfoModalVisible(true);
  };

  const db = useSQLiteContext();

  const { user_id, encryptionKeys } = route.params;

  const filteredPasswords = passwords.filter(
    (item) =>
      item.app_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showDiolog = () => {
    setLogoutDialogVisible(true);
  };
  const hideDialog = () => {
    setLogoutDialogVisible(false);
  };

  const logout = async () => {
    try {
      await db.execAsync("DELETE FROM users");
      await db.execAsync("DELETE FROM vaults");
      await db.execAsync("DELETE FROM passwords");

      NativeCrypto.removeEncryptionKey();

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLogoutDialogVisible(false);
    }
  };

  const confirmLogout = () => {
    setLogoutDialogVisible(true);
  };

  async function setEncryptionKey(token) {
    const response = await fetch(`http://${API_URL}/api/v1/vault/@me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    const protectedSymmetricKey = `${data.data.mac}:${data.data.protected_symmetric_key}`;

    const a = NativeCrypto.setEncryptionKey(
      protectedSymmetricKey,
      encryptionKeys
    );

    await setVault(db, data.data);
  }

  async function getPasswordsFromServer() {
    const response = await fetch(`http://${API_URL}/api/v1/vault/passwords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    const encryptionKey = NativeCrypto.getEncryptionKey();

    const decryptedData = data.data.map((item) => {
      if (item.app_name && item.app_name != "") {
        item.app_name = decrypt(item.app_name, encryptionKey);
      }

      if (item.username && item.username != "") {
        item.username = decrypt(item.username, encryptionKey);
      }

      //uri ve şifreyide detaylarda göstermek için encrypt'e ekledim.
      if (item.uri && item.uri != "") {
        item.uri = decrypt(item.uri, encryptionKey);
      }

      if (item.encrypted_password) {
        item.encrypted_password = decrypt(
          item.encrypted_password,
          encryptionKey
        );
      }

      return item;
    });

    return decryptedData;
  }

  function encrypt(data, encryptionKey) {
    const encryptedData = NativeCrypto.encryptWithChaCha20(data, encryptionKey);

    return encryptedData;
  }

  function decrypt(data, encryptionKey) {
    const decryptedData = NativeCrypto.decryptWithChaCha20(data, encryptionKey);

    return decryptedData;
  }

  const navigateToPasswordDetails = (password) => {
    navigation.navigate("PasswordDetails", {
      passwordDetails: password,
      onDelete: () => deletePassword(password),
    });
  };

  const deletePassword = async (password) => {
    // handle delete on backend also

    const response = await fetch(
      `http://${API_URL}/api/v1/vault/password/delete/${password.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.data.succeeded) {
      return;
    }

    const updatedPasswords = passwords.filter(
      (item) => item.id !== password.id
    );
    setPasswords(updatedPasswords);
    showSuccess("Password successfully deleted");
  };

  const filteredPasswordsRenderItem = ({ item }) => {
    const handleOnPress = () => navigateToPasswordDetails(item);
    const handlePasswordDelete = () => deletePassword(item);
    return (
      <TouchableOpacity onPress={handleOnPress}>
        <PasswordCard
          onEdit={handleOnPress}
          onDelete={handlePasswordDelete}
          item={item}
        />
      </TouchableOpacity>
    );
  };

  const addNewPassword = async (newPassword) => {
    const encryptionKey = NativeCrypto.getEncryptionKey();

    const encrypted_password = encrypt(newPassword.password, encryptionKey);
    const encrypted_title =
      newPassword.title != "" ? encrypt(newPassword.title, encryptionKey) : "";
    const encrypted_uri =
      newPassword.uri != "" ? encrypt(newPassword.uri, encryptionKey) : "";
    const encrypted_username =
      newPassword.username != ""
        ? encrypt(newPassword.username, encryptionKey)
        : "";

    const response = await fetch(
      `http://${API_URL}/api/v1/vault/password/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          app_name: encrypted_title,
          uri: encrypted_uri,
          username: encrypted_username,
          encrypted_password: encrypted_password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return;
    }

    //uri ve şifreyide detaylarda göstermek için encrypt'e ekledim.
    const keysToDecrypt = ["app_name", "username", "uri", "encrypted_password"];
    const decryptedData = {};
    for (const [keyName, encryptedValue] of Object.entries(data.data)) {
      var newValue = encryptedValue;

      if (keysToDecrypt.includes(keyName)) {
        newValue = decrypt(encryptedValue, encryptionKey);
      }

      decryptedData[keyName] = newValue;
    }

    setPasswords((prevItems) => [...prevItems, decryptedData]);
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
          renderItem={filteredPasswordsRenderItem}
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
        onDismiss={() => {
          setInfoModalVisible(false);
        }}
        type={modalType}
      />

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addNewPassword}
      />
      <Button onPress={confirmLogout}>LogOut</Button>

      <Portal>
        <Dialog visible={logoutDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Çıkış Yap</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Hesabınızdan çıkış yapmak ve tüm yerel verilerinizi silmek
              istediğinize emin misiniz?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={logout}>Çıkış Yap</Button>
            <Button onPress={hideDialog}>İptal</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "AfacadFlux-Black",
  },
  searchBar: {
    margin: 16,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  sectionHeader: {
    fontFamily: "AfacadFlux-Black",
    fontSize: 32,
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
