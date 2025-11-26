import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadUser } from './authSlice';
import favoritesReducer, { loadFavorites } from './favoritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/loadUser/fulfilled', 'favorites/loadFavorites/fulfilled'],
      },
    }),
});

// Load persisted data on app start
export const initializeStore = async () => {
  await Promise.all([
    store.dispatch(loadUser()),
    store.dispatch(loadFavorites()),
  ]);
};

export default store;
