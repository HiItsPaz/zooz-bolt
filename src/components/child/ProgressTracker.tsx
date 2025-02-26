import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Activity, Submission } from '../../services/mockData';
import { ACTIVITY_CATEGORIES } from '../../constants';

interface ProgressTrackerProps {
  submissions: Submission[];
  activities: Activity[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  submissions,
  activities,
}) => {
  // Calculate progress for each category
  const categoryProgress = ACTIVITY_CATEGORIES.map(category => {
    const categoryActivities = activities.filter(a => a.category === category.id);
    const completedActivities = submissions.filter(
      s => s.status === 'approved' && 
      categoryActivities.some(a => a.id === s.activityId)
    );
    
    const total = categoryActivities.length;
    const completed = completedActivities.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      ...category,
      total,
      completed,
      percentage,
    };
  });
  
  // Get overall progress
  const totalActivities = activities.length;
  const completedActivities = submissions.filter(s => s.status === 'approved').length;
  const overallPercentage = totalActivities > 0 
    ? (completedActivities / totalActivities) * 100 
    : 0;
  
  return (
    <View style={styles.container}>
      {/* Overall Progress */}
      <View style={styles.overallProgress}>
        <View style={styles.progressCircle}>
          <Text style={styles.progressPercentage}>
            {Math.round(overallPercentage)}%
          </Text>
          <Text style={styles.progressLabel}>Complete</Text>
        </View>
        <View style={styles.progressStats}>
          <Text style={styles.statsText}>
            <Text style={styles.statsHighlight}>{completedActivities}</Text> of{' '}
            <Text style={styles.statsHighlight}>{totalActivities}</Text> quests completed
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${overallPercentage}%` }
              ]} 
            />
          </View>
        </View>
      </View>
      
      {/* Category Progress */}
      <View style={styles.categoryProgress}>
        {categoryProgress.map(category => (
          <View key={category.id} style={styles.categoryItem}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Text style={styles.categoryCount}>
                {category.completed}/{category.total}
              </Text>
            </View>
            <View style={styles.categoryBar}>
              <View 
                style={[
                  styles.categoryFill,
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: getCategoryColor(category.id),
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Helper to get category color
const getCategoryColor = (category: string) => {
  switch (category) {
    case 'educational':
      return theme.colors.primary[500];
    case 'social':
      return theme.colors.secondary[500];
    case 'house chores':
      return theme.colors.accent[500];
    case 'physical':
      return '#FF7A45';
    default:
      return theme.colors.primary[500];
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.md,
  },
  overallProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.xl,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.lg,
  },
  progressPercentage: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.neutral[0],
  },
  progressLabel: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
  },
  progressStats: {
    flex: 1,
  },
  statsText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.sm,
  },
  statsHighlight: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  categoryProgress: {
    gap: theme.spacing.spacing.md,
  },
  categoryItem: {
    marginBottom: theme.spacing.spacing.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.xs,
  },
  categoryLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
  categoryCount: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  categoryBar: {
    height: 6,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default ProgressTracker;