import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockDataService, User, Parent, Child, Admin, Activity, Submission, Transaction, Notification } from '../services/mockData';

// Create types for context state
interface MockDataContextType {
  // Auth states
  currentUser: (Parent | Child | Admin) | null;
  isLoading: boolean;
  error: string | null;
  
  // Auth functions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Data functions
  getActivities: (filters?: { category?: string; status?: string }) => Promise<Activity[]>;
  getSubmissions: (filters?: { status?: string }) => Promise<Submission[]>;
  getNotifications: () => Promise<Notification[]>;
  getUnreadNotificationCount: () => Promise<number>;
  getChildrenForParent: (parentId: string) => Promise<Child[]>;
  getTokenBalance: (childId: string) => Promise<number>;
  getTokenHistory: (childId: string) => Promise<Transaction[]>;
  submitActivity: (submission: { activityId: string; notes: string; evidenceUrl?: string }) => Promise<void>;
  reviewSubmission: (submissionId: string, approved: boolean, feedback?: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  createActivity: (activity: Partial<Activity>) => Promise<Activity>;
  
  // Dev functions
  switchUser: (role: 'parent' | 'child' | 'admin') => void;
  setDevMode: (enabled: boolean) => void;
  isDevMode: boolean;
}

// Create the context
const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

// Mock login credentials for test users
const mockUsers = {
  parent: { email: 'parent1@example.com', password: 'password', id: 'parent1' },
  child: { email: 'child1@example.com', password: 'password', id: 'child1' },
  admin: { email: 'admin@zooz.com', password: 'password', id: 'admin1' },
};

// Provider component
export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<(Parent | Child | Admin) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDevMode, setIsDevMode] = useState(false);
  
  // Simulate initial authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulate checking for stored session
        const storedUserId = localStorage.getItem('mockUserId');
        
        if (storedUserId) {
          const user = await mockDataService.users.getById(storedUserId);
          setCurrentUser(user as Parent | Child | Admin);
        }
      } catch (err) {
        console.error('Auth error:', err);
        localStorage.removeItem('mockUserId');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, just check against our mock users
      let userId: string | null = null;
      
      if (email === mockUsers.parent.email && password === mockUsers.parent.password) {
        userId = mockUsers.parent.id;
      } else if (email === mockUsers.child.email && password === mockUsers.child.password) {
        userId = mockUsers.child.id;
      } else if (email === mockUsers.admin.email && password === mockUsers.admin.password) {
        userId = mockUsers.admin.id;
      } else {
        throw new Error('Invalid email or password');
      }
      
      const user = await mockDataService.users.getById(userId);
      setCurrentUser(user as Parent | Child | Admin);
      localStorage.setItem('mockUserId', userId);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('mockUserId');
  };
  
  // Switch user function (for development only)
  const switchUser = async (role: 'parent' | 'child' | 'admin') => {
    setIsLoading(true);
    
    try {
      let userId: string;
      
      switch (role) {
        case 'parent':
          userId = mockUsers.parent.id;
          break;
        case 'child':
          userId = mockUsers.child.id;
          break;
        case 'admin':
          userId = mockUsers.admin.id;
          break;
        default:
          throw new Error('Invalid role');
      }
      
      const user = await mockDataService.users.getById(userId);
      setCurrentUser(user as Parent | Child | Admin);
      localStorage.setItem('mockUserId', userId);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get activities for the current user
  const getActivities = async (filters?: { category?: string; status?: string }) => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    try {
      let activities: Activity[] = [];
      
      if (currentUser?.role === 'parent' || (isDevMode && !currentUser)) {
        // For parents, get activities they created
        activities = await mockDataService.activities.getForParent(
          currentUser?.id || mockUsers.parent.id
        );
      } else if (currentUser?.role === 'child') {
        // For children, get activities assigned to them
        activities = await mockDataService.activities.getForChild(currentUser.id);
      } else if (currentUser?.role === 'admin') {
        // For admins, get all activities
        activities = await mockDataService.activities.getAll();
      }
      
      // Apply filters if provided
      if (filters) {
        if (filters.category) {
          activities = activities.filter(a => a.category === filters.category);
        }
        
        if (filters.status && currentUser?.role === 'child') {
          // Get submissions for this child to determine status
          const submissions = await mockDataService.submissions.getForChild(currentUser.id);
          
          if (filters.status === 'pending') {
            // Get activities with pending submissions
            const pendingActivityIds = submissions
              .filter(s => s.status === 'pending')
              .map(s => s.activityId);
              
            activities = activities.filter(a => pendingActivityIds.includes(a.id));
          } else if (filters.status === 'completed') {
            // Get activities with approved submissions
            const completedActivityIds = submissions
              .filter(s => s.status === 'approved')
              .map(s => s.activityId);
              
            activities = activities.filter(a => completedActivityIds.includes(a.id));
          } else if (filters.status === 'open') {
            // Get activities without submissions
            const submittedActivityIds = submissions.map(s => s.activityId);
            activities = activities.filter(a => !submittedActivityIds.includes(a.id));
          }
        }
      }
      
      return activities;
    } catch (err) {
      console.error('Error fetching activities:', err);
      return [];
    }
  };
  
  // Get submissions for the current user
  const getSubmissions = async (filters?: { status?: string }) => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    try {
      let submissions: Submission[] = [];
      
      if (currentUser?.role === 'parent' || (isDevMode && !currentUser)) {
        // For parents, get submissions they need to review
        submissions = await mockDataService.submissions.getForParent(
          currentUser?.id || mockUsers.parent.id
        );
      } else if (currentUser?.role === 'child') {
        // For children, get their submissions
        submissions = await mockDataService.submissions.getForChild(currentUser.id);
      } else if (currentUser?.role === 'admin') {
        // For admins, get all submissions
        submissions = await mockDataService.submissions.getAll();
      }
      
      // Apply filters if provided
      if (filters?.status) {
        submissions = submissions.filter(s => s.status === filters.status);
      }
      
      return submissions;
    } catch (err) {
      console.error('Error fetching submissions:', err);
      return [];
    }
  };
  
  // Get notifications for the current user
  const getNotifications = async () => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    try {
      return await mockDataService.notifications.getForUser(
        currentUser?.id || mockUsers.parent.id
      );
    } catch (err) {
      console.error('Error fetching notifications:', err);
      return [];
    }
  };
  
  // Get unread notification count for the current user
  const getUnreadNotificationCount = async () => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    try {
      const unreadNotifications = await mockDataService.notifications.getUnreadForUser(
        currentUser?.id || mockUsers.parent.id
      );
      return unreadNotifications.length;
    } catch (err) {
      console.error('Error fetching unread notifications:', err);
      return 0;
    }
  };
  
  // Get children for parent
  const getChildrenForParent = async (parentId: string) => {
    try {
      const children = await mockDataService.users.getChildrenForParent(parentId);
      return children as Child[];
    } catch (err) {
      console.error('Error fetching children:', err);
      return [];
    }
  };
  
  // Get token balance for child
  const getTokenBalance = async (childId: string) => {
    try {
      const child = await mockDataService.users.getById(childId) as Child;
      return child.tokenBalance;
    } catch (err) {
      console.error('Error fetching token balance:', err);
      return 0;
    }
  };
  
  // Get token history for child
  const getTokenHistory = async (childId: string) => {
    try {
      return await mockDataService.transactions.getForChild(childId);
    } catch (err) {
      console.error('Error fetching token history:', err);
      return [];
    }
  };
  
  // Submit activity
  const submitActivity = async (submission: { activityId: string; notes: string; evidenceUrl?: string }) => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser?.role !== 'child' && !isDevMode) {
      throw new Error('Only children can submit activities');
    }
    
    try {
      const activity = await mockDataService.activities.getById(submission.activityId);
      
      // Create submission
      await mockDataService.submissions.create({
        activityId: submission.activityId,
        childId: currentUser?.id || mockUsers.child.id,
        parentId: (currentUser as Child)?.parentId || mockUsers.parent.id,
        status: 'pending',
        evidenceUrl: submission.evidenceUrl,
        notes: submission.notes,
        tokenValue: activity.tokenValue,
        tokenAwarded: false,
      });
    } catch (err) {
      console.error('Error submitting activity:', err);
      throw err;
    }
  };
  
  // Review submission
  const reviewSubmission = async (submissionId: string, approved: boolean, feedback?: string) => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser?.role !== 'parent' && !isDevMode) {
      throw new Error('Only parents can review submissions');
    }
    
    try {
      await mockDataService.submissions.update(submissionId, {
        status: approved ? 'approved' : 'rejected',
        feedback,
      });
    } catch (err) {
      console.error('Error reviewing submission:', err);
      throw err;
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await mockDataService.notifications.markAsRead(notificationId);
    } catch (err) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  };
  
  // Create activity
  const createActivity = async (activity: Partial<Activity>) => {
    if (!currentUser && !isDevMode) {
      throw new Error('User not authenticated');
    }
    
    if (currentUser?.role !== 'parent' && currentUser?.role !== 'admin' && !isDevMode) {
      throw new Error('Only parents and admins can create activities');
    }
    
    try {
      // Fill in missing fields
      const newActivity = await mockDataService.activities.create({
        title: activity.title || 'New Activity',
        description: activity.description || '',
        category: activity.category || 'educational',
        tokenValue: activity.tokenValue || 10,
        requiresEvidence: activity.requiresEvidence ?? true,
        createdBy: currentUser?.id || mockUsers.parent.id,
        assignedTo: activity.assignedTo || [],
        dueDate: activity.dueDate,
        recurringType: activity.recurringType || 'none',
        isTemplate: activity.isTemplate || false,
      });
      
      return newActivity;
    } catch (err) {
      console.error('Error creating activity:', err);
      throw err;
    }
  };
  
  // Context value
  const value: MockDataContextType = {
    currentUser,
    isLoading,
    error,
    login,
    logout,
    getActivities,
    getSubmissions,
    getNotifications,
    getUnreadNotificationCount,
    getChildrenForParent,
    getTokenBalance,
    getTokenHistory,
    submitActivity,
    reviewSubmission,
    markNotificationAsRead,
    createActivity,
    switchUser,
    setDevMode,
    isDevMode,
  };
  
  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
};

// Hook to use mock data context
export const useMockData = () => {
  const context = useContext(MockDataContext);
  
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  
  return context;
};