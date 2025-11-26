import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { loadFavorites } from '../store/favoritesSlice';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import ExerciseCard from '../components/ExerciseCard';

const FavoritesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);
  const styles = getStyles(theme);

  useFocusEffect(
    useCallback(() => {
      dispatch(loadFavorites());
    }, [dispatch])
  );

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Favorites</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Feather name="heart" size={64} color={theme.primary} />
          </View>
          <Text style={styles.emptyText}>No Favorites Yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding exercises to your favorites to see them here!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{favorites.length}</Text>
        </View>
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }) => (
          <ExerciseCard exercise={item} onPress={handleExercisePress} theme={theme} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
  },
  headerTitle: {
    fontSize: FONTS.h1.fontSize,
    fontWeight: FONTS.h1.fontWeight,
    color: theme.text,
  },
  badge: {
    backgroundColor: theme.primary,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base / 2,
    minWidth: 32,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: 'bold',
    color: theme.card,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(108, 99, 255, 0.082)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  emptyText: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: FONTS.h3.fontWeight,
    color: theme.text,
    marginBottom: SIZES.base,
  },
  emptySubtext: {
    fontSize: FONTS.body.fontSize,
    color: theme.textSecondary,
    textAlign: 'center',
    lineHeight: SIZES.xl,
  },
  listContent: {
    paddingVertical: SIZES.base,
  },
});

export default FavoritesScreen;
