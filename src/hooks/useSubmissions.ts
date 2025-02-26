import { useState, useEffect, useCallback } from 'react';
import { useMockData } from '../context/MockDataContext';
import { Submission, Activity } from '../services/mockData';

interface UseSubmissionsOptions {
  status?: string;
  initialFetch?: boolean;
}

export const useSubmissions = (options: UseSubmissionsOptions = { initialFetch: true }) => {
  const { getSubmissions, reviewSubmission } = useMockData();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activitiesMap, setActivitiesMap] = useState<Record<string, Activity>>({});
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSubmissions({
        status: options.status,
      });
      setSubmissions(data);
      
      // Fetch activity details for each submission
      const activityIds = [...new Set(data.map(s => s.activityId))];
      const activitiesData: Record<string, Activity> = {};
      
      for (const activityId of activityIds) {
        try {
          const activity = await mockDataService.activities.getById(activityId);
          activitiesData[activityId] = activity;
        } catch (err) {
          console.error(`Error fetching activity ${activityId}:`, err);
        }
      }
      
      setActivitiesMap(activitiesData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch submissions');
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  }, [getSubmissions, options.status]);
  
  // Function to approve a submission
  const approveSubmission = async (submissionId: string, feedback?: string) => {
    setReviewing(true);
    setError(null);
    
    try {
      await reviewSubmission(submissionId, true, feedback);
      await fetchSubmissions(); // Refresh data after approval
    } catch (err: any) {
      setError(err.message || 'Failed to approve submission');
      console.error('Error approving submission:', err);
    } finally {
      setReviewing(false);
    }
  };
  
  // Function to reject a submission
  const rejectSubmission = async (submissionId: string, feedback: string) => {
    setReviewing(true);
    setError(null);
    
    try {
      await reviewSubmission(submissionId, false, feedback);
      await fetchSubmissions(); // Refresh data after rejection
    } catch (err: any) {
      setError(err.message || 'Failed to reject submission');
      console.error('Error rejecting submission:', err);
    } finally {
      setReviewing(false);
    }
  };
  
  // Fetch submissions on mount and when dependencies change
  useEffect(() => {
    if (options.initialFetch) {
      fetchSubmissions();
    }
  }, [fetchSubmissions, options.initialFetch]);
  
  return {
    submissions,
    activitiesMap,
    loading,
    reviewing,
    error,
    refreshSubmissions: fetchSubmissions,
    approveSubmission,
    rejectSubmission,
  };
};

export default useSubmissions;