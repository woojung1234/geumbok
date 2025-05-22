import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickStats = ({ monthlyTotal = 0, todayTotal = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="calendar" size={20} color="#2e78b7" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>이번 달 지출</Text>
          <Text style={styles.statValue}>{monthlyTotal.toLocaleString()}원</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.statItem}>
        <View style={styles.statIcon}>
          <Ionicons name="today" size={20} color="#27ae60" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statLabel}>오늘 지출</Text>
          <Text style={styles.statValue}>{todayTotal.toLocaleString()}원</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
});

export default QuickStats;