import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import store, { initializeStore } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [storeReady, setStoreReady] = useState(false);

  useEffect(() => {
    const setupStore = async () => {
      await initializeStore();
      setStoreReady(true);
    };
    setupStore();
  }, []);

  if (!storeReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
}
