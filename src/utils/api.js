import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/config';

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?apikey=${API_KEY}&s=${query}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return null;
  }
};

export const getMovieDetails = async (id) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};