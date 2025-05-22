import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Finance Assistant</Text>
          <Text style={styles.subtitle}>💰 Welcome to your finance helper!</Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>📊 Track your expenses</Text>
          <Text style={styles.stepText}>
            Monitor your spending and keep track of your financial goals.
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>🎯 Set budgets</Text>
          <Text style={styles.stepText}>
            Create budgets for different categories and stick to your limits.
          </Text>
        </View>
        
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>💡 Get insights</Text>
          <Text style={styles.stepText}>
            Receive personalized insights about your spending patterns.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  stepContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 14,
    color: '#5a6c7d',
    lineHeight: 20,
  },
});
