// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { LinearGradient } from "expo-linear-gradient";
// import { API_URL } from "../../config"; 
// import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// export default function SignupScreen({ navigation }) {
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [dob, setDob] = useState(new Date());
//   const [showDobPicker, setShowDobPicker] = useState(false);
//   const [role, setRole] = useState("customer");
//   const [pin, setPin] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const validate = () => {
//     const newErrors = {};
//     if (!fullName.trim()) newErrors.fullName = "Required";
//     if (!email.trim()) newErrors.email = "Required";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
//     if (!password) newErrors.password = "Required";
//     else if (password.length < 6) newErrors.password = "Min 6 chars";
//     if (!dob) newErrors.dob = "Required";
//     if (role.toLowerCase() === "staff" && !pin) newErrors.pin = "Required for staff";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSignup = async () => {
//     if (!validate()) return;
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           fullName,
//           email,
//           password,
//           dob: dob.toISOString().split('T')[0],
//           role,
//           pin: pin || undefined
//         })
//       });

//       const data = await response.json();
//       setLoading(false);

//       if (!response.ok) {
//         Alert.alert("Signup Failed", data.message || "An error occurred.");
//         return;
//       }

//       Alert.alert("Success", data.message || "Account created successfully!");
//       navigation.navigate("Login"); // ✅ fixed
//     } catch (error) {
//       setLoading(false);
//       console.error(error);
//       Alert.alert("Network Error", "Cannot reach server. Check API_URL and your connection.");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.appTitle}>🎬 Benny-Bunch Movies 🎬</Text>
//       <Text style={styles.headerText}>Sign Up</Text>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           placeholderTextColor="#999"
//           value={fullName}
//           onChangeText={setFullName}
//         />
//         {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
//       </View>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//         />
//         {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
//       </View>

//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//         />
//         {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
//       </View>

//       <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.inputContainer}>
//         <Text style={{ color: dob ? "#fff" : "#999" }}>
//           {dob ? dob.toDateString() : "Select Date of Birth"}
//         </Text>
//       </TouchableOpacity>
//       {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
//       {showDobPicker && (
//         <DateTimePicker
//           value={dob}
//           mode="date"
//           maximumDate={new Date()}
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDobPicker(false);
//             if (selectedDate) setDob(selectedDate);
//           }}
//         />
//       )}

//       {role.toLowerCase() === "staff" && (
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Staff PIN"
//             placeholderTextColor="#999"
//             keyboardType="numeric"
//             value={pin}
//             onChangeText={setPin}
//           />
//           {errors.pin && <Text style={styles.errorText}>{errors.pin}</Text>}
//         </View>
//       )}

//       <TouchableOpacity onPress={handleSignup} disabled={loading}>
//         <LinearGradient colors={["#f97794", "#623aa2"]} style={styles.signupButton}>
//           {loading ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <>
//               <Text style={styles.signupButtonText}>Sign Up</Text>
//               <FontAwesome6 name="arrow-right-to-bracket" size={24} color="white" style={{ marginLeft: 10 }} />
//             </>
//           )}
//         </LinearGradient>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//         <Text style={styles.footerText}>
//           Already have an account?{" "}
//           <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>
//             Login
//           </Text>
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#191a2b", padding: 20, justifyContent: "center" },
//   appTitle: { fontSize: 28, color: "white", fontWeight: "bold", textAlign: "center", marginBottom: 10 },
//   headerText: { color: "white", fontSize: 20, textAlign: "center", marginBottom: 25 },
//   inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#2a2d3e", borderRadius: 25, paddingHorizontal: 15, marginBottom: 15, height: 50 },
//   input: { flex: 1, color: "white" },
//   errorText: { color: "#ff4d4f", marginLeft: 10, fontSize: 12 },
//   signupButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 25, marginVertical: 20 },
//   signupButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
//   footerText: { color: "white", textAlign: "center", fontSize: 16 },
// });
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { API_URL } from "../../config"; 
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState(new Date());
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = "Required";
    if (!email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email";
    if (!password) newErrors.password = "Required";
    else if (password.length < 6) newErrors.password = "Min 6 chars";
    if (!dob) newErrors.dob = "Required";
    if (!agreeTerms) newErrors.agreeTerms = "You must agree to terms.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          dob: dob.toISOString().split('T')[0],
          role
        })
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        Alert.alert("Signup Failed", data.message || "An error occurred.");
        return;
      }

      Alert.alert("Success", data.message || "Account created successfully!");
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Network Error", "Cannot reach server. Check API_URL and your connection.");
    }
  };

  return (
    <LinearGradient colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]} style={styles.container}>
      <View style={styles.formBox}>
        {/* Stars and App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.stars}>★★★★★</Text>
          <Text style={styles.appTitle}>Aura Reels</Text>
          <Text style={styles.headerText}>Sign Up</Text>
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="user" size={20} color="white" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#ccc"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>
        {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        {/* Email */}
        <View style={styles.inputContainer}>
          <SimpleLineIcons name="envelope" size={20} color="white" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <View style={styles.inputContainer}>
          <FontAwesome6 name="lock" size={20} color="white" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* Date of Birth */}
        <TouchableOpacity onPress={() => setShowDobPicker(true)} style={styles.inputContainer}>
          <Text style={{ color: dob ? "#fff" : "#ccc" }}>
            {dob ? dob.toDateString() : "Select Date of Birth"}
          </Text>
        </TouchableOpacity>
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
        {showDobPicker && (
          <DateTimePicker
            value={dob}
            mode="date"
            maximumDate={new Date()}
            display="default"
            onChange={(event, selectedDate) => {
              setShowDobPicker(false);
              if (selectedDate) setDob(selectedDate);
            }}
          />
        )}

        {/* Role Selector */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === "customer" && styles.roleButtonActive]}
            onPress={() => setRole("customer")}
          >
            <Text style={[styles.roleText, role === "customer" && styles.roleTextActive]}>Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, role === "staff" && styles.roleButtonActive]}
            onPress={() => setRole("staff")}
          >
            <Text style={[styles.roleText, role === "staff" && styles.roleTextActive]}>Staff</Text>
          </TouchableOpacity>
        </View>

        {/* Terms & Conditions */}
        <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)} style={{ marginBottom: 10 }}>
          <Text style={{ color: "#fff" }}>
            <Text style={{ fontWeight: "bold" }}>{agreeTerms ? "✅ " : "⬜ "} </Text>
            I agree to the Terms & Conditions
          </Text>
        </TouchableOpacity>
        {errors.agreeTerms && <Text style={styles.errorText}>{errors.agreeTerms}</Text>}

        {/* Sign Up Button */}
        <TouchableOpacity onPress={handleSignup} disabled={loading || !agreeTerms}>
          <LinearGradient colors={["#f97794", "#623aa2"]} style={styles.signupButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.signupButtonText}>Sign Up</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={{ fontWeight: "bold", textDecorationLine: "underline" }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  formBox: {
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 25,
    backgroundColor: "rgba(36,33,40,0.85)",
    justifyContent: "center",
  },
  titleContainer: { alignItems: "center", marginBottom: 20 },
  stars: { fontSize: 18, color: "white", marginBottom: 5 },
  appTitle: { fontSize: 28, color: "#fff", fontWeight: "bold" },
  headerText: { color: "white", fontSize: 20, marginTop: 5, fontWeight: "bold" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2d3e",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  input: { flex: 1, color: "white", fontSize: 16 },
  errorText: { color: "#ff4d4f", fontSize: 12, marginBottom: 5 },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    backgroundColor: "#2a2d3e",
    borderRadius: 25,
    padding: 5,
  },
  roleButton: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 20 },
  roleButtonActive: { backgroundColor: "#623aa2" },
  roleText: { color: "white", fontWeight: "500" },
  roleTextActive: { color: "#fff", fontWeight: "bold" },
  signupButton: { alignItems: "center", justifyContent: "center", paddingVertical: 12, borderRadius: 25, marginVertical: 15 },
  signupButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  footerText: { color: "white", textAlign: "center", fontSize: 16, marginTop: 10 },
});
