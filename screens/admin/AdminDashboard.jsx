// // screens/Admin/AdminDashboard.js
// import React from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";


// export default function AdminDashboard({ navigation }) {
//   return (
//     <View style={styles.container}>
//       {/* Gradient Header */}
//       <LinearGradient
//         colors={["#141E30", "#243B55"]}
//         style={styles.header}
//       >
//         <Text style={styles.headerText}>🎬 Admin Dashboard</Text>
//       </LinearGradient>

//       <View style={styles.content}>
//         {/* Manage Movies */}
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() => navigation.navigate("MovieManagement")}
//           activeOpacity={0.8}
//         >
//           <Ionicons name="film-outline" size={28} color="#FF4655" />
//           <Text style={styles.cardText}>Manage Movies</Text>
//         </TouchableOpacity>

//         {/* Manage Users */}
//         <TouchableOpacity
//           style={styles.card}
//           onPress={() => navigation.navigate("UserManagement")}
//           activeOpacity={0.8}
//         >
//           <MaterialIcons name="people-outline" size={28} color="#1DB954" />
//           <Text style={styles.cardText}>Manage Users</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#0F0F1C",
//   },
//   header: {
//     paddingTop: 60,
//     paddingBottom: 25,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   headerText: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#fff",
//     letterSpacing: 1,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1E1E2C",
//     padding: 18,
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//     elevation: 6,
//   },
//   cardText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "600",
//     marginLeft: 15,
//   },
// });
