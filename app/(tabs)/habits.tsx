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
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../../src/services/api.service';
import { StorageService } from '../../src/utils/storage';

type Routine = {
  id: string;
  title: string;
  categoryName: string;
  description: string;
  remindTime: string;
  visibility: string;
  repeatType: string;
  progress: number;
  status: string;
  iconType: 'gym' | 'study' | 'other';
};

type Category = {
  id: string;
  name: string;
};

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

function RoutineCard({
  routine,
  onOpen,
  onCopy,
  onDelete,
}: {
  routine: Routine;
  onOpen: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.topRow}>
        <RoutineIcon type={routine.iconType} />
        <Text style={cardStyles.name}>{routine.title}</Text>
        <Text style={cardStyles.progress}>{routine.progress}%</Text>
      </View>

      <Text style={cardStyles.descLabel}>Description:</Text>

      <View style={cardStyles.detailsRow}>
        <View style={{ flex: 1 }}>
          <Text style={cardStyles.details}>
            {routine.description
              ? `${routine.description}\n`
              : ''}
            {`Category: ${routine.categoryName}\nTime: ${routine.remindTime}\nRepeat: ${routine.repeatType}\nVisibility: ${routine.visibility}`}
          </Text>
        </View>
        <Text style={cardStyles.status}>Status: {routine.status}</Text>
      </View>

      <View style={cardStyles.actionsRow}>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onOpen}>
          <Text style={cardStyles.actionBtnText}>Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onCopy}>
          <Text style={cardStyles.actionBtnText}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cardStyles.actionBtnDanger} onPress={onDelete}>
          <Text style={cardStyles.actionBtnDangerText}>Delete</Text>
        </TouchableOpacity>
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
  actionsRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    backgroundColor: '#95FF00',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionBtnText: {
    color: '#101010',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnDanger: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  actionBtnDangerText: {
    color: '#FCA5A5',
    fontSize: 11,
    fontWeight: '700',
  },
});

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

export default function Habits() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const mapRoutine = (item: any, index: number): Routine => {
    const title = String(item?.title || item?.name || `Routine ${index + 1}`);
    const categoryName = String(item?.categoryName || item?.category?.name || 'Uncategorized');
    const repeatType = String(item?.repeatType || 'Daily');
    const visibility = String(item?.visibility || 'Public');
    const progressValue = Number(item?.progress ?? item?.completionRate ?? 0);

    return {
      id: String(item?.id || `routine-${index}`),
      title,
      categoryName,
      description: String(item?.description || ''),
      remindTime: String(item?.remindTime || '07:00:00'),
      visibility,
      repeatType,
      progress: Number.isFinite(progressValue) ? Math.round(progressValue) : 0,
      status: String(item?.status || 'Processing'),
      iconType: index % 2 === 0 ? 'gym' : 'study',
    };
  };

  const fetchRoutines = useCallback(async () => {
    try {
      const token = await StorageService.getToken();
      const [catRes, meRes, todayRes] = await Promise.all([
        apiService.get<any[]>('/api/categories'),
        apiService.get<any[]>('/api/routines/me', token || undefined),
        apiService.get<any>('/api/routines/today', token || undefined),
      ]);

      if (catRes.success && Array.isArray(catRes.data)) {
        const mappedCategories = catRes.data
          .map((c: any) => ({ id: String(c?.id || ''), name: String(c?.name || 'Category') }))
          .filter((c: Category) => c.id);
        setCategories(mappedCategories);
      }

      if (meRes.success && Array.isArray(meRes.data)) {
        setRoutines(meRes.data.map(mapRoutine));
      } else {
        setRoutines([]);
      }

      if (todayRes.success && todayRes.data) {
        const list = Array.isArray(todayRes.data?.routines)
          ? todayRes.data.routines
          : Array.isArray(todayRes.data)
            ? todayRes.data
            : [];
        setTodayCount(list.length);
      } else {
        setTodayCount(0);
      }
    } catch (error) {
      console.error('Error fetching routines:', error);
      setRoutines([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const handleAddRoutine = () => {
    router.push('/(tabs)/routine/new');
  };

  const handleOpenRoutine = (routineId: string) => {
    router.push({ pathname: '/(tabs)/routine/[id]', params: { id: routineId } });
  };

  const handleDeleteRoutine = async (routineId: string) => {
    const token = await StorageService.getToken();
    setWorkingId(routineId);
    const response = await apiService.delete(`/api/routines/${routineId}`, token || undefined);
    setWorkingId(null);
    if (!response.success) {
      Alert.alert('Delete failed', response.error || 'Unknown error');
      return;
    }
    fetchRoutines();
  };

  const handleCopyRoutine = async (routineId: string) => {
    const token = await StorageService.getToken();
    setWorkingId(routineId);
    const response = await apiService.post(`/api/routines/${routineId}/copy`, {}, token || undefined);
    setWorkingId(null);
    if (!response.success) {
      Alert.alert('Copy failed', response.error || 'Unknown error');
      return;
    }
    fetchRoutines();
  };

  const filteredRoutines = selectedCategoryId === 'all'
    ? routines
    : routines.filter((r) => {
        const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
        return selectedCategory ? r.categoryName.toLowerCase() === selectedCategory.name.toLowerCase() : true;
      });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.header}>
        <Text style={styles.title}>Routine Management</Text>
        <Text style={styles.subtitle}>{`Today: ${todayCount} routines`}</Text>
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
          <View style={styles.categoryFilterWrap}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                style={[styles.categoryChip, selectedCategoryId === 'all' && styles.categoryChipActive]}
                onPress={() => setSelectedCategoryId('all')}
              >
                <Text style={[styles.categoryChipText, selectedCategoryId === 'all' && styles.categoryChipTextActive]}>All</Text>
              </TouchableOpacity>
              {categories.map((cat) => {
                const active = selectedCategoryId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryChip, active && styles.categoryChipActive]}
                    onPress={() => setSelectedCategoryId(cat.id)}
                  >
                    <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {filteredRoutines.map((routine) => (
            <View key={routine.id} style={{ opacity: workingId && workingId === routine.id ? 0.7 : 1 }}>
              <RoutineCard
                routine={routine}
                onOpen={() => handleOpenRoutine(routine.id)}
                onCopy={() => handleCopyRoutine(routine.id)}
                onDelete={() => handleDeleteRoutine(routine.id)}
              />
            </View>
          ))}

          {filteredRoutines.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No routines for this filter.</Text>
            </View>
          ) : null}

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
    paddingBottom: 10,
  },
  title: {
    color: '#FFF',
    fontSize: 21,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  categoryFilterWrap: {
    marginBottom: 10,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  categoryChipActive: {
    borderColor: '#95FF00',
    backgroundColor: '#1A2E00',
  },
  categoryChipText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#CCFF73',
  },
  emptyBox: {
    borderWidth: 1,
    borderColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#111827',
  },
  emptyText: {
    color: '#9CA3AF',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
