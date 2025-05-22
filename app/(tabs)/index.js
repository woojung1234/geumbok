import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext.js';
import VoiceDemo from '../../components/VoiceDemo.js'; // 이 부분은 이미 올바르게 되어 있습니다.
import QuickStats from '../../components/QuickStats.js';
import RecentExpenses from '../../components/RecentExpenses.js';
import NotificationList from '../../components/NotificationList.js';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    recentExpenses: [],
    notifications: [],
    monthlyTotal: 0,
    todayTotal: 0,
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // API 호출로 대시보드 데이터 로드
      // 임시 데이터
      setDashboardData({
        recentExpenses: [
          {
            id: 1,
            description: '마트 장보기',
            amount: 45000,
            category: '식료품',
            date: new Date().toISOString(),
          },
          {
            id: 2,
            description: '병원비',
            amount: 15000,
            category: '의료',
            date: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
        notifications: [
          {
            id: 1,
            title: '복지서비스 알림',
            content: '새로운 노인복지 혜택이 있습니다.',
            isRead: false,
            createdAt: new Date().toISOString(),
          },
        ],
        monthlyTotal: 450000,
        todayTotal: 45000,
      });
    } catch (error) {
      console.error('대시보드 데이터 로드 실패:', error);
      Alert.alert('오류', '데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // VoiceDemo에서 command (문자열)만 받도록 수정했으므로, parsedCommand는 여기서 사용하지 않습니다.
  const handleVoiceCommand = (command) => {
    console.log('음성 명령:', command);

    if (command.includes('가계부') || command.includes('지출')) {
      router.push('/expenses');
    } else if (command.includes('복지') || command.includes('혜택')) {
      router.push('/welfare');
    } else if (command.includes('금복') || command.includes('대화')) {
      router.push('/chatbot');
    }
    // 필요하다면 여기서 voiceService.parseVoiceCommand(command)를 호출하여
    // parsedCommand를 활용할 수 있습니다.
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Ionicons name="person-circle" size={80} color="#ccc" />
          <Text style={styles.loginText}>로그인이 필요합니다</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 80 }} // VoiceDemo 버튼이 가리지 않도록 패딩 추가
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요,</Text>
            <Text style={styles.userName}>{user.userName || '사용자'}님!</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#666" />
            {dashboardData.notifications.filter(n => !n.isRead).length > 0 && (
              <View style={styles.notificationBadge} />
            )}
          </TouchableOpacity>
        </View>

        {/* 빠른 통계 */}
        <QuickStats
          monthlyTotal={dashboardData.monthlyTotal}
          todayTotal={dashboardData.todayTotal}
        />

        {/* 빠른 액션 버튼들 */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/expenses')}
          >
            <Ionicons name="receipt" size={24} color="#2e78b7" />
            <Text style={styles.actionButtonText}>가계부</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/chatbot')}
          >
            <Ionicons name="chatbubble-ellipses" size={24} color="#2e78b7" />
            <Text style={styles.actionButtonText}>금복이</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/welfare')}
          >
            <Ionicons name="heart" size={24} color="#2e78b7" />
            <Text style={styles.actionButtonText}>복지서비스</Text>
          </TouchableOpacity>
        </View>

        {/* 최근 지출 내역 */}
        <RecentExpenses expenses={dashboardData.recentExpenses} router={router} />

        {/* 알림 목록 */}
        <NotificationList notifications={dashboardData.notifications} router={router} />
      </ScrollView>

      {/* 음성 데모 버튼 - 화면 하단에 고정 */}
      <View style={styles.voiceDemoContainer}>
        <VoiceDemo onVoiceCommand={handleVoiceCommand} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 4,
  },
  notificationIcon: {
    position: 'relative',
    padding: 5, // 터치 영역 확보
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
    borderWidth: 1,
    borderColor: '#fff'
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15, // 양쪽 간격 살짝 줄임
    marginBottom: 25,
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#fff',
    paddingVertical: 15, // 세로 패딩 살짝 줄임
    paddingHorizontal: 10, // 가로 패딩
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5, // 버튼 사이 간격
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1, // 그림자 약하게
    },
    shadowOpacity: 0.05, // 그림자 더 약하게
    shadowRadius: 2, // 그림자 부드럽게
    elevation: 2, // 안드로이드 그림자
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 13, // 폰트 크기 살짝 줄임
    fontWeight: '600',
    color: '#2c3e50',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loginText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#2e78b7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // VoiceDemo 버튼을 담을 컨테이너 스타일 수정
  voiceDemoContainer: {
    position: 'absolute',
    bottom: 20, // 하단 여백
    right: 20,  // 우측 여백
    // backgroundColor: 'transparent', // 필요한 경우 배경색 설정
  },
});