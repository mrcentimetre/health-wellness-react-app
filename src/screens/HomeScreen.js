import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';
import { MUSCLE_GROUPS, EXERCISE_TYPES, DIFFICULTY_LEVELS } from '../constants/data';
import CategoryCard from '../components/CategoryCard';
import ExerciseCard from '../components/ExerciseCard';
import { exerciseAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendedExercises, setRecommendedExercises] = useState([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  useEffect(() => {
    fetchRecommendedExercises();
  }, []);

  const fetchRecommendedExercises = async () => {
    setLoadingRecommended(true);
    try {
      // Fetch popular exercises (chest exercises as recommended)
      const data = await exerciseAPI.searchExercises({ muscle: 'chest', difficulty: 'beginner' });
      // Limit to first 5 exercises for the home screen
      setRecommendedExercises(data.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching recommended exercises:', error);
      setRecommendedExercises([]);
    } finally {
      setLoadingRecommended(false);
    }
  };

  const handleCategoryPress = (category, filterType) => {
    navigation.navigate('ExerciseList', {
      filterType,
      filterValue: category.id,
      title: category.name,
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigation.navigate('ExerciseList', {
        filterType: 'name',
        filterValue: searchQuery.trim(),
        title: `Search: ${searchQuery}`,
      });
    }
  };

  const handleExercisePress = (exercise) => {
    navigation.navigate('ExerciseDetails', { exercise });
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={theme.gradient}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</Text>
              <Text style={styles.title}>FitBuddy</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Feather name="user" size={32} color={theme.card} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Feather name="x-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Feather name="zap" size={24} color={theme.primary} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="clock" size={24} color={theme.secondary} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="award" size={24} color={theme.accent} />
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Goals</Text>
          </View>
        </View>

        {/* Recommended Exercises Section - Fetched from API */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended for You</Text>
            <View style={styles.popularBadge}>
              <Feather name="star" size={14} color={theme.accent} />
              <Text style={styles.popularText}>Popular</Text>
            </View>
          </View>
          
          {loadingRecommended ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text style={styles.loadingText}>Loading exercises...</Text>
            </View>
          ) : recommendedExercises.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContent}
            >
              {recommendedExercises.map((exercise, index) => (
                <View key={`${exercise.name}-${index}`} style={styles.horizontalCard}>
                  <ExerciseCard 
                    exercise={exercise} 
                    onPress={handleExercisePress} 
                    theme={theme}
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyRecommended}>
              <Feather name="activity" size={32} color={theme.textSecondary} />
              <Text style={styles.emptyText}>No recommendations available</Text>
            </View>
          )}
        </View>

        {/* Muscle Groups Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Muscle Groups</Text>
          </View>
          <View style={styles.grid}>
            {MUSCLE_GROUPS.map((muscle) => (
              <CategoryCard
                key={muscle.id}
                item={muscle}
                onPress={(item) => handleCategoryPress(item, 'muscle')}
                theme={theme}
              />
            ))}
          </View>
        </View>

        {/* Exercise Types Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exercise Types</Text>
          </View>
          <View style={styles.grid}>
            {EXERCISE_TYPES.map((type) => (
              <CategoryCard
                key={type.id}
                item={type}
                onPress={(item) => handleCategoryPress(item, 'type')}
                theme={theme}
              />
            ))}
          </View>
        </View>

        {/* Difficulty Levels Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Difficulty Levels</Text>
          </View>
          <View style={styles.grid}>
            {DIFFICULTY_LEVELS.map((level) => (
              <CategoryCard
                key={level.id}
                item={level}
                onPress={(item) => handleCategoryPress(item, 'difficulty')}
                theme={theme}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  headerGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingBottom: SIZES.padding,
  },
  greeting: {
    fontSize: FONTS.body.fontSize,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: FONTS.h1.fontSize,
    fontWeight: FONTS.h1.fontWeight,
    color: theme.card,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: 'rgba(255, 255, 255, 0.125)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    backgroundColor: theme.card,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.padding,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    marginRight: SIZES.base,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SIZES.padding,
    fontSize: FONTS.body.fontSize,
    color: theme.text,
  },
  clearButton: {
    padding: SIZES.base / 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding * 1.5,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
    marginHorizontal: SIZES.base,
  },
  statValue: {
    fontSize: FONTS.h2.fontSize,
    fontWeight: FONTS.h2.fontWeight,
    color: theme.text,
    marginTop: SIZES.base / 2,
  },
  statLabel: {
    fontSize: FONTS.small.fontSize,
    color: theme.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: SIZES.padding * 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: FONTS.h3.fontWeight,
    color: theme.text,
  },
  popularBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 199, 7, 0.125)',
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radiusSmall,
    gap: 4,
  },
  popularText: {
    fontSize: FONTS.small.fontSize,
    fontWeight: '600',
    color: theme.accent,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
    gap: SIZES.base,
  },
  loadingText: {
    fontSize: FONTS.body.fontSize,
    color: theme.textSecondary,
  },
  horizontalScrollContent: {
    paddingHorizontal: SIZES.padding,
    gap: SIZES.padding,
  },
  horizontalCard: {
    width: 300,
  },
  emptyRecommended: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding * 2,
    backgroundColor: theme.card,
    marginHorizontal: SIZES.padding,
    borderRadius: SIZES.radius,
    gap: SIZES.base,
  },
  emptyText: {
    fontSize: FONTS.body.fontSize,
    color: theme.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.padding - SIZES.base / 2,
  },
});

export default HomeScreen;
