// import React, { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons, MaterialIcons } from "@expo/vector-icons";

// const UserManagement = () => {
//   const [users, setUsers] = useState([
//     { id: 1, name: "John Doe", email: "john@example.com", role: "User", status: "Active" },
//     { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Suspended" },
//     { id: 3, name: "Mike Ross", email: "mike@example.com", role: "User", status: "Active" },
//   ]);

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");

  
//   const handleDelete = (id) => {
//     setUsers(users.filter((user) => user.id !== id));
//   };

//   // Toggle Status
//   const handleEdit = (id) => {
//     setUsers(
//       users.map((user) =>
//         user.id === id
//           ? { ...user, status: user.status === "Active" ? "Suspended" : "Active" }
//           : user
//       )
//     );
//   };

  
//   const handleAddUser = () => {
//     const newUser = {
//       id: Date.now(),
//       name: "New User",
//       email: "newuser@example.com",
//       role: "User",
//       status: "Active",
//     };
//     setUsers([...users, newUser]);
//   };

  
//   const filteredUsers = users.filter((user) => {
//     const matchesSearch =
//       user.name.toLowerCase().includes(search.toLowerCase()) ||
//       user.email.toLowerCase().includes(search.toLowerCase());
//     const matchesFilter = filter === "All" || user.status === filter;
//     return matchesSearch && matchesFilter;
//   });

//   return (
//     <LinearGradient colors={["#141E30", "#243B55"]} style={styles.container}>
//       {/* Header */}
//       <Text style={styles.title}>👥 Manage Users</Text>

    
//       <View style={styles.controls}>
//         <View style={styles.searchBox}>
//           <Ionicons name="search" size={18} color="#aaa" style={{ marginRight: 6 }} />
//           <TextInput
//             style={styles.input}
//             placeholder="Search by name or email"
//             placeholderTextColor="#aaa"
//             value={search}
//             onChangeText={setSearch}
//           />
//         </View>

//         <View style={styles.pickerBox}>
//           <Picker
//             selectedValue={filter}
//             style={styles.picker}
//             dropdownIconColor="#fff"
//             onValueChange={(val) => setFilter(val)}
//           >
//             <Picker.Item label="All" value="All" />
//             <Picker.Item label="Active" value="Active" />
//             <Picker.Item label="Suspended" value="Suspended" />
//           </Picker>
//         </View>

//         <TouchableOpacity style={styles.addBtn} onPress={handleAddUser}>
//           <Ionicons name="person-add" size={18} color="white" />
//           <Text style={styles.addBtnText}>Add</Text>
//         </TouchableOpacity>
//       </View>

//       {/* User List */}
//       <FlatList
//         data={filteredUsers}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <LinearGradient
//             colors={["#1E1E2C", "#2C2C44"]}
//             style={styles.userCard}
//           >
//             <View style={{ flex: 1 }}>
//               <Text style={styles.userName}>{item.name}</Text>
//               <Text style={styles.userEmail}>{item.email}</Text>
//               <Text style={[
//                 styles.userRole,
//                 { color: item.status === "Active" ? "#4CAF50" : "#FF5252" }
//               ]}>
//                 {item.role} | {item.status}
//               </Text>
//             </View>
//             <View style={styles.actions}>
//               <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item.id)}>
//                 <MaterialIcons name="edit" size={20} color="#fff" />
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
//                 <MaterialIcons name="delete" size={20} color="#fff" />
//               </TouchableOpacity>
//             </View>
//           </LinearGradient>
//         )}
//         ListEmptyComponent={
//           <Text style={styles.emptyText}>No users found</Text>
//         }
//       />
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 18, paddingTop: 50 },
//   title: { 
//     color: "#fff", 
//     fontSize: 26, 
//     fontWeight: "bold", 
//     marginBottom: 20, 
//     textAlign: "center" 
//   },
//   controls: { 
//     flexDirection: "row", 
//     alignItems: "center", 
//     marginBottom: 20 
//   },
//   searchBox: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2a2d3e",
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   input: { 
//     flex: 1, 
//     color: "white", 
//     paddingVertical: 8 
//   },
//   pickerBox: {
//     backgroundColor: "#2a2d3e",
//     borderRadius: 10,
//     marginRight: 10,
//     overflow: "hidden",
//   },
//   picker: { 
//     width: 120, 
//     color: "white" 
//   },
//   addBtn: { 
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#E50914",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   addBtnText: { 
//     color: "white", 
//     fontWeight: "600", 
//     marginLeft: 6 
//   },
//   userCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.25,
//     shadowOffset: { 
//     width: 0, 
//     height: 4 },
//     shadowRadius: 6,
//     elevation: 5,
//   },
//   userName: { color: "white", 
//     fontSize: 18, 
//     fontWeight: "700",
//   },
//   userEmail: { 
//     color: "#bbb", 
//     fontSize: 14, 
//     marginBottom: 4 
//   },
//   userRole: { 
//     fontSize: 14, 
//     fontWeight: "600" 
//   },
//   actions: { 
//     flexDirection: "row" 
//   },
//   editBtn: { 
//     backgroundColor: "#FFC107", 
//     padding: 10, 
//     borderRadius: 8, 
//     marginRight: 8 
//   },
//   deleteBtn: { 
//     backgroundColor: "#D32F2F", 
//     padding: 10, 
//     borderRadius: 8 
//   },
//   emptyText: { 
//     textAlign: "center", 
//     color: "#aaa", 
//     marginTop: 30, 
//     fontSize: 16 
//   },
// });

// export default UserManagement;
