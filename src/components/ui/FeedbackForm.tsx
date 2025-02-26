import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import TextArea from './TextArea';
import Button from './Button';
import { lightTheme as theme } from '../../styles/theme';

interface FeedbackFormProps {
  initialValue?: string;
  maxLength?: number;
  onSubmit: (feedback: string) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  error?: string;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  initialValue = '',
  maxLength = 500,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  loading = false,
  error,
}) => {
  const [feedback, setFeedback] = useState(initialValue);
  
  const handleSubmit = () => {
    if (feedback.trim()) {
      onSubmit(feedback);
    }
  };
  
  return (
    <View style={styles.container}>
      <TextArea
        label="Feedback"
        value={feedback}
        onChangeText={setFeedback}
        placeholder="Enter your feedback..."
        minHeight={80}
        maxHeight={160}
        maxLength={maxLength}
        showCounter
        disabled={loading}
        error={error}
      />
      
      <View style={styles.actionButtons}>
        {onCancel && (
          <Button
            title={cancelLabel}
            variant="outline"
            onPress={onCancel}
            disabled={loading}
            style={styles.cancelButton}
          />
        )}
        <Button
          title={submitLabel}
          onPress={handleSubmit}
          disabled={loading || !feedback.trim()}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.spacing.sm,
  },
  cancelButton: {
    marginRight: theme.spacing.spacing.sm,
  },
});

export default FeedbackForm;