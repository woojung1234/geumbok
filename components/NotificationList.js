import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NotificationList = ({ notifications = [] }) => {
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
      <View style={styles.notificationIcon}>
        <Ionicons
          name={getNotificationIcon(item.type)}
          size={16}
          color={item.isRead ? '#666' : '#2e78b7'}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, !item.isRead && styles.unreadText]}>
          {item.title}
        </Text>
        <Text style={styles.notificationText} numberOfLines={2}>
          {item.content}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'welfare': return 'heart';
      case 'expense': return 'receipt';
      case 'reminder': return 'alarm';
      default: return 'notifications';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림</Text>
      <FlatList
        data={notifications.slice(0, 3)}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id ? item.id.toString() : Math.random().toString()}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>새로운 알림이 없습니다.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: '#f8f9ff',
  },
  notificationIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '600',
    color: '#2e78b7',
  },
  notificationText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2e78b7',
    position: 'absolute',
    right: 10,
    top: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    padding: 20,
  },
});

export default NotificationList;