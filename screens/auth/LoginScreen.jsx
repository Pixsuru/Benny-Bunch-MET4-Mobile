
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onLoginPress = async () => {
    setErrorMessage("");

    if (!email) return setErrorMessage("Email is required.");
    if (!/\S+@\S+\.\S+/.test(email)) return setErrorMessage("Invalid email format.");
    if (!password) return setErrorMessage("Password is required.");
    if (password.length < 6) return setErrorMessage("Password must be at least 6 characters.");

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        return setErrorMessage(data.message || "Login failed. Try again.");
      }

      await AsyncStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      Alert.alert("Success", "Login successful!");

    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Network error. Please check your connection.");
    }
  };

  return (
    <LinearGradient
      colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Aura Reels Title with 5 stars */}
        <View style={styles.titleContainer}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.appTitle}>Aura Reels</Text>
        </View>

        {/* Login Box */}
        <View style={styles.loginBox}>
          <Text style={styles.headerText}>Login to your account</Text>

          {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}
          {isLoading && <ActivityIndicator color="#fff" size="large" style={{ marginBottom: 15 }} />}

          <View style={styles.inputContainer}>
            <SimpleLineIcons name="user" size={20} color="white" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#ccc"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome6 name="lock" size={20} color="white" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#ccc"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {/* Login Button with Gradient */}
          <TouchableOpacity onPress={onLoginPress} disabled={isLoading || !email || !password}>
            <LinearGradient
              colors={["#f97794", "#623aa2"]}
              style={styles.loginButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Login Now</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text style={{ fontWeight: "bold", color: "#fff" }} onPress={() => navigation.navigate("Signup")}>
              Register Here
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  titleContainer: { alignItems: "center", marginBottom: 30 },
  stars: { color: "white", fontSize: 20, marginBottom: 5 },
  appTitle: { fontSize: 28, color: "white", fontWeight: "bold" },
  loginBox: {
    backgroundColor: "rgba(36,33,40,0.7)",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  headerText: { color: "white", fontSize: 20, textAlign: "center", marginBottom: 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2d3e",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: { flex: 1, color: "white" },
  errorText: { color: "#ff4d4f", marginLeft: 10, fontSize: 12, marginBottom: 10 },
  loginButton: { alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 25, marginVertical: 15 },
  loginButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  footerText: { color: "white", textAlign: "center", fontSize: 16, marginTop: 10 },
});
