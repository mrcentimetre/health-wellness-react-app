import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import { signUp as signUpAction } from '../store/authSlice';
import { SIZES, FONTS } from '../constants/theme';

const signUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUpScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignUp = async () => {
    try {
      // Validate form data
      await signUpSchema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
      );
      
      setLoading(true);
      setErrors({});
      await dispatch(signUpAction({ name, email, password })).unwrap();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      if (err.name === 'ValidationError') {
        const validationErrors = {};
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: err.message || 'Sign up failed' });
      }
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradientSecondary}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Feather name="activity" size={64} color={theme.card} />
              <Text style={styles.title}>Join FitBuddy</Text>
              <Text style={styles.subtitle}>Create your account</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {errors.general ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={20} color={theme.error} />
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              ) : null}

              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color={theme.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && (
                <Text style={styles.fieldError}>{errors.name}</Text>
              )}

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Feather name="mail" size={20} color={theme.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && (
                <Text style={styles.fieldError}>{errors.email}</Text>
              )}

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor={theme.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password}</Text>
              )}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color={theme.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={theme.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={styles.fieldError}>{errors.confirmPassword}</Text>
              )}

              {/* Sign Up Button */}
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradientSecondary}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.card} />
                  ) : (
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={styles.signInLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SIZES.padding * 1.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.card,
    marginTop: SIZES.padding,
    marginBottom: SIZES.base,
  },
  subtitle: {
    fontSize: SIZES.medium,
    fontWeight: '400',
    color: theme.card,
    opacity: 0.9,
  },
  formCard: {
    backgroundColor: theme.card,
    borderRadius: SIZES.radiusLarge,
    padding: SIZES.padding * 1.5,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 92, 92, 0.082)',
    padding: SIZES.padding,
    borderRadius: SIZES.radiusSmall,
    marginBottom: SIZES.padding,
    gap: SIZES.base,
  },
  errorText: {
    fontSize: FONTS.body.fontSize,
    fontWeight: '500',
    color: theme.error,
    flex: 1,
  },
  fieldError: {
    fontSize: FONTS.small.fontSize,
    color: theme.error,
    marginTop: -SIZES.base,
    marginBottom: SIZES.base,
    marginLeft: SIZES.base,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: SIZES.radiusSmall,
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    gap: SIZES.base,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: SIZES.medium,
    fontWeight: '400',
    color: theme.text,
  },
  signUpButton: {
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding,
  },
  buttonGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: theme.card,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: SIZES.font,
    fontWeight: '400',
    color: theme.textSecondary,
  },
  signInLink: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: theme.primary,
  },
});

export default SignUpScreen;
