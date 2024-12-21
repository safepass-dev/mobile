import React from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { Appbar, Button, PaperProvider } from "react-native-paper";
import PasswordCard from "../../components/passwordCard";
import AddPasswordModal from "../../components/passwordModal";

// Dummy data
const data = [
  {
    id: "14",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "15",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "13",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "12",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "11",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "10",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "9",
    name: "Dribbble",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "2",
    name: "Microsoft 365",
    email: "tasyasyadik23@outlook.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "3",
    name: "Airbnb",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "4",
    name: "PayPal",
    email: "tasyasyadik23@outlook.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
  {
    id: "5",
    name: "Netflix",
    email: "syadiktasya@gmail.com",
    // icon: <MaterialIcons name="search" size={24} color="#fff" />,
  },
];

const DashboardScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newPasswords, setNewPasswords] = React.useState(data);

  const filteredPasswords = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addNewPassword = (newPassword) => {
    setNewPasswords(newPassword);
    setModalVisible(false);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.Content
            title="Safepass"
            titleStyle={styles.contentTitleText}
          />
          {/* <Avatar.Image size={36} source={require("./assets/avatar.png")} /> */}
          <Appbar.Action
            size={36}
            icon="plus-circle"
            onPress={() => setModalVisible(true)}
          />
        </Appbar.Header>

        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search"
          style={styles.searchBar}
        />
        <Text style={styles.sectionHeader}>Passwords</Text>

        <FlatList
          data={filteredPasswords}
          renderItem={({ item }) => <PasswordCard item={item} />}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.navBar}>
          <Button icon="home" labelStyle={styles.navButton}>
            Home
          </Button>
          <Button icon="shield" labelStyle={styles.navButton}>
            Security
          </Button>
          <Button icon="dots-horizontal" labelStyle={styles.navButton}>
            Other
          </Button>
        </View>
      </View>

      <AddPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addNewPassword}
      />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  contentTitleText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
  searchBar: {
    margin: 16,
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 16,
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  icon: { width: 40, height: 40, marginRight: 16 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#555" },
  menu: { fontSize: 24, color: "#888" },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  navButton: { fontSize: 24 },
});

export default DashboardScreen;
