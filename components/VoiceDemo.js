import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { voiceService } from '../services/voiceService';

const VoiceDemo = ({ onVoiceCommand }) => {
  const [showDemo, setShowDemo] = useState(false);

  // 데모 명령어 목록
  const demoCommands = [
    {
      category: '지출 입력',
      commands: [
        '커피 5000원 샀어',
        '점심 12000원 지출',
        '버스카드 충전 10000원',
        '마트 장보기 45000원',
        '병원비 15000원 결제',
      ]
    },
    {
      category: '조회 명령',
      commands: [
        '가계부 보여줘',
        '이번 달 지출 얼마야',
        '복지서비스 알려줘',
        '통계 보여줘',
      ]
    },
    {
      category: '일반 대화',
      commands: [
        '금복아 안녕',
        '도움말',
        '사용법 알려줘',
        '고마워',
      ]
    }
  ];

  const handleDemoCommand = (command) => {
    // 음성 명령 파싱
    const parsedCommand = voiceService.parseVoiceCommand(command);

    // 응답 생성
    const response = voiceService.generateResponse(parsedCommand);

    // TTS로 응답
    voiceService.speak(response);

    // 부모 컴포넌트에 알림
    if (onVoiceCommand) {
      onVoiceCommand(command, parsedCommand);
    }

    // 모달 닫기
    setShowDemo(false);

    // 결과 표시
    Alert.alert(
      '음성 명령 처리 완료',
      `명령: ${command}\n응답: ${response}`,
      [{ text: '확인' }]
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.demoButton} onPress={() => setShowDemo(true)}>
        <Ionicons name="list" size={20} color="#27ae60" />
        <Text style={styles.demoButtonText}>음성 명령 예시</Text>
      </TouchableOpacity>

      <Modal
        visible={showDemo}
        animationType="slide"
        onRequestClose={() => setShowDemo(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowDemo(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>음성 명령 예시</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.noticeCard}>
              <Ionicons name="information-circle" size={24} color="#2e78b7" />
              <View style={styles.noticeText}>
                <Text style={styles.noticeTitle}>음성 인식 안내</Text>
                <Text style={styles.noticeDescription}>
                  현재 Expo 환경에서는 웹 브라우저에서만 실제 음성 인식이 가능합니다.
                  모바일에서는 아래 예시 명령어를 터치하여 테스트할 수 있습니다.
                </Text>
              </View>
            </View>

            {demoCommands.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.category}</Text>
                {section.commands.map((command, commandIndex) => (
                  <TouchableOpacity
                    key={commandIndex}
                    style={styles.commandButton}
                    onPress={() => handleDemoCommand(command)}
                  >
                    <View style={styles.commandContent}>
                      <Ionicons name="mic" size={16} color="#2e78b7" />
                      <Text style={styles.commandText}>{command}</Text>
                    </View>
                    <Ionicons name="play-circle" size={20} color="#27ae60" />
                  </TouchableOpacity>
                ))}
              </View>
            ))}

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 음성 명령 팁</Text>
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>• "항목명 + 금액 + 원" 형태로 말하세요</Text>
                <Text style={styles.tipItem}>• 예: "커피 3000원", "점심 8000원"</Text>
                <Text style={styles.tipItem}>• 자동으로 카테고리가 분류됩니다</Text>
                <Text style={styles.tipItem}>• "가계부 보여줘", "복지서비스 알려줘" 등 조회 가능</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27ae60',
    marginTop: 10,
  },
  demoButtonText: {
    color: '#27ae60',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#e8f4fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    marginLeft: 12,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e78b7',
    marginBottom: 5,
  },
  noticeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  commandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  commandContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  commandText: {
    fontSize: 16,
    color: '#2c3e50',
    marginLeft: 10,
  },
  tipsCard: {
    backgroundColor: '#fff5e6',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e67e22',
    marginBottom: 10,
  },
  tipsList: {
    marginLeft: 5,
  },
  tipItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 5,
  },
});

export default VoiceDemo;