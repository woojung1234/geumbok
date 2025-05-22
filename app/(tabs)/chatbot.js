import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useUser } from '../../contexts/UserContext';

export default function ChatbotScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTTSEnabled, setIsTTSEnabled] = useState(true);
  const scrollViewRef = useRef();

  useEffect(() => {
    // 초기 인사 메시지
    setMessages([
      {
        id: 1,
        text: `안녕하세요 ${user?.userName || '고객'}님! 저는 금복이입니다. 가계부 관리나 복지서비스에 대해 궁금한 것이 있으시면 언제든 말씀해 주세요.`,
        isBot: true,
        timestamp: new Date(),
      },
    ]);
  }, [user]);

  const startListening = async () => {
    if (Platform.OS === 'web') {
      // 웹에서는 Web Speech API 사용
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = 'ko-KR';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event) => {
          const result = event.results[0][0].transcript;
          setInputText(result);
          handleSendMessage(result);
        };
        recognition.onerror = () => {
          setIsListening(false);
          Alert.alert('음성 인식 오류', '다시 시도해주세요.');
        };
        recognition.onend = () => setIsListening(false);

        recognition.start();
      } else {
        Alert.alert('지원하지 않음', '이 브라우저는 음성 인식을 지원하지 않습니다.');
      }
    } else {
      // 모바일에서는 시뮬레이션
      setIsListening(true);
      setTimeout(() => {
        const demoCommands = [
          '커피 5000원 샀어',
          '가계부 보여줘',
          '복지서비스 알려줘',
          '안녕하세요'
        ];
        const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
        setInputText(randomCommand);
        handleSendMessage(randomCommand);
        setIsListening(false);
      }, 2000);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // GPT API 호출 (실제 구현시)
      const response = await getBotResponse(text.trim());

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

      // TTS 재생
      if (isTTSEnabled) {
        Speech.speak(response, {
          language: 'ko-KR',
          pitch: 1.0,
          rate: 0.8,
        });
      }
    } catch (error) {
      console.error('챗봇 응답 오류:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '죄송합니다. 현재 서비스에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getBotResponse = async (userInput) => {
    // 실제로는 GPT API 호출
    // 임시 응답 로직
    const input = userInput.toLowerCase();

    if (input.includes('가계부') || input.includes('지출') || input.includes('소비')) {
      return '가계부 관리에 대해 궁금하시군요! 음성으로 "커피 5000원 샀어"라고 말씀하시면 자동으로 지출이 기록됩니다. 또한 월별, 카테고리별 지출 분석도 제공해드립니다.';
    } else if (input.includes('복지') || input.includes('혜택') || input.includes('지원')) {
      return '복지서비스 정보를 찾아드릴게요. 고령자를 위한 다양한 복지혜택이 있습니다. 기초연금, 노인돌봄서비스, 의료비 지원 등이 있는데, 어떤 분야가 궁금하신가요?';
    } else if (input.includes('안녕') || input.includes('반가')) {
      return '안녕하세요! 만나서 반갑습니다. 오늘도 건강하게 지내고 계신가요? 무엇을 도와드릴까요?';
    } else if (input.includes('고마워') || input.includes('감사')) {
      return '천만에요! 언제든지 궁금한 것이 있으시면 말씀해 주세요. 항상 도와드릴 준비가 되어 있습니다.';
    } else {
      return '네, 잘 들었습니다. 가계부 관리나 복지서비스에 대해 더 자세히 알고 싶으시면 언제든 말씀해 주세요. 구체적으로 어떤 도움이 필요하신가요?';
    }
  };

  const toggleTTS = () => {
    setIsTTSEnabled(!isTTSEnabled);
    Speech.stop();
  };

  const handleVoicePress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#2e78b7" />
          <Text style={styles.headerTitle}>금복이</Text>
        </View>
        <TouchableOpacity onPress={toggleTTS} style={styles.ttsButton}>
          <Ionicons
            name={isTTSEnabled ? "volume-high" : "volume-mute"}
            size={24}
            color={isTTSEnabled ? "#2e78b7" : "#ccc"}
          />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isBot ? styles.botMessage : styles.userMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  message.isBot ? styles.botBubble : styles.userBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.isBot ? styles.botText : styles.userText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}

          {isLoading && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View style={[styles.messageBubble, styles.botBubble]}>
                <Text style={styles.loadingText}>금복이가 생각중입니다...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            multiline
            maxLength={500}
          />

          <TouchableOpacity
            style={[
              styles.voiceButton,
              isListening && styles.voiceButtonActive,
            ]}
            onPress={handleVoicePress}
          >
            <Ionicons
              name={isListening ? "stop" : "mic"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sendButton,
              !inputText.trim() && styles.sendButtonDisabled,
            ]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  ttsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 15,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
  },
  userBubble: {
    backgroundColor: '#2e78b7',
    borderBottomRightRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#2c3e50',
  },
  userText: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 11,
    color: '#999',
    marginTop: 5,
    textAlign: 'right',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2e78b7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  voiceButtonActive: {
    backgroundColor: '#e74c3c',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2e78b7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});