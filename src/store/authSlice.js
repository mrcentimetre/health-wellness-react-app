import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = '@user_data';

// Async thunks
export const loadUser = createAsyncThunk('auth/loadUser', async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error loading user:', error);
    return null;
  }
});

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  try {
    // Simulate API call
    const userData = {
      id: '1',
      name: 'Fitness User',
      email: email,
      avatar: null,
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw new Error('Failed to sign in');
  }
});

export const signUp = createAsyncThunk('auth/signUp', async ({ name, email, password }) => {
  try {
    // Simulate API call
    const userData = {
      id: '1',
      name: name,
      email: email,
      avatar: null,
    };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    return userData;
  } catch (error) {
    throw new Error('Failed to sign up');
  }
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (updatedData, { getState }) => {
  try {
    const { auth } = getState();
    const newUserData = { ...auth.user, ...updatedData };
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData));
    return newUserData;
  } catch (error) {
    throw new Error('Failed to update profile');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load user
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
      })
      .addCase(loadUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Sign in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Sign up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Sign out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
