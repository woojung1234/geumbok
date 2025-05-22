import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RecentExpenses = ({ expenses = [] }) => {
  const router = useRouter();

  const renderExpenseItem = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseDescription}>{item.description}</Text>
        <Text style={styles.expenseCategory}>{item.category}</Text>
      </View>
      <Text style={styles.expenseAmount}>-{item.amount.toLocaleString()}원</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>최근 지출</Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => router.push('/expenses')}
        >
          <Text style={styles.viewAllText}>전체보기</Text>
          <Ionicons name="chevron-forward" size={16} color="#2e78b7" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses.slice(0, 5)}
        renderItem={renderExpenseItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>최근 지출 내역이 없습니다.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2e78b7',
    marginRight: 4,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expenseInfo: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
});

export default RecentExpenses;