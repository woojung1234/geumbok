import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { useUser } from '../../contexts/UserContext';

const screenWidth = Dimensions.get('window').width;

// 간단한 ExpenseItem 컴포넌트
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

  return (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Ionicons name={getCategoryIcon(expense.category)} size={20} color="#2e78b7" />
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseDescription}>{expense.description}</Text>
          <Text style={styles.expenseCategory}>{expense.category}</Text>
          <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString('ko-KR')}</Text>
        </View>
      </View>
      <Text style={styles.expenseAmount}>-{expense.amount.toLocaleString()}원</Text>
    </View>
  );
};

// 간단한 CategoryPicker 컴포넌트
const CategoryPicker = ({ categories, selectedCategory, onSelect }) => {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>카테고리</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton,
            ]}
            onPress={() => onSelect(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.selectedCategoryText,
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

export default function ExpensesScreen() {
  const { user } = useUser();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyStats, setMonthlyStats] = useState({
    total: 0,
    byCategory: {},
  });

  // 새 지출 입력 폼
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: '식료품',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    '식료품', '교통비', '의료비', '생활용품', '통신비',
    '공과금', '문화생활', '기타'
  ];

  useEffect(() => {
    loadExpenses();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    calculateStats();
  }, [filteredExpenses]);

  const loadExpenses = async () => {
    try {
      // 임시 데이터
      const mockExpenses = [
        {
          id: 1,
          amount: 45000,
          description: '마트 장보기',
          category: '식료품',
          date: '2024-05-20',
        },
        {
          id: 2,
          amount: 15000,
          description: '병원비',
          category: '의료비',
          date: '2024-05-19',
        },
        {
          id: 3,
          amount: 5000,
          description: '버스카드 충전',
          category: '교통비',
          date: '2024-05-18',
        },
      ];

      setExpenses(mockExpenses);
      setFilteredExpenses(mockExpenses);
    } catch (error) {
      console.error('지출 내역 로드 실패:', error);
      Alert.alert('오류', '지출 내역을 불러오는 중 오류가 발생했습니다.');
    }
  };

  const calculateStats = () => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const byCategory = {};
    filteredExpenses.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });

    setMonthlyStats({ total, byCategory });
  };

  const handleAddExpense = async () => {
    if (!newExpense.amount || !newExpense.description) {
      Alert.alert('입력 오류', '금액과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const expense = {
        id: Date.now(),
        amount: parseInt(newExpense.amount),
        description: newExpense.description,
        category: newExpense.category,
        date: newExpense.date,
      };

      setExpenses(prev => [expense, ...prev]);
      setFilteredExpenses(prev => [expense, ...prev]);

      setNewExpense({
        amount: '',
        description: '',
        category: '식료품',
        date: new Date().toISOString().split('T')[0],
      });

      setShowAddModal(false);
      Alert.alert('성공', '지출이 등록되었습니다.');
    } catch (error) {
      console.error('지출 등록 실패:', error);
      Alert.alert('오류', '지출 등록 중 오류가 발생했습니다.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  const renderExpenseItem = ({ item }) => (
    <ExpenseItem expense={item} onEdit={() => {}} onDelete={() => {}} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>가계부</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 월별 총액 */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {selectedYear}년 {selectedMonth + 1}월 총 지출
          </Text>
          <Text style={styles.summaryAmount}>
            {monthlyStats.total.toLocaleString()}원
          </Text>
        </View>

        {/* 카테고리별 지출 */}
        <View style={styles.categoryCard}>
          <Text style={styles.categoryTitle}>카테고리별 지출</Text>
          {Object.entries(monthlyStats.byCategory).map(([category, amount]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.categoryAmount}>
                {amount.toLocaleString()}원
              </Text>
            </View>
          ))}
        </View>

        {/* 지출 목록 */}
        <View style={styles.expenseList}>
          <Text style={styles.expenseListTitle}>지출 내역</Text>
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>지출 내역이 없습니다.</Text>
            }
          />
        </View>
      </ScrollView>

      {/* 지출 추가 모달 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>지출 추가</Text>
            <TouchableOpacity onPress={handleAddExpense}>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>금액</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense(prev => ({...prev, amount: text}))}
                placeholder="금액을 입력하세요"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>내용</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.description}
                onChangeText={(text) => setNewExpense(prev => ({...prev, description: text}))}
                placeholder="지출 내용을 입력하세요"
              />
            </View>

            <CategoryPicker
              categories={categories}
              selectedCategory={newExpense.category}
              onSelect={(category) => setNewExpense(prev => ({...prev, category}))}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>날짜</Text>
              <TextInput
                style={styles.textInput}
                value={newExpense.date}
                onChangeText={(text) => setNewExpense(prev => ({...prev, date: text}))}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2e78b7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2e78b7',
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  categoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e78b7',
  },
  expenseList: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expenseListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
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
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseDetails: {
    marginLeft: 10,
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  expenseCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e78b7',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  categoryScroll: {
    marginHorizontal: -5,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  selectedCategoryButton: {
    backgroundColor: '#2e78b7',
    borderColor: '#2e78b7',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});