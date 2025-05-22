import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { useRecoilState } from 'recoil';
import { userState } from '../store/userState';
import Icon from 'react-native-vector-icons/Feather';

const HomeScreen = ({ navigation }) => {
  const [user] = useRecoilState(userState);
  const [notifications, setNotifications] = useState([]);
  const [recentConsumption, setRecentConsumption] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 샘플 데이터 설정 (실제로는 API 호출이 필요)
        setNotifications([
          {
            notification_no: 1,
            notification_title: '신규 복지 서비스 안내',
            notification_content: '고령자 대상 신규 복지서비스가 시작되었습니다.',
            created_at: new Date().toISOString(),
            is_read: false
          },
          {
            notification_no: 2,
            notification_title: '소비 패턴 분석',
            notification_content: '지난 달 대비 식비 지출이 10% 증가했습니다.',
            created_at: new Date().toISOString(),
            is_read: true
          }
        ]);

        setRecentConsumption([
          {
            consumption_no: 1,
            consumption_date: new Date().toISOString(),
            category: '식비',
            amount: 15000,
            description: '점심식사'
          },
          {
            consumption_no: 2,
            consumption_date: new Date().toISOString(),
            category: '교통비',
            amount: 1250,
            description: '버스 요금'
          },
          {
            consumption_no: 3,
            consumption_date: new Date().toISOString(),
            category: '생활용품',
            amount: 22000,
            description: '세제구매'
          }
        ]);

        setLoading(false);
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 음성 인식 토글 함수
  const toggleListening = () => {
    setIsListening(!isListening);

    if (!isListening) {
      // 실제로는 음성인식 라이브러리 연동 필요
      setTimeout(() => {
        setIsListening(false);
        navigation.navigate('Chatbot');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 16 }}>로딩 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>안녕하세요, {user.userName}님!</Text>
          <Text style={styles.subGreeting}>오늘도 금복이 함께하겠습니다.</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="list" size={20} color="#007BFF" />
            <Text style={styles.sectionTitle}>최근 소비내역</Text>
          </View>

          {recentConsumption.length > 0 ? (
            recentConsumption.map(item => (
              <View key={item.consumption_no} style={styles.consumptionItem}>
                <Text style={styles.date}>
                  {new Date(item.consumption_date).toLocaleDateString()}
                </Text>
                <View style={styles.consumptionDetails}>
                  <Text style={styles.category}>{item.category}</Text>
                  <Text style={styles.amount}>{item.amount.toLocaleString()}원</Text>
                </View>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>최근 소비내역이 없습니다.</Text>
          )}

          <TouchableOpacity
            style={styles.viewMoreButton}
            onPress={() => navigation.navigate('Consumption')}
          >
            <Text style={styles.viewMoreText}>더 보기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="bell" size={20} color="#007BFF" />
            <Text style={styles.sectionTitle}>알림</Text>
          </View>

          {notifications.length > 0 ? (
            notifications.map(notification => (
              <View
                key={notification.notification_no}
                style={[
                  styles.notificationItem,
                  notification.is_read ? styles.read : styles.unread
                ]}
              >
                <Text style={styles.notificationTitle}>
                  {notification.notification_title}
                </Text>
                <Text style={styles.notificationContent}>
                  {notification.notification_content}
                </Text>
                <Text style={styles.notificationTime}>
                  {new Date(notification.created_at).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyMessage}>새 알림이 없습니다.</Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Chatbot')}
          >
            <Icon name="message-circle" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>챗봇 대화하기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Welfare')}
          >
            <Icon name="heart" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>복지서비스 보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.floatingButton, isListening && styles.listeningButton]}
        onPress={toggleListening}
      >
        <Icon name="mic" size={24} color="#fff" />
      </TouchableOpacity>
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
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 8,
  },
  section: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343a40',
    marginLeft: 8,
  },
  consumptionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  date: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  consumptionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: '#343a40',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
  },
  notificationItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  unread: {
    borderLeftWidth: 3,
    borderLeftColor: '#007BFF',
  },
  read: {
    opacity: 0.6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 4,
  },
  notificationContent: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#adb5bd',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 14,
    paddingVertical: 20,
  },
  viewMoreButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  viewMoreText: {
    color: '#007BFF',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
    marginBottom: 80,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  listeningButton: {
    backgroundColor: '#dc3545',
  },
});

export default HomeScreen;