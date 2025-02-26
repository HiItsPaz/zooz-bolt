import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInUser, 
  signOutUser, 
  createParentUser, 
  createChildUser,
  getCurrentUser,
  onAuthStateChange,
} from '../services/firebase/auth';
import { User, Parent, Child } from '../types/index';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerParent: (email: string, password: string, displayName: string) => Promise<void>;
  registerChild: (displayName: string, age: number, parentId: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await signInUser(email, password);
      setUser(user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await signOutUser();
      setUser(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const registerParent = async (email: string, password: string, displayName: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await createParentUser(email, password, displayName);
      setUser(user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const registerChild = async (displayName: string, age: number, parentId: string) => {
    try {
      setLoading(true);
      setError(null);
      const child = await createChildUser(displayName, age, parentId);
      // Don't set user here since children don't have auth accounts
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const clearError = () => setError(null);
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signOut,
        registerParent,
        registerChild,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};