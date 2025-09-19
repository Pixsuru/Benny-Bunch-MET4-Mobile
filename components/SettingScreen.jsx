import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AuthStack from "../navigation/Auths";

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  return (
    <LinearGradient
      colors={["#0f0f1a", "#1a1a2e", "#191a2b"]}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>⚙️ Settings</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" size={28} color="#ff6f61" />
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.optionContainer}>
          <Text style={styles.optionTitle}>Notifications</Text>
          <Switch
            trackColor={{ false: "#555", true: "#ff6f61" }}
            thumbColor={notificationsEnabled ? "#fff" : "#fff"}
            onValueChange={setNotificationsEnabled}
            value={notificationsEnabled}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionTitle}>Dark Mode</Text>
          <Switch
            trackColor={{ false: "#555", true: "#ff6f61" }}
            thumbColor={darkMode ? "#fff" : "#fff"}
            onValueChange={setDarkMode}
            value={darkMode}
          />
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionTitle}>Language</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionButtonText}>English</Text>
            <Ionicons name="chevron-forward" size={20} color="#ff6f61" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionContainer}>
          <Text style={styles.optionTitle}>Account</Text>
          <TouchableOpacity style={styles.optionButton} onPress={() => navigation.navigate('ManageAccount')}>
            <Text style={styles.optionButtonText}>Manage Account</Text>
            <Ionicons name="chevron-forward" size={20} color="#ff6f61" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => { navigation.navigate('Login'); alert('Logged out'); }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 25, 
    paddingHorizontal: 15 
},
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  headerText: {
    color: "#ff6f61",
    fontSize: 22,
    fontWeight: "bold",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  optionTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionButtonText: {
    color: "#ff6f61",
    fontSize: 16,
    marginRight: 5,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6f61",
  },
  logoutText: {
    color: "#ff6f61",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SettingsScreen;
