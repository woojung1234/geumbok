import * as Speech from 'expo-speech';
import { Platform, Alert } from 'react-native';

// TTS 서비스 (Expo에서 완전 지원)
export const ttsService = {
  // 텍스트를 음성으로 변환
  speak: (text, options = {}) => {
    const defaultOptions = {
      language: 'ko-KR',
      pitch: 1.0,
      rate: 0.8,
      ...options,
    };

    Speech.speak(text, defaultOptions);
  },

  // 음성 중지
  stop: () => {
    Speech.stop();
  },

  // 사용 가능한 언어 목록 가져오기
  getAvailableLanguages: async () => {
    try {
      const languages = await Speech.getAvailableLanguagesAsync();
      return languages;
    } catch (error) {
      console.error('언어 목록 조회 실패:', error);
      return ['ko-KR', 'en-US'];
    }
  },

  // 음성 상태 확인
  isSpeaking: () => {
    return Speech.isSpeakingAsync();
  },
};

// STT 서비스 (제한적 지원)
export const sttService = {
  // 음성 인식 가능 여부 확인
  isSupported: () => {
    if (Platform.OS === 'web') {
      return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
    return false; // Expo Go에서는 지원 안 함
  },

  // 웹에서 음성 인식 시작
  startWebRecognition: (callbacks = {}) => {
    if (!sttService.isSupported()) {
      Alert.alert('지원하지 않음', '이 환경에서는 음성 인식이 지원되지 않습니다.');
      return null;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // 설정
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // 이벤트 핸들러
    recognition.onstart = () => {
      console.log('음성 인식 시작');
      callbacks.onStart && callbacks.onStart();
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      console.log('인식 결과:', result);
      callbacks.onResult && callbacks.onResult(result);
    };

    recognition.onerror = (event) => {
      console.error('음성 인식 오류:', event.error);
      callbacks.onError && callbacks.onError(event.error);
    };

    recognition.onend = () => {
      console.log('음성 인식 종료');
      callbacks.onEnd && callbacks.onEnd();
    };

    recognition.start();
    return recognition;
  },

  // 모바일용 시뮬레이션 모드
  startSimulation: (callbacks = {}) => {
    callbacks.onStart && callbacks.onStart();

    // 데모용 음성 명령어들
    const demoCommands = [
      '커피 5000원 샀어',
      '점심 12000원 지출',
      '버스카드 충전 10000원',
      '마트 장보기 45000원',
      '병원비 15000원',
      '가계부 보여줘',
      '복지서비스 알려줘',
      '이번 달 지출 얼마야',
      '금복아 안녕',
      '도움말',
    ];

    // 2초 후 랜덤 명령어 반환
    setTimeout(() => {
      const randomCommand = demoCommands[Math.floor(Math.random() * demoCommands.length)];
      callbacks.onResult && callbacks.onResult(randomCommand);
      callbacks.onEnd && callbacks.onEnd();
    }, 2000);
  },
};

// 통합 음성 서비스
export const voiceService = {
  // 음성 인식 시작 (환경에 따라 자동 선택)
  startRecognition: (callbacks = {}) => {
    if (Platform.OS === 'web' && sttService.isSupported()) {
      return sttService.startWebRecognition(callbacks);
    } else {
      // 모바일에서는 시뮬레이션 모드
      sttService.startSimulation(callbacks);
      return null;
    }
  },

  // 텍스트를 음성으로 변환
  speak: (text, options = {}) => {
    return ttsService.speak(text, options);
  },

  // 음성 중지
  stop: () => {
    ttsService.stop();
  },

  // 음성 명령어 파싱
  parseVoiceCommand: (text) => {
    const command = {
      type: 'unknown',
      data: null,
    };

    // 지출 관련 명령어 파싱
    const expenseMatch = text.match(/(.+?)(\d+)원/);
    if (expenseMatch) {
      const [, description, amount] = expenseMatch;
      command.type = 'expense';
      command.data = {
        description: description.trim(),
        amount: parseInt(amount),
        category: parseCategory(description),
      };
      return command;
    }

    // 조회 명령어
    if (text.includes('가계부') || text.includes('지출')) {
      command.type = 'view_expenses';
      return command;
    }

    if (text.includes('복지') || text.includes('혜택')) {
      command.type = 'view_welfare';
      return command;
    }

    if (text.includes('통계') || text.includes('분석')) {
      command.type = 'view_stats';
      return command;
    }

    if (text.includes('도움') || text.includes('사용법')) {
      command.type = 'help';
      return command;
    }

    // 인사말
    if (text.includes('안녕') || text.includes('금복')) {
      command.type = 'greeting';
      return command;
    }

    return command;
  },

  // 응답 생성
  generateResponse: (command) => {
    switch (command.type) {
      case 'expense':
        return `${command.data.description} ${command.data.amount}원이 ${command.data.category} 항목으로 등록되었습니다.`;

      case 'view_expenses':
        return '가계부 화면으로 이동합니다.';

      case 'view_welfare':
        return '복지서비스 화면으로 이동합니다.';

      case 'view_stats':
        return '통계 화면으로 이동합니다.';

      case 'help':
        return '음성으로 "커피 5000원 샀어"라고 말하면 지출이 자동으로 등록됩니다. 가계부 보기, 복지서비스 확인 등도 가능합니다.';

      case 'greeting':
        return '안녕하세요! 금복입니다. 무엇을 도와드릴까요?';

      default:
        return '잘 이해하지 못했습니다. 다시 말씀해 주세요.';
    }
  },
};

// 카테고리 추론 함수
const parseCategory = (description) => {
  const categoryMap = {
    '식료품': ['커피', '음식', '식사', '마트', '장보기', '빵', '우유', '과일'],
    '교통비': ['버스', '지하철', '택시', '주유', '버스카드', '교통카드'],
    '의료비': ['병원', '약국', '의료', '치료', '진료', '약'],
    '생활용품': ['세제', '화장지', '샴푸', '비누', '생활용품'],
    '통신비': ['휴대폰', '인터넷', '전화', '통신'],
    '공과금': ['전기', '가스', '수도', '관리비'],
    '문화생활': ['영화', '책', '음악', '게임', '문화'],
  };

  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => description.includes(keyword))) {
      return category;
    }
  }

  return '기타';
};

export default voiceService;