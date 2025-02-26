import { useState, useEffect, useCallback } from 'react';
import { useMockData } from '../context/MockDataContext';
import { Activity } from '../services/mockData';

interface UseActivitiesOptions {
  category?: string;
  status?: string;
  initialFetch?: boolean;
}

export const useActivities = (options: UseActivitiesOptions = { initialFetch: true }) => {
  const { getActivities } = useMockData();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getActivities({
        category: options.category,
        status: options.status,
      });
      setActivities(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activities');
      console.error('Error fetching activities:', err);
    } finally {
      setLoading(false);
    }
  }, [getActivities, options.category, options.status]);
  
  // Fetch activities on mount and when dependencies change
  useEffect(() => {
    if (options.initialFetch) {
      fetchActivities();
    }
  }, [fetchActivities, options.initialFetch]);
  
  return {
    activities,
    loading,
    error,
    refreshActivities: fetchActivities,
  };
};

export default useActivities;