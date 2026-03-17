import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../../src/utils/storage';
import apiService from '../../src/services/api.service';

const isWeb = Platform.OS === 'web';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [routines, setRoutines] = useState<any[]>([]);
  const [segment, setSegment] = useState<'routines' | 'posts' | 'saved'>('routines');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const token = await StorageService.getToken();
      const cachedUser = await StorageService.getUser();
      setUser(cachedUser);

      if (!token) return;

      const [meResponse, routinesResponse] = await Promise.all([
        apiService.get<any>('/api/users/me', token),
        apiService.get<any[]>('/api/routines/me', token),
      ]);

      if (meResponse.success && meResponse.data) {
        setUser(meResponse.data);
        await StorageService.saveUser(meResponse.data);
      }

      if (routinesResponse.success && Array.isArray(routinesResponse.data)) {
        setRoutines(routinesResponse.data);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const handleLogout = () => {
    const performLogout = async () => {
      await StorageService.clearAll();
      router.replace('/(auth)/login');
    };

    if (Platform.OS === 'web') {
      const shouldLogout = typeof window !== 'undefined'
        ? window.confirm('Are you sure you want to logout?')
        : true;
      if (shouldLogout) {
        void performLogout();
      }
      return;
    }

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            void performLogout();
          },
        },
      ]
    );
  };

  const routineCards = routines.map((routine, index) => {
    const title = routine?.title || routine?.name || `Routine ${index + 1}`;
    const progressRaw = routine?.progress ?? routine?.completionRate ?? 0;
    const progress = `${Math.round(Number(progressRaw) || 0)}%`;
    const description = [
      routine?.description ? `${routine.description}` : 'No description',
      routine?.categoryName ? `Category: ${routine.categoryName}` : undefined,
      routine?.remindTime ? `Time: ${routine.remindTime}` : undefined,
      routine?.repeatType ? `Frequency: ${routine.repeatType}` : undefined,
    ]
      .filter(Boolean)
      .join('\n');

    return {
      title,
      progress,
      description,
      status: routine?.status || 'Processing',
      icon: index % 2 === 0 ? 'barbell-outline' : 'book-outline',
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <Text style={styles.handleText}>{(user?.email || 'lawren_wes').split('@')[0]}</Text>
          <TouchableOpacity>
            <Ionicons name="menu-outline" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={48} color="#FFFFFF" />
            )}
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.userName}>{user?.fullName || 'Harry Lawrence'}</Text>
            <View style={styles.statRow}>
              <Text style={styles.statText}>Routine 2</Text>
              <Text style={styles.statText}>Followers 13</Text>
              <Text style={styles.statText}>Following 24</Text>
            </View>
            <Text style={styles.bioText}>
              Hi, my name is Harry.{"\n"}
              I&apos;m on a mission to rebuild myself new habits, new mindset, new routine.{"\n"}
              If you&apos;re also trying to change your life, follow along. Let&apos;s grow together.
            </Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Follow</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Copy Routine</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.segmentWrap}>
          <TouchableOpacity
            style={[styles.segmentItem, segment === 'routines' && styles.segmentItemActive]}
            onPress={() => setSegment('routines')}
          >
            <Ionicons name="radio-button-on-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, segment === 'posts' && styles.segmentItemActive]}
            onPress={() => setSegment('posts')}
          >
            <Ionicons name="grid-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, segment === 'saved' && styles.segmentItemActive]}
            onPress={() => setSegment('saved')}
          >
            <Ionicons name="bookmark-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressRow}>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Processing</Text>
            <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.counterRow}>
            <View style={styles.counterItem}><Text style={styles.counterLabel}>5</Text></View>
            <View style={[styles.counterItem, styles.counterWarning]}><Text style={styles.counterLabel}>2</Text></View>
            <View style={[styles.counterItem, styles.counterSuccess]}><Text style={styles.counterLabel}>1</Text></View>
          </View>
        </View>

        {segment === 'routines' ? (
          <View style={styles.routineSection}>
            {(routineCards.length ? routineCards : [
              {
                title: 'No Routine',
                progress: '0%',
                description: 'Create your first routine to see it here.',
                status: 'Idle',
                icon: 'sparkles-outline',
              },
            ]).map((card) => (
              <View key={card.title} style={styles.routineCard}>
                <View style={styles.routineTopRow}>
                  <View style={styles.routineTitleWrap}>
                    <View style={styles.routineIconWrap}>
                      <Ionicons name={card.icon as any} size={22} color="#111111" />
                    </View>
                    <Text style={styles.routineTitle}>{card.title}</Text>
                  </View>
                  <Text style={styles.routineProgress}>{card.progress}</Text>
                </View>
                <Text style={styles.routineDescriptionTitle}>Description:</Text>
                <Text style={styles.routineDescription}>{card.description}</Text>
                <Text style={styles.routineStatus}>Status: {card.status}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.placeholderWrap}>
            <Text style={styles.placeholderText}>Layout section is ready for {segment}.</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6B6B" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingBottom: 120,
    maxWidth: isWeb ? 560 : undefined,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    marginTop: 6,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  handleText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '700',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatarContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1F1F1F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2C2C2C',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  profileMeta: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
  },
  statRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bioText: {
    marginTop: 10,
    color: '#D5D5D5',
    lineHeight: 18,
    fontSize: 12,
  },
  actionRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#B2FF00',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
  },
  segmentWrap: {
    marginTop: 18,
    backgroundColor: '#1B1B1B',
    borderRadius: 28,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  segmentItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
  },
  segmentItemActive: {
    backgroundColor: '#262626',
  },
  progressRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterPill: {
    backgroundColor: '#1F1F1F',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    color: '#FFC400',
    fontSize: 16,
    fontWeight: '700',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  counterItem: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterWarning: {
    borderColor: '#FFC400',
  },
  counterSuccess: {
    borderColor: '#B2FF00',
  },
  counterLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  routineSection: {
    marginTop: 12,
    gap: 12,
  },
  routineCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 18,
    padding: 14,
  },
  routineTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routineTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routineIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routineTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  routineProgress: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  routineDescriptionTitle: {
    color: '#AEFF00',
    fontWeight: '700',
    fontSize: 14,
  },
  routineDescription: {
    marginTop: 4,
    color: '#FFFFFF',
    lineHeight: 18,
    fontSize: 12,
  },
  routineStatus: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'flex-end',
  },
  placeholderWrap: {
    marginTop: 14,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 16,
  },
  placeholderText: {
    color: '#A6A6A6',
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1F1F1F',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  logoutButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '700',
  },
});
