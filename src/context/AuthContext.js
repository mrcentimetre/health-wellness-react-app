import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      // Simulate API call
      const userData = {
        id: '1',
        name: 'Fitness User',
        email: email,
        avatar: null,
      };
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign in' };
    }
  };

  const signUp = async (name, email, password) => {
    try {
      // Simulate API call
      const userData = {
        id: '1',
        name: name,
        email: email,
        avatar: null,
      };
      await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to sign up' };
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@user_data');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData };
      await AsyncStorage.setItem('@user_data', JSON.stringify(newUserData));
      setUser(newUserData);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
