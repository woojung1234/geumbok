import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../contexts/UserContext';
import { authAPI, handleAPIError } from '../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userName: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      Alert.alert('입력 오류', '이메일과 비밀번호를 입력해주세요.');
      return false;
    }

    if (!isLogin) {
      if (!formData.userName) {
        Alert.alert('입력 오류', '이름을 입력해주세요.');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
        return false;
      }
      if (formData.password.length < 6) {
        Alert.alert('입력 오류', '비밀번호는 6자 이상이어야 합니다.');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        // 로그인
        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });

        if (response.success) {
          await login(response.token, response.user);
          router.replace('/(tabs)');
        } else {
          Alert.alert('로그인 실패', response.message || '로그인에 실패했습니다.');
        }
      } else {
        // 회원가입
        const response = await authAPI.register({
          email: formData.email,
          password: formData.password,
          userName: formData.userName,
        });

        if (response.success) {
          Alert.alert('회원가입 성공', '회원가입이 완료되었습니다. 로그인해주세요.', [
            { text: '확인', onPress: () => setIsLogin(true) }
          ]);
        } else {
          Alert.alert('회원가입 실패', response.message || '회원가입에 실패했습니다.');
        }
      }
    } catch (error) {
      const errorMessage = handleAPIError(error, isLogin ? '로그인 중 오류가 발생했습니다.' : '회원가입 중 오류가 발생했습니다.');
      Alert.alert('오류', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);

    try {
      // 데모 계정으로 로그인 (실제 서버 없이 테스트용)
      const demoUser = {
        userId: 'demo123',
        userName: '김할머니',
        email: 'demo@geumbok.kr',
        age: 72,
        phone: '010-1234-5678',
      };

      const demoToken = 'demo_token_' + Date.now();

      await login(demoToken, demoUser);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('오류', '데모 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="heart" size={60} color="#2e78b7" />
            </View>
            <Text style={styles.appName}>금복(GEUMBOK)</Text>
            <Text style={styles.appDescription}>
              고령자를 위한 음성 기반 금융 도우미
            </Text>
          </View>

          {/* 폼 전환 탭 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.activeTab]}
              onPress={() => setIsLogin(true)}
            >
              <Text style={[styles.tabText, isLogin && styles.activeTabText]}>
                로그인
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.activeTab]}
              onPress={() => setIsLogin(false)}
            >
              <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>
                회원가입
              </Text>
            </TouchableOpacity>
          </View>

          {/* 입력 폼 */}
          <View style={styles.formContainer}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>이름</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.userName}
                  onChangeText={(text) => handleInputChange('userName', text)}
                  placeholder="이름을 입력하세요"
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>이메일</Text>
              <TextInput
                style={styles.textInput}
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>비밀번호</Text>
              <TextInput
                style={styles.textInput}
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="비밀번호를 입력하세요"
                secureTextEntry
                autoCapitalize="none"
                autoComplete="password"
              />
            </View>

            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>비밀번호 확인</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  placeholder="비밀번호를 다시 입력하세요"
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* 로그인/회원가입 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
              </Text>
            </TouchableOpacity>

            {/* 데모 로그인 버튼 */}
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={loading}
            >
              <Ionicons name="play-circle" size={20} color="#27ae60" />
              <Text style={styles.demoButtonText}>데모 체험하기</Text>
            </TouchableOpacity>

            {/* 비밀번호 찾기 (로그인 모드일 때만) */}
            {isLogin && (
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => Alert.alert('준비 중', '비밀번호 찾기 기능을 준비 중입니다.')}
              >
                <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* 도움말 */}
          <View style={styles.helpContainer}>
            <View style={styles.helpItem}>
              <Ionicons name="mic" size={20} color="#2e78b7" />
              <Text style={styles.helpText}>음성으로 간편하게 가계부 작성</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="heart" size={20} color="#e74c3c" />
              <Text style={styles.helpText}>맞춤형 복지서비스 정보 제공</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#27ae60" />
              <Text style={styles.helpText}>친근한 AI 도우미 금복이</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 30,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#2e78b7',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
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
  submitButton: {
    backgroundColor: '#2e78b7',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#27ae60',
    marginBottom: 15,
  },
  demoButtonText: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  forgotPasswordButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  forgotPasswordText: {
    color: '#2e78b7',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  helpContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
});