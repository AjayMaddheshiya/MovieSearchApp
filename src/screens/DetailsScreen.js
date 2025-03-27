import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { getMovieDetails } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadMovieDetails();
    loadFavorites();
  }, []);

  const loadMovieDetails = async () => {
    try {
      const result = await getMovieDetails(movie.imdbID);
      setDetails(result);
    } catch (error) {
      console.error('Error loading details:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(parsedFavorites);
        setIsFavorite(parsedFavorites.some(fav => fav.imdbID === movie.imdbID));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      let updatedFavorites;
      
      if (isFavorite) {
        updatedFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        updatedFavorites = [...favorites, movie];
      }
      
      setFavorites(updatedFavorites);
      setIsFavorite(!isFavorite);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={styles.container}>
        <Text>Error loading movie details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/300x450' }}
        style={styles.poster}
      />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{details.Title}</Text>
        <Text style={styles.meta}>{details.Year} • {details.Rated} • {details.Runtime}</Text>
        
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? '★ Remove from Favorites' : '☆ Add to Favorites'}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.ratingContainer}>
          {details.Ratings && details.Ratings.map((rating, index) => (
            <View key={index} style={styles.rating}>
              <Text style={styles.ratingSource}>{rating.Source}</Text>
              <Text style={styles.ratingValue}>{rating.Value}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plot</Text>
          <Text style={styles.sectionContent}>{details.Plot}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genre</Text>
          <Text style={styles.sectionContent}>{details.Genre}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Director</Text>
          <Text style={styles.sectionContent}>{details.Director}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actors</Text>
          <Text style={styles.sectionContent}>{details.Actors}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  poster: {
    width: '100%',
    height: 400,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  meta: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  favoriteButton: {
    backgroundColor: '#ffcc00',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontWeight: 'bold',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  rating: {
    alignItems: 'center',
    flex: 1,
  },
  ratingSource: {
    fontSize: 14,
    color: '#666',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 22,
  },
});

export default DetailsScreen;