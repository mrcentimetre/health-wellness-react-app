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
import { signIn as signInAction } from '../store/authSlice';
import { SIZES, FONTS } from '../constants/theme';

const signInSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const SignInScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignIn = async () => {
    try {
      // Validate form data
      await signInSchema.validate({ email, password }, { abortEarly: false });
      
      setLoading(true);
      setErrors({});
      const result = await dispatch(signInAction({ email, password })).unwrap();
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
        setErrors({ general: err.message || 'Sign in failed' });
      }
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={theme.gradient}
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
              <Text style={styles.title}>Welcome to FitBuddy!</Text>
              <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {errors.general ? (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={20} color={theme.error} />
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              ) : null}

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

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={styles.signInButton}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.gradient}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.card} />
                  ) : (
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.padding * 1.5,
  },
  forgotText: {
    fontSize: SIZES.font,
    fontWeight: '500',
    color: theme.primary,
  },
  signInButton: {
    borderRadius: SIZES.radiusSmall,
    overflow: 'hidden',
    marginBottom: SIZES.padding,
  },
  buttonGradient: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: theme.card,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: SIZES.font,
    fontWeight: '400',
    color: theme.textSecondary,
  },
  signUpLink: {
    fontSize: SIZES.font,
    fontWeight: 'bold',
    color: theme.primary,
  },
});

export default SignInScreen;
