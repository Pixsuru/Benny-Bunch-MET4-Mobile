import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartProvider } from "./context/Cart";
import Auths from "./navigation/Auths";
import Tabs from "./navigation/Tabs"; 

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkLogin();
  }, []);

  if (loading) return null;

  return (
    <CartProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tabs setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Auths setIsLoggedIn={setIsLoggedIn} />
        )}
      </NavigationContainer>
    </CartProvider>
  );
}