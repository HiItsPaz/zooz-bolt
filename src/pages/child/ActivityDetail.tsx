import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ChildLayout from '../../components/layout/ChildLayout';
import Button from '../../components/ui/Button';
import TokenDisplay from '../../components/ui/TokenDisplay';
import CategoryBadge from '../../components/activities/CategoryBadge';
import EvidenceCapture from '../../components/child/EvidenceCapture';
import SubmissionConfirmation from '../../components/child/SubmissionConfirmation';
import { useMockData } from '../../context/MockDataContext';
import { Activity } from '../../services/mockData';
import { Camera, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';

interface ActivityDetailProps {
  activityId: string;
  onBack: () => void;
}

const ActivityDetail: React.FC<ActivityDetailProps> = ({ activityId, onBack }) => {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { submitActivity } = useMockData();
  
  // Load activity data
  useEffect(() => {
    const loadActivity = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const activityData = await mockDataService.activities.getById(activityId);
        setActivity(activityData);
      } catch (err: any) {
        console.error('Error loading activity:', err);
        setError(err.message || 'Failed to load activity details');
      } finally {
        setLoading(false);
      }
    };
    
    loadActivity();
  }, [activityId]);
  
  // Handle submission
  const handleSubmit = async (data: { notes: string; photo?: File | null }) => {
    if (!activity) return;
    
    setSubmitting(true);
    setError(null);
    
    try {
      await submitActivity({
        activityId: activity.id,
        notes: data.notes,
        evidenceUrl: data.photo ? URL.createObjectURL(data.photo) : undefined,
      });
      
      setShowSubmissionForm(false);
      setShowConfirmation(true);
    } catch (err: any) {
      console.error('Error submitting activity:', err);
      setError(err.message || 'Failed to submit activity');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <ChildLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading quest details...</Text>
        </View>
      </ChildLayout>
    );
  }
  
  // Error state
  if (error || !activity) {
    return (
      <ChildLayout>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Quest</Text>
          <Text style={styles.errorText}>{error || 'Quest not found'}</Text>
          <Button title="Go Back" onPress={onBack} style={styles.backButton} />
        </View>
      </ChildLayout>
    );
  }
  
  // Show submission confirmation
  if (showConfirmation) {
    return (
      <ChildLayout>
        <SubmissionConfirmation
          activity={activity}
          onClose={onBack}
        />
      </ChildLayout>
    );
  }
  
  // Show submission form
  if (showSubmissionForm) {
    return (
      <ChildLayout>
        <EvidenceCapture
          activity={activity}
          onSubmit={handleSubmit}
          onCancel={() => setShowSubmissionForm(false)}
          loading={submitting}
          error={error}
        />
      </ChildLayout>
    );
  }
  
  return (
    <ChildLayout>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Button 
            title="Back to Quests" 
            variant="outline"
            size="sm"
            onPress={onBack}
            leftIcon={<Text>←</Text>}
          />
          <CategoryBadge category={activity.category} size="md" />
        </View>
        
        {/* Quest Details */}
        <View style={styles.questCard}>
          <Text style={styles.title}>{activity.title}</Text>
          
          <View style={styles.rewardSection}>
            <Text style={styles.rewardLabel}>Reward:</Text>
            <TokenDisplay amount={activity.tokenValue} size="lg" />
          </View>
          
          <Text style={styles.description}>{activity.description}</Text>
          
          {/* Requirements */}
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            
            <View style={styles.requirement}>
              {activity.requiresEvidence ? (
                <>
                  <Camera size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.requirementText}>
                    Photo evidence required
                  </Text>
                </>
              ) : (
                <>
                  <AlertCircle size={20} color={theme.colors.textPrimary} />
                  <Text style={styles.requirementText}>
                    No photo evidence needed
                  </Text>
                </>
              )}
            </View>
            
            {activity.dueDate && (
              <View style={styles.requirement}>
                <Clock size={20} color={theme.colors.textPrimary} />
                <Text style={styles.requirementText}>
                  Due by {new Date(activity.dueDate).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
          
          {/* Start Button */}
          <Button
            title="Start Quest"
            onPress={() => setShowSubmissionForm(true)}
            style={styles.startButton}
          />
        </View>
      </ScrollView>
    </ChildLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.md,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  questCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.md,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  rewardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.lg,
  },
  rewardLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginRight: theme.spacing.spacing.sm,
  },
  description: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xl,
  },
  requirementsSection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.sm,
  },
  requirementText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.spacing.sm,
  },
  startButton: {
    marginTop: theme.spacing.spacing.md,
  },
});

export default ActivityDetail;