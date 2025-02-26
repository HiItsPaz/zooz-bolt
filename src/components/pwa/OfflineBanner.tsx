import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { WifiOff } from 'lucide-react';

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <WifiOff size={20} color={theme.colors.semantic.error} />
      <Text style={styles.text}>
        You are offline. Some features may be limited.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.semantic.error + '10',
    paddingVertical: theme.spacing.spacing.sm,
    paddingHorizontal: theme.spacing.spacing.md,
    gap: theme.spacing.spacing.sm,
  },
  text: {
    ...theme.typography.textStyle.body,
    color: theme.colors.semantic.error,
  },
});

export default OfflineBanner;