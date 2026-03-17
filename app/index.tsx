import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StorageService } from '../src/utils/storage';

export default function Index() {
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
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#95FF00" />
      </View>
    );
  }

  return authenticated ? <Redirect href="/(tabs)/home" /> : <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: '#0D0F13',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
