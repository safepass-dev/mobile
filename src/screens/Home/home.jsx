import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, PermissionsAndroid, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import WifiManager from "react-native-wifi-reborn";
import Screen from "../../components/screen";

const HomeScreen = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [wifiList, setWifiList] = React.useState([]);
  const [currentSSID, setCurrentSSID] = React.useState("");
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Konum İzni Gereklidir",
          message:
            "Wi-Fi bilgilerine erişmek için konum iznine ihtiyaç vardır.",
          buttonNegative: "Hayır",
          buttonPositive: "Evet",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };
  const enabled = async () => {
    try {
      const isEnabled = await WifiManager.isEnabled();
      console.log("Is enabled?", isEnabled);
      setIsConnected(isEnabled);
    } catch (error) {
      console.error(error);
    }
  };

  const getWifiDetails = async () => {
    const permissionGranted = await requestLocationPermission();
    if (!permissionGranted) {
      console.log("Konum izni reddedildi.");
      return;
    }

    try {
      const currentSSID = await WifiManager.getCurrentWifiSSID();
      setCurrentSSID(currentSSID);
      const wifiList = await WifiManager.loadWifiList();
      setWifiList(wifiList);
      const currentNetwork = wifiList.find(
        (network) => network.SSID === currentSSID
      );

      if (currentNetwork) {
        const securityType = getSecurityType(currentNetwork.capabilities);
        console.log(`Ağ Adı (SSID): ${currentSSID}`);
        console.log(`Güvenlik Türü: ${securityType}`);
      } else {
        console.log("Mevcut Wi-Fi ağı bilgileri alınamadı.");
      }
    } catch (error) {
      console.error("Wi-Fi bilgileri alınırken hata oluştu:", error);
    }
  };

  const getSecurityType = (capabilities) => {
    if (capabilities.includes("WPA2")) {
      return "Secure (WPA2)";
    } else if (capabilities.includes("WPA")) {
      return "Secure (WPA)";
    } else if (capabilities.includes("WEP")) {
      return "Insecure (WEP)";
    } else if (capabilities.includes("ESS")) {
      return "Open Network (No Security)";
    } else {
      return "Unknown Security Type";
    }
  };

  React.useEffect(() => {
    enabled();
    getWifiDetails();
  }, []);

  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <Screen>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.logoImage}
        />
        {!isConnected && (
          <Text style={{ color: "red", marginBottom: 20 }}>
            Wi-Fi'ye bağlı değilsiniz.
          </Text>
        )}
        {currentSSID && (
          <Text style={{ color: "green", marginBottom: 20 }}>
            {currentSSID} -{" "}
            {getSecurityType(
              wifiList.find((network) => network.SSID === currentSSID)
                ?.capabilities || ""
            )}
          </Text>
        )}
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
