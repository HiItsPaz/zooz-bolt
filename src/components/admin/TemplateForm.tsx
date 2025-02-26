import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import Button from '../ui/Button';
import { CategoryType } from '../activities/CategoryBadge';
import { Activity } from '../../services/mockData';
import { ACTIVITY_CATEGORIES } from '../../constants';

interface TemplateFormProps {
  template?: Activity | null;
  onSubmit: (data: Partial<Activity>) => Promise<void>;
  onCancel: () => void;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: template?.title || '',
    description: template?.description || '',
    category: template?.category || 'educational',
    tokenValue: template?.tokenValue?.toString() || '10',
    requiresEvidence: template?.requiresEvidence ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    const tokenValue = parseInt(formData.tokenValue, 10);
    if (isNaN(tokenValue) || tokenValue < 1) {
      setError('Token value must be a positive number');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit({
        ...formData,
        tokenValue,
        isTemplate: true,
      });
    } catch (err: any) {
      console.error('Error saving template:', err);
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        {template ? 'Edit Template' : 'Create Template'}
      </Text>
      
      <View style={styles.formSection}>
        <Input
          label="Title"
          value={formData.title}
          onChangeText={(value) => setFormData(prev => ({ ...prev, title: value }))}
          placeholder="Enter activity title"
          required
        />
        
        <TextArea
          label="Description"
          value={formData.description}
          onChangeText={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Enter activity description"
          minHeight={100}
          maxHeight={200}
          required
        />
        
        <Select
          label="Category"
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value as CategoryType }))}
          options={ACTIVITY_CATEGORIES.map(cat => ({
            value: cat.id,
            label: cat.label,
          }))}
        />
        
        <Input
          label="Token Value"
          value={formData.tokenValue}
          onChangeText={(value) => setFormData(prev => ({ ...prev, tokenValue: value }))}
          placeholder="Enter token value" ```typescript
          type="number"
          required
        />
        
        <Checkbox
          label="Requires photo evidence"
          checked={formData.requiresEvidence}
          onChange={(checked) => setFormData(prev => ({ ...prev, requiresEvidence: checked }))}
        />
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.actionButtons}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          disabled={loading}
          style={styles.cancelButton}
        />
        <Button
          title={template ? 'Save Changes' : 'Create Template'}
          onPress={handleSubmit}
          disabled={loading}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  formSection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: theme.spacing.spacing.sm,
  },
});

export default TemplateForm;

export default TemplateForm