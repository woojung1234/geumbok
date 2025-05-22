import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '../contexts/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            title: '로그인',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="voice-input"
          options={{
            title: '음성 입력',
            presentation: 'modal'
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </UserProvider>
  );
}