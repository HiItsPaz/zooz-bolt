import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { useMockData } from '../../context/MockDataContext';
import useSubmissions from '../../hooks/useSubmissions';
import ParentLayout from '../../components/layout/ParentLayout';
import { Submission, Activity, Child } from '../../services/mockData';

// Define filter types
type FilterStatus = 'pending' | 'approved' | 'rejected' | 'all';

interface ApprovalsProps {
  onViewSubmission: (submissionId: string) => void;
}

const Approvals: React.FC<ApprovalsProps> = ({ onViewSubmission }) => {
  // Get submissions data
  const { currentUser } = useMockData();
  const { 
    submissions, 
    activitiesMap, 
    loading, 
    refreshSubmissions 
  } = useSubmissions();
  
  // State for filters
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('pending');
  const [childrenMap, setChildrenMap] = useState<Record<string, Child>>({});
  const [childrenLoading, setChildrenLoading] = useState(false);
  
  // Load children data
  useEffect(() => {
    const loadChildrenData = async () => {
      if (!currentUser || currentUser.role !== 'parent') return;
      
      setChildrenLoading(true);
      try {
        const childrenData: Record<string, Child> = {};
        const children = await mockDataService.users.getChildrenForParent(currentUser.id);
        
        children.forEach(child => {
          childrenData[child.id] = child as Child;
        });
        
        setChildrenMap(childrenData);
      } catch (error) {
        console.error('Error loading children data:', error);
      } finally {
        setChildrenLoading(false);
      }
    };
    
    loadChildrenData();
  }, [currentUser]);
  
  // Filter submissions based on status
  const filteredSubmissions = submissions.filter(submission => {
    if (filterStatus === 'all') return true;
    return submission.status === filterStatus;
  });
  
  // Group submissions by child
  const submissionsByChild: Record<string, Submission[]> = {};
  
  filteredSubmissions.forEach(submission => {
    if (!submissionsByChild[submission.childId]) {
      submissionsByChild[submission.childId] = [];
    }
    submissionsByChild[submission.childId].push(submission);
  });
  
  // Loading state
  if (loading || childrenLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Approvals</Text>
        <Button 
          title="Refresh" 
          variant="outline"
          size="sm"
          onPress={refreshSubmissions}
        />
      </View>
      
      {/* Filters */}
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'pending' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'pending' && styles.activeFilterText,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'approved' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('approved')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'approved' && styles.activeFilterText,
              ]}
            >
              Approved
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'rejected' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('rejected')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'rejected' && styles.activeFilterText,
              ]}
            >
              Rejected
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.activeFilter,
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Submissions list */}
      <ScrollView style={styles.submissionsList}>
        {Object.keys(submissionsByChild).length > 0 ? (
          Object.entries(submissionsByChild).map(([childId, childSubmissions]) => (
            <View key={childId} style={styles.childSection}>
              <Text style={styles.childName}>
                {childrenMap[childId]?.displayName || `Child (${childId})`}
              </Text>
              
              {childSubmissions.map(submission => {
                const activity = activitiesMap[submission.activityId];
                
                if (!activity) {
                  return null;
                }
                
                return (
                  <Card
                    key={submission.id}
                    elevation="sm"
                    style={styles.submissionCard}
                    onPress={() => onViewSubmission(submission.id)}
                  >
                    <View style={styles.submissionHeader}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
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
                    
                    <View style={styles.submissionDetails}>
                      <Text style={styles.submissionDate}>
                        Submitted: {new Date(submission.submittedAt).toLocaleDateString()} at {new Date(submission.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      {submission.notes && (
                        <Text style={styles.submissionNotes} numberOfLines={2}>
                          {submission.notes}
                        </Text>
                      )}
                      
                      {submission.evidenceUrl && (
                        <View style={styles.evidenceIndicator}>
                          <Text style={styles.evidenceText}>📸 Photo Evidence Available</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.submissionActions}>
                      <Button
                        title="View Details"
                        size="sm"
                        variant="outline"
                        onPress={() => onViewSubmission(submission.id)}
                      />
                    </View>
                  </Card>
                );
              })}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No submissions found</Text>
            <Text style={styles.emptyStateText}>
              {filterStatus === 'pending' ? 
                "You don't have any pending submissions to review." :
                `No ${filterStatus === 'all' ? '' : filterStatus} submissions found.`}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
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
  filters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  filterLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginRight: theme.spacing.spacing.sm,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: theme.spacing.spacing.md,
    paddingVertical: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.md,
    backgroundColor: theme.colors.neutral[100],
    marginRight: theme.spacing.spacing.xs,
    marginBottom: theme.spacing.spacing.xs,
  },
  activeFilter: {
    backgroundColor: theme.colors.primary[500],
  },
  filterButtonText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
  activeFilterText: {
    color: theme.colors.neutral[0],
  },
  submissionsList: {
    flex: 1,
  },
  childSection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  childName: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  submissionCard: {
    marginBottom: theme.spacing.spacing.md,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.sm,
  },
  activityTitle: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs / 2,
    borderRadius: theme.spacing.borderRadius.sm,
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
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  submissionDetails: {
    marginBottom: theme.spacing.spacing.sm,
  },
  submissionDate: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  submissionNotes: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  evidenceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  evidenceText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.primary[600],
  },
  submissionActions: {
    alignItems: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.spacing.xl,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
  },
  emptyStateTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default Approvals;