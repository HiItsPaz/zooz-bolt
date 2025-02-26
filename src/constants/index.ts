// Application constants
export const APP_NAME = 'Zooz';
export const APP_DESCRIPTION = 'Complete real-world activities to earn gaming currency';

// Activity categories
export const ACTIVITY_CATEGORIES = [
  { id: 'educational', label: 'Educational', icon: 'book' },
  { id: 'social', label: 'Social', icon: 'users' },
  { id: 'house chores', label: 'House Chores', icon: 'home' },
  { id: 'physical', label: 'Physical', icon: 'activity' }
];

// Default token values by category
export const DEFAULT_TOKEN_VALUES = {
  'educational': 15,
  'social': 10,
  'house chores': 8,
  'physical': 12
};

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PARENT_DASHBOARD: '/parent/dashboard',
  CHILD_DASHBOARD: '/child/home',
  ADMIN_DASHBOARD: '/admin/dashboard'
};