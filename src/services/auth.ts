import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'parent' | 'child' | 'admin';
  createdAt: Date;
}

export interface Parent extends User {
  role: 'parent';
  children: string[];
}

export interface Child extends User {
  role: 'child';
  parentId: string;
  age: number;
  tokenBalance: number;
}

// Auth functions
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  return userDoc.data() as User;
};

export const registerParent = async (
  email: string,
  password: string,
  displayName: string
): Promise<Parent> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  const userData: Parent = {
    id: userCredential.user.uid,
    email,
    displayName,
    role: 'parent',
    children: [],
    createdAt: new Date(),
  };
  
  await setDoc(doc(db, 'users', userCredential.user.uid), userData);
  return userData;
};

export const registerChild = async (
  displayName: string,
  age: number,
  parentId: string
): Promise<Child> => {
  // Create child document in Firestore
  const childId = `child_${Date.now()}`;
  const childData: Child = {
    id: childId,
    email: '',
    displayName,
    role: 'child',
    parentId,
    age,
    tokenBalance: 0,
    createdAt: new Date(),
  };
  
  await setDoc(doc(db, 'users', childId), childData);
  
  // Update parent's children array
  const parentRef = doc(db, 'users', parentId);
  const parentDoc = await getDoc(parentRef);
  const parentData = parentDoc.data() as Parent;
  
  await setDoc(parentRef, {
    ...parentData,
    children: [...parentData.children, childId],
  });
  
  return childData;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  
  const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
  return userDoc.data() as User;
};

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