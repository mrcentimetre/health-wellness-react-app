import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
  primary: '#6C63FF',
  primaryLight: '#8B84FF',
  primaryDark: '#5548E8',
  secondary: '#FF6B9D',
  accent: '#FFC107',
  background: '#F8F9FE',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1D1F',
  textSecondary: '#6F767E',
  textTertiary: '#9CA4AB',
  border: '#EFEFEF',
  success: '#00D9A5',
  error: '#FF5C5C',
  warning: '#FFB800',
  info: '#4E9FFF',
  gradient: ['#6C63FF', '#5548E8'],
  gradientSecondary: ['#FF6B9D', '#FF8FB5'],
  gradientDark: ['#2D2A45', '#1A1825'],
  shadow: 'rgba(108, 99, 255, 0.15)',
  isDark: false,
};

export const darkTheme = {
  primary: '#8B84FF',
  primaryLight: '#A29DFF',
  primaryDark: '#6C63FF',
  secondary: '#FF8FB5',
  accent: '#FFD54F',
  background: '#121218',
  backgroundSecondary: '#1A1A24',
  card: '#1E1E2D',
  text: '#FFFFFF',
  textSecondary: '#B0B3B8',
  textTertiary: '#6F767E',
  border: '#2A2A3C',
  success: '#00E5B0',
  error: '#FF6B7A',
  warning: '#FFC940',
  info: '#5BA8FF',
  gradient: ['#8B84FF', '#6C63FF'],
  gradientSecondary: ['#FF8FB5', '#FF6B9D'],
  gradientDark: ['#1E1E2D', '#121218'],
  shadow: 'rgba(0, 0, 0, 0.4)',
  isDark: true,
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme_preference');
      if (savedTheme !== null) {
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
        setTheme(isDark ? darkTheme : lightTheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newIsDark = !isDarkMode;
      setIsDarkMode(newIsDark);
      setTheme(newIsDark ? darkTheme : lightTheme);
      await AsyncStorage.setItem('@theme_preference', newIsDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
