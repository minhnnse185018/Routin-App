import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../src/utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isSmallScreen = SCREEN_WIDTH < 768;

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await StorageService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await StorageService.clearAll();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome to Routin!</Text>
          <Text style={styles.welcomeText}>
            Start building your smart habits today and track your progress.
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="checkmark-circle" size={32} color="#AEFF00" />
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="flame" size={32} color="#FF6B6B" />
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={32} color="#FFD700" />
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Achievements</Text>
          </View>
        </View>

        {/* Today's Habits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#727272" />
            <Text style={styles.emptyStateText}>No habits yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Go to Habits tab to create your first habit
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/(tabs)/habits')}
            >
              <Text style={styles.createButtonText}>Create Habit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteCard}>
          <Ionicons name="bulb-outline" size={24} color="#AEFF00" />
          <Text style={styles.quoteText}>
            "The secret of getting ahead is getting started."
          </Text>
          <Text style={styles.quoteAuthor}>- Mark Twain</Text>
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
    padding: isWeb ? (isSmallScreen ? 16 : 24) : 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    color: '#727272',
    fontSize: 16,
    fontWeight: '400',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  welcomeCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#AEFF00',
  },
  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeText: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: isWeb && !isSmallScreen ? 150 : 100,
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#727272',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#727272',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 87,
    paddingHorizontal: 24,
    paddingVertical: 12,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  createButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  quoteCard: {
    backgroundColor: '#1F1F1F',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 24,
  },
  quoteAuthor: {
    color: '#AEFF00',
    fontSize: 14,
    fontWeight: '600',
  },
});
