import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import { Download } from 'lucide-react';
import { usePWA } from '../../hooks/usePWA';

interface InstallPromptProps {
  onDismiss?: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { canInstall, promptInstall } = usePWA();

  if (!canInstall) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Install Zooz</Text>
        <Text style={styles.description}>
          Install Zooz on your device for the best experience and offline access.
        </Text>
        
        <View style={styles.actions}>
          {onDismiss && (
            <Button
              title="Maybe Later"
              variant="outline"
              onPress={onDismiss}
              style={styles.dismissButton}
            />
          )}
          <Button
            title="Install"
            leftIcon={<Download size={20} color={theme.colors.neutral[0]} />}
            onPress={promptInstall}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.lg,
  },
  content: {
    maxWidth: 600,
    marginHorizontal: 'auto',
  },
  title: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  description: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.spacing.sm,
  },
  dismissButton: {
    marginRight: theme.spacing.spacing.xs,
  },
});

export default InstallPrompt;