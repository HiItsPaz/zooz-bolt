import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import TokenDisplay from '../ui/TokenDisplay';
import { Transaction } from '../../services/mockData';
import {  as Check,  as X,  as Gamepad2,  as User } from 'lucide-react-native';

interface RedemptionApprovalProps {
  redemption: Transaction;
  childName: string;
  onApprove: (redemptionId: string, feedback?: string) => void;
  onReject: (redemptionId: string, feedback: string) => void;
  loading?: boolean;
  error?: string | null;
}

const RedemptionApproval: React.FC<RedemptionApprovalProps> = ({
  redemption,
  childName,
  onApprove,
  onReject,
  loading = false,
  error,
}) => {
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const handleApprove = () => {
    onApprove(redemption.id, feedback);
  };
  
  const handleReject = () => {
    if (!feedback.trim()) {
      // Require feedback for rejections
      setShowFeedback(true);
      return;
    }
    onReject(redemption.id, feedback);
  };
  
  return (
    <Card elevation="md" style={styles.container}>
      <View style={styles.header}>
        <View style={styles.childInfo}>
          <View style={styles.avatar}>
            <User size={24} color={theme.colors.neutral[400]} />
          </View>
          <View>
            <Text style={styles.childName}>{childName}</Text>
            <Text style={styles.timestamp}>
              Requested {new Date(redemption.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
        
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Pending Review</Text>
        </View>
      </View>
      
      <View style={styles.details}>
        <View style={styles.platformInfo}>
          <View style={styles.platformIcon}>
            <Gamepad2 size={20} color={theme.colors.primary[500]} />
          </View>
          <View>
            <Text style={styles.platformLabel}>Gaming Platform</Text>
            <Text style={styles.platformValue}>{redemption.platform}</Text>
          </View>
        </View>
        
        <View style={styles.amountInfo}>
          <View>
            <Text style={styles.amountLabel}>Token Amount</Text>
            <TokenDisplay amount={Math.abs(redemption.amount)} size="md" />
          </View>
          
          <View style={styles.conversionInfo}>
            <Text style={styles.conversionLabel}>Converts to</Text>
            <Text style={styles.conversionValue}>
              {Math.abs(redemption.gameAmount)} {redemption.platform} currency
            </Text>
          </View>
        </View>
        
        {redemption.accountId && (
          <View style={styles.accountInfo}>
            <Text style={styles.accountLabel}>Gaming Account</Text>
            <Text style={styles.accountValue}>{redemption.accountId}</Text>
          </View>
        )}
        
        {redemption.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Additional Notes</Text>
            <Text style={styles.notesText}>{redemption.notes}</Text>
          </View>
        )}
      </View>
      
      {(showFeedback || feedback) && (
        <View style={styles.feedbackSection}>
          <TextArea
            label="Feedback"
            value={feedback}
            onChangeText={setFeedback}
            placeholder="Provide feedback about this redemption request..."
            required={showFeedback}
            error={showFeedback && !feedback.trim() ? 'Feedback is required for rejections' : undefined}
            minHeight={80}
            maxHeight={160}
          />
        </View>
      )}
      
      {error && (
        <View style={styles.errorMessage}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.actions}>
        {!showFeedback && (
          <Button
            title="Add Feedback"
            variant="outline"
            onPress={() => setShowFeedback(true)}
            disabled={loading}
            style={styles.feedbackButton}
          />
        )}
        
        <View style={styles.mainActions}>
          <Button
            title="Reject"
            variant="outline"
            leftIcon={<X size={20} color={theme.colors.semantic.error} />}
            onPress={handleReject}
            disabled={loading}
            style={styles.rejectButton}
          />
          <Button
            title="Approve"
            leftIcon={<Check size={20} color={theme.colors.neutral[0]} />}
            onPress={handleApprove}
            disabled={loading}
            loading={loading}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.spacing.lg,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.sm,
  },
  childName: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
  },
  timestamp: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    backgroundColor: theme.colors.accent[500],
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  details: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    marginBottom: theme.spacing.spacing.lg,
  },
  platformInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  platformIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.sm,
  },
  platformLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  platformValue: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  amountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.md,
  },
  amountLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  conversionInfo: {
    alignItems: 'flex-end',
  },
  conversionLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  conversionValue: {
    ...theme.typography.textStyle.body,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.bold,
  },
  accountInfo: {
    marginBottom: theme.spacing.spacing.md,
  },
  accountLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  accountValue: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.sm,
  },
  notesSection: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
  },
  notesLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  notesText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
  feedbackSection: {
    marginBottom: theme.spacing.spacing.lg,
  },
  errorMessage: {
    backgroundColor: theme.colors.semantic.error + '10',
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.md,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feedbackButton: {
    minWidth: 120,
  },
  mainActions: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.sm,
  },
  rejectButton: {
    borderColor: theme.colors.semantic.error,
  },
});

export default RedemptionApproval;