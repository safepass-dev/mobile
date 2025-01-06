import { ExpoConfig } from "expo/config";
import "ts-node/register"; // Add this to import TypeScript files

const config: ExpoConfig = {
  icon: "./assets/safepass-logo.png",
  plugins: [
    "expo-font",
    "react-native-wifi-reborn"
  ],
  android: {
    package: "com.anonymous.safepass",
  },
  ios: {
    bundleIdentifier: "com.anonymous.safepass",
  },
  name: "SafePass",
  slug: "safepass",
};

export default config;
