import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Animated, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import NotificationItem from './NotificationItem';
import Button from '../ui/Button';
import useNotifications from '../../hooks/useNotifications';
import { Notification } from '../../services/mockData';
import { Bell, Check, Trash2 } from 'lucide-react-native';

interface NotificationCenterProps {
  onClose: () => void;
  visible: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onClose,
  visible,
}) => {
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 10,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  
  const handleMarkAllAsRead = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(unreadNotifications.map(n => markAsRead(n.id)));
      await refreshNotifications();
    } catch (err: any) {
      setError(err.message || 'Failed to mark notifications as read');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClearAll = async () => {
    // Clear all read notifications
    console.log('Clearing all read notifications');
  };
  
  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onMarkAsRead={markAsRead}
    />
  );
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
          opacity: slideAnim,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Bell size={20} color={theme.colors.textPrimary} />
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actions}>
        <Button
          title="Mark All as Read"
          size="sm"
          variant="outline"
          leftIcon={<Check size={16} color={theme.colors.primary[500]} />}
          onPress={handleMarkAllAsRead}
          disabled={unreadCount === 0 || loading}
          style={styles.actionButton}
        />
        <Button
          title="Clear All"
          size="sm"
          variant="outline"
          leftIcon={<Trash2 size={16} color={theme.colors.primary[500]} />}
          onPress={handleClearAll}
          disabled={notifications.length === 0 || loading}
          style={styles.actionButton}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.notificationsList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No notifications to show
            </Text>
          </View>
        )}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 60 : 80,
    right: theme.spacing.spacing.md,
    width: 400,
    maxHeight: 600,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    ...theme.spacing.shadow.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.spacing.sm,
  },
  unreadBadge: {
    backgroundColor: theme.colors.semantic.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.spacing.sm,
  },
  unreadCount: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
    paddingHorizontal: theme.spacing.spacing.xs,
  },
  closeButton: {
    padding: theme.spacing.spacing.xs,
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  notificationsList: {
    paddingVertical: theme.spacing.spacing.sm,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.spacing.xs,
  },
  emptyState: {
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    textAlign: 'center',
    padding: theme.spacing.spacing.sm,
  },
});

export default NotificationCenter;