import React from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Submission, Activity } from '../../services/mockData';
import TokenDisplay from '../ui/TokenDisplay';
import { Check, X, Clock } from 'lucide-react-native';

interface RecentActivityListProps {
  submissions: Submission[];
  activities: Activity[];
}

const RecentActivityList: React.FC<RecentActivityListProps> = ({
  submissions,
  activities,
}) => {
  const renderItem = ({ item: submission }: { item: Submission }) => {
    const activity = activities.find(a => a.id === submission.activityId);
    if (!activity) return null;
    
    const getStatusIcon = () => {
      switch (submission.status) {
        case 'approved':
          return <Check size={16} color={theme.colors.semantic.success} />;
        case 'rejected':
          return <X size={16} color={theme.colors.semantic.error} />;
        case 'pending':
          return <Clock size={16} color={theme.colors.accent[500]} />;
        default:
          return null;
      }
    };
    
    return (
      <View style={styles.activityItem}>
        <View style={styles.activityHeader}>
          <View style={styles.activityInfo}>
            {getStatusIcon()}
            <Text style={styles.activityTitle}>{activity.title}</Text>
          </View>
          <TokenDisplay amount={submission.tokenValue} size="sm" />
        </View>
        
        <View style={styles.activityDetails}>
          <Text style={styles.timestamp}>
            {new Date(submission.submittedAt).toLocaleDateString()} at{' '}
            {new Date(submission.submittedAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          
          {submission.feedback && (
            <Text style={styles.feedback} numberOfLines={2}>
              {submission.feedback}
            </Text>
          )}
        </View>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <FlatList
        data={submissions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No recent activity to show
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.md,
    ...theme.spacing.shadow.md,
  },
  activityItem: {
    paddingVertical: theme.spacing.spacing.sm,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.xs,
  },
  activityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.spacing.sm,
    flex: 1,
  },
  activityDetails: {
    marginLeft: 24, // Align with title after icon
  },
  timestamp: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  feedback: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    marginTop: theme.spacing.spacing.xs,
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.spacing.sm,
  },
  emptyState: {
    padding: theme.spacing.spacing.lg,
    alignItems: 'center',
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
});

export default RecentActivityList;