import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const tags = ['Trending', 'Fitness', 'Study', 'Morning', 'Mindset', 'Nutrition'];

const cards = [
  {
    id: '1',
    title: 'Atomic Morning Reset',
    author: 'minh.habit',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
    stats: '12.4k copies',
  },
  {
    id: '2',
    title: 'Deep Work Sprint',
    author: 'focus.lab',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    stats: '8.2k copies',
  },
  {
    id: '3',
    title: 'Gym Consistency Pro',
    author: 'coach.bao',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    stats: '20.1k copies',
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.subtitle}>Discover routines, creators, and trending habit plans.</Text>

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search routines, creators..."
          placeholderTextColor="#7D8696"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
        {tags.map((tag, idx) => (
          <TouchableOpacity key={tag} style={[styles.tagPill, idx === 0 && styles.tagPillActive]}>
            <Text style={[styles.tagText, idx === 0 && styles.tagTextActive]}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {cards.map((card) => (
        <View key={card.id} style={styles.card}>
          <Image source={{ uri: card.image }} style={styles.cardImage} />
          <View style={styles.overlay} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardMeta}>by {card.author} • {card.stats}</Text>
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Copy Routine</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.block}>
        <Text style={styles.blockTitle}>Suggested Creators</Text>
        <View style={styles.creatorRow}>
          <Text style={styles.creatorName}>@lawren_wes</Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.creatorRow}>
          <Text style={styles.creatorName}>@bng.png</Text>
          <TouchableOpacity style={styles.followBtn}>
            <Text style={styles.followBtnText}>Follow</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1115',
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#A8AFBA',
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
  },
  searchWrap: {
    backgroundColor: '#141922',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#283040',
    paddingHorizontal: 12,
    height: 46,
    justifyContent: 'center',
    marginBottom: 12,
  },
  searchInput: {
    color: '#F7FAFF',
    fontSize: 14,
  },
  tagRow: {
    paddingBottom: 12,
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#151B25',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#263040',
  },
  tagPillActive: {
    backgroundColor: '#B2FF00',
    borderColor: '#B2FF00',
  },
  tagText: {
    color: '#D0D9E8',
    fontSize: 12,
    fontWeight: '600',
  },
  tagTextActive: {
    color: '#121212',
  },
  card: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2A3344',
    backgroundColor: '#121821',
  },
  cardImage: {
    width: '100%',
    height: 210,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  cardContent: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  cardMeta: {
    marginTop: 4,
    color: '#D7DFED',
    fontSize: 13,
  },
  actionRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#B2FF00',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  primaryBtnText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(10,13,18,0.8)',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#46516A',
  },
  secondaryBtnText: {
    color: '#EFF5FF',
    fontSize: 12,
    fontWeight: '700',
  },
  block: {
    marginTop: 4,
    backgroundColor: '#121821',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2A3344',
    padding: 14,
  },
  blockTitle: {
    color: '#EEF4FF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  creatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  creatorName: {
    color: '#C8D3E4',
    fontSize: 14,
    fontWeight: '600',
  },
  followBtn: {
    backgroundColor: '#B2FF00',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  followBtnText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
});
