import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Screen: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>{children}</View>
    </SafeAreaView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
});
