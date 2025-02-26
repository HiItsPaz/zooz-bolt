import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ScrollView, 
  Image, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import TextArea from '../../components/ui/TextArea';
import CategoryBadge from '../../components/activities/CategoryBadge';
import TokenDisplay from '../../components/ui/TokenDisplay';
import ParentLayout from '../../components/layout/ParentLayout';
import { useMockData } from '../../context/MockDataContext';
import useSubmissions from '../../hooks/useSubmissions';
import { Submission, Activity, Child } from '../../services/mockData';

interface SubmissionDetailProps {
  submissionId: string;
  onBack: () => void;
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ 
  submissionId,
  onBack
}) => {
  // State for the component
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [child, setChild] = useState<Child | null>(null);
  const [feedback, setFeedback] = useState('');
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get data hooks
  const { currentUser } = useMockData();
  const { approveSubmission, rejectSubmission } = useSubmissions({ initialFetch: false });
  
  // Load submission data
  useEffect(() => {
    const loadSubmissionData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch submission
        const submissionData = await mockDataService.submissions.getById(submissionId);
        setSubmission(submissionData);
        
        // Fetch related activity
        const activityData = await mockDataService.activities.getById(submissionData.activityId);
        setActivity(activityData);
        
        // Fetch child data
        const childData = await mockDataService.users.getById(submissionData.childId) as Child;
        setChild(childData);
        
        // Set initial feedback if submission is rejected
        if (submissionData.status === 'rejected' && submissionData.feedback) {
          setFeedback(submissionData.feedback);
        }
      } catch (err: any) {
        console.error('Error loading submission data:', err);
        setError(err.message || 'Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };
    
    loadSubmissionData();
  }, [submissionId]);
  
  // Handle approval
  const handleApprove = async () => {
    if (!submission) return;
    
    setApproving(true);
    setError(null);
    
    try {
      await approveSubmission(submission.id, feedback || undefined);
      
      // Reload submission data
      const updatedSubmission = await mockDataService.submissions.getById(submissionId);
      setSubmission(updatedSubmission);
    } catch (err: any) {
      console.error('Error approving submission:', err);
      setError(err.message || 'Failed to approve submission');
    } finally {
      setApproving(false);
    }
  };
  
  // Handle rejection
  const handleReject = async () => {
    if (!submission || !feedback.trim()) {
      setError('Please provide feedback for rejection');
      return;
    }
    
    setRejecting(true);
    setError(null);
    
    try {
      await rejectSubmission(submission.id, feedback);
      
      // Reload submission data
      const updatedSubmission = await mockDataService.submissions.getById(submissionId);
      setSubmission(updatedSubmission);
    } catch (err: any) {
      console.error('Error rejecting submission:', err);
      setError(err.message || 'Failed to reject submission');
    } finally {
      setRejecting(false);
    }
  };
  
  // Format date helper
  const formatDateTime = (date: Date | string) => {
    const d = new Date(date);
    return `${d.toLocaleDateString()} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={styles.loadingText}>Loading submission details...</Text>
      </View>
    );
  }
  
  // Error state
  if (error || !submission || !activity || !child) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Submission</Text>
        <Text style={styles.errorText}>{error || 'Submission not found'}</Text>
        <Button title="Go Back" onPress={onBack} style={styles.backButton} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Button 
          title="Back to Approvals" 
          variant="outline"
          size="sm"
          onPress={onBack}
          leftIcon={<Text>←</Text>}
        />
        <View style={[
          styles.statusBadge,
          submission.status === 'pending' && styles.pendingBadge,
          submission.status === 'approved' && styles.approvedBadge,
          submission.status === 'rejected' && styles.rejectedBadge,
        ]}>
          <Text style={styles.statusText}>
            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <Card elevation="md" padding="lg" style={styles.detailCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <CategoryBadge category={activity.category} size="md" />
        </View>
        
        <Text style={styles.activityDescription}>{activity.description}</Text>
        
        <View style={styles.tokenSection}>
          <Text style={styles.sectionLabel}>Reward:</Text>
          <TokenDisplay amount={activity.tokenValue} size="md" />
        </View>
        
        <View style={styles.submissionSection}>
          <Text style={styles.sectionTitle}>Submission Details</Text>
          <View style={styles.submissionInfo}>
            <Text style={styles.submissionLabel}>Submitted by:</Text>
            <Text style={styles.submissionValue}>{child.displayName}</Text>
          </View>
          <View style={styles.submissionInfo}>
            <Text style={styles.submissionLabel}>Submitted on:</Text>
            <Text style={styles.submissionValue}>{formatDateTime(submission.submittedAt)}</Text>
          </View>
          
          {submission.reviewedAt && (
            <View style={styles.submissionInfo}>
              <Text style={styles.submissionLabel}>Reviewed on:</Text>
              <Text style={styles.submissionValue}>{formatDateTime(submission.reviewedAt)}</Text>
            </View>
          )}
        </View>
        
        {submission.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Child's Notes</Text>
            <Text style={styles.notesText}>{submission.notes}</Text>
          </View>
        )}
        
        {submission.evidenceUrl && (
          <View style={styles.evidenceSection}>
            <Text style={styles.sectionTitle}>Photo Evidence</Text>
            <TouchableOpacity 
              style={styles.evidenceImageContainer}
              onPress={() => setPhotoModalVisible(true)}
            >
              <Image 
                source={{ uri: submission.evidenceUrl }} 
                style={styles.evidenceImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay}>
                <Text style={styles.tapToEnlarge}>Tap to enlarge</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        
        {submission.status === 'pending' && (
          <View style={styles.approvalSection}>
            <Text style={styles.sectionTitle}>Review Submission</Text>
            <TextArea
              label="Feedback (required for rejection)"
              value={feedback}
              onChangeText={setFeedback}
              placeholder="Provide feedback for the child..."
              minHeight={80}
              maxHeight={160}
            />
            
            <View style={styles.actionButtons}>
              <Button 
                title="Reject" 
                variant="outline" 
                onPress={handleReject}
                disabled={rejecting || approving || !feedback.trim()}
                loading={rejecting}
                style={styles.rejectButton}
              />
              <Button 
                title="Approve" 
                onPress={handleApprove}
                disabled={rejecting || approving}
                loading={approving}
              />
            </View>
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
          </View>
        )}
        
        {submission.status !== 'pending' && submission.feedback && (
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Feedback</Text>
            <Text style={styles.feedbackText}>{submission.feedback}</Text>
          </View>
        )}
      </Card>
      
      {/* Photo Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalBackground}
            activeOpacity={1}
            onPress={() => setPhotoModalVisible(false)}
          >
            <View style={styles.modalImageContainer}>
              <Image 
                source={{ uri: submission.evidenceUrl }} 
                style={styles.modalImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPhotoModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.spacing.xl,
  },
  errorTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.sm,
  },
  errorText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.semantic.error,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  backButton: {
    marginTop: theme.spacing.spacing.md,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.spacing.md,
    paddingVertical: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.md,
    backgroundColor: theme.colors.neutral[300],
  },
  pendingBadge: {
    backgroundColor: theme.colors.accent[500],
  },
  approvedBadge: {
    backgroundColor: theme.colors.semantic.success,
  },
  rejectedBadge: {
    backgroundColor: theme.colors.semantic.error,
  },
  statusText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailCard: {
    marginBottom: theme.spacing.spacing.xl,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.spacing.sm,
  },
  activityTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.spacing.sm,
  },
  activityDescription: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.md,
  },
  tokenSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
  },
  sectionLabel: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.spacing.sm,
  },
  submissionSection: {
    marginBottom: theme.spacing.spacing.md,
    padding: theme.spacing.spacing.md,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.md,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  submissionInfo: {
    flexDirection: 'row',
    marginBottom: theme.spacing.spacing.xs,
  },
  submissionLabel: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textPrimary,
    width: 120,
  },
  submissionValue: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  notesSection: {
    marginBottom: theme.spacing.spacing.lg,
  },
  notesText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
  },
  evidenceSection: {
    marginBottom: theme.spacing.spacing.lg,
  },
  evidenceImageContainer: {
    borderRadius: theme.spacing.borderRadius.md,
    overflow: 'hidden',
    ...theme.spacing.shadow.sm,
  },
  evidenceImage: {
    width: '100%',
    height: 240,
  },
  imageOverlay: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: theme.spacing.spacing.xs,
    borderTopLeftRadius: theme.spacing.borderRadius.md,
  },
  tapToEnlarge: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.neutral[0],
  },
  approvalSection: {
    marginTop: theme.spacing.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.spacing.md,
  },
  rejectButton: {
    marginRight: theme.spacing.spacing.sm,
  },
  feedbackSection: {
    marginTop: theme.spacing.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.spacing.lg,
  },
  feedbackText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: theme.colors.neutral[0],
    borderRadius: theme.spacing.borderRadius.lg,
    overflow: 'hidden',
    ...theme.spacing .shadow.lg,
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: theme.colors.neutral[0],
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default SubmissionDetail;