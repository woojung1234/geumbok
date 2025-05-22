import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRecoilState } from 'recoil';
import { userState } from '../store/userState';

const ConsumptionScreen = () => {
  const [user] = useRecoilState(userState);
  const [consumptions, setConsumptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // 'week', 'month', 'year'
  const [showAddModal, setShowAddModal] = useState(false);
  const [newConsumption, setNewConsumption] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // 카테고리 정의
  const categories = [
    { id: 'food', label: '식비', icon: 'coffee' },
    { id: 'transport', label: '교통비', icon: 'truck' },
    { id: 'living', label: '생활용품', icon: 'home' },
    { id: 'health', label: '의료/건강', icon: 'heart' },
    { id: 'leisure', label: '여가/취미', icon: 'film' },
    { id: 'etc', label: '기타', icon: 'more-horizontal' }
  ];

  useEffect(() => {
    fetchConsumptionData();
  }, [selectedPeriod]);

  const fetchConsumptionData = async () => {
    try {
      setLoading(true);

      // 선택된 기간에 따라 날짜 범위 설정
      const endDate = new Date();
      const startDate = new Date();

      if (selectedPeriod === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (selectedPeriod === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (selectedPeriod === 'year') {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      // 실제로는 API 호출 필요, 현재는 샘플 데이터
      const data = [
        {
          id: '1',
          date: '2025-05-20',
          category: '식비',
          amount: 15000,
          description: '점심식사'
        },
        {
          id: '2',
          date: '2025-05-19',
          category: '교통비',
          amount: 1250,
          description: '버스 요금'
        },
        {
          id: '3',
          date: '2025-05-18',
          category: '생활용품',
          amount: 22000,
          description: '세제구매'
        },
        {
          id: '4',
          date: '2025-05-17',
          category: '의료/건강',
          amount: 5000,
          description: '약국'
        },
        {
          id: '5',
          date: '2025-05-16',
          category: '여가/취미',
          amount: 12000,
          description: '도서구매'
        }
      ];

      setTimeout(() => {
        setConsumptions(data);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('소비내역 불러오기 오류:', error);
      setError('소비내역을 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return consumptions.reduce((sum, item) => sum + item.amount, 0);
  };

  const getCategoryAmount = (category) => {
    return consumptions
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.amount, 0);
  };

  const handleAddConsumption = () => {
    // 입력 값 검증
    if (!newConsumption.category || !newConsumption.amount || !newConsumption.description) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    // 새 소비내역 추가 (실제로는 API 호출 필요)
    const newItem = {
      id: (Date.now()).toString(),
      date: newConsumption.date,
      category: newConsumption.category,
      amount: parseInt(newConsumption.amount),
      description: newConsumption.description
    };

    setConsumptions([newItem, ...consumptions]);
    setShowAddModal(false);
    setNewConsumption({
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const renderConsumptionItem = ({ item }) => (
    <View style={styles.consumptionItem}>
      <View style={styles.consumptionDate}>
        <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.consumptionContent}>
        <View style={styles.consumptionHeader}>
          <Text style={styles.categoryText}>{item.category}</Text>
          <Text style={styles.amountText}>{item.amount.toLocaleString()}원</Text>
        </View>
        <Text style={styles.descriptionText}>{item.description}</Text>
      </View>
    </View>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        newConsumption.category === item.label && styles.selectedCategory
      ]}
      onPress={() => setNewConsumption({...newConsumption, category: item.label})}
    >
      <Icon
        name={item.icon}
        size={20}
        color={newConsumption.category === item.label ? '#fff' : '#495057'}
      />
      <Text
        style={[
          styles.categoryButtonText,
          newConsumption.category === item.label && styles.selectedCategoryText
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 16 }}>소비내역 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchConsumptionData}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.periodSelector}>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'week' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('week')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'week' && styles.activePeriodText]}>1주일</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'month' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('month')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'month' && styles.activePeriodText]}>1개월</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.periodButton, selectedPeriod === 'year' && styles.activePeriod]}
          onPress={() => setSelectedPeriod('year')}
        >
          <Text style={[styles.periodText, selectedPeriod === 'year' && styles.activePeriodText]}>1년</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>총 지출액</Text>
        <Text style={styles.summaryAmount}>{getTotalAmount().toLocaleString()}원</Text>
        <View style={styles.categoryDistribution}>
          {categories.slice(0, 4).map(category => (
            <View key={category.id} style={styles.categoryItem}>
              <Icon name={category.icon} size={16} color="#007BFF" />
              <Text style={styles.categoryItemLabel}>{category.label}</Text>
              <Text style={styles.categoryItemAmount}>
                {getCategoryAmount(category.label).toLocaleString()}원
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>상세 내역</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Icon name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={consumptions}
        renderItem={renderConsumptionItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.consumptionList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>소비내역이 없습니다.</Text>
          </View>
        }
      />

      {/* 소비내역 추가 모달 */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>소비내역 추가</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowAddModal(false)}
              >
                <Icon name="x" size={24} color="#495057" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <Text style={styles.inputLabel}>카테고리</Text>
              <FlatList
                data={categories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              />

              <Text style={styles.inputLabel}>금액</Text>
              <TextInput
                style={styles.input}
                placeholder="금액"
                keyboardType="numeric"
                value={newConsumption.amount}
                onChangeText={text => setNewConsumption({...newConsumption, amount: text})}
              />

              <Text style={styles.inputLabel}>설명</Text>
              <TextInput
                style={styles.input}
                placeholder="설명"
                value={newConsumption.description}
                onChangeText={text => setNewConsumption({...newConsumption, description: text})}
              />

              <Text style={styles.inputLabel}>날짜</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DD"
                value={newConsumption.date}
                onChangeText={text => setNewConsumption({...newConsumption, date: text})}
              />

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddConsumption}
              >
                <Text style={styles.saveButtonText}>저장</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  periodButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  activePeriod: {
    backgroundColor: '#e9ecef',
  },
  periodText: {
    fontSize: 14,
    color: '#6c757d',
  },
  activePeriodText: {
    color: '#212529',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 15,
  },
  categoryDistribution: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryItemLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#495057',
    flex: 1,
  },
  categoryItemAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
    marginBottom: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  consumptionList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  consumptionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  consumptionDate: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#e9ecef',
    marginRight: 12,
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  consumptionContent: {
    flex: 1,
  },
  consumptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    color: '#212529',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  descriptionText: {
    fontSize: 14,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    padding: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#495057',
    marginBottom: 10,
  },
  categoriesList: {
    paddingBottom: 10,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedCategory: {
    backgroundColor: '#007BFF',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 5,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConsumptionScreen;