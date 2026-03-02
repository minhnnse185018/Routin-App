import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import apiService from '../../src/services/api.service';
import { StorageService } from '../../src/utils/storage';
import { validateLoginForm } from '../../src/utils/validation';
import { KeyboardAvoidingView, Keyboard } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isSmallScreen = SCREEN_WIDTH < 768;

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log('🔵 Login button pressed');
    console.log('📧 Email:', email);
    console.log('🔑 Password length:', password.length);
    
    // Validate form
    const validation = validateLoginForm(email, password);
    console.log('🔍 Validation result:', validation);
    
    if (!validation.isValid) {
      const errorMessages = validation.errors.map(e => e.message).join('\n');
      console.log('❌ Validation failed:', errorMessages);
      Alert.alert('Validation Error', errorMessages);
      return;
    }

    console.log('✅ Validation passed, starting login...');
    setLoading(true);
    try {
      const response = await apiService.login({
        email: email.trim(),
        password,
      });

      if (response.success && response.data) {
        console.log('✅ Login successful, saving tokens...');
        
        // Save token and user data
        await StorageService.saveToken(response.data.accessToken);
        if (response.data.refreshToken) {
          await StorageService.saveRefreshToken(response.data.refreshToken);
        }
        await StorageService.saveUser(response.data.user);

        console.log('🏠 Navigating to home page...');
        
        // Navigate to home page
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Login Failed', response.error || 'Invalid credentials');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const response = await apiService.googleSignIn('mock_google_token');
      
      if (response.success && response.data) {
        await StorageService.saveToken(response.data.accessToken);
        await StorageService.saveUser(response.data.user);
        Alert.alert('Success', 'Signed in with Google!');
        console.log('Google user:', response.data.user);
      } else {
        Alert.alert('Error', response.error || 'Google sign in failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setLoading(true);
    try {
      const response = await apiService.facebookSignIn('mock_facebook_token');
      
      if (response.success && response.data) {
        await StorageService.saveToken(response.data.accessToken);
        await StorageService.saveUser(response.data.user);
        Alert.alert('Success', 'Signed in with Facebook!');
      } else {
        Alert.alert('Error', response.error || 'Facebook sign in failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const response = await apiService.appleSignIn('mock_apple_token');
      
      if (response.success && response.data) {
        await StorageService.saveToken(response.data.accessToken);
        await StorageService.saveUser(response.data.user);
        Alert.alert('Success', 'Signed in with Apple!');
      } else {
        Alert.alert('Error', response.error || 'Apple sign in failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />

    <ImageBackground
      source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/54561f3262bb8537c5dc49ba77122da4d765f5a3?width=1526' }}
      style={styles.backgroundImage}
      blurRadius={2}
    />

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>
            <Text style={styles.appTitleWhite}>Rou</Text>
            <Text style={styles.appTitleGreen}>tin</Text>
          </Text>
        </View>

        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            <Text style={styles.taglineWhite}>Discover millions of{'\n'}</Text>
            <Text style={styles.taglineGreen}>smart habits</Text>
            <Text style={styles.taglineWhite}> shared daily.</Text>
          </Text>
        </View>

        <View style={styles.bottomCard}>
          {/* inputs + buttons như cũ */}
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email (test@example.com)"
              placeholderTextColor="#727272"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
              returnKeyType="next"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password (password123)"
              placeholderTextColor="#727272"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton,
              loading && { opacity: 0.6 }
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleGoogleSignIn}
            disabled={loading}
          >
            <View style={styles.socialButtonContent}>
              <View style={styles.googleIcon}>
                <View style={styles.googleIconBlue} />
                <View style={styles.googleIconRed} />
                <View style={styles.googleIconYellow} />
                <View style={styles.googleIconGreen} />
              </View>
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>

          {/* Facebook Sign In */}
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleFacebookSignIn}
            disabled={loading}
          >
            <View style={styles.socialButtonContent}>
              <View style={styles.facebookIcon} />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </View>
          </TouchableOpacity>

          {/* Apple Sign In */}
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleAppleSignIn}
            disabled={loading}
          >
            <View style={styles.socialButtonContent}>
              <View style={styles.appleIcon} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity 
            style={styles.signUpContainer}
            onPress={() => router.push('/(auth)/signup')}
            disabled={loading}
          >
            <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </View>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  backgroundImage: {
    position: 'absolute',
    width: isWeb ? '100%' : 763,
    height: isWeb ? '100%' : 954,
    left: isWeb ? 0 : -288,
    top: isWeb ? 0 : -80,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: isWeb ? 'center' : 'stretch',
    paddingHorizontal: isWeb && !isSmallScreen ? 0 : 0,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 21,
    paddingBottom: 19,
    height: 62,
  },
  time: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  dynamicIsland: {
    position: 'absolute',
    left: 136,
    top: 14,
    width: 129,
    height: 37,
    borderRadius: 102.401,
    backgroundColor: '#000000',
  },
  statusIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
    height: 12,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  signalBar1: {
    height: 4,
  },
  signalBar2: {
    height: 6,
  },
  signalBar3: {
    height: 8,
  },
  signalBar4: {
    height: 10,
  },
  wifiIcon: {
    width: 15,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wifiArc: {
    width: 12,
    height: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderBottomWidth: 0,
  },
  batteryIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryFill: {
    width: 21,
    height: 9,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  batteryTip: {
    width: 1.5,
    height: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.4,
    marginLeft: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: isWeb ? (isSmallScreen ? 100 : 150) : 238,
  },
  appTitle: {
    fontFamily: 'SF Pro',
    fontSize: isWeb ? (isSmallScreen ? 40 : 53) : 53,
    fontWeight: '700',
    textAlign: 'center',
  },
  appTitleWhite: {
    color: '#FFFFFF',
  },
  appTitleGreen: {
    color: '#AEFF00',
  },
  taglineContainer: {
    alignItems: 'center',
    paddingHorizontal: isWeb ? 20 : 42,
    marginTop: 7,
    maxWidth: isWeb ? 600 : undefined,
  },
  tagline: {
    fontFamily: 'SF Pro Display',
    fontSize: isWeb ? (isSmallScreen ? 20 : 27) : 27,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: isWeb ? (isSmallScreen ? 26 : 33) : 33,
  },
  taglineWhite: {
    color: '#FFFFFF',
  },
  taglineGreen: {
    color: '#AEFF00',
  },
  bottomCard: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: isWeb ? (isSmallScreen ? 32 : 62) : 62,
    paddingTop: isWeb ? (isSmallScreen ? 40 : 58) : 58,
    paddingBottom: 40,
    minHeight: 352,
    width: isWeb ? '100%' : undefined,
    maxWidth: isWeb ? 500 : undefined,
    alignSelf: isWeb ? 'center' : undefined,
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 87.273,
    height: isWeb ? 48 : 40,
    justifyContent: 'center',
    paddingHorizontal: 13,
    marginBottom: 12,
  },
  input: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: isWeb ? 16 : 14,
    fontWeight: '600',
    outlineStyle: isWeb ? 'none' : undefined,
  } as any,
  loginButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 87.273,
    height: isWeb ? 48 : 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  loginButtonText: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: 20,
    fontWeight: '700',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#C3C3C3',
    borderRadius: 87.273,
    height: isWeb ? 48 : 40,
    justifyContent: 'center',
    marginBottom: 16,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 23,
    height: 24,
    position: 'relative',
  },
  googleIconBlue: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#4285F4',
    borderRadius: 2,
    top: 0,
    right: 0,
  },
  googleIconRed: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#EA4335',
    borderRadius: 2,
    top: 0,
    left: 0,
  },
  googleIconYellow: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#FBBC05',
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
  googleIconGreen: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#34A853',
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
  facebookIcon: {
    width: 23,
    height: 24,
    backgroundColor: '#1877F2',
    borderRadius: 12,
  },
  appleIcon: {
    width: 23,
    height: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    marginTop: 21,
    alignItems: 'center',
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  signUpText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
  },
});
