import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

// 스크린 임포트
import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import WelfareScreen from '../screens/WelfareScreen';
import ConsumptionScreen from '../screens/ConsumptionScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Chatbot') {
            iconName = 'message-circle';
          } else if (route.name === 'Welfare') {
            iconName = 'heart';
          } else if (route.name === 'Consumption') {
            iconName = 'list';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: '챗봇' }} />
      <Tab.Screen name="Welfare" component={WelfareScreen} options={{ title: '복지서비스' }} />
      <Tab.Screen name="Consumption" component={ConsumptionScreen} options={{ title: '소비내역' }} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;