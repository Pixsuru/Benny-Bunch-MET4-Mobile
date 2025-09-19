import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";
class AuthService {
  constructor() {
    this.user = null;
    this.subscribers = [];
    this.ready = false;

    this.loadUser();
  }

  async loadUser() {
    try {
      const userStr = await AsyncStorage.getItem("user_data");
      if (userStr) this.user = JSON.parse(userStr);
    } catch (e) {
      console.error("Failed to load user:", e);
    } finally {
      this.ready = true;
      this.notify();
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    if (this.ready) callback(this.user);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  notify() {
    this.subscribers.forEach(sub => sub(this.user));
  }

  async login(token, userData) {
    await AsyncStorage.setItem("jwt_token", token);
    await AsyncStorage.setItem("user_data", JSON.stringify(userData));
    this.user = userData;
    this.notify();
  }

  async logout() {
    await AsyncStorage.removeItem("jwt_token");
    await AsyncStorage.removeItem("user_data");
    this.user = null;
    this.notify();
  }

  async updateUser(updates) {
    if (!this.user) return;
    const updated = { ...this.user, ...updates };
    this.user = updated;
    await AsyncStorage.setItem("user_data", JSON.stringify(updated));
    this.notify();
    return updated;
  }

  async getToken() {
    return await AsyncStorage.getItem("jwt_token");
  }

  isLoggedIn() {
    return !!this.user;
  }
}

export default new AuthService();
