import { Redirect, Tabs } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StorageService } from '../../src/utils/storage';

const TAB_ROUTES = [
  { name: 'home', icon: 'home-outline', iconActive: 'home' },
  { name: 'habits', icon: 'radio-button-off', iconActive: 'radio-button-on' },
  { name: 'explore', icon: 'grid-outline', iconActive: 'grid' },
  { name: 'messages', icon: 'chatbubble-outline', iconActive: 'chatbubble' },
];

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarWrapper, { paddingBottom: insets.bottom + 8 }]}>
      {/* Left pill with 4 icons */}
      <View style={styles.pill}>
        {TAB_ROUTES.map((tab, index) => {
          const isFocused = state.index === index;
          const route = state.routes[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route?.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              {isFocused && <View style={styles.activeIndicator} />}
              <Ionicons
                name={(isFocused ? tab.iconActive : tab.icon) as any}
                size={22}
                color={isFocused ? '#AEFF00' : '#FFFFFF'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Right profile avatar circle */}
      {(() => {
        const profileIndex = state.routes.findIndex(
          (r: any) => r.name === 'profile'
        );
        const isProfileActive = state.index === profileIndex;

        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('profile')}
            activeOpacity={0.8}
            style={[
              styles.profileCircle,
              isProfileActive && styles.profileCircleActive,
            ]}
          >
            <View style={styles.profileInner}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        );
      })()}
    </View>
  );
}

export default function TabsLayout() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const isAuthenticated = await StorageService.isAuthenticated();
      if (mounted) {
        setAuthenticated(isAuthenticated);
        setCheckingAuth(false);
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.authLoadingRoot}>
        <ActivityIndicator size="large" color="#95FF00" />
      </View>
    );
  }

  if (!authenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="habits" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="routine/new" options={{ href: null }} />
      <Tabs.Screen name="routine/[id]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  authLoadingRoot: {
    flex: 1,
    backgroundColor: '#0D0F13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 27,
    gap: 8,
    backgroundColor: 'transparent',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: Platform.OS === 'ios' ? 0.5 : 0,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    width: 42,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(174,255,0,0.12)',
  },
  profileCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#252525',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCircleActive: {
    borderWidth: 2,
    borderColor: '#AEFF00',
  },
  profileInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
