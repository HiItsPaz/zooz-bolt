import { 
  collection,
  doc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { User, Parent, Child, Admin, Activity, Submission, Transaction, Notification } from '../../types/index';

// Users collection
export const usersCollection = collection(db, 'users');
export const activitiesCollection = collection(db, 'activities');
export const submissionsCollection = collection(db, 'submissions');
export const transactionsCollection = collection(db, 'transactions');
export const notificationsCollection = collection(db, 'notifications');

// User operations
export const getUserById = async (id: string): Promise<User> => {
  const userDoc = await getDoc(doc(db, 'users', id));
  return userDoc.data() as User;
};

export const getChildrenForParent = async (parentId: string): Promise<Child[]> => {
  const q = query(
    usersCollection,
    where('role', '==', 'child'),
    where('parentId', '==', parentId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Child);
};

// Activity operations
export const getActivitiesForParent = async (parentId: string): Promise<Activity[]> => {
  const q = query(
    activitiesCollection,
    where('createdBy', '==', parentId),
    where('isTemplate', '==', false)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
};

export const getActivitiesForChild = async (childId: string): Promise<Activity[]> => {
  const q = query(
    activitiesCollection,
    where('assignedTo', 'array-contains', childId),
    where('isTemplate', '==', false)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
};

export const createActivity = async (activity: Omit<Activity, 'id' | 'createdAt' | 'updatedAt'>): Promise<Activity> => {
  const activityRef = doc(activitiesCollection);
  const newActivity = {
    ...activity,
    id: activityRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  await setDoc(activityRef, newActivity);
  return newActivity;
};

// Submission operations
export const getSubmissionsForParent = async (parentId: string): Promise<Submission[]> => {
  const q = query(
    submissionsCollection,
    where('parentId', '==', parentId),
    orderBy('submittedAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
};

export const createSubmission = async (submission: Omit<Submission, 'id' | 'submittedAt' | 'reviewedAt'>): Promise<Submission> => {
  const submissionRef = doc(submissionsCollection);
  const newSubmission = {
    ...submission,
    id: submissionRef.id,
    submittedAt: serverTimestamp(),
  };
  
  await setDoc(submissionRef, newSubmission);
  return newSubmission;
};

// Transaction operations
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> => {
  const transactionRef = doc(transactionsCollection);
  const newTransaction = {
    ...transaction,
    id: transactionRef.id,
    createdAt: serverTimestamp(),
  };
  
  await setDoc(transactionRef, newTransaction);
  
  // Update child's token balance
  const childDoc = doc(db, 'users', transaction.childId);
  const childData = (await getDoc(childDoc)).data() as Child;
  await updateDoc(childDoc, {
    tokenBalance: childData.tokenBalance + transaction.amount,
  });
  
  return newTransaction;
};

// Notification operations
export const getNotificationsForUser = async (userId: string): Promise<Notification[]> => {
  const q = query(
    notificationsCollection,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
};

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> => {
  const notificationRef = doc(notificationsCollection);
  const newNotification = {
    ...notification,
    id: notificationRef.id,
    createdAt: serverTimestamp(),
  };
  
  await setDoc(notificationRef, newNotification);
  return newNotification;
};

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true,
  });
};