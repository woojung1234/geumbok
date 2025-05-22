import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useRecoilState } from 'recoil';
import { userState } from '../store/userState';

const ChatbotScreen = () => {
  const [user] = useRecoilState(userState);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // 초기 메시지 설정
    setMessages([
      {
        id: '1',
        text: '안녕하세요! 금복입니다. 무엇을 도와드릴까요?',
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    // 챗봇 응답 처리 (실제로는 API 호출 필요)
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: '죄송합니다. 현재 개발 중인 기능입니다. 조금만 기다려주세요.',
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);

    // 실제로는 음성인식 로직 구현
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputText('음성 인식 결과가 여기 표시됩니다');
      }, 2000);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.isUser ? styles.userBubble : styles.botBubble
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timestamp}>
        {item.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#adb5bd"
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.micButton, isListening && styles.listeningMic]}
          onPress={toggleListening}
        >
          <Icon name="mic" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messageList: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#e9ecef',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#212529',
  },
  timestamp: {
    fontSize: 10,
    color: '#6c757d',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f1f3f5',
    borderRadius: 24,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  micButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listeningMic: {
    backgroundColor: '#dc3545',
  },
});

export default ChatbotScreen;