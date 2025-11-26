import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { FONTS, SIZES } from '../constants/theme';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import ExerciseDetailsScreen from '../screens/ExerciseDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = ({ theme }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.card,
        headerTitleStyle: {
          fontSize: FONTS.h3.fontSize,
          fontWeight: FONTS.h3.fontWeight,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ExerciseList"
        component={ExerciseListScreen}
        options={{ title: 'Exercises' }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={{ title: 'Exercise Details' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const FavoritesStack = ({ theme }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.card,
        headerTitleStyle: {
          fontSize: FONTS.h3.fontSize,
          fontWeight: FONTS.h3.fontWeight,
        },
      }}
    >
      <Stack.Screen
        name="FavoritesList"
        component={FavoritesScreen}
        options={{ title: 'My Favorites' }}
      />
      <Stack.Screen
        name="ExerciseDetails"
        component={ExerciseDetailsScreen}
        options={{ title: 'Exercise Details' }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = ({ theme }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.primary,
        },
        headerTintColor: theme.card,
        headerTitleStyle: {
          fontSize: FONTS.h3.fontSize,
          fontWeight: FONTS.h3.fontWeight,
        },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'HomeTab') {
            iconName = 'home';
          } else if (route.name === 'FavoritesTab') {
            iconName = 'heart';
          } else if (route.name === 'ProfileTab') {
            iconName = 'user';
          }
          
          return <Feather name={iconName} size={24} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 85,
          paddingBottom: 15,
          paddingTop: 10,
          shadowColor: theme.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      >
        {() => <HomeStack theme={theme} />}
      </Tab.Screen>
      <Tab.Screen
        name="FavoritesTab"
        options={{
          title: 'Favorites',
          tabBarLabel: 'Favorites',
        }}
      >
        {() => <FavoritesStack theme={theme} />}
      </Tab.Screen>
      <Tab.Screen
        name="ProfileTab"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      >
        {() => <ProfileStack theme={theme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { theme } = useTheme();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
