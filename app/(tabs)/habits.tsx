import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const isWeb = Platform.OS === 'web';

export default function Habits() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={80} color="#727272" />
          <Text style={styles.emptyStateText}>No habits yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first habit to start tracking your progress
          </Text>
          <TouchableOpacity style={styles.createButton}>
            <Ionicons name="add" size={24} color="#000000" />
            <Text style={styles.createButtonText}>Create Habit</Text>
          </TouchableOpacity>
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
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: '#727272',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  createButton: {
    backgroundColor: '#AEFF00',
    borderRadius: 87,
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    cursor: isWeb ? 'pointer' : undefined,
  } as any,
  createButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
