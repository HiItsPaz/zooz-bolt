import { Notification } from '../services/mockData';
import { lightTheme as theme } from '../styles/theme';

// Format notification timestamp
export const formatNotificationTime = (timestamp: Date | string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diff = now.getTime() - date.getTime();
  
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
    return date.toLocaleDateString();
  }
};

// Get notification color based on type
export const getNotificationColor = (type: string): string => {
  switch (type) {
    case 'submission':
      return theme.colors.accent[500];
    case 'approval':
      return theme.colors.semantic.success;
    case 'rejection':
      return theme.colors.semantic.error;
    case 'reminder':
      return theme.colors.primary[500];
    default:
      return theme.colors.neutral[500];
  }
};

// Create notification title based on type and data
export const createNotificationTitle = (type: string, data: any): string => {
  switch (type) {
    case 'submission':
      return 'New Activity Submission';
    case 'approval':
      return 'Activity Approved';
    case 'rejection':
      return 'Activity Needs Revision';
    case 'reminder':
      return 'Activity Reminder';
    default:
      return 'New Notification';
  }
};

// Create notification message based on type and data
export const createNotificationMessage = (type: string, data: any): string => {
  switch (type) {
    case 'submission':
      return `${data.childName} has submitted "${data.activityTitle}" for review.`;
    case 'approval':
      return `Your submission for "${data.activityTitle}" has been approved! You earned ${data.tokenValue} tokens.`;
    case 'rejection':
      return `Your submission for "${data.activityTitle}" needs some changes. Check the feedback and try again.`;
    case 'reminder':
      return `Don't forget to complete "${data.activityTitle}" before it expires.`;
    default:
      return data.message || 'You have a new notification.';
  }
};

// Generate action URL for a notification
export const generateActionUrl = (type: string, relatedId: string): string => {
  switch (type) {
    case 'submission':
      return `/parent/approvals/${relatedId}`;
    case 'approval':
    case 'rejection':
      return `/child/activities/${relatedId}`;
    case 'reminder':
      return `/child/activities/${relatedId}`;
    default:
      return '/';
  }
};