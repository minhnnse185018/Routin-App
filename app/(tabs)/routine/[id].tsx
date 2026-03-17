import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../../../src/services/api.service';
import { StorageService } from '../../../src/utils/storage';

type RoutineTask = {
  id: string;
  title: string;
  targetValue?: number;
  status: 'InProgress' | 'Completed' | 'Skipped';
};

type RoutineDetail = {
  id: string;
  title: string;
  description?: string | null;
  categoryName?: string;
  remindTime?: string;
  visibility?: string;
  tasks: RoutineTask[];
};

function normalizeStatus(raw: unknown): RoutineTask['status'] {
  const value = String(raw ?? '').toLowerCase();
  if (value.includes('complete') || value === '1') return 'Completed';
  if (value.includes('skip') || value === '2') return 'Skipped';
  return 'InProgress';
}

export default function RoutineDetailScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const routineId = params.id ? String(params.id) : '';

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [detail, setDetail] = useState<RoutineDetail | null>(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTarget, setTaskTarget] = useState('');
  const [workingTaskId, setWorkingTaskId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!routineId) return;

    const token = await StorageService.getToken();
    const [detailRes, logsRes] = await Promise.all([
      apiService.get<any>(`/api/routines/${routineId}`, token ?? undefined),
      apiService.get<any[]>('/api/tasklogs/today', token ?? undefined),
    ]);

    if (!detailRes.success || !detailRes.data) {
      setDetail(null);
      return;
    }

    const logs = logsRes.success && Array.isArray(logsRes.data) ? logsRes.data : [];
    const logsByTaskId = new Map<string, any>();
    logs.forEach((log: any) => {
      const taskId = String(log?.taskId ?? '');
      if (taskId) logsByTaskId.set(taskId, log);
    });

    const tasks = Array.isArray(detailRes.data?.tasks)
      ? detailRes.data.tasks.map((task: any) => {
          const id = String(task?.id ?? task?.taskId ?? '');
          const log = logsByTaskId.get(id);
          return {
            id,
            title: String(task?.title ?? 'Untitled task'),
            targetValue: typeof task?.targetValue === 'number' ? task.targetValue : undefined,
            status: normalizeStatus(log?.status),
          } satisfies RoutineTask;
        }).filter((task: RoutineTask) => task.id)
      : [];

    setDetail({
      id: String(detailRes.data?.id ?? routineId),
      title: String(detailRes.data?.title ?? 'Routine'),
      description: detailRes.data?.description ?? null,
      categoryName: detailRes.data?.category?.name ?? detailRes.data?.categoryName,
      remindTime: detailRes.data?.remindTime ? String(detailRes.data.remindTime) : undefined,
      visibility: detailRes.data?.visibility ? String(detailRes.data.visibility) : undefined,
      tasks,
    });
  }, [routineId]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      try {
        await fetchData();
      } finally {
        if (mounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    run();

    return () => {
      mounted = false;
    };
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const createTask = async () => {
    if (!detail?.id) return;
    if (!taskTitle.trim()) {
      Alert.alert('Validation', 'Task title is required');
      return;
    }

    const token = await StorageService.getToken();
    const targetValue = taskTarget.trim().length > 0 ? Number(taskTarget) : 1;

    const payload = {
      title: taskTitle.trim(),
      unitType: 'Times',
      targetValue: Number.isFinite(targetValue) ? targetValue : 1,
      unitName: 'times',
      difficultyLevel: 'Easy',
      estimatedMinutes: 0,
      prepareItems: [],
    };

    const response = await apiService.post(`/api/routines/${detail.id}/tasks`, payload, token ?? undefined);

    if (!response.success) {
      Alert.alert('Create task failed', response.error || 'Unknown error');
      return;
    }

    setTaskTitle('');
    setTaskTarget('');
    await fetchData();
  };

  const checkInTask = async (taskId: string) => {
    const token = await StorageService.getToken();
    setWorkingTaskId(taskId);
    await apiService.post('/api/tasklogs/checkin', { taskId }, token ?? undefined);
    await fetchData();
    setWorkingTaskId(null);
  };

  const deleteTask = async (taskId: string) => {
    if (!detail?.id) return;
    const token = await StorageService.getToken();
    setWorkingTaskId(taskId);
    await apiService.delete(`/api/routines/${detail.id}/tasks/${taskId}`, token ?? undefined);
    await fetchData();
    setWorkingTaskId(null);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}> 
      <ScrollView
        contentContainerStyle={[styles.content, isWide && styles.contentWide]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#95FF00" />}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={18} color="#E5E7EB" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={styles.centered}><ActivityIndicator size="large" color="#95FF00" /></View>
        ) : !detail ? (
          <View style={styles.centered}><Text style={styles.emptyText}>Routine not found.</Text></View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.title}>{detail.title}</Text>
              <Text style={styles.meta}>Category: {detail.categoryName ?? 'Unknown'}</Text>
              <Text style={styles.meta}>Visibility: {detail.visibility ?? 'Private'}</Text>
              {detail.remindTime ? <Text style={styles.meta}>Reminder: {detail.remindTime}</Text> : null}
              <Text style={styles.description}>{detail.description?.trim() || 'No description'}</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Add Task</Text>
              <TextInput
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Task title"
                placeholderTextColor="#6B7280"
                style={styles.input}
              />
              <TextInput
                value={taskTarget}
                onChangeText={setTaskTarget}
                placeholder="Target value (optional)"
                keyboardType="numeric"
                placeholderTextColor="#6B7280"
                style={styles.input}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={createTask}>
                <Text style={styles.primaryBtnText}>Create Task</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              {detail.tasks.length === 0 ? (
                <Text style={styles.emptyText}>No tasks yet</Text>
              ) : (
                detail.tasks.map((task) => {
                  const isBusy = workingTaskId === task.id;
                  return (
                    <View key={task.id} style={styles.taskRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        <Text style={styles.taskMeta}>Status: {task.status}</Text>
                      </View>

                      <View style={styles.taskActions}>
                        <TouchableOpacity style={styles.primaryBtnSmall} onPress={() => checkInTask(task.id)} disabled={isBusy}>
                          <Text style={styles.primaryBtnText}>Check-in</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dangerBtnSmall} onPress={() => deleteTask(task.id)} disabled={isBusy}>
                          <Text style={styles.dangerBtnText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F13',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
    gap: 12,
  },
  contentWide: {
    maxWidth: 980,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: {
    color: '#E5E7EB',
    fontWeight: '600',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
    padding: 14,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  meta: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 4,
  },
  description: {
    color: '#E5E7EB',
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0B1220',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },
  primaryBtn: {
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#95FF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnSmall: {
    minHeight: 36,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#95FF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#0A0F1D',
    fontWeight: '700',
    fontSize: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#0B1220',
    padding: 10,
    marginBottom: 8,
  },
  taskTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  taskMeta: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
  },
  dangerBtnSmall: {
    minHeight: 36,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerBtnText: {
    color: '#FCA5A5',
    fontWeight: '700',
    fontSize: 12,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#9CA3AF',
  },
});
