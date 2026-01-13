import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://api.builder.io/api/v1/image/assets/TEMP/54561f3262bb8537c5dc49ba77122da4d765f5a3?width=1526' }}
        style={styles.backgroundImage}
        blurRadius={2}
      />

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

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.appTitle}>
            <Text style={styles.appTitleWhite}>Rou</Text>
            <Text style={styles.appTitleGreen}>tin</Text>
          </Text>
        </View>

        {/* Tagline */}
        <View style={styles.taglineContainer}>
          <Text style={styles.tagline}>
            <Text style={styles.taglineWhite}>Discover millions of{'\n'}</Text>
            <Text style={styles.taglineGreen}>smart habits</Text>
            <Text style={styles.taglineWhite}> shared daily.</Text>
          </Text>
        </View>

        {/* Bottom Card */}
        <View style={styles.bottomCard}>
          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Google Sign In */}
          <TouchableOpacity style={styles.socialButton}>
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
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialButtonContent}>
              <View style={styles.facebookIcon} />
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </View>
          </TouchableOpacity>

          {/* Apple Sign In */}
          <TouchableOpacity style={styles.socialButton}>
            <View style={styles.socialButtonContent}>
              <View style={styles.appleIcon} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <TouchableOpacity 
            style={styles.signUpContainer}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    width: 763,
    height: 954,
    left: -288,
    top: -80,
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
    marginTop: 238,
  },
  appTitle: {
    fontFamily: 'SF Pro',
    fontSize: 53,
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
    paddingHorizontal: 42,
    marginTop: 7,
  },
  tagline: {
    fontFamily: 'SF Pro Display',
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 33,
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
    paddingHorizontal: 62,
    paddingTop: 58,
    paddingBottom: 40,
    minHeight: 352,
  },
  loginButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 87.273,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
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
    height: 40,
    justifyContent: 'center',
    marginBottom: 16,
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
  },
  signUpText: {
    color: '#FFFFFF',
    fontFamily: 'SF Pro Display',
    fontSize: 16,
    fontWeight: '600',
  },
});
