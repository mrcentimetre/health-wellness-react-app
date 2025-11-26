import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ExerciseCard = ({ exercise, onPress, theme }) => {
  const styles = getStyles(theme);
  
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
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(exercise)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>
          {exercise.name}
        </Text>
        <View
          style={[styles.difficultyBadge, { backgroundColor: hexToRgba(getDifficultyColor(exercise.difficulty), 0.125) }]}
        >
          <Text style={[styles.difficultyText, { color: getDifficultyColor(exercise.difficulty) }]}>
            {exercise.difficulty?.charAt(0).toUpperCase() + exercise.difficulty?.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Feather name="activity" size={16} color={theme.primary} />
          <Text style={styles.infoValue}>{exercise.type}</Text>
        </View>
        <View style={styles.infoItem}>
          <Feather name="user" size={16} color={theme.secondary} />
          <Text style={styles.infoValue}>{exercise.muscle}</Text>
        </View>
      </View>

      {exercise.equipment && (
        <View style={styles.equipmentContainer}>
          <Feather name="target" size={14} color={theme.textSecondary} />
          <Text style={styles.equipmentText}>{exercise.equipment}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const getStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base * 1.5,
    marginHorizontal: SIZES.padding,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.padding,
  },
  name: {
    fontSize: FONTS.body.fontSize,
    fontWeight: 'bold',
    color: theme.text,
    flex: 1,
    marginRight: SIZES.base,
  },
  difficultyBadge: {
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.radiusSmall,
  },
  difficultyText: {
    fontSize: FONTS.small.fontSize,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SIZES.base,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
  },
  infoValue: {
    fontSize: FONTS.body.fontSize,
    color: theme.text,
    textTransform: 'capitalize',
  },
  equipmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.base / 2,
    marginTop: SIZES.base / 2,
    paddingTop: SIZES.base,
    borderTopWidth: 1,
    borderTopColor: theme.border,
  },
  equipmentText: {
    fontSize: FONTS.body.fontSize,
    color: theme.textSecondary,
    textTransform: 'capitalize',
  },
});

export default ExerciseCard;
