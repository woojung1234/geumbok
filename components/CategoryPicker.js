// components/ExpenseItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ExpenseItem = ({ expense, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case '식료품': return 'restaurant';
      case '교통비': return 'car';
      case '의료비': return 'medical';
      case '생활용품': return 'home';
      case '통신비': return 'phone-portrait';
      case '공과금': return 'flash';
      case '문화생활': return 'film';
      default: return 'ellipsis-horizontal';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '식료품': return '#4CAF50';
      case '교통비': return '#2196F3';
      case '의료비': return '#F44336';
      case '생활용품': return '#FF9800';
      case '통신비': return '#9C27B0';
      case '공과금': return '#FFEB3B';
      case '문화생활': return '#E91E63';
      default: return '#607D8B';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(expense.category) + '20' }]}>
          <Ionicons
            name={getCategoryIcon(expense.category)}
            size={20}
            color={getCategoryColor(expense.category)}
          />
        </View>
        <View style={styles.expenseInfo}>
          <Text style={styles.description}>{expense.description}</Text>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.date}>{new Date(expense.date).toLocaleDateString('ko-KR')}</Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.amount}>-{expense.amount.toLocaleString()}원</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(expense)}>
            <Ionicons name="pencil" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(expense.id)}>
            <Ionicons name="trash" size={16} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: '#999',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default ExpenseItem;

// components/QuickStats.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickStats = ({ monthlyTotal, todayTotal }) => {
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

const QuickStatsStyles = StyleSheet.create({
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

QuickStats.defaultProps = {
  monthlyTotal: 0,
  todayTotal: 0,
};

// components/RecentExpenses.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RecentExpenses = ({ expenses }) => {
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
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>최근 지출 내역이 없습니다.</Text>
        }
      />
    </View>
  );
};

const RecentExpensesStyles = StyleSheet.create({
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

// components/NotificationList.js
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationList = ({ notifications }) => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={16}
          color={item.isRead ? '#666' : '#2e78b7'}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.unreadText]}>
          {item.title}
        </Text>
        <Text style={styles.notificationText} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welfare': return 'heart';
      case 'expense': return 'receipt';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림</Text>
      <FlatList
        data={notifications.slice(0, 3)}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>새로운 알림이 없습니다.</Text>
        }
      />
    </View>
  );
};

const NotificationListStyles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#f8f9ff',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: '#2e78b7',
  },
  notificationText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e78b7',
    position: 'absolute',
    right: 10,
    top: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
});

// components/CategoryPicker.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CategoryPicker = ({ categories, selectedCategory, onSelect }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case '식료품': return 'restaurant';
      case '교통비': return 'car';
      case '의료비': return 'medical';
      case '생활용품': return 'home';
      case '통신비': return 'phone-portrait';
      case '공과금': return 'flash';
      case '문화생활': return 'film';
      default: return 'ellipsis-horizontal';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case '식료품': return '#4CAF50';
      case '교통비': return '#2196F3';
      case '의료비': return '#F44336';
      case '생활용품': return '#FF9800';
      case '통신비': return '#9C27B0';
      case '공과금': return '#FFEB3B';
      case '문화생활': return '#E91E63';
      default: return '#607D8B';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>카테고리</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedButton,
              { borderColor: getCategoryColor(category) }
            ]}
            onPress={() => onSelect(category)}
          >
            <Ionicons
              name={getCategoryIcon(category)}
              size={20}
              color={selectedCategory === category ? '#fff' : getCategoryColor(category)}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.selectedText,
                { color: selectedCategory === category ? '#fff' : getCategoryColor(category) }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const CategoryPickerStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  scrollView: {
    marginHorizontal: -5,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: '#fff',
  },
  selectedButton: {
    backgroundColor: '#2e78b7',
    borderColor: '#2e78b7',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  selectedText: {
    color: '#fff',
  },
});