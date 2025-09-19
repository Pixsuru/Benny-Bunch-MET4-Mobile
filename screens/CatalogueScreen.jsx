import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../config";
import { CartContext } from "../context/Cart";

const { width } = Dimensions.get("window");

export default function CatalogueScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/movies`);
      let data = await response.json();
      data = data.map((movie) => ({
        ...movie,
        price: (Math.random() * (15.99 - 4.99) + 4.99).toFixed(2),
      }));
      setMovies(data);
      setFilteredMovies(data);
      const allGenres = data.flatMap((m) => m.genre || []);
      setGenres(["all", ...Array.from(new Set(allGenres))]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch movies from server.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "all" || (movie.genre || []).includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
    setFilteredMovies(filtered);
  }, [searchQuery, selectedGenre, movies]);

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedGenre === item && { backgroundColor: "#FF6B6B" },
      ]}
      onPress={() => setSelectedGenre(item)}
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderMovieCard = ({ item }) => {
    const inCart = cart.some((c) => c._id === item._id);

    if (viewMode === "list") {
      return (
        <View style={styles.listMovieCard}>
          <Image source={{ uri: item.image || item.poster }} style={styles.listPoster} />
          <View style={styles.listMovieInfo}>
            <Text style={styles.listMovieTitle}>{item.title}</Text>
            <View style={styles.movieMeta}>
              <Text style={styles.movieGenre}>{(item.genre || []).join(", ")}</Text>
              <Text style={styles.movieYear}>• {item.year}</Text>
              <Text style={styles.movieRating}>• ⭐ {item.rating}</Text>
            </View>
            <Text style={styles.listMoviePrice}>R{item.price}</Text>
            <View style={styles.listActions}>
              <TouchableOpacity
                style={[styles.listCartButton, inCart && { backgroundColor: "#b600c7ff" }]}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.listCartText}>
                  {inCart ? "✓ Added" : "Add to Cart"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.gridMovieCard}>
        <View style={styles.posterWrapper}>
          <Image source={{ uri: item.image || item.poster }} style={styles.gridPoster} />
          <LinearGradient
            colors={["rgba(65, 7, 77, 0.0)", "rgba(65, 7, 77, 0.8)"]}
            style={styles.posterOverlay}
          />
        </View>
        <View style={styles.movieInfo}>
          <Text style={styles.gridMovieTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.gridMovieGenre}>{(item.genre || []).join(", ")}</Text>

          <Text style={styles.gridMoviePrice}>R{item.price}</Text>

          <View style={styles.gridBottomRow}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.movieYear}>{item.year}</Text>
              <Text style={[styles.movieRating, { marginLeft: 5 }]}>⭐ {item.rating}</Text>
            </View>

            <TouchableOpacity
              style={[styles.gridCartButton, inCart && { backgroundColor: "#b600c7ff" }]}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.gridCartText}>{inCart ? "✓" : "+"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <LinearGradient
        colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#fff" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#a64642", "#5a1f88", "#40224f", "#29183f"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <TextInput
        placeholder="Search movies..."
        placeholderTextColor="#ccc"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        horizontal
        data={genres}
        keyExtractor={(item) => item}
        renderItem={renderCategoryItem}
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingHorizontal: 15, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}>
          <Ionicons name={viewMode === "grid" ? "list" : "grid"} size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item._id || item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        numColumns={viewMode === "grid" ? 2 : 1}
        key={viewMode}
        renderItem={renderMovieCard}
        ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchInput: {
    backgroundColor: "rgba(58,31,136,0.4)",
    color: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 45,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  categoryButton: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 6,
    height: 40,
    minWidth: 60,
    maxHeight: 40,
    marginBottom: 15,
  },
  categoryText: { color: "#fff", fontSize: 12 },

  // Grid
  gridMovieCard: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: "#190a27",
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  posterWrapper: {
    position: "relative",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  gridPoster: { width: "100%", height: 220, resizeMode: "cover" },
  posterOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
  },
  movieInfo: { padding: 15 },
  gridMovieTitle: {
    color: "#e5e5e5",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  gridMovieGenre: { color: "#aaa", fontSize: 12, marginBottom: 4, textAlign: "center" },
  gridBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  gridMoviePrice: { color: "#ff8a95", fontSize: 16, fontWeight: "bold", textAlign: "center" },
  gridCartButton: {
    backgroundColor: "#ff3d00",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  gridCartText: { color: "white", fontSize: 18, fontWeight: "bold" },

  // List
  listMovieCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#190a27",
    borderRadius: 15,
    padding: 12,
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  listPoster: { width: 80, height: 120, borderRadius: 10, marginRight: 15 },
  listMovieInfo: { flex: 1 },
  listMovieTitle: { color: "#e5e5e5", fontSize: 16, fontWeight: "600", marginBottom: 6 },
  movieMeta: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginBottom: 6 },
  movieGenre: { color: "#aaa", fontSize: 12, fontWeight: "600", marginRight: 5 },
  movieYear: { color: "#aaa", fontSize: 12, marginRight: 5 },
  movieRating: { color: "#ffd93d", fontSize: 12 },
  listMoviePrice: { color: "#ff8a95", fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  listActions: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  listCartButton: {
    backgroundColor: "#ff3d00",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  listCartText: { color: "white", fontSize: 12, fontWeight: "bold" },
});
