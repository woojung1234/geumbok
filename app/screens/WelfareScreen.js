import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const WelfareScreen = () => {
  const [welfareServices, setWelfareServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWelfareServices();
  }, []);

  const fetchWelfareServices = async () => {
    try {
      setLoading(true);

      // 실제로는 API 호출 필요, 현재는 샘플 데이터
      const data = [
        {
          id: '1',
          title: '기초연금',
          description: '65세 이상 어르신의 생활 안정을 위한 기초연금 지원',
          eligibility: '만 65세 이상, 소득인정액 하위 70%',
          amount: '월 최대 300,000원',
          category: '금융지원'
        },
        {
          id: '2',
          title: '노인 일자리 지원',
          description: '노인의 사회 참여와 소득 보충을 위한 일자리 제공',
          eligibility: '만 65세 이상 기초연금 수급자',
          amount: '월 최대 270,000원',
          category: '일자리'
        },
        {
          id: '3',
          title: '경로우대 제도',
          description: '65세 이상 어르신 대상 교통, 문화시설 등 이용 요금 할인',
          eligibility: '만 65세 이상',
          amount: '시설별 상이',
          category: '생활지원'
        },
        {
          id: '4',
          title: '무료 독감 예방접종',
          description: '고령자 대상 무료 독감 예방접종 지원',
          eligibility: '만 65세 이상',
          amount: '전액 지원',
          category: '의료지원'
        }
      ];

      setTimeout(() => {
        setWelfareServices(data);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('복지서비스 정보 불러오기 오류:', error);
      setError('복지서비스 정보를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const filteredServices = welfareServices.filter(service =>
    service.title.includes(searchQuery) ||
    service.description.includes(searchQuery) ||
    service.category.includes(searchQuery)
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.serviceDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>지원 자격:</Text>
          <Text style={styles.detailText}>{item.eligibility}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>지원 금액:</Text>
          <Text style={styles.detailText}>{item.amount}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>신청하기</Text>
        <Icon name="arrow-right" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 16 }}>복지서비스 정보를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchWelfareServices}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#adb5bd" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="복지서비스 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <Icon name="x" size={20} color="#adb5bd" />
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.servicesList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
          </View>
        }
      />
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
  },
  clearButton: {
    padding: 5,
  },
  servicesList: {
    padding: 15,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 15,
    lineHeight: 20,
  },
  serviceDetails: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#495057',
    width: 80,
  },
  detailText: {
    color: '#495057',
    flex: 1,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
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
});

export default WelfareScreen;