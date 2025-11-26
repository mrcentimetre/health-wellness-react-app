import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

// Async thunks
export const loadFavorites = createAsyncThunk('favorites/loadFavorites', async () => {
  try {
    const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
});

export const addFavorite = createAsyncThunk('favorites/addFavorite', async (exercise, { getState }) => {
  try {
    const { favorites } = getState();
    const isAlreadyFavorite = favorites.items.some((fav) => fav.name === exercise.name);

    if (!isAlreadyFavorite) {
      const updatedFavorites = [...favorites.items, exercise];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      return exercise;
    }
    return null;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
});

export const removeFavorite = createAsyncThunk('favorites/removeFavorite', async (exerciseName, { getState }) => {
  try {
    const { favorites } = getState();
    const updatedFavorites = favorites.items.filter((fav) => fav.name !== exerciseName);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return exerciseName;
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load favorites
      .addCase(loadFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadFavorites.rejected, (state) => {
        state.loading = false;
        state.items = [];
      })
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        if (action.payload) {
          state.items.push(action.payload);
        }
      })
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter((fav) => fav.name !== action.payload);
      });
  },
});

export default favoritesSlice.reducer;
