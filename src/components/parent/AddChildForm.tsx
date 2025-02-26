import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface AddChildFormProps {
  onSubmit: (data: { displayName: string; age: number }) => void;
  onCancel: () => void;
  loading?: boolean;
}

const AddChildForm: React.FC<AddChildFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    displayName: '',
    age: '',
  });
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = () => {
    setError(null);
    
    if (!formData.displayName.trim()) {
      setError('Please enter a display name');
      return;
    }
    
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 1 || age > 17) {
      setError('Please enter a valid age between 1 and 17');
      return;
    }
    
    onSubmit({
      displayName: formData.displayName.trim(),
      age,
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Child</Text>
      
      <Input
        label="Display Name"
        value={formData.displayName}
        onChangeText={(value) => setFormData(prev => ({ ...prev, displayName: value }))}
        placeholder="Enter child's name"
        required
        disabled={loading}
      />
      
      <Input
        label="Age"
        value={formData.age}
        onChangeText={(value) => setFormData(prev => ({ ...prev, age: value }))}
        placeholder="Enter child's age"
        type="number"
        required
        disabled={loading}
      />
      
      {error && (
        <Text style={ styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          disabled={loading}
          style={styles.cancelButton}
        />
        <Button
          title="Add Child"
          onPress={handleSubmit}
          loading={loading}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.spacing.md,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.spacing.sm,
    marginTop: theme.spacing.spacing.md,
  },
  cancelButton: {
    marginRight: theme.spacing.spacing.xs,
  },
});

export default AddChildForm;