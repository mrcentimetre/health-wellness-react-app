import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { exerciseAPI } from '../services/api';
import ExerciseCard from '../components/ExerciseCard';

const ExerciseListScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const { filterType, filterValue, title } = route.params;
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    navigation.setOptions({ title });
    fetchExercises();
  }, [filterType, filterValue]);

  const fetchExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      let data;
      const params = {};
      params[filterType] = filterValue;

      data = await exerciseAPI.searchExercises(params);
      setExercises(data || []);
    } catch (err) {
      setError('Failed to load exercises. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading exercises...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centerContainer}>
          <View style={styles.errorIconContainer}>
            <Feather name="alert-circle" size={64} color={theme.error} />
          </View>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (exercises.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.centerContainer}>
          <View style={styles.emptyIconContainer}>
            <Feather name="search" size={64} color={theme.textSecondary} />
          </View>
          <Text style={styles.emptyText}>No exercises found</Text>
          <Text style={styles.emptySubtext}>Try a different search or filter</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={exercises}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: SIZES.padding * 2,
  },
  listContent: {
    paddingVertical: SIZES.padding,
  },
  loadingText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.textSecondary,
    marginTop: SIZES.padding,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 92, 92, 0.082)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.padding * 1.5,
  },
  errorText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.error,
    textAlign: 'center',
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.border,
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
});

export default ExerciseListScreen;
