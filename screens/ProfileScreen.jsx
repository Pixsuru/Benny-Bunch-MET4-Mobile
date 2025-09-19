import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Text as SvgText, Polygon } from "react-native-svg";
import { API_URL } from "../config";

export default function ProfileScreen({ navigation, setIsLoggedIn }) {
  const [userData, setUserData] = useState(null);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Stats (could also come from backend)
  const [userStats, setUserStats] = useState({
    moviesWatched: 0,
    favorites: 0,
    hoursWatched: 0
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setUserData(data);

      // Example: stats from backend
      setUserStats({
        moviesWatched: data.moviesWatched || 0,
        favorites: data.favorites || 0,
        hoursWatched: data.hoursWatched || 0,
      });

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not load profile. Please login again.");
      setIsLoggedIn(false);
    }
  };

  const handleEditProfile = (field, value) => {
    setEditingField(field);
    setEditValue(value);
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      Alert.alert("Error", "This field cannot be empty.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const updates = { [editingField]: editValue };

      const response = await fetch(`${API_URL}/api/auth/update/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");

    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    }
  };

  const handleCancelEdit = () => setIsEditModalVisible(false);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("token");
            setIsLoggedIn(false);
            Alert.alert("Logged Out", "You have been logged out successfully.");
          },
        },
      ]
    );
  };

  const handleContactPress = (type, value) => {
    switch(type) {
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'website':
        Linking.openURL(value);
        break;
      default:
        break;
    }
  };

  const renderLogo = () => (
    <View style={styles.logoContainer}>
      <Svg width="200" height="48" viewBox="0 0 320 80.64">
        <SvgText
          x="2.88"
          y="61.96"
          fill="#fff"
          fontSize="48"
          fontFamily="Noto Sans"
          fontWeight="700"
          fontStyle="italic"
        >
          AURA REELS
        </SvgText>
        <Polygon points="30 17.81 24.38 13.74 17.51 18.15 20.91 11.22 15.29 7.14 23.01 6.93 26.4 0 27.78 6.8 35.49 6.59 28.63 11.01 30 17.81" fill="#fff" />
        <Polygon points="52.55 17.81 46.93 13.74 40.07 18.15 43.46 11.22 37.84 7.14 45.56 6.93 48.95 0 50.33 6.8 58.05 6.59 51.18 11.01 52.55 17.81" fill="#fff" />
        <Polygon points="75.09 17.81 69.47 13.74 62.61 18.15 66 11.22 60.38 7.14 68.1 6.93 71.49 0 72.87 6.8 80.59 6.59 73.72 11.01 75.09 17.81" fill="#fff" />
        <Polygon points="96.21 17.81 90.59 13.74 83.73 18.15 87.12 11.22 81.5 7.14 89.22 6.93 92.61 0 93.99 6.8 101.71 6.59 94.84 11.01 96.21 17.81" fill="#fff" />
        <Polygon points="117.04 17.81 111.42 13.74 104.55 18.15 107.95 11.22 102.33 7.14 110.05 6.93 113.44 0 114.81 6.8 122.53 6.59 115.66 11.01 117.04 17.81" fill="#fff" />
      </Svg>
    </View>
  );

  const renderStatCard = (icon, value, label, color) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const renderProfileItem = (icon, label, field, value, onPress = null) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={20} color="#de8affff" />
        <Text style={styles.profileItemLabel}>{label}</Text>
      </View>
      <View style={styles.profileItemRight}>
        <Text style={styles.profileItemValue}>{value}</Text>
        {onPress && <Ionicons name="chevron-forward" size={16} color="#a8e6cf" />}
      </View>
    </TouchableOpacity>
  );

  const renderContactItem = (icon, label, value, type, color = "#4ecdc4") => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(type, value)}
    >
      <View style={[styles.contactIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Ionicons name="open-outline" size={16} color="#a8e6cf" />
    </TouchableOpacity>
  );

  const renderEditModal = () => (
    <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCancelEdit}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <LinearGradient
              colors={["#40224f", "#29183f"]}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
                </Text>
                <TouchableOpacity onPress={handleCancelEdit}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>
                  {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={editValue}
                  onChangeText={setEditValue}
                  autoCapitalize={editingField === "fullName" ? "words" : "none"}
                  keyboardType={editingField === "email" ? "email-address" : "default"}
                  placeholder={`Enter your ${editingField}`}
                  placeholderTextColor="rgba(255,255,255,0.5)"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );


  if (!userData) return (
    <LinearGradient colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]} style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <StatusBar barStyle="light-content" />
      <Text style={{color:'#fff'}}>Loading profile...</Text>
    </LinearGradient>
  );

  return (
    <LinearGradient colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]} style={styles.background}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {renderLogo()}
          <Text style={styles.headerSubtitle}>My Profile</Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <LinearGradient colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']} style={styles.userCardGradient}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={40} color="#ff8a95" />
            </View>
            <Text style={styles.userName}>{userData.fullName}</Text>
            <Text style={styles.userEmail}>{userData.email}</Text>
            <Text style={styles.memberSince}>Member since Dec 2023</Text>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Stats</Text>
          <View style={styles.statsRow}>
            {renderStatCard("film", userStats.moviesWatched, "Movies", "#ff8a95")}
            {renderStatCard("heart", userStats.favorites, "Favorites", "#8700f5ff")}
            {renderStatCard("time", `${userStats.hoursWatched}h`, "Watched", "#ffd93d")}
          </View>
        </View>

        {/* Profile Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Settings</Text>
          <View style={styles.settingsCard}>
            {renderProfileItem("person-outline", "Full Name", "fullName", userData.fullName, () => handleEditProfile("fullName", userData.fullName))}
            {renderProfileItem("mail-outline", "Email", "email", userData.email, () => handleEditProfile("email", userData.email))}
            {userData.dob && renderProfileItem("calendar-outline", "Date of Birth", "dob", userData.dob, () => handleEditProfile("dob", userData.dob))}
            {renderProfileItem("star-outline", "Role", "role", userData.role)}
          </View>
        </View>

        {/* Contact & Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact & Support</Text>
          <View style={styles.contactCard}>
            {renderContactItem(
              "mail",
              "Email Support",
              "support@aurareels.com",
              "email",
              "#ff8a95"
            )}
            {renderContactItem(
              "call",
              "Phone Support",
              "+27 123 456 789",
              "phone",
              "#ff8a95"
            )}
            {renderContactItem(
              "globe",
              "Website",
              "https://aurareels.com",
              "website",
              "#ff8a95"
            )}
            {renderContactItem(
              "help-circle",
              "Help Center",
              "help@aurareels.com",
              "email",
              "#ff8a95"
            )}
          </View>
        </View>

        {/* About Team */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Team</Text>
          <View style={styles.teamCard}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.teamGradient}
            >
              <Text style={styles.teamTitle}>Built with ❤️ by</Text>
              <View style={styles.teamMembers}>
                <Text style={styles.teamMember}>Niketa</Text>
                <Text style={styles.teamMember}>Anishka</Text>
                <Text style={styles.teamMember}>Thaakirah</Text>
                <Text style={styles.teamMember}>Benedict</Text>
              </View>
              <Text style={styles.teamTagline}>Making movies accessible anytime, anywhere ✨</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditProfile("fullName", userData.fullName)}
          >
            <LinearGradient
              colors={['#8700f5ff', '#540197ff']}
              style={styles.buttonGradient}
            >
              <Ionicons name="create-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LinearGradient colors={['#ff6b6b', '#c5525dff']} style={styles.buttonGradient}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={styles.buttonText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {renderEditModal()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
  },
  logoContainer: {
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#e6e7e8',
    fontWeight: '600',
  },

  // User Card
  userCard: {
    marginHorizontal: 20,
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userCardGradient: {
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(58, 10, 59, 0.25)', // dark purple overlay
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e6e7e8',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#ff8a95', // pink accent
    marginBottom: 5,
  },
  memberSince: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },

  // Stats
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e6e7e8',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(44,28,66,0.5)', // dark translucent purple
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e6e7e8',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },

  // Sections
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  settingsCard: {
    backgroundColor: 'rgba(44,28,66,0.5)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemLabel: {
    color: '#e6e7e8',
    fontSize: 16,
    marginLeft: 12,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemValue: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginRight: 8,
  },

  // Contact
  contactCard: {
    backgroundColor: 'rgba(44,28,66,0.5)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: 'rgba(255,138,149,0.2)', // pink overlay instead of blue
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    color: '#e6e7e8',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactValue: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },

  // Team
  teamCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  teamGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  teamTitle: {
    fontSize: 18,
    color: '#e6e7e8',
    fontWeight: '600',
    marginBottom: 15,
  },
  teamMembers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  teamMember: {
    color: '#ff8a95',
    fontWeight: 'bold',
    fontSize: 16,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  teamTagline: {
    color: '#ffbfae',
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },

  // Actions
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 40,
    gap: 15,
  },
  editButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  logoutButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#e6e7e8',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.7)',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e6e7e8',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#e6e7e8',
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: 'rgba(87,65,117,0.5)',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  saveButton: {
    backgroundColor: '#ff8a95', // replaced blue with pink
  },
  cancelButtonText: {
    color: '#e6e7e8',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#e6e7e8',
    fontWeight: 'bold',
  },
});

