import { ExpoConfig } from "expo/config";
import "ts-node/register"; // Add this to import TypeScript files

const config: ExpoConfig = {
  android: {
    package: "com.anonymous.safepass",
  },
  ios: {
    bundleIdentifier: "com.anonymous.safepass",
  },
  name: "safepass",
  slug: "safepass",
};

export default config;
