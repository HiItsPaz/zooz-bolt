import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from '../ui/LoadingScreen';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { loading, initialized } = useAuth();

  // Show loading screen while initializing auth
  if (!initialized || loading) {
    return <LoadingScreen message="Initializing..." />;
  }

  return <>{children}</>;
};

export default AuthProvider;