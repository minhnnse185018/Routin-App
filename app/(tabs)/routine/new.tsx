import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import apiService from '../../../src/services/api.service';
import { StorageService } from '../../../src/utils/storage';

type Category = {
  id: string;
  name: string;
};

export default function NewRoutineScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const isWide = width >= 900;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [repeatType, setRepeatType] = useState<'Daily' | 'Weekly'>('Daily');
  const [repeatDays, setRepeatDays] = useState('');
  const [visibility, setVisibility] = useState<'Private' | 'Public' | 'SubscribersOnly'>('Public');
  const [remindTime, setRemindTime] = useState('07:00:00');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [bootLoading, setBootLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategories = async () => {
      const res = await apiService.get<any[]>('/api/categories');
      if (mounted && res.success && Array.isArray(res.data)) {
        const mapped = res.data.map((item: any) => ({
          id: String(item?.id ?? ''),
          name: String(item?.name ?? 'Category'),
        })).filter((item: Category) => item.id.length > 0);

        setCategories(mapped);
        if (mapped.length > 0) {
          setCategoryId(mapped[0].id);
        }
      }
      if (mounted) setBootLoading(false);
    };

    loadCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const onSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required');
      return;
    }

    if (!categoryId) {
      Alert.alert('Validation', 'Please choose a category');
      return;
    }

    if (repeatType === 'Weekly' && !repeatDays.trim()) {
      Alert.alert('Validation', 'repeatDays is required for Weekly type (example: 1,3,5)');
      return;
    }

    setLoading(true);
    const token = await StorageService.getToken();

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      categoryId,
      repeatType,
      repeatDays: repeatType === 'Weekly' ? repeatDays.trim() : null,
      remindTime: remindTime.trim() || null,
      visibility,
    };

    const response = await apiService.post('/api/routines', payload, token ?? undefined);
    setLoading(false);

    if (response.success) {
      router.replace('/(tabs)/habits');
      return;
    }

    Alert.alert('Create routine failed', response.error || 'Unknown error');
  };

  if (bootLoading) {
    return (
      <View style={styles.loadingRoot}>
        <ActivityIndicator size="large" color="#95FF00" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}> 
      <ScrollView contentContainerStyle={[styles.content, isWide && styles.contentWide]}>
        <Text style={styles.title}>Create Routine</Text>

        <View style={[styles.card, isWide && styles.cardWide]}>
          <Text style={styles.label}>Title *</Text>
          <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder="Morning routine" placeholderTextColor="#6B7280" />

          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={[styles.input, styles.textArea]}
            placeholder="Optional note"
            placeholderTextColor="#6B7280"
            multiline
          />

          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsWrap}>
            {categories.map((item) => {
              const active = item.id === categoryId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setCategoryId(item.id)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.label}>Repeat Type</Text>
          <View style={styles.inlineRow}>
            <TouchableOpacity style={[styles.optionBtn, repeatType === 'Daily' && styles.optionBtnActive]} onPress={() => setRepeatType('Daily')}>
              <Text style={[styles.optionBtnText, repeatType === 'Daily' && styles.optionBtnTextActive]}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionBtn, repeatType === 'Weekly' && styles.optionBtnActive]} onPress={() => setRepeatType('Weekly')}>
              <Text style={[styles.optionBtnText, repeatType === 'Weekly' && styles.optionBtnTextActive]}>Weekly</Text>
            </TouchableOpacity>
          </View>

          {repeatType === 'Weekly' ? (
            <>
              <Text style={styles.label}>Repeat Days *</Text>
              <TextInput
                value={repeatDays}
                onChangeText={setRepeatDays}
                style={styles.input}
                placeholder="1,3,5"
                placeholderTextColor="#6B7280"
              />
            </>
          ) : null}

          <Text style={styles.label}>Reminder Time</Text>
          <TextInput value={remindTime} onChangeText={setRemindTime} style={styles.input} placeholder="07:00:00" placeholderTextColor="#6B7280" />

          <Text style={styles.label}>Visibility</Text>
          <View style={styles.inlineRowWrap}>
            {(['Private', 'Public', 'SubscribersOnly'] as const).map((item) => {
              const active = visibility === item;
              return (
                <TouchableOpacity key={item} style={[styles.optionBtn, active && styles.optionBtnActive]} onPress={() => setVisibility(item)}>
                  <Text style={[styles.optionBtnText, active && styles.optionBtnTextActive]}>{item}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBtn} onPress={onSubmit} disabled={loading}>
              <Text style={styles.primaryBtnText}>{loading ? 'Creating...' : 'Create Routine'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    backgroundColor: '#0D0F13',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D0F13',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  contentWide: {
    maxWidth: 980,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
    backgroundColor: '#111827',
    padding: 16,
  },
  cardWide: {
    padding: 24,
  },
  label: {
    color: '#E5E7EB',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0B1220',
    color: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'web' ? 10 : 9,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipsWrap: {
    marginVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: {
    borderColor: '#95FF00',
    backgroundColor: '#1A2E00',
  },
  chipText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#CCFF73',
  },
  inlineRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  inlineRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  optionBtn: {
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  optionBtnActive: {
    borderColor: '#95FF00',
    backgroundColor: '#1A2E00',
  },
  optionBtnText: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '600',
  },
  optionBtnTextActive: {
    color: '#CCFF73',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  primaryBtn: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#95FF00',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryBtnText: {
    color: '#0A0F1D',
    fontWeight: '700',
  },
  secondaryBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  secondaryBtnText: {
    color: '#E5E7EB',
    fontWeight: '600',
  },
});
