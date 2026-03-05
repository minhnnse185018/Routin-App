import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import apiService from "../../src/services/api.service";
import { StorageService } from "../../src/utils/storage";
import { validateSignUpForm } from "../../src/utils/validation";
import { ImageBackground } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isSmallScreen = SCREEN_WIDTH < 768;

export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const handleSignUp = async () => {
    console.log('=== SIGNUP STARTED ===');
    
    // Basic validation
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Please enter your full name");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation Error", "Please enter your email");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    console.log('Validation passed, sending OTP to:', email.trim());

    setLoading(true);
    setLoadingMessage('Sending verification code...');

    // Add a small delay to show the initial message, then update
    setTimeout(() => {
      if (loading) {
        setLoadingMessage('Server is waking up, please wait...');
      }
    }, 3000);

    try {
      // Step 1: Send OTP to email
      const otpResponse = await apiService.post<any>(
        '/api/Auth/register/otp/send',
        { email: email.trim() }
      );

      console.log('OTP Send Response:', JSON.stringify(otpResponse, null, 2));

      if (otpResponse.success) {
        // Show OTP modal
        setLoading(false);
        setLoadingMessage('');
        setShowOtpModal(true);
        Alert.alert(
          "Verification Code Sent",
          `A verification code has been sent to ${email.trim()}. Please check your email.`
        );
      } else {
        const errorMessage = otpResponse.error || "Unable to send verification code";
        
        if (errorMessage.includes('timeout') || errorMessage.includes('waking up')) {
          Alert.alert('Connection Issue', 'The server is taking longer than expected to respond. This is normal for the first request after a period of inactivity. Please try again.');
        } else {
          Alert.alert("Failed to Send Code", errorMessage);
        }
      }
    } catch (error: any) {
      console.error('OTP send error:', error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) {
      Alert.alert("Validation Error", "Please enter the verification code");
      return;
    }

    console.log('=== VERIFYING OTP ===');
    
    setOtpLoading(true);
    setLoadingMessage('Verifying code...');

    setTimeout(() => {
      if (otpLoading) {
        setLoadingMessage('Server is waking up, please wait...');
      }
    }, 3000);

    try {
      // Step 2: Verify OTP and complete registration
      const verifyResponse = await apiService.post<any>(
        '/api/Auth/register/otp/verify',
        {
          email: email.trim(),
          code: otpCode.trim(),
          fullName: fullName.trim(),
          password: password,
        }
      );

      console.log('OTP Verify Response:', JSON.stringify(verifyResponse, null, 2));

      if (verifyResponse.success && verifyResponse.data) {
        // Save token and user data
        await StorageService.saveToken(verifyResponse.data.accessToken);
        if (verifyResponse.data.refreshToken) {
          await StorageService.saveRefreshToken(verifyResponse.data.refreshToken);
        }
        await StorageService.saveUser(verifyResponse.data.user);

        console.log('✅ Registration successful! Navigating to home...');
        
        // Close modal and navigate to home
        setShowOtpModal(false);
        Alert.alert("Success", "Your account has been created successfully!");
        router.replace('/(tabs)/home');
      } else {
        console.log('Verification failed:', !verifyResponse.success ? verifyResponse.error : 'Unknown error');
        const errorMessage = !verifyResponse.success ? verifyResponse.error : "Invalid verification code";
        
        if (errorMessage.includes('timeout') || errorMessage.includes('waking up')) {
          Alert.alert('Connection Issue', 'The server is taking longer than expected to respond. Please try again.');
        } else {
          Alert.alert("Verification Failed", errorMessage);
        }
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setOtpLoading(false);
      setLoadingMessage('');
    }
  };

  const handleResendOtp = async () => {
    console.log('=== RESENDING OTP ===');
    
    setOtpLoading(true);
    setLoadingMessage('Resending code...');

    try {
      const otpResponse = await apiService.post<any>(
        '/api/Auth/register/otp/send',
        { email: email.trim() }
      );

      if (otpResponse.success) {
        Alert.alert("Code Resent", "A new verification code has been sent to your email.");
        setOtpCode("");
      } else {
        Alert.alert("Failed to Resend", otpResponse.error || "Unable to resend verification code");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setOtpLoading(false);
      setLoadingMessage('');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setLoadingMessage('Connecting to server...');

    setTimeout(() => {
      if (loading) {
        setLoadingMessage('Server is waking up, please wait...');
      }
    }, 3000);

    try {
      const response = await apiService.googleSignIn("mock_google_token");
      
      if (response.success && response.data) {
        await StorageService.saveToken(response.data.accessToken);
        await StorageService.saveUser(response.data.user);
        Alert.alert("Success", "Signed in with Google!");
        console.log("Google user:", response.data.user);
      } else {
        const errorMessage = response.error || "Google sign in failed";
        if (errorMessage.includes('timeout') || errorMessage.includes('waking up')) {
          Alert.alert('Connection Issue', 'The server is taking longer than expected to respond. This is normal for the first request after a period of inactivity. Please try again.');
        } else {
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMessage('');
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

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => !otpLoading && setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Email</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a verification code to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <TextInput
              style={styles.otpInput}
              placeholder="Enter verification code"
              placeholderTextColor="#727272"
              value={otpCode}
              onChangeText={setOtpCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              editable={!otpLoading}
              maxLength={6}
              returnKeyType="done"
              onSubmitEditing={handleVerifyOtp}
            />

            <TouchableOpacity
              style={[
                styles.verifyButton,
                otpLoading && { opacity: 0.6 }
              ]}
              onPress={handleVerifyOtp}
              disabled={otpLoading}
            >
              {otpLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator color="#000000" />
                  {loadingMessage ? (
                    <Text style={styles.loadingText}>{loadingMessage}</Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.verifyButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendOtp}
              disabled={otpLoading}
            >
              <Text style={styles.resendButtonText}>Didn't receive code? Resend</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => !otpLoading && setShowOtpModal(false)}
              disabled={otpLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Sign up</Text>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          {/* Google Sign In */}
          <TouchableOpacity 
            style={styles.googleButton}
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

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>or</Text>
          </View>

          {/* Full Name Input */}
          <View style={styles.fullInput}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#727272"
              value={fullName}
              onChangeText={setFullName}
              editable={!loading}
              autoCapitalize="words"
            />
          </View>

          {/* Email Input */}
          <View style={styles.fullInput}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#727272"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.fullInput}>
            <TextInput
              style={styles.input}
              placeholder="Password (min 8 characters)"
              placeholderTextColor="#727272"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          {/* Confirm Password Input */}
          <View style={styles.fullInput}>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#727272"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!loading}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity 
            style={[
              styles.createAccountButton,
              loading && { opacity: 0.6 }
            ]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#000000" />
                {loadingMessage ? (
                  <Text style={styles.loadingText}>{loadingMessage}</Text>
                ) : null}
              </View>
            ) : (
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Terms Text */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              <Text style={styles.termsTextGray}>
                Signing up for a Webflow account means you agree{"\n"}to the{" "}
              </Text>
              <Text style={styles.termsTextWhite}>Privacy Policy</Text>
              <Text style={styles.termsTextGray}> and </Text>
              <Text style={styles.termsTextWhite}>Terms of Service</Text>
              <Text style={styles.termsTextGray}>.</Text>
            </Text>
          </View>

          {/* Login Link */}
          <TouchableOpacity
            style={styles.loginContainer}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={styles.loginText}>Have an account? Log in here</Text>
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
    backgroundColor: "#161616",
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
    justifyContent: "space-between",
    alignItems: isWeb ? 'center' : 'stretch',
  },
  statusBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 21,
    paddingBottom: 19,
    height: 62,
  },
  time: {
    color: "#FFFFFF",
    fontFamily: "SF Pro",
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 22,
  },
  dynamicIsland: {
    position: "absolute",
    left: 136,
    top: 14,
    width: 129,
    height: 37,
    borderRadius: 102.401,
    backgroundColor: "#000000",
  },
  statusIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  signalBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
    height: 12,
  },
  signalBar: {
    width: 3,
    backgroundColor: "#FFFFFF",
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
    justifyContent: "center",
    alignItems: "center",
  },
  wifiArc: {
    width: 12,
    height: 8,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    borderBottomWidth: 0,
  },
  batteryIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryFill: {
    width: 21,
    height: 9,
    borderRadius: 2.5,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
  },
  batteryTip: {
    width: 1.5,
    height: 4,
    backgroundColor: "#FFFFFF",
    opacity: 0.4,
    marginLeft: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginTop: isWeb ? (isSmallScreen ? 60 : 94) : 94,
    marginBottom: isWeb ? (isSmallScreen ? 40 : 78) : 78,
  },
  pageTitle: {
    color: "#000000",
    fontFamily: "SF Pro Display",
    fontSize: isWeb ? (isSmallScreen ? 48 : 66) : 66,
    fontWeight: "700",
    textAlign: "center",
  },
  bottomCard: {
    backgroundColor: "#000000",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: isWeb ? (isSmallScreen ? 32 : 62) : 62,
    paddingTop: isWeb ? (isSmallScreen ? 32 : 47) : 47,
    paddingBottom: 40,
    minHeight: isWeb ? 'auto' : 508,
    width: isWeb ? '100%' : undefined,
    maxWidth: isWeb ? 500 : undefined,
    alignSelf: isWeb ? 'center' : undefined,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: "#C3C3C3",
    borderRadius: 87.273,
    height: isWeb ? 48 : 40,
    justifyContent: "center",
    marginBottom: 15,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  socialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  googleIcon: {
    width: 23,
    height: 24,
    position: "relative",
  },
  googleIconBlue: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#4285F4",
    borderRadius: 2,
    top: 0,
    right: 0,
  },
  googleIconRed: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#EA4335",
    borderRadius: 2,
    top: 0,
    left: 0,
  },
  googleIconYellow: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#FBBC05",
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
  googleIconGreen: {
    position: "absolute",
    width: 10,
    height: 10,
    backgroundColor: "#34A853",
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontFamily: "SF Pro Display",
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  dividerText: {
    color: "#FFFFFF",
    fontFamily: "SF Pro Display",
    fontSize: isWeb ? (isSmallScreen ? 20 : 27) : 27,
    fontWeight: "600",
  },
  fullInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 87.273,
    height: isWeb ? 48 : 36,
    justifyContent: "center",
    paddingHorizontal: 13,
    marginBottom: 8,
  },
  input: {
    color: "#000000",
    fontFamily: "SF Pro Display",
    fontSize: isWeb ? 16 : 12,
    fontWeight: "600",
    outlineStyle: isWeb ? 'none' : undefined,
  } as any,
  createAccountButton: {
    backgroundColor: "#AEFF00",
    borderRadius: 87.273,
    height: isWeb ? 48 : 36,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 15,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  createAccountButtonText: {
    color: "#000000",
    fontFamily: "SF Pro Display",
    fontSize: isWeb ? 16 : 14,
    fontWeight: "700",
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: 12,
    fontWeight: '600',
  },
  termsContainer: {
    alignItems: "center",
    marginBottom: 44,
  },
  termsText: {
    fontFamily: "SF Pro Display",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  termsTextGray: {
    color: "#CECECE",
  },
  termsTextWhite: {
    color: "#FFFFFF",
  },
  loginContainer: {
    alignItems: "center",
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  loginText: {
    color: "#FFFFFF",
    fontFamily: "SF Pro Display",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: isWeb ? 40 : 30,
    width: '100%',
    maxWidth: isWeb ? 400 : undefined,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: isWeb ? 28 : 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#CECECE',
    fontFamily: 'SF Pro Display',
    fontSize: isWeb ? 16 : 14,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  emailText: {
    color: '#AEFF00',
    fontWeight: '700',
  },
  otpInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: isWeb ? 56 : 48,
    paddingHorizontal: 20,
    fontSize: isWeb ? 20 : 18,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 8,
    width: '100%',
    marginBottom: 20,
    outlineStyle: isWeb ? 'none' : undefined,
  } as any,
  verifyButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 12,
    height: isWeb ? 52 : 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  verifyButtonText: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: isWeb ? 18 : 16,
    fontWeight: '700',
  },
  resendButton: {
    marginBottom: 12,
    paddingVertical: 8,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  resendButtonText: {
    color: '#AEFF00',
    fontFamily: 'SF Pro Display',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 8,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  cancelButtonText: {
    color: '#CECECE',
    fontFamily: 'SF Pro Display',
    fontSize: 14,
    fontWeight: '600',
  },
});
