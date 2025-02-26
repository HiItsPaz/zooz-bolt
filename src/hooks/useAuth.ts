import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, signIn, signOutUser, registerParent, registerChild } from '../services/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  registerParent: (email: string, password: string, displayName: string) => Promise<void>;
  registerChild: (displayName: string, age: number, parentId: string) => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,
      initialized: false,

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const user = await signIn(email, password);
          set({ user, loading: false, error: null });
        } catch (err: any) {
          set({ 
            error: err.message || 'Failed to sign in', 
            loading: false 
          });
          throw err;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          await signOutUser();
          set({ user: null, loading: false, error: null });
        } catch (err: any) {
          set({ 
            error: err.message || 'Failed to sign out', 
            loading: false 
          });
          throw err;
        }
      },

      registerParent: async (email: string, password: string, displayName: string) => {
        set({ loading: true, error: null });
        try {
          const user = await registerParent(email, password, displayName);
          set({ user, loading: false, error: null });
        } catch (err: any) {
          set({ 
            error: err.message || 'Failed to register', 
            loading: false 
          });
          throw err;
        }
      },

      registerChild: async (displayName: string, age: number, parentId: string) => {
        set({ loading: true, error: null });
        try {
          await registerChild(displayName, age, parentId);
          set({ loading: false, error: null });
        } catch (err: any) {
          set({ 
            error: err.message || 'Failed to register child', 
            loading: false 
          });
          throw err;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuth;