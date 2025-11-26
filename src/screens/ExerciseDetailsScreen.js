import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/favoritesSlice';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ExerciseDetailsScreen = ({ route }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const styles = getStyles(theme);
  const { exercise } = route.params;
  const favorites = useSelector((state) => state.favorites.items);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [favorites]);

  const checkFavoriteStatus = () => {
    const status = favorites.some((fav) => fav.name === exercise.name);
    setIsFavorite(status);
  };

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await dispatch(removeFavorite(exercise.name)).unwrap();
      Alert.alert('Removed', 'Exercise removed from favorites');
    } else {
      await dispatch(addFavorite(exercise)).unwrap();
      Alert.alert('Added', 'Exercise added to favorites');
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return theme.success;
      case 'intermediate':
        return theme.warning;
      case 'expert':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <TouchableOpacity
              style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
              onPress={handleToggleFavorite}
            >
              <Feather 
                name="heart" 
                size={28} 
                color={isFavorite ? theme.error : theme.textSecondary} 
                fill={isFavorite ? theme.error : 'none'}
              />
            </TouchableOpacity>
          </View>

          {/* Difficulty Badge */}
          <View
            style={[styles.difficultyBadge, { backgroundColor: hexToRgba(getDifficultyColor(exercise.difficulty), 0.125) }]}
          >
            <Feather 
              name={exercise.difficulty === 'beginner' ? 'leaf' : exercise.difficulty === 'intermediate' ? 'zap' : 'zap'} 
              size={16} 
              color={getDifficultyColor(exercise.difficulty)} 
            />
            <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
              {exercise.difficulty?.charAt(0).toUpperCase() + exercise.difficulty?.slice(1)}
            </Text>
          </View>

          {/* Info Cards */}
          <View style={styles.infoGrid}>
            <View style={[styles.infoCard, styles.infoCardPrimary]}>
              <Feather name="activity" size={24} color={theme.primary} />
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>{exercise.type}</Text>
            </View>
            <View style={[styles.infoCard, styles.infoCardSecondary]}>
              <Feather name="user" size={24} color={theme.secondary} />
              <Text style={styles.infoLabel}>Muscle</Text>
              <Text style={styles.infoValue}>{exercise.muscle}</Text>
            </View>
          </View>

          {exercise.equipment && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="target" size={20} color={theme.primary} />
                <Text style={styles.sectionTitle}>Equipment</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardText}>{exercise.equipment}</Text>
              </View>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="list" size={20} color={theme.primary} />
              <Text style={styles.sectionTitle}>Instructions</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.instructionText}>{exercise.instructions}</Text>
            </View>
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
  content: {
    padding: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  title: {
    fontSize: FONTS.h1.fontSize,
    fontWeight: FONTS.h1.fontWeight,
    color: theme.text,
    flex: 1,
    marginRight: SIZES.base,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: theme.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255, 92, 92, 0.082)',
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.padding * 1.5,
  },
  difficultyText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: 'bold',
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: SIZES.padding * 1.5,
    gap: SIZES.base,
  },
  infoCard: {
    flex: 1,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: FONTS.small.fontSize,
    color: theme.textSecondary,
    marginTop: SIZES.base / 2,
  },
  infoValue: {
    fontSize: FONTS.body.fontSize,
    fontWeight: 'bold',
    color: theme.text,
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  infoCardPrimary: {
    backgroundColor: 'rgba(108, 99, 255, 0.082)',
  },
  infoCardSecondary: {
    backgroundColor: 'rgba(255, 107, 157, 0.082)',
  },
  section: {
    marginBottom: SIZES.padding * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base,
    marginBottom: SIZES.padding,
  },
  sectionTitle: {
    fontSize: FONTS.h3.fontSize,
    fontWeight: FONTS.h3.fontWeight,
    color: theme.text,
  },
  card: {
    backgroundColor: theme.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    ...SHADOWS.small,
  },
  cardText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.text,
    textTransform: 'capitalize',
  },
  instructionText: {
    fontSize: FONTS.body.fontSize,
    color: theme.text,
    lineHeight: SIZES.extraLarge,
  },
});

export default ExerciseDetailsScreen;
