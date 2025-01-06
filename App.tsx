import { NavigationContainer } from "@react-navigation/native";
import { SQLiteProvider } from "expo-sqlite";
import React from "react";
import initializeDatabase from "./src/database/db";
import RootStack from "./src/navigation/root";
import { useFonts } from "expo-font";

const App = () => {
  const [loaded, error] = useFonts({
    'AfacadFlux-Black': require('./assets/fonts/AfacadFlux-Black.ttf'),
    'AfacadFlux-Bold': require('./assets/fonts/AfacadFlux-Bold.ttf'),
    'AfacadFlux-ExtraBold': require('./assets/fonts/AfacadFlux-ExtraBold.ttf'),
    'AfacadFlux-Light': require('./assets/fonts/AfacadFlux-Light.ttf'),
    'AfacadFlux-Medium': require('./assets/fonts/AfacadFlux-Medium.ttf'),
    'AfacadFlux-Regular': require('./assets/fonts/AfacadFlux-Regular.ttf'),
    'AfacadFlux-SemiBold': require('./assets/fonts/AfacadFlux-SemiBold.ttf'),
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
