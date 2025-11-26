import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { signOut as signOutAction } from '../store/authSlice';
import { SIZES, FONTS, SHADOWS } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            await dispatch(signOutAction());
          }
        },
      ]
    );
  };
  const profileOptions = [
    {
      id: 1,
      title: 'Personal Information',
      icon: 'user',
      onPress: () => {},
    },
    {
      id: 2,
      title: 'Workout Goals',
      icon: 'award',
      onPress: () => {},
    },
    {
      id: 3,
      title: 'Statistics',
      icon: 'bar-chart-2',
      onPress: () => {},
    },
    {
      id: 4,
      title: 'Notifications',
      icon: 'bell',
      onPress: () => {},
    },
    {
      id: 5,
      title: 'Dark Mode',
      icon: 'moon',
      isToggle: true,
      value: isDarkMode,
      onToggle: toggleTheme,
    },
    {
      id: 6,
      title: 'Settings',
      icon: 'settings',
      onPress: () => {},
    },
    {
      id: 7,
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => {},
    },
  ];

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
          <Text style={styles.headerTitle}>Profile</Text>
          
          {/* Profile Info */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Feather name="user" size={48} color={theme.card} />
            </View>
            <Text style={styles.userName}>{user?.name || 'Fitness User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </LinearGradient>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                index === profileOptions.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={option.isToggle ? undefined : option.onPress}
              activeOpacity={option.isToggle ? 1 : 0.7}
              disabled={Boolean(option.isToggle)}
            >
              <View style={styles.optionLeft}>
                <View style={styles.optionIconContainer}>
                  <Feather name={option.icon} size={22} color={theme.primary} />
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
              </View>
              {option.isToggle ? (
                <Switch
                  value={Boolean(option.value)}
                  onValueChange={option.onToggle}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={option.value ? theme.primary : theme.textSecondary}
                />
              ) : (
                <Feather name="chevron-right" size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7} onPress={handleSignOut}>
          <LinearGradient
            colors={[theme.error, theme.error]}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Feather name="log-out" size={20} color={theme.card} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingTop: 20,
    paddingHorizontal: 24,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: FONTS.h1.fontSize,
    fontWeight: FONTS.h1.fontWeight,
    color: theme.card,
    marginBottom: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.125)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: theme.card,
  },
  userName: {
    fontSize: FONTS.h2.fontSize,
    fontWeight: FONTS.h2.fontWeight,
    color: theme.card,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FONTS.body.fontSize,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: theme.card,
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.border,
    marginHorizontal: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: FONTS.body.fontSize,
    color: theme.textSecondary,
  },
  optionsContainer: {
    backgroundColor: theme.card,
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(108, 99, 255, 0.082)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionTitle: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.text,
  },
  logoutButton: {
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 40,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: 'bold',
    color: theme.card,
  },
});

export default ProfileScreen;
