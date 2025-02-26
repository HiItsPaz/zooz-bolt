import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Activity, Submission } from '../../services/mockData';
import TokenDisplay from '../ui/TokenDisplay';
import { Camera, Clock } from 'lucide-react-native';

interface QuestCardProps {
  activity: Activity;
  submissions: Submission[];
  style?: any;
  onPress?: () => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  activity,
  submissions,
  style,
  onPress,
}) => {
  // Find submission for this activity
  const submission = submissions.find(s => s.activityId === activity.id);
  const isNew = !submission && new Date(activity.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000;
  
  // Get status
  const getStatus = () => {
    if (!submission) return 'available';
    return submission.status;
  };
  
  // Get background image based on category
  const getBackgroundImage = () => {
    switch (activity.category) {
      case 'educational':
        return 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80';
      case 'social':
        return 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80';
      case 'house chores':
        return 'https://images.unsplash.com/photo-1527515545081-5db817172677?w=400&q=80';
      case 'physical':
        return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80';
      default:
        return 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=400&q=80';
    }
  };
  
  const status = getStatus();
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: getBackgroundImage() }}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW!</Text>
            </View>
          )}
          <TokenDisplay amount={activity.tokenValue} size="sm" />
        </View>
        
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {activity.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {activity.description}
          </Text>
        </View>
        
        <View style={styles.footer}>
          {activity.requiresEvidence && (
            <View style={styles.tag}>
              <Camera size={12} color={theme.colors.neutral[0]} />
              <Text style={styles.tagText}>Photo Required</Text>
            </View>
          )}
          {activity.dueDate && (
            <View style={styles.tag}>
              <Clock size={12} color={theme.colors.neutral[0]} />
              <Text style={styles.tagText}>
                Due: {new Date(activity.dueDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          {status !== 'available' && (
            <View style={[
              styles.statusBadge,
              status === 'approved' && styles.approvedBadge,
              status === 'rejected' && styles.rejectedBadge,
              status === 'pending' && styles.pendingBadge,
            ]}>
              <Text style={styles.statusText}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 200,
    borderRadius: theme.spacing.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    ...theme.spacing.shadow.md,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  content: {
    flex: 1,
    padding: theme.spacing.spacing.md,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  newBadge: {
    backgroundColor: theme.colors.semantic.info,
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs / 2,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  newBadgeText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.neutral[0],
    marginBottom: theme.spacing.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.neutral[100],
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs / 2,
    borderRadius: theme.spacing.borderRadius.sm,
    gap: 4,
  },
  tagText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs / 2,
    borderRadius: theme.spacing.borderRadius.sm,
    backgroundColor: theme.colors.neutral[500],
  },
  approvedBadge: {
    backgroundColor: theme.colors.semantic.success,
  },
  rejectedBadge: {
    backgroundColor: theme.colors.semantic.error,
  },
  pendingBadge: {
    backgroundColor: theme.colors.accent[500],
  },
  statusText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default QuestCard;