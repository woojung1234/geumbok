import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import Voice from '@react-native-voice/voice';

const VoiceButton = ({ onVoiceCommand, style }) => {
  const [isListening, setIsListening] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [pulseAnim] = useState(new Animated.Value(1));
  const [recognizedText, setRecognizedText] = useState('');

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (isListening) {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [isListening]);

  const onSpeechStart = () => {
    console.log('음성 인식 시작');
    setIsListening(true);
  };

  const onSpeechRecognized = () => {
    console.log('음성 인식됨');
  };

  const onSpeechEnd = () => {
    console.log('음성 인식 종료');
    setIsListening(false);
  };

  const onSpeechError = (error) => {
    console.log('음성 인식 오류:', error);
    setIsListening(false);
    Alert.alert('음성 인식 오류', '다시 시도해주세요.');
  };

  const onSpeechResults = (event) => {
    console.log('음성 인식 결과:', event.value);
    const result = event.value[0];
    setRecognizedText(result);

    if (onVoiceCommand) {
      onVoiceCommand(result);
    }

    // TTS로 응답
    speakResponse(result);
  };

  const speakResponse = (text) => {
    let response = '무엇을 도와드릴까요?';

    if (text.includes('가계부') || text.includes('지출')) {
      response = '가계부 화면으로 이동합니다.';
    } else if (text.includes('복지') || text.includes('혜택')) {
      response = '복지서비스 화면으로 이동합니다.';
    } else if (text.includes('금복') || text.includes('대화')) {
      response = '금복이와 대화를 시작합니다.';
    } else if (text.includes('안녕')) {
      response = '안녕하세요! 금복입니다. 무엇을 도와드릴까요?';
    }

    Speech.speak(response, {
      language: 'ko-KR',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  const startListening = async () => {
    try {
      setRecognizedText('');
      await Voice.start('ko-KR');

      // 버튼 애니메이션
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

    } catch (error) {
      console.error('음성 인식 시작 오류:', error);
      Alert.alert('오류', '음성 인식을 시작할 수 없습니다.');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('음성 인식 중지 오류:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    pulseAnim.setValue(1);
  };

  const handlePress = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <View style={[styles.container, style]}>
      {recognizedText !== '' && (
        <View style={styles.textContainer}>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [
              { scale: scaleAnim },
              { scale: pulseAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.voiceButton,
            isListening ? styles.voiceButtonActive : null,
          ]}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isListening ? 'stop' : 'mic'}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>
      </Animated.View>

      {isListening && (
        <View style={styles.listeningIndicator}>
          <Text style={styles.listeningText}>듣고 있습니다...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'center',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: 200,
  },
  recognizedText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  voiceButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2e78b7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonActive: {
    backgroundColor: '#e74c3c',
  },
  listeningIndicator: {
    backgroundColor: 'rgba(46, 120, 183, 0.9)',
    padding: 8,
    borderRadius: 15,
    marginTop: 10,
  },
  listeningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default VoiceButton;