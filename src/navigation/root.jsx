import { StyleSheet, Text, View } from "react-native";
import React from "react";

import Auth from "./auth";
import GuestStack from "./guest";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Guest" component={GuestStack} />
        {/* <Stack.Screen name="Auth" component={Auth} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStack;
