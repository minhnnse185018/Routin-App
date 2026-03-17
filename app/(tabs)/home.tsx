import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../../src/services/api.service';
import { StorageService } from '../../src/utils/storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const CONTENT_WIDTH = isWeb ? Math.min(SCREEN_WIDTH, 560) : SCREEN_WIDTH;
const CARD_WIDTH = CONTENT_WIDTH - 28;

// ─── Types ────────────────────────────────────────────────────────────────────
type Post = {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  images: string[];
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  saved: boolean;
};

const mapRoutineImage = (routine: any, index: number): string => {
  const mediaFromTasks = Array.isArray(routine?.tasks)
    ? routine.tasks.find((t: any) => typeof t?.mediaUrl === 'string' && t.mediaUrl)?.mediaUrl
    : undefined;
  const mediaFromRoutine = typeof routine?.mediaUrl === 'string' ? routine.mediaUrl : undefined;

  if (mediaFromTasks) return mediaFromTasks;
  if (mediaFromRoutine) return mediaFromRoutine;
  return `https://picsum.photos/seed/routin-${routine?.id || index}/1200/1600`;
};

const mapRoutineToPost = (routine: any, index: number, username: string, avatarUrl?: string): Post => {
  const title = routine?.title || routine?.name || 'Routine';
  const desc = routine?.description || 'Stay consistent and keep improving.';
  return {
    id: String(routine?.id || `routine-${index}`),
    userId: String(routine?.userId || 'me'),
    username,
    avatarUrl,
    images: [mapRoutineImage(routine, index)],
    caption: `${title}: ${desc}`,
    timestamp: routine?.updatedAt || routine?.createdAt ? 'updated recently' : 'today',
    likes: Math.max(Number(routine?.copiedCount || 0), 0),
    comments: Math.max(Number(routine?.reviewCount || 0), 0),
    shares: Math.max(Number(routine?.shareCount || 0), 0),
    liked: false,
    saved: false,
  };
};

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike, onSave }: { post: Post; onLike: (id: string) => void; onSave: (id: string) => void }) {
  const [activeImage, setActiveImage] = useState(0);

  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <View style={cardStyles.container}>
      {/* Image Area */}
      <View style={cardStyles.imageArea}>
        {post.images.length > 0 ? (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              setActiveImage(index);
            }}
          >
            {post.images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={cardStyles.image} resizeMode="cover" />
            ))}
          </ScrollView>
        ) : (
          <View style={cardStyles.imagePlaceholder}>
            <Ionicons name="image-outline" size={48} color="#444" />
          </View>
        )}

        {/* User header overlay */}
        <View style={cardStyles.userRow}>
          <View style={cardStyles.avatarSmall}>
            {post.avatarUrl ? (
              <Image source={{ uri: post.avatarUrl }} style={cardStyles.avatarImg} />
            ) : (
              <Ionicons name="person" size={20} color="#FFF" />
            )}
          </View>
          <Text style={cardStyles.usernameOverlay}>{post.username}</Text>
        </View>

        {/* Bookmark */}
        <TouchableOpacity style={cardStyles.bookmarkBtn} onPress={() => onSave(post.id)}>
          <Ionicons
            name={post.saved ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>

        {/* Right actions */}
        <View style={cardStyles.actions}>
          <TouchableOpacity style={cardStyles.actionItem} onPress={() => onLike(post.id)}>
            <Ionicons
              name={post.liked ? 'heart' : 'heart'}
              size={24}
              color={post.liked ? '#FF0000' : '#FF0000'}
            />
            <Text style={cardStyles.actionCount}>{formatCount(post.likes)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cardStyles.actionItem}>
            <Ionicons name="chatbubble-outline" size={24} color="#FFF" />
            <Text style={cardStyles.actionCount}>{formatCount(post.comments)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={cardStyles.actionItem}>
            <Ionicons name="paper-plane-outline" size={24} color="#FFF" />
            <Text style={cardStyles.actionCount}>{formatCount(post.shares)}</Text>
          </TouchableOpacity>
        </View>

        {/* Dot indicators */}
        {post.images.length > 1 && (
          <View style={cardStyles.dotsRow}>
            {post.images.map((_, i) => (
              <View
                key={i}
                style={[cardStyles.dot, i === activeImage && cardStyles.dotActive]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Caption row */}
      <View style={cardStyles.captionRow}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 2 }}>
            <Text style={cardStyles.captionUser}>{post.username}</Text>
            <Text style={cardStyles.captionText}>{post.caption}</Text>
          </View>
          <Text style={cardStyles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount] = useState(6);

  const fetchPosts = useCallback(async () => {
    try {
      const token = await StorageService.getToken();
      const user = await StorageService.getUser();

      const routinesResponse = await apiService.get<any[]>('/api/routines/me', token || undefined);
      if (routinesResponse.success && Array.isArray(routinesResponse.data)) {
        const username = (user?.email || 'you').split('@')[0] || 'you';
        const mapped = routinesResponse.data.map((routine, index) =>
          mapRoutineToPost(routine, index, username, user?.avatarUrl || undefined)
        );
        setPosts(mapped);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
      )
    );
  };

  const handleSave = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, saved: !p.saved } : p))
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.shell}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search" size={26} color="#FFF" />
          </TouchableOpacity>

          {/* "Routin" Logo */}
          <View style={styles.logoRow}>
            <Text style={styles.logoWhite}>Rou</Text>
            <Text style={styles.logoGreen}>tin</Text>
          </View>

          {/* Bell with badge */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={26} color="#FFF" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Feed */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#AEFF00" />
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="images-outline" size={64} color="#333" />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptySubtitle}>Follow people to see their posts here</Text>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.postRow}>
                <PostCard post={item} onLike={handleLike} onSave={handleSave} />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#AEFF00"
              />
            }
          />
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060606',
  },
  shell: {
    flex: 1,
    width: CONTENT_WIDTH,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: '#242424',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoWhite: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  logoGreen: {
    color: '#AEFF00',
    fontSize: 22,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
    backgroundColor: '#FF0000',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  postRow: {
    alignItems: 'center',
    marginTop: 8,
  },
  feedContent: {
    paddingBottom: 130,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

const cardStyles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    marginBottom: 12,
    width: CARD_WIDTH,
  },
  imageArea: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.32,
    backgroundColor: '#101010',
    borderRadius: 34,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#262626',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.32,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRow: {
    position: 'absolute',
    top: 14,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarSmall: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  usernameOverlay: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bookmarkBtn: {
    position: 'absolute',
    top: 18,
    right: 16,
  },
  actions: {
    position: 'absolute',
    right: 12,
    bottom: 72,
    alignItems: 'center',
    gap: 16,
  },
  actionItem: {
    alignItems: 'center',
    gap: 2,
  },
  actionCount: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dotsRow: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: '#FFF',
    opacity: 1,
  },
  captionRow: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  captionUser: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  captionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '400',
    flex: 1,
  },
  timestamp: {
    color: '#555',
    fontSize: 10,
    marginTop: 2,
  },
});
