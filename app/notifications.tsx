import React from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../src/services/api.service';
import { StorageService } from '../src/utils/storage';

const isWeb = Platform.OS === 'web';

type UINotification = {
  id: string;
  user: string;
  message: string;
  time: string;
  avatar: string;
  preview?: string;
};

const formatRelativeTime = (iso?: string): string => {
  if (!iso) return 'now';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(Math.floor(diffMs / 60000), 0);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
};

const fallbackNotifications: UINotification[] = [
  {
    id: 'fallback-1',
    user: 'Minh Hoang',
    message: 'Started following your "Gym" routine.',
    time: '5m',
    avatar: 'https://i.pravatar.cc/120?img=12',
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const token = await StorageService.getToken();
        if (!token) {
          setNotifications(fallbackNotifications);
          return;
        }

        const incoming = await apiService.get<any[]>('/api/friends/requests/incoming', token);
        if (incoming.success && Array.isArray(incoming.data) && incoming.data.length > 0) {
          const mapped = incoming.data.map((item: any, idx: number) => ({
            id: String(item?.requestId || idx),
            user: item?.requesterName || item?.fullName || 'New user',
            message: 'Sent you a friend request.',
            time: formatRelativeTime(item?.createdAt),
            avatar: item?.requesterAvatarUrl || item?.avatarUrl || `https://i.pravatar.cc/120?img=${(idx % 40) + 1}`,
          }));
          setNotifications(mapped);
        } else {
          setNotifications(fallbackNotifications);
        }
      } catch (error) {
        console.error('Failed to load notifications:', error);
        setNotifications(fallbackNotifications);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.contentWrap}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Notification</Text>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#B2FF00" />
          </View>
        ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Today</Text>

          {notifications.map((item) => (
            <View key={item.id} style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />

              <View style={styles.textCol}>
                <Text style={styles.user}>{item.user}</Text>
                <Text style={styles.message}>
                  {item.message} <Text style={styles.time}>{item.time}</Text>
                </Text>
              </View>

              {item.preview ? (
                <View style={styles.previewWrap}>
                  <Image source={{ uri: item.preview }} style={styles.preview} />
                  <View style={styles.heartBadge}>
                    <Ionicons name="heart" size={13} color="#2AA7FF" />
                  </View>
                </View>
              ) : null}
            </View>
          ))}
        </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
  },
  contentWrap: {
    flex: 1,
    maxWidth: isWeb ? 560 : undefined,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  topBar: {
    marginTop: 8,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#B2FF00',
    fontSize: 50,
    fontWeight: '800',
    lineHeight: 54,
  },
  list: {
    paddingBottom: 120,
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    color: '#737373',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  textCol: {
    flex: 1,
  },
  user: {
    color: '#B2FF00',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  time: {
    color: '#8F8F8F',
    fontSize: 14,
    fontWeight: '500',
  },
  previewWrap: {
    position: 'relative',
  },
  preview: {
    width: 74,
    height: 74,
    borderRadius: 10,
  },
  heartBadge: {
    position: 'absolute',
    right: -8,
    top: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF4A78',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
