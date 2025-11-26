import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const storageUtils = {
  // Get all favorites
  getFavorites: async () => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  },

  // Add exercise to favorites
  addFavorite: async (exercise) => {
    try {
      const favorites = await storageUtils.getFavorites();
      const isAlreadyFavorite = favorites.some(
        (fav) => fav.name === exercise.name
      );

      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, exercise];
        await AsyncStorage.setItem(
          FAVORITES_KEY,
          JSON.stringify(updatedFavorites)
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding favorite:', error);
      return false;
    }
  },

  // Remove exercise from favorites
  removeFavorite: async (exerciseName) => {
    try {
      const favorites = await storageUtils.getFavorites();
      const updatedFavorites = favorites.filter(
        (fav) => fav.name !== exerciseName
      );
      await AsyncStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites)
      );
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      return false;
    }
  },

  // Check if exercise is favorite
  isFavorite: async (exerciseName) => {
    try {
      const favorites = await storageUtils.getFavorites();
      return favorites.some((fav) => fav.name === exerciseName);
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  },
};
