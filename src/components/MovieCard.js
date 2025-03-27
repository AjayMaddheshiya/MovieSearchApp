import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const MovieCard = ({ movie, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100x150' }}
        style={styles.poster}
      />
      <View style={styles.details}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.year}>{movie.Year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 5,
  },
  details: {
    paddingLeft: 10,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  year: {
    fontSize: 14,
    color: '#666',
  },
});

export default MovieCard;