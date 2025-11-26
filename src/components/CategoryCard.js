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

const CategoryCard = ({ item, onPress, theme }) => {
  const styles = getStyles(theme);
  
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: hexToRgba(item.color, 0.082) }]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Feather name={item.icon} size={SIZES.iconLarge} color={theme.card} />
      </View>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (theme) => StyleSheet.create({
  card: {
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base,
    marginHorizontal: SIZES.base / 2,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    ...SHADOWS.medium,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.base * 1.5,
  },
  name: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.text,
    textAlign: 'center',
  },
});

export default CategoryCard;
