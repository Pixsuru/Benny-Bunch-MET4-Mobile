// mobile/api.js
import { Platform } from "react-native";

// If running on a simulator, use localhost
// If running on a real phone, replace with the computer's LAN IP
const API_URL =
  Platform.OS === "ios" || Platform.OS === "android"
    ? "http://000.000.00.000:3000" //you ip4 address
    : "http://localhost:3000";

export default API_URL;
