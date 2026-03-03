import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type Routine = {
  id: string;
  name: string;
  category: string;
  description: string;
  time: string;
  duration: string;
  frequency?: string;
  progress: number;
  status: string;
  iconType: 'gym' | 'study' | 'other';
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function RoutineIcon({ type }: { type: Routine['iconType'] }) {
  const iconMap: Record<string, string> = {
    gym: 'barbell-outline',
    study: 'book-outline',
    other: 'star-outline',
  };
  return (
    <View style={iconStyles.box}>
      <Ionicons name={iconMap[type] as any} size={18} color="#000" />
    </View>
  );
}

const iconStyles = StyleSheet.create({
  box: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─── Routine Card ─────────────────────────────────────────────────────────────
function RoutineCard({ routine }: { routine: Routine }) {
  return (
    <View style={cardStyles.card}>
      {/* Top row: icon + name + progress */}
      <View style={cardStyles.topRow}>
        <RoutineIcon type={routine.iconType} />
        <Text style={cardStyles.name}>{routine.name}</Text>
        <Text style={cardStyles.progress}>{routine.progress}%</Text>
      </View>

      {/* Description label */}
      <Text style={cardStyles.descLabel}>Description:</Text>

      {/* Details */}
      <View style={cardStyles.detailsRow}>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.details}>
            {routine.description
              ? `${routine.description}\n`
              : ''}
            {`Category: ${routine.category}\nTime: ${routine.time}\nDuration: ${routine.duration}${routine.frequency ? `\nFrequency: ${routine.frequency}` : ''}`}
          </Text>
        </View>
        <Text style={cardStyles.status}>Status: {routine.status}</Text>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#252525',
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  name: {
    flex: 1,
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  progress: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },
  descLabel: {
    color: '#AEFF00',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  details: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 14,
  },
  status: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'right',
  },
});

// ─── Add Card ─────────────────────────────────────────────────────────────────
function AddCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={addCardStyles.card} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name="add" size={52} color="#C4C4C4" />
    </TouchableOpacity>
  );
}

const addCardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1C1C1C',
    borderRadius: 15,
    height: 114,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
});

// ─── Habits Screen ────────────────────────────────────────────────────────────
export default function Habits() {
  const insets = useSafeAreaInsets();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRoutines = useCallback(async () => {
    try {
      // TODO: Replace with real API call
      // const response = await apiService.getMyRoutines();
      // setRoutines(response.data);
      setRoutines([]);
    } catch (error) {
      console.error('Error fetching routines:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleAddRoutine = () => {
    // TODO: Navigate to add routine screen / open modal
    console.log('Add routine');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Routine</Text>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#AEFF00" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchRoutines();
              }}
              tintColor="#AEFF00"
            />
          }
        >
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
          <AddCard onPress={handleAddRoutine} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '700',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
