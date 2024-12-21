import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Modal, Portal, TextInput } from "react-native-paper";

const AddPasswordModal = ({ visible, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAdd = () => {
    const newPassword = { title, username, password };
    onAdd(newPassword);
    setTitle("");
    setUsername("");
    setPassword("");
    onClose();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={styles.modal}
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />
        <Button mode="contained" onPress={handleAdd} style={styles.button}>
          Add Password
        </Button>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default AddPasswordModal;
