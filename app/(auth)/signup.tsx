import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUp() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Status Bar Area */}
      <View style={styles.statusBar}>
        <Text style={styles.time}>9:41</Text>
        <View style={styles.dynamicIsland} />
        <View style={styles.statusIconsContainer}>
          <View style={styles.signalBars}>
            <View style={[styles.signalBar, styles.signalBar1]} />
            <View style={[styles.signalBar, styles.signalBar2]} />
            <View style={[styles.signalBar, styles.signalBar3]} />
            <View style={[styles.signalBar, styles.signalBar4]} />
          </View>
          <View style={styles.wifiIcon}>
            <View style={styles.wifiArc} />
          </View>
          <View style={styles.batteryIcon}>
            <View style={styles.batteryFill} />
            <View style={styles.batteryTip} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Page Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.pageTitle}>Sign up</Text>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          {/* Google Sign In */}
          <TouchableOpacity style={styles.googleButton}>
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

          {/* Name Inputs Row */}
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#727272"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.nameInput}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#727272"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
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
            />
          </View>

          {/* Password Input */}
          <View style={styles.fullInput}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#727272"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Create Account Button */}
          <TouchableOpacity style={styles.createAccountButton}>
            <Text style={styles.createAccountButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Terms Text */}
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              <Text style={styles.termsTextGray}>
                Signing up for a Webflow account means you agree{'\n'}to the{' '}
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
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.loginText}>Have an account? Log in here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  scrollContent: {
    flexGrow: 1,
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
  titleContainer: {
    alignItems: 'center',
    marginTop: 94,
    marginBottom: 78,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 66,
    fontWeight: '700',
    textAlign: 'center',
  },
  bottomCard: {
    backgroundColor: '#000000',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingHorizontal: 62,
    paddingTop: 47,
    paddingBottom: 40,
    minHeight: 508,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#C3C3C3',
    borderRadius: 87.273,
    height: 40,
    justifyContent: 'center',
    marginBottom: 15,
  },
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
  socialButtonText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dividerText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 27,
    fontWeight: '600',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 87.273,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  fullInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 87.273,
    height: 36,
    justifyContent: 'center',
    paddingHorizontal: 13,
    marginBottom: 8,
  },
  input: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: 12,
    fontWeight: '600',
  },
  createAccountButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 87.273,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 15,
  },
  createAccountButtonText: {
    color: '#000000',
    fontFamily: 'SF Pro Display',
    fontSize: 14,
    fontWeight: '700',
  },
  termsContainer: {
    alignItems: 'center',
    marginBottom: 44,
  },
  termsText: {
    fontFamily: 'SF Pro Display',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
  termsTextGray: {
    color: '#CECECE',
  },
  termsTextWhite: {
    color: '#FFFFFF',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
  },
});
