import { useNavigation, useRoute } from "@react-navigation/native";
import * as BackgroundFetch from "expo-background-fetch";
import * as Clipboard from "expo-clipboard";
import * as TaskManager from "expo-task-manager";
import { atom, useAtom } from "jotai";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button, Card, IconButton } from "react-native-paper";

const BACKGROUND_FETCH_TASK = "delete-copy-password";
export const globalPasswordAtom = atom(null);
let globalPasswordValue = null;

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    if (globalPasswordValue) {
      const result = await Clipboard.setStringAsync("");
      console.log(result);
      console.log("Pano temizlendi.");
    } else {
      console.log("Global state boş, işlem yapılmadı.");
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Arkaplan görevi hatası:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const PasswordDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [globalPassword, setGlobalPassword] = useAtom(globalPasswordAtom);

  useEffect(() => {
    globalPasswordValue = globalPassword;
  }, [globalPassword]);

  const { passwordDetails, onDelete } = route.params;
  const handleOnDelete = () => {
    // handle delete on backend also
    onDelete(passwordDetails.id);
    navigation.goBack();
  };

  const copyToClipboard = async () => {
    const password = passwordDetails.encrypted_password;
    await Clipboard.setStringAsync(password);
    setGlobalPassword(password);
    alert("Password copied to clipboard");
    registerBackgroundTask();
  };

  const registerBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 30,
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Arka plan görevi kaydedildi.");
    } catch (error) {
      console.error("Görev kaydı hatası:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          size={36}
        />
        <IconButton icon="delete" onPress={handleOnDelete} size={32} />
      </View>

      <View style={styles.avatarSection}>
        <Image
          source={require("../../../assets/global-network.png")}
          style={{ width: 78, height: 78, borderRadius: 20 }}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            justifyContent: "center",
          }}
        >
          <Text style={styles.headerText}>{passwordDetails.app_name}</Text>
          <Text style={styles.email}>{passwordDetails.username}</Text>
        </View>
      </View>

      <Card style={styles.detailsCard}>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Link</Text>
          <Text
            style={styles.detailsValue}
            onPress={() => Linking.openURL(passwordDetails.uri)}
          >
            {passwordDetails.uri}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>User ID</Text>
          <Text style={styles.detailsValue}>{passwordDetails.username}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailsLabel}>Password</Text>
          <Text style={styles.detailsValue}>
            {passwordDetails.encrypted_password}
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <Button
          labelStyle={{ color: "black" }}
          style={{ backgroundColor: "#f9f9f9", borderRadius: 15 }}
          mode="outlined"
          onPress={copyToClipboard}
        >
          Copy Password
        </Button>
        <Button
          labelStyle={{ color: "black" }}
          style={{ backgroundColor: "#f9f9f9", borderRadius: 15 }}
          mode="outlined"
          onPress={() => console.log("Change Password")}
        >
          Change Password
        </Button>
      </View>
    </View>
  );
};

export default PasswordDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "semibold",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  email: {
    fontSize: 16,
    color: "#666",
  },
  detailsCard: {
    padding: 20,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  detailsLabel: {
    fontSize: 16,
    color: "#333",
  },
  detailsValue: {
    fontSize: 16,
    color: "#007bff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
