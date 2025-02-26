import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import CategoryBadge from './CategoryBadge';
import TokenDisplay from '../ui/TokenDisplay';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Clock, Camera } from 'lucide-react-native';

export type ActivityStatus = 'pending' | 'approved' | 'rejected' | 'open';
export type ActivityViewMode = 'parent' | 'child' | 'admin';

export interface ActivityCardProps {
  id: string;
  title: string;
  description: string;
  category: 'educational' | 'social' | 'house chores' | 'physical';
  tokenValue: number;
  status?: ActivityStatus;
  dueDate?: Date | string;
  requiresEvidence?: boolean;
  viewMode: ActivityViewMode;
  onSelect?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  isNew?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  id,
  title,
  description,
  category,
  tokenValue,
  status = 'open',
  dueDate,
  requiresEvidence = false,
  viewMode,
  onSelect,
  onApprove,
  onReject,
  onComplete,
  onEdit,
  onDelete,
  containerStyle,
  isNew = false,
}) => {
  const handleSelect = () => onSelect?.(id);
  const handleApprove = () => onApprove?.(id);
  const handleReject = () => onReject?.(id);
  const handleComplete = () => onComplete?.(id);
  const handleEdit = () => onEdit?.(id);
  const handleDelete = () => onDelete?.(id);
  
  const formatDate = (date: Date | string) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
  };
  
  const StatusBadge = ({ status }: { status: ActivityStatus }) => {
    let backgroundColor;
    let text;
    
    switch (status) {
      case 'pending':
        backgroundColor = theme.colors.accent[500];
        text = 'Pending Review';
        break;
      case 'approved':
        backgroundColor = theme.colors.semantic.success;
        text = 'Completed';
        break;
      case 'rejected':
        backgroundColor = theme.colors.semantic.error;
        text = 'Try Again';
        break;
      default:
        return null;
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor }]}>
        <Text style={styles.statusText}>{text}</Text>
      </View>
    );
  };
  
  const renderCardActions = () => {
    switch (viewMode) {
      case 'parent':
        if (status === 'pending') {
          return (
            <View style={styles.actionsRow}>
              <Button 
                title="Approve" 
                size="sm"
                onPress={handleApprove} 
                style={styles.actionButton}
              />
              <Button 
                title="Reject" 
                size="sm"
                variant="outline"
                onPress={handleReject} 
                style={styles.actionButton}
              />
            </View>
          );
        }
        return (
          <View style={styles.actionsRow}>
            <Button 
              title="Edit" 
              size="sm"
              variant="outline"
              onPress={handleEdit} 
              style={styles.actionButton}
            />
            <Button 
              title="Delete" 
              size="sm"
              variant="outline"
              onPress={handleDelete} 
              style={styles.actionButton}
            />
          </View>
        );
      
      case 'child':
        if (status === 'open') {
          return (
            <Button 
              title="Complete Quest" 
              size="sm"
              onPress={handleComplete} 
              fullWidth
            />
          );
        }
        return (
          <Button 
            title="View Details" 
            size="sm"
            variant="outline"
            onPress={handleSelect} 
            fullWidth
          />
        );
      
      case 'admin':
        return (
          <View style={styles.actionsRow}>
            <Button 
              title="Edit Template" 
              size="sm"
              variant="outline"
              onPress={handleEdit} 
              style={styles.actionButton}
            />
            <Button 
              title="Delete" 
              size="sm"
              variant="outline"
              onPress={handleDelete} 
              style={styles.actionButton}
            />
          </View>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Card
      elevation="md"
      padding="md"
      onPress={handleSelect}
      style={[styles.card, containerStyle]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          {isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>
        <CategoryBadge category={category} size="sm" />
      </View>
      
      <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
        {description}
      </Text>
      
      <View style={styles.detailsContainer}>
        <View style={styles.tokenContainer}>
          <TokenDisplay amount={tokenValue} size="sm" />
          {requiresEvidence && viewMode === 'child' && (
            <View style={styles.evidenceContainer}>
              <Camera size={16} color={theme.colors.textSecondary} />
              <Text style={styles.evidenceText}>Photo required</Text>
            </View>
          )}
        </View>
        
        <View style={styles.rightDetails}>
          {status !== 'open' && <StatusBadge status={status} />}
          {dueDate && (
            <View style={styles.dueDateContainer}>
              <Clock size={14} color={theme.colors.textSecondary} />
              <Text style={styles.dueDate}>
                Due: {formatDate(dueDate)}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        {renderCardActions()}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.spacing.sm,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.spacing.sm,
  },
  title: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.spacing.xs,
    flex: 1,
  },
  newBadge: {
    backgroundColor: theme.colors.semantic.info,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: theme.spacing.spacing.xs,
  },
  newBadgeText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  description: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.md,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  tokenContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.spacing.sm,
    backgroundColor: theme.colors.neutral[100],
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  evidenceText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  rightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: theme.spacing.spacing.sm,
  },
  statusText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.spacing.sm,
  },
  dueDate: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  actionsContainer: {
    marginTop: theme.spacing.spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.spacing.xs,
  },
  actionButton: {
    minWidth: 100,
  },
});

export default ActivityCard;