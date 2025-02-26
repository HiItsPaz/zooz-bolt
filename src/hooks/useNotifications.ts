import { useState, useEffect, useCallback } from 'react';
import { useMockData } from '../context/MockDataContext';
import { Notification } from '../services/mockData';

export const useNotifications = () => {
  const { getNotifications, getUnreadNotificationCount, markNotificationAsRead } = useMockData();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [notificationsData, unreadCountData] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);
      
      setNotifications(notificationsData);
      setUnreadCount(unreadCountData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [getNotifications, getUnreadNotificationCount]);
  
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  }, [markNotificationAsRead]);
  
  // Fetch notifications on mount and set up polling
  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);
  
  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    refreshNotifications: fetchNotifications,
  };
};

export default useNotifications;