import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>🔍 Discover financial tools</Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>📈 Analytics</Text>
          <Text style={styles.cardText}>
            View detailed analytics of your spending patterns and financial trends.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>💳 Expense Tracking</Text>
          <Text style={styles.cardText}>
            Keep track of all your expenses and categorize them for better organization.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>🎯 Budget Planning</Text>
          <Text style={styles.cardText}>
            Set monthly budgets and receive alerts when you're approaching your limits.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          <Text style={styles.cardTitle}>💰 Investment Tracking</Text>
          <Text style={styles.cardText}>
            Monitor your investments and track their performance over time.
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
  cardContainer: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#5a6c7d',
    lineHeight: 20,
  },
});