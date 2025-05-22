import React from 'react';
import { RecoilRoot } from 'recoil';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './app/navigation/AppNavigator';

const App = () => {
  return (
    <RecoilRoot>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </RecoilRoot>
  );
};

export default App;