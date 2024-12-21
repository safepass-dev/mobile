import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import initializeDatabase from "./src/database/db";
import RootStack from "./src/navigation/root";

const App = () => (
  <SQLiteProvider databaseName="app.db" onInit={initializeDatabase}>
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  </SQLiteProvider>
);

export default App;
