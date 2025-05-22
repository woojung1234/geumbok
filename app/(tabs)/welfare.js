import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import WelfareCard from '../../components/WelfareCard';
import SearchBar from '../../components/SearchBar';

export default function WelfareScreen() {
  const { user } = useUser();
  const [welfareServices, setWelfareServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    '전체', '건강의료', '생활지원', '주거복지', '경제지원', '사회참여', '돌봄서비스'
  ];

  useEffect(() => {
    loadWelfareServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [welfareServices, searchQuery, selectedCategory]);

  const loadWelfareServices = async () => {
    try {
      setLoading(true);

      // 공공 API 호출 (보건복지부 복지서비스 정보)
      // 실제로는 공공데이터포털 API 사용
      const mockServices = [
        {
          id: 1,
          title: '기초연금',
          description: '만 65세 이상 어르신 중 소득·재산이 일정액 이하인 분들께 매월 일정액의 연금을 지급',
          category: '경제지원',
          target: '만 65세 이상',
          amount: '월 최대 334,810원',
          applicationMethod: '국민연금공단, 주민센터 방문 또는 온라인 신청',
          requiredDocuments: '신분증, 통장사본, 소득·재산 관련 서류',
          contactInfo: '국민연금공단 1355',
          url: 'https://basicpension.nps.or.kr',
          isEligible: true,
        },
        {
          id: 2,
          title: '노인장기요양보험',
          description: '일상생활이 어려운 노인분들에게 신체활동 또는 가사활동 지원 서비스 제공',
          category: '돌봄서비스',
          target: '만 65세 이상 또는 65세 미만 노인성 질병자',
          amount: '본인부담금 15-20%',
          applicationMethod: '국민건강보험공단 방문 또는 온라인 신청',
          requiredDocuments: '신청서, 의사소견서',
          contactInfo: '국민건강보험공단 1577-1000',
          url: 'https://www.longtermcare.or.kr',
          isEligible: checkLongTermCareEligibility(),
        },
        {
          id: 3,
          title: '치매안심센터 서비스',
          description: '치매 예방, 진단, 치료, 돌봄까지 치매 관련 종합서비스 제공',
          category: '건강의료',
          target: '60세 이상 지역주민',
          amount: '무료',
          applicationMethod: '해당 지역 치매안심센터 방문 또는 전화 신청',
          requiredDocuments: '신분증',
          contactInfo: '중앙치매센터 1899-9988',
          url: 'https://www.nid.or.kr',
          isEligible: true,
        },
        {
          id: 4,
          title: '노인일자리 및 사회활동 지원사업',
          description: '어르신들의 활기찬 노후생활과 소득보장을 위한 일자리 및 사회활동 지원',
          category: '사회참여',
          target: '만 65세 이상',
          amount: '월 27만원 ~ 71만원',
          applicationMethod: '시니어클럽, 대한노인회 등 수행기관 방문 신청',
          requiredDocuments: '신청서, 신분증, 건강진단서',
          contactInfo: '한국노인인력개발원 1544-3388',
          url: 'https://www.kordi.or.kr',
          isEligible: true,
        },
        {
          id: 5,
          title: '노인맞춤돌봄서비스',
          description: '일상생활 영위가 어려운 취약 노인에게 적절한 돌봄서비스 제공',
          category: '돌봄서비스',
          target: '만 65세 이상 기초생활수급자, 차상위계층 등',
          amount: '무료',
          applicationMethod: '읍면동 주민센터 방문 신청',
          requiredDocuments: '신청서, 신분증',
          contactInfo: '보건복지부 콜센터 129',
          url: 'https://www.mohw.go.kr',
          isEligible: checkCustomCareEligibility(),
        },
      ];

      setWelfareServices(mockServices);
      setLoading(false);
    } catch (error) {
      console.error('복지서비스 정보 로드 실패:', error);
      Alert.alert('오류', '복지서비스 정보를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = welfareServices;

    // 카테고리 필터
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  };

  const checkLongTermCareEligibility = () => {
    // 실제로는 사용자의 나이, 건강상태 등을 체크
    return user && user.age >= 65;
  };

  const checkCustomCareEligibility = () => {
    // 실제로는 사용자의 소득수준 등을 체크
    return user && user.age >= 65;
  };

  const handleServicePress = (service) => {
    Alert.alert(
      service.title,
      `${service.description}\n\n📞 문의: ${service.contactInfo}`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '상세보기',
          onPress: () => openServiceUrl(service.url),
        },
        {
          text: '신청하기',
          onPress: () => showApplicationInfo(service),
        },
      ]
    );
  };

  const openServiceUrl = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('오류', 'URL을 열 수 없습니다.');
    });
  };

  const showApplicationInfo = (service) => {
    Alert.alert(
      '신청 안내',
      `신청 방법: ${service.applicationMethod}\n\n필요 서류: ${service.requiredDocuments}\n\n문의: ${service.contactInfo}`,
      [
        { text: '확인' },
        {
          text: '전화하기',
          onPress: () => {
            const phoneNumber = service.contactInfo.match(/\d{3,4}-\d{4}/);
            if (phoneNumber) {
              Linking.openURL(`tel:${phoneNumber[0]}`);
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWelfareServices();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>복지서비스 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>복지서비스</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle" size={24} color="#2e78b7" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 검색바 */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="복지서비스를 검색하세요..."
        />

        {/* 카테고리 필터 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category && styles.categoryButtonTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 맞춤 추천 서비스 */}
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="star" size={16} color="#f39c12" /> 맞춤 추천 서비스
          </Text>
          {filteredServices
            .filter(service => service.isEligible)
            .slice(0, 3)
            .map((service) => (
              <WelfareCard
                key={service.id}
                service={service}
                onPress={() => handleServicePress(service)}
                isRecommended={true}
              />
            ))}
        </View>

        {/* 전체 서비스 목록 */}
        <View style={styles.allServicesSection}>
          <Text style={styles.sectionTitle}>
            전체 서비스 ({filteredServices.length}개)
          </Text>
          {filteredServices.map((service) => (
            <WelfareCard
              key={service.id}
              service={service}
              onPress={() => handleServicePress(service)}
            />
          ))}
        </View>

        {filteredServices.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            <Text style={styles.emptySubText}>
              다른 검색어나 카테고리를 선택해보세요.
            </Text>
          </View>
        )}
      </ScrollView>
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
  infoButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#2e78b7',
    borderColor: '#2e78b7',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  recommendedSection: {
    marginBottom: 30,
  },
  allServicesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '500',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});