import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import initializeDatabase from "./src/database/db";
import RootStack from "./src/navigation/root";
import { useFonts } from "expo-font";

const App = () => {
  const [loaded, error] = useFonts({
    'AfacadFlux-Black': require('./assets/fonts/AfacadFlux-Black.ttf'),
  });
  
  console.log(loaded)
  console.log(error)

  return (
    <SQLiteProvider databaseName="app.db" onInit={initializeDatabase}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SQLiteProvider>
  );
}

export default App;
