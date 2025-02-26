import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import { RefreshCw } from 'lucide-react';

interface UpdatePromptProps {
  onUpdate: () => void;
}

const UpdatePrompt: React.FC<UpdatePromptProps> = ({ onUpdate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Update Available</Text>
        <Text style={styles.description}>
          A new version of Zooz is available. Update now to get the latest features and improvements.
        </Text>
        
        <Button
          title="Update Now"
          leftIcon={<RefreshCw size={20} color={theme.colors.neutral[0]} />}
          onPress={onUpdate}
        />
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
});

export default UpdatePrompt;