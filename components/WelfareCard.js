import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WelfareCard = ({ service, onPress, isRecommended = false }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case '건강의료': return 'medical';
      case '생활지원': return 'home';
      case '주거복지': return 'business';
      case '경제지원': return 'card';
      case '사회참여': return 'people';
      case '돌봄서비스': return 'heart';
      default: return 'information-circle';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, isRecommended && styles.recommendedCard]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isRecommended && (
        <View style={styles.recommendedBadge}>
          <Ionicons name="star" size={12} color="#fff" />
          <Text style={styles.recommendedText}>추천</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Ionicons
            name={getCategoryIcon(service.category)}
            size={20}
            color="#2e78b7"
          />
          <Text style={styles.title}>{service.title}</Text>
        </View>

        {service.isEligible && (
          <View style={styles.eligibleBadge}>
            <Text style={styles.eligibleText}>신청가능</Text>
          </View>
        )}
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {service.description}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="person" size={14} color="#666" />
          <Text style={styles.infoText}>{service.target}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="cash" size={14} color="#666" />
          <Text style={styles.infoText}>{service.amount}</Text>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>{service.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
  },
  recommendedCard: {
    borderWidth: 2,
    borderColor: '#f39c12',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 15,
    backgroundColor: '#f39c12',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  eligibleBadge: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eligibleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    flex: 1,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 12,
    color: '#2e78b7',
    fontWeight: '500',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});

export default WelfareCard;