import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { searchMovies } from '../utils/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const search = async (pageNum = 1) => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const result = await searchMovies(query, pageNum);
      if (result.Response === 'True') {
        if (pageNum === 1) {
          setMovies(result.Search);
          setTotalResults(parseInt(result.totalResults));
        } else {
          setMovies(prev => [...prev, ...result.Search]);
        }
      } else {
        if (pageNum === 1) {
          setMovies([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    search(1);
  };

  const loadMore = () => {
    if (movies.length < totalResults && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      search(nextPage);
    }
  };

  const toggleFavorite = async (movie) => {
    try {
      let updatedFavorites;
      const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
      
      if (isFavorite) {
        updatedFavorites = favorites.filter(fav => fav.imdbID !== movie.imdbID);
      } else {
        updatedFavorites = [...favorites, movie];
      }
      
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="Search movies..."
        onSubmitEditing={handleSearch}
      />
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('Details', { movie: item })}
          />
        )}
        ListFooterComponent={renderFooter}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  footer: {
    padding: 20,
  },
});

export default HomeScreen;