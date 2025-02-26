import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import InstallPrompt from './InstallPrompt';
import UpdatePrompt from './UpdatePrompt';
import OfflineBanner from './OfflineBanner';

interface PWAContextType {
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateApp: () => void;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [updateSW, setUpdateSW] = useState<(() => Promise<void>) | null>(null);

  useEffect(() => {
    // Register service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        setIsUpdateAvailable(true);
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });
    setUpdateSW(() => updateSW);

    // Online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateApp = async () => {
    if (updateSW) {
      await updateSW();
      setIsUpdateAvailable(false);
      window.location.reload();
    }
  };

  return (
    <PWAContext.Provider value={{ isOnline, isUpdateAvailable, updateApp }}>
      {children}
      <OfflineBanner />
      {isUpdateAvailable && <UpdatePrompt onUpdate={updateApp} />}
      <InstallPrompt />
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
};