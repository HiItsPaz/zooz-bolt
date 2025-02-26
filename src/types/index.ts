// User related types
export interface User {
  id: string;
  email?: string;
  displayName: string;
  role: 'parent' | 'child' | 'admin';
  createdAt: Date;
}

export interface Parent extends User {
  role: 'parent';
  children: string[]; // Array of child user IDs
}

export interface Child extends User {
  role: 'child';
  parentId: string;
  age: number;
  tokenBalance: number;
}

export interface Admin extends User {
  role: 'admin';
}

// Activity related types
export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'educational' | 'social' | 'house chores' | 'physical';
  tokenValue: number;
  requiresEvidence: boolean;
  createdBy: string; // Parent user ID
  assignedTo: string[]; // Child user IDs
  dueDate?: Date;
  createdAt: Date;
}

export interface Submission {
  id: string;
  activityId: string;
  childId: string;
  status: 'pending' | 'approved' | 'rejected';
  evidenceUrl?: string;
  notes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}