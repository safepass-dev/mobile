import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Icon,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

const CustomModal = ({ visible, onDismiss, type, message }) => {
  const theme = useTheme();

  // Determine modal style and icon based on type (success or error)
  const isSuccess = type === "success";

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              isSuccess ? styles.successIcon : styles.errorIcon,
            ]}
          >
            <Icon
              source={isSuccess ? "check-circle" : "alert-circle"}
              size={64}
              color={isSuccess ? "#4CAF50" : "#F44336"}
            />
          </View>
          <Text
            style={[
              styles.title,
              isSuccess ? styles.successText : styles.errorText,
            ]}
          >
            {isSuccess ? "Success" : "Error"}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.button}
            buttonColor={isSuccess ? "#4CAF50" : "#F44336"}
            textColor="white"
          >
            Ok
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
  content: {
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 15,
    borderRadius: 50,
    padding: 10,
  },
  successIcon: {
    backgroundColor: "#e0f8e9",
  },
  errorIcon: {
    backgroundColor: "#f8e0e0",
  },
  successText: {
    color: "#4CAF50",
  },
  errorText: {
    color: "#F44336",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
    width: "100%",
  },
});

export default CustomModal;
