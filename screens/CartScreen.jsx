import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { CartContext } from "../context/Cart";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Text as SvgText, Polygon } from "react-native-svg";

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const [fadeAnim] = useState(new Animated.Value(1));

  const totalPrice = cart.reduce((sum, movie) => {
    const price = typeof movie.price === 'string' ? Number(movie.price.replace('R', '')) : movie.price;
    return sum + (price || 0);
  }, 0).toFixed(2);
  
  const totalItems = cart.length;

  const handleRemoveItem = (item) => {
    Alert.alert(
      "Remove Movie",
      `Remove "${item.title}" from cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              removeFromCart(item._id); 
              fadeAnim.setValue(1);
            });
          }
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Remove all movies from cart?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => clearCart()
        }
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      "Checkout",
      `Proceed to payment for ${totalItems} movies?\nTotal: R${totalPrice}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Continue", 
          onPress: () => {
            Alert.alert("Success!", "Payment processed successfully! 🎬", [{ text: "OK", onPress: () => clearCart() }]);
          }
        }
      ]
    );
  };

  const renderMovieCard = ({ item }) => (
    <Animated.View style={[styles.movieCard, { opacity: fadeAnim }]}>
      <View style={styles.cardContent}>
        <Image source={{ uri: item.poster || item.image }} style={styles.poster} />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.movieMeta}>
            <Text style={styles.movieGenre}>{item.genre.join(', ') || 'Movie'}</Text>
            <Text style={styles.movieYear}>{item.year || '2023'}</Text>
            {item.rating && (
              <Text style={styles.movieRating}>⭐ {item.rating}</Text>
            )}
          </View>
          <Text style={styles.moviePrice}>R{Number(item.price).toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item)}
        >
          <FontAwesome name="trash" size={20} color="#ff3d00" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bag-outline" size={80} color="rgba(255,255,255,0.3)" />
      </View>
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>Browse movies and add them to your cart</Text>
      <TouchableOpacity 
        style={styles.browseButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.browseButtonText}>Browse Movies</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      <LinearGradient
        colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
        style={styles.summaryGradient}
      >
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items ({totalItems})</Text>
          <Text style={styles.summaryValue}>R{totalPrice}</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Streaming Fee</Text>
          <Text style={styles.summaryValue}>R0.00</Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R{totalPrice}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <LinearGradient
              colors={['#5a1f88', '#a64642']}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>Checkout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // SVG Logo for Cart Header
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

  return (
    <LinearGradient colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]} style={styles.background}>
      <StatusBar barStyle="light-content" />

      {/* Header with SVG */}
      <View style={styles.header}>
        {renderLogo()}
        <Text style={styles.headerSubtitle}>My Cart</Text>
      </View>

      {cart.length === 0 ? (
        renderEmptyCart()
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.itemCount}>{totalItems} {totalItems === 1 ? 'movie' : 'movies'} in cart</Text>
          
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={renderMovieCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
          />
          
          {renderCartSummary()}
        </View>
      )}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: { 
    flex: 1 
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  stars: { 
    fontSize: 16, 
    color: '#ffedbc', 
    marginBottom: 2 
  },
  appTitle: { 
    fontSize: 24, 
    color: '#fff', 
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#debaffff',
    fontWeight: '600',
  },

  // Content
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemCount: {
    color: '#ffedbc',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },

  // Movie Cards
  listContainer: {
    paddingBottom: 20,
  },
  movieCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  poster: { 
    width: 80, 
    height: 120, 
    borderRadius: 10, 
    marginRight: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  movieInfo: { 
    flex: 1,
    marginRight: 15,
  },
  movieTitle: { 
    color: "#e5e5e5", 
    fontSize: 16, 
    fontWeight: "600",
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
    maxWidth:90,
  },
  movieGenre: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  movieYear: {
    color: '#aaa',
    fontSize: 12,
  },
  movieRating: {
    color: '#ffedbc',
    fontSize: 12,
  },
  moviePrice: { 
    color: "#ff8a95", 
    fontSize: 18, 
    fontWeight: "bold",
  },
  removeButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: 12,
    alignSelf: 'center'
  },

  // Empty State
  emptyContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: { 
    color: "white", 
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#ff3d00',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Summary
  summaryContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  summaryGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#aaa',
    fontSize: 16,
  },
  summaryValue: {
    color: '#e5e5e5',
    fontSize: 16,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: 15,
    marginTop: 15,
    marginBottom: 20,
  },
  totalLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalValue: {
    color: '#ff8a95',
    fontSize: 20,
    fontWeight: 'bold',
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  clearButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  checkoutButton: {
    flex: 2,
    borderRadius: 25,
    overflow: 'hidden',
  },
  checkoutGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  checkoutText: { 
    color: "white", 
    fontSize: 16, 
    fontWeight: "bold",
    letterSpacing: 1,
  },
});