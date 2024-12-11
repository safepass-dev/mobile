import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GuestStack from "./guest";

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
