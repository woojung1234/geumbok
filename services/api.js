import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// API 기본 설정
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api/v1'  // 개발 환경
  : 'https://your-production-api.com/api/v1';  // 프로덕션 환경

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('토큰 조회 오류:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      Alert.alert('세션 만료', '다시 로그인해주세요.');
    }
    return Promise.reject(error);
  }
);

// 사용자 관련 API
export const authAPI = {
  // 로그인
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // 회원가입
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // 프로필 조회
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // 프로필 업데이트
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/auth/profile', profileData);
    return response.data;
  },
};

// 지출 관련 API (기존 welfareController 패턴 참고)
export const expenseAPI = {
  // 지출 목록 조회
  getExpenses: async (params = {}) => {
    const response = await apiClient.get('/expenses', { params });
    return response.data;
  },

  // 지출 추가
  addExpense: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  // 지출 수정
  updateExpense: async (expenseId, expenseData) => {
    const response = await apiClient.put(`/expenses/${expenseId}`, expenseData);
    return response.data;
  },

  // 지출 삭제
  deleteExpense: async (expenseId) => {
    const response = await apiClient.delete(`/expenses/${expenseId}`);
    return response.data;
  },

  // 월별 통계
  getMonthlyStats: async (year, month) => {
    const response = await apiClient.get(`/expenses/stats/${year}/${month}`);
    return response.data;
  },

  // 카테고리별 통계
  getCategoryStats: async (params = {}) => {
    const response = await apiClient.get('/expenses/stats/category', { params });
    return response.data;
  },
};

// 복지서비스 관련 API (기존 welfareController 로직 활용)
export const welfareAPI = {
  // 복지서비스 목록 조회
  getWelfareServices: async (params = {}) => {
    try {
      const response = await apiClient.get('/welfare/services', { params });
      return response.data;
    } catch (error) {
      console.error('복지서비스 조회 오류:', error);
      // 오프라인 또는 서버 오류 시 더미 데이터 반환
      return {
        success: true,
        data: getDummyWelfareServices(),
        pagination: {
          total: getDummyWelfareServices().length,
          page: 1,
          limit: 10,
          pages: 1
        }
      };
    }
  },

  // 복지서비스 상세 조회
  getWelfareServiceById: async (serviceId) => {
    try {
      const response = await apiClient.get(`/welfare/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('복지서비스 상세 조회 오류:', error);
      // 더미 데이터에서 찾기
      const dummyServices = getDummyWelfareServices();
      const service = dummyServices.find(s => s.serviceId === serviceId);
      return {
        success: !!service,
        data: service || null
      };
    }
  },

  // 복지서비스 검색
  searchWelfareServices: async (keyword, params = {}) => {
    try {
      const response = await apiClient.get('/welfare/search', {
        params: { keyword, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('복지서비스 검색 오류:', error);
      // 더미 데이터에서 검색
      const dummyServices = getDummyWelfareServices();
      const filtered = dummyServices.filter(service =>
        service.title.toLowerCase().includes(keyword.toLowerCase()) ||
        service.description.toLowerCase().includes(keyword.toLowerCase())
      );
      return {
        success: true,
        data: filtered,
        pagination: {
          total: filtered.length,
          page: 1,
          limit: 10,
          pages: 1
        }
      };
    }
  },

  // 동년배 통계 조회
  getPeerStatistics: async (age, gender) => {
    try {
      const response = await apiClient.get('/welfare/statistics', {
        params: { age, gender }
      });
      return response.data;
    } catch (error) {
      console.error('동년배 통계 조회 오류:', error);
      return {
        success: true,
        data: getDummyStatistics(age, gender)
      };
    }
  },

  // 복지서비스 데이터 동기화 (관리자용)
  syncWelfareServices: async () => {
    const response = await apiClient.post('/welfare/sync');
    return response.data;
  },
};

// 챗봇 관련 API
export const chatbotAPI = {
  // 챗봇 대화
  sendMessage: async (message, conversationId = null) => {
    const response = await apiClient.post('/chatbot/message', {
      message,
      conversationId
    });
    return response.data;
  },

  // 음성 명령 처리
  processVoiceCommand: async (voiceText, commandType = 'OTHER') => {
    const response = await apiClient.post('/chatbot/voice', {
      voiceText,
      commandType
    });
    return response.data;
  },

  // 대화 내역 조회
  getConversationHistory: async (conversationId) => {
    const response = await apiClient.get(`/chatbot/conversations/${conversationId}`);
    return response.data;
  },
};

// 알림 관련 API
export const notificationAPI = {
  // 알림 목록 조회
  getNotifications: async (params = {}) => {
    const response = await apiClient.get('/notifications', { params });
    return response.data;
  },

  // 알림 읽음 처리
  markAsRead: async (notificationId) => {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // 알림 설정 업데이트
  updateNotificationSettings: async (settings) => {
    const response = await apiClient.put('/notifications/settings', settings);
    return response.data;
  },
};

// 더미 데이터 함수들 (오프라인 또는 서버 오류 시 사용)
const getDummyWelfareServices = () => {
  return [
    {
      serviceId: 'WLF00000001',
      title: '기초연금',
      description: '만 65세 이상 어르신들의 안정된 노후생활을 위한 기초연금 지원',
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
      serviceId: 'WLF00000002',
      title: '노인장기요양보험',
      description: '일상생활이 어려운 노인분들에게 신체활동 또는 가사활동 지원 서비스 제공',
      category: '돌봄서비스',
      target: '만 65세 이상 또는 65세 미만 노인성 질병자',
      amount: '본인부담금 15-20%',
      applicationMethod: '국민건강보험공단 방문 또는 온라인 신청',
      requiredDocuments: '신청서, 의사소견서',
      contactInfo: '국민건강보험공단 1577-1000',
      url: 'https://www.longtermcare.or.kr',
      isEligible: true,
    },
    {
      serviceId: 'WLF00000003',
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
      serviceId: 'WLF00000004',
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
  ];
};

const getDummyStatistics = (age, gender) => {
  // 연령대별 더미 통계 데이터
  const baseStats = {
    totalSpending: 1500000,
    categoryAverages: {
      식료품: 450000,
      교통비: 150000,
      의료비: 200000,
      생활용품: 100000,
      통신비: 80000,
      공과금: 120000,
      문화생활: 100000,
      기타: 80000,
    },
    categoryPercentages: {
      식료품: 30,
      교통비: 10,
      의료비: 13,
      생활용품: 7,
      통신비: 5,
      공과금: 8,
      문화생활: 7,
      기타: 5,
    },
    sampleSize: 1000,
  };

  // 연령대에 따른 조정
  if (age >= 65) {
    baseStats.categoryAverages.의료비 *= 1.5;
    baseStats.categoryAverages.문화생활 *= 0.7;
    baseStats.categoryAverages.교통비 *= 0.8;
  } else if (age >= 50) {
    baseStats.categoryAverages.의료비 *= 1.2;
    baseStats.categoryAverages.생활용품 *= 1.1;
  }

  return baseStats;
};

// 네트워크 상태 확인
export const checkNetworkStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// 에러 처리 헬퍼
export const handleAPIError = (error, customMessage = '오류가 발생했습니다.') => {
  console.error('API 오류:', error);

  if (error.response) {
    // 서버 응답 오류
    const status = error.response.status;
    const message = error.response.data?.message || customMessage;

    if (status === 401) {
      return '인증이 필요합니다. 다시 로그인해주세요.';
    } else if (status === 403) {
      return '권한이 없습니다.';
    } else if (status === 404) {
      return '요청한 정보를 찾을 수 없습니다.';
    } else if (status >= 500) {
      return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }

    return message;
  } else if (error.request) {
    // 네트워크 오류
    return '네트워크 연결을 확인해주세요.';
  } else {
    // 기타 오류
    return customMessage;
  }
};

export default apiClient;