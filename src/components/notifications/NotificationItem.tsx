import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Notification } from '../../services/mockData';
import { Check, CircleAlert as AlertCircle, Bell, Clock } from 'lucide-react-native';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => Promise<void>;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'submission':
        return <Clock size={20} color={theme.colors.accent[500]} />;
      case 'approval':
        return <Check size={20} color={theme.colors.semantic.success} />;
      case 'rejection':
        return <AlertCircle size={20} color={theme.colors.semantic.error} />;
      default:
        return <Bell size={20} color={theme.colors.primary[500]} />;
    }
  };
  
  const formatTimestamp = (date: Date | string) => {
    const now = new Date();
    const timestamp = new Date(date);
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.unreadContainer,
      ]}
      onPress={() => onMarkAsRead(notification.id)}
    >
      <View style={styles.iconContainer}>
        {getNotificationIcon()}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.timestamp}>
          {formatTimestamp(notification.createdAt)}
        </Text>
      </View>
      
      {!notification.read && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.spacing.md,
  },
  unreadContainer: {
    backgroundColor: theme.colors.primary[50],
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.md,
  },
  content: {
    flex: 1,
    marginRight: theme.spacing.spacing.sm,
  },
  title: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.spacing.xs,
  },
  message: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  timestamp: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.textSecondary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary[500],
    marginTop: 4,
  },
});

export default NotificationItem;