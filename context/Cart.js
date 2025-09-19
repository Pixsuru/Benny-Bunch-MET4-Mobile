import React, { createContext, useState } from "react";
import { Alert } from "react-native";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (movie) => {
    setCart((prevCart) => {
      // Use .some() for a cleaner check if the movie already exists.
      const exists = prevCart.some((item) => item._id === movie._id);
      if (exists) {
        Alert.alert("Already in Cart", `${movie.title} is already in your cart!`);
        return prevCart; // Return the previous cart state unchanged.
      } else {
        Alert.alert("Added to Cart", `${movie.title} added to cart!`);
        return [...prevCart, movie]; // Add the new movie to the cart.
      }
    });
  };

  const removeFromCart = (movieId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== movieId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // The total price calculation is correct, no changes needed here.
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};