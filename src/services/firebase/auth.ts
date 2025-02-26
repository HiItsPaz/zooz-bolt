import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, Parent, Child, Admin } from '../../types/index';

// Create a new parent user
export const createParentUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<Parent> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update profile with display name
  await updateProfile(userCredential.user, { displayName });
  
  // Create user document in Firestore
  const userDoc = doc(db, 'users', userCredential.user.uid);
  const userData: Parent = {
    id: userCredential.user.uid,
    email,
    displayName,
    role: 'parent',
    children: [],
    notificationPreferences: {
      email: true,
      push: true,
      inApp: true,
    },
    createdAt: serverTimestamp(),
  };
  
  await setDoc(userDoc, userData);
  return userData;
};

// Create a child user
export const createChildUser = async (
  displayName: string,
  age: number,
  parentId: string
): Promise<Child> => {
  // Create user document in Firestore
  const userDoc = doc(db, 'users', `child_${Date.now()}`);
  const userData: Child = {
    id: userDoc.id,
    displayName,
    role: 'child',
    parentId,
    age,
    tokenBalance: 0,
    createdAt: serverTimestamp(),
  };
  
  await setDoc(userDoc, userData);
  
  // Update parent's children array
  const parentDoc = doc(db, 'users', parentId);
  const parentData = (await getDoc(parentDoc)).data() as Parent;
  await setDoc(parentDoc, {
    ...parentData,
    children: [...parentData.children, userDoc.id],
  });
  
  return userData;
};

// Sign in user
export const signInUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  return userDoc.data() as User;
};

// Sign out user
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Get current user data
export const getCurrentUser = async (): Promise<User | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  return userDoc.data() as User;
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      callback(userDoc.data() as User);
    } else {
      callback(null);
    }
  });
};