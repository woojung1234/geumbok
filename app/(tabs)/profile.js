import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../../contexts/UserContext';
import { authAPI, notificationAPI } from '../../services/api';

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const router = useRouter();
  const [settings, setSettings] = useState({
    voiceEnabled: true,
    ttsEnabled: true,
    notificationsEnabled: true,
    welfareNotifications: true,
    expenseReminders: true,
    fontSize: 'medium',
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState({
    userName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      setEditingProfile({
        userName: user.userName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/login');
            } catch (error) {
              Alert.alert('오류', '로그아웃 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const handleSettingChange = async (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));

    try {
      // 설정을 서버에 저장
      await notificationAPI.updateNotificationSettings({ [key]: value });
    } catch (error) {
      console.error('설정 저장 오류:', error);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await authAPI.updateProfile(editingProfile);
      setShowEditModal(false);
      Alert.alert('성공', '프로필이 업데이트되었습니다.');
    } catch (error) {
      Alert.alert('오류', '프로필 업데이트 중 오류가 발생했습니다.');
    }
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={20} color="#2e78b7" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </TouchableOpacity>
  );

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
      <ScrollView style={styles.scrollView}>
        {/* 프로필 헤더 */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#2e78b7" />
          </View>
          <Text style={styles.userName}>{user.userName || '사용자'}</Text>
          <Text style={styles.userEmail}>{user.email || ''}</Text>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setShowEditModal(true)}
          >
            <Text style={styles.editProfileText}>프로필 편집</Text>
          </TouchableOpacity>
        </View>

        {/* 앱 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 설정</Text>

          <SettingItem
            icon="mic"
            title="음성 입력"
            subtitle="음성으로 지출을 입력하고 명령을 실행합니다"
            rightComponent={
              <Switch
                value={settings.voiceEnabled}
                onValueChange={(value) => handleSettingChange('voiceEnabled', value)}
                trackColor={{ false: '#ccc', true: '#2e78b7' }}
              />
            }
          />

          <SettingItem
            icon="volume-high"
            title="음성 응답"
            subtitle="금복이의 답변을 소리로 들려줍니다"
            rightComponent={
              <Switch
                value={settings.ttsEnabled}
                onValueChange={(value) => handleSettingChange('ttsEnabled', value)}
                trackColor={{ false: '#ccc', true: '#2e78b7' }}
              />
            }
          />

          <SettingItem
            icon="text"
            title="글자 크기"
            subtitle={`현재: ${settings.fontSize === 'small' ? '작게' : settings.fontSize === 'large' ? '크게' : '보통'}`}
            onPress={() => {
              Alert.alert(
                '글자 크기 설정',
                '글자 크기를 선택해주세요',
                [
                  { text: '작게', onPress: () => handleSettingChange('fontSize', 'small') },
                  { text: '보통', onPress: () => handleSettingChange('fontSize', 'medium') },
                  { text: '크게', onPress: () => handleSettingChange('fontSize', 'large') },
                  { text: '취소', style: 'cancel' },
                ]
              );
            }}
          />
        </View>

        {/* 알림 설정 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>알림 설정</Text>

          <SettingItem
            icon="notifications"
            title="알림 받기"
            subtitle="앱에서 보내는 알림을 받습니다"
            rightComponent={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={(value) => handleSettingChange('notificationsEnabled', value)}
                trackColor={{ false: '#ccc', true: '#2e78b7' }}
              />
            }
          />

          <SettingItem
            icon="heart"
            title="복지서비스 알림"
            subtitle="새로운 복지서비스 정보를 알려줍니다"
            rightComponent={
              <Switch
                value={settings.welfareNotifications}
                onValueChange={(value) => handleSettingChange('welfareNotifications', value)}
                trackColor={{ false: '#ccc', true: '#2e78b7' }}
              />
            }
          />

          <SettingItem
            icon="receipt"
            title="지출 알림"
            subtitle="정기적인 지출 입력을 리마인드합니다"
            rightComponent={
              <Switch
                value={settings.expenseReminders}
                onValueChange={(value) => handleSettingChange('expenseReminders', value)}
                trackColor={{ false: '#ccc', true: '#2e78b7' }}
              />
            }
          />
        </View>

        {/* 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>

          <SettingItem
            icon="help-circle"
            title="도움말"
            subtitle="앱 사용법을 확인합니다"
            onPress={() => Alert.alert('도움말', '도움말 페이지를 준비 중입니다.')}
          />

          <SettingItem
            icon="document-text"
            title="이용약관"
            onPress={() => Alert.alert('이용약관', '이용약관을 준비 중입니다.')}
          />

          <SettingItem
            icon="shield-checkmark"
            title="개인정보처리방침"
            onPress={() => Alert.alert('개인정보처리방침', '개인정보처리방침을 준비 중입니다.')}
          />

          <SettingItem
            icon="information-circle"
            title="앱 정보"
            subtitle="버전 1.0.0"
            onPress={() => Alert.alert('앱 정보', '금복(GEUMBOK) v1.0.0\n고령자를 위한 음성 기반 금융 도우미')}
          />
        </View>

        {/* 로그아웃 */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#e74c3c" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 프로필 편집 모달 */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>프로필 편집</Text>
            <TouchableOpacity onPress={handleProfileUpdate}>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이름</Text>
              <TextInput
                style={styles.textInput}
                value={editingProfile.userName}
                onChangeText={(text) => setEditingProfile(prev => ({...prev, userName: text}))}
                placeholder="이름을 입력하세요"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
                style={styles.textInput}
                value={editingProfile.email}
                onChangeText={(text) => setEditingProfile(prev => ({...prev, email: text}))}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>전화번호</Text>
              <TextInput
                style={styles.textInput}
                value={editingProfile.phone}
                onChangeText={(text) => setEditingProfile(prev => ({...prev, phone: text}))}
                placeholder="전화번호를 입력하세요"
                keyboardType="phone-pad"
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  editProfileButton: {
    backgroundColor: '#2e78b7',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginLeft: 10,
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
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});