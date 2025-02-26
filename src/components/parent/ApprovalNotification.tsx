import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useMockData } from '../../context/MockDataContext';
import { lightTheme as theme } from '../../styles/theme';

interface ApprovalNotificationProps {
  onPress: () => void;
}

export const ApprovalNotification: React.FC<ApprovalNotificationProps> = ({ onPress }) => {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useMockData();
  
  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      if (!currentUser || currentUser.role !== 'parent') {
        setPendingCount(0);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      try {
        const submissions = await mockDataService.submissions.getPendingForParent(currentUser.id);
        setPendingCount(submissions.length);
      } catch (error) {
        console.error('Error fetching pending submissions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingSubmissions();
    
    // Poll for updates every 30 seconds
    const intervalId = setInterval(fetchPendingSubmissions, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [currentUser]);
  
  if (loading || pendingCount === 0) {
    return null;
  }
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.badge}>
        <Text style={styles.count}>{pendingCount}</Text>
      </View>
      <Text style={styles.text}>Pending Approvals</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.spacing.sm,
    marginBottom: theme.spacing.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.semantic.error,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.sm,
  },
  count: {
    ...theme.typography.textStyle.bodySmall,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[0],
  },
  text: {
    ...theme.typography.textStyle.body,
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default ApprovalNotification;