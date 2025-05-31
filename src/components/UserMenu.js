import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Avatar, Menu, Button } from "react-native-paper";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectUser } from "../slices/userSlice";

function UserMenu() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu} style={styles.userButton}>
            <View style={styles.userInfo}>
              <Text style={styles.name}>{user.data.name}</Text>
              <Text style={styles.userRole}>
                {user.role?.length ? user.role.toString() : "Guest"}
              </Text>
            </View>
            {user.data.photoURL ? (
              <Avatar.Image size={40} source={{ uri: user.data.photoURL }} />
            ) : (
              <Avatar.Text size={40} label={user.data.name[0]} />
            )}
          </TouchableOpacity>
        }
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate("signIn");
              }}
              title="Sign In"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate("signUp");
              }}
              title="Sign Up"
            />
          </>
        ) : (
          <>
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate("profile");
              }}
              title="My Profile"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                navigation.navigate("signOut");
              }}
              title="Sign Out"
            />
          </>
        )}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  userButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  userInfo: {
    marginRight: 8,
    alignItems: "flex-end",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  userRole: {
    fontSize: 12,
    color: "gray",
  },
});

export default UserMenu;
