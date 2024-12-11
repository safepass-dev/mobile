// App.js
import React from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "./src/navigation/root";

export default function App() {
  return <RootStack />;
}
