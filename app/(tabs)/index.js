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
import { useUser } from '../../contexts/UserContext';
import VoiceDemo from '../../components/VoiceDemo';
import QuickStats from '../../components/QuickStats';
import RecentExpenses from '../../components/RecentExpenses';
import NotificationList from '../../components/NotificationList';

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

  const handleVoiceCommand = (command) => {
    // 음성 명령 처리
    console.log('음성 명령:', command);

    if (command.includes('가계부') || command.includes('지출')) {
      router.push('/expenses');
    } else if (command.includes('복지') || command.includes('혜택')) {
      router.push('/welfare');
    } else if (command.includes('금복') || command.includes('대화')) {
      router.push('/chatbot');
    }
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
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications" size={24} color="#666" />
            {dashboardData.notifications.some(n => !n.isRead) && (
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
        <RecentExpenses expenses={dashboardData.recentExpenses} />

        {/* 알림 목록 */}
        <NotificationList notifications={dashboardData.notifications} />
      </ScrollView>

      {/* 음성 데모 버튼 */}
      <View style={styles.voiceDemo}>
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
    padding: 20,
    paddingTop: 10,
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
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
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
  },
  loginButton: {
    backgroundColor: '#2e78b7',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  voiceDemo: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
});