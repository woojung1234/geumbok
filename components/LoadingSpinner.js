import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

const LoadingSpinner = ({ message = '로딩 중...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2e78b7" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  message: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
});

export default LoadingSpinner;