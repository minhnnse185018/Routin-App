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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 0;

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
      // TODO: Replace with real API call
      // const response = await apiService.getPosts();
      // setPosts(response.data);
      setPosts([]);
    } catch (error) {
      console.error('Error fetching posts:', error);
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="search" size={24} color="#FFF" />
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
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
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
            <PostCard post={item} onLike={handleLike} onSave={handleSave} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
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
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
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
  },
  imageArea: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
    backgroundColor: '#111',
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.4,
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userRow: {
    position: 'absolute',
    top: 16,
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
    top: 22,
    right: 16,
  },
  actions: {
    position: 'absolute',
    right: 14,
    bottom: 60,
    alignItems: 'center',
    gap: 12,
  },
  actionItem: {
    alignItems: 'center',
    gap: 2,
  },
  actionCount: {
    color: '#FFF',
    fontSize: 12,
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
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
