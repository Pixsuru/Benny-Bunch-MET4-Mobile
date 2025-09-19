// config.js
import { Platform } from "react-native";

// Use localhost for Android/iOS simulators, LAN IP for real devices
const LOCAL_URL = "http://localhost:3000";
const LAN_URL = "http://000.000.00.000:3000"; //you ip4 address

export const API_URL = Platform.OS === "android" || Platform.OS === "ios" ? LAN_URL : LOCAL_URL;
