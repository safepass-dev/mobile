import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Card, IconButton, Menu, Text } from "react-native-paper";

const PasswordCard = ({ item }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Image source={item.icon} style={styles.icon} />

        <View style={styles.info}>
          <Text variant="bodyMedium" style={styles.name}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={styles.email}>
            {item.email}
          </Text>
        </View>
        <Menu
          contentStyle={styles.menuContainer}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton icon="dots-vertical" size={20} onPress={openMenu} />
          }
        >
          <Menu.Item
            onPress={() => {
              closeMenu();
              onEdit();
            }}
            title="Edit"
            leadingIcon="pencil"
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              onDelete();
            }}
            leadingIcon="delete"
            title="Delete"
          />
        </Menu>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: "#ffffff",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333333",
  },
  email: {
    fontSize: 14,
    color: "#777777",
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 10,
  },
});

export default PasswordCard;