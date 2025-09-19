import React from "react";
import { View, Text, Image, Modal, TouchableOpacity, StyleSheet } from "react-native";

export default function MovieModal({ visible, movie, onClose }) {
  if (!movie) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: movie.poster }} style={styles.modalPoster} />
          <Text style={styles.modalTitle}>{movie.title}</Text>
          <Text style={styles.modalGenre}>{movie.genre} • {movie.year}</Text>
          <Text style={styles.modalRating}>⭐ {movie.rating}</Text>
          <Text style={styles.modalPrice}>Price: R{movie.price}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#191a2b',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  modalPoster: {
    width: 200,
    height: 300,
    borderRadius: 12,
    marginBottom: 15,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalGenre: {
    color: '#4ecdc4',
    fontSize: 16,
    marginBottom: 8,
  },
  modalRating: {
    color: '#ffd93d',
    fontSize: 16,
    marginBottom: 8,
  },
  modalPrice: {
    color: '#ff8a95',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
