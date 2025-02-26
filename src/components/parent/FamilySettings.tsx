import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useMockData } from '../../context/MockDataContext';
import { Child } from '../../services/mockData';
import AddChildForm from './AddChildForm';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';

const FamilySettings = () => {
  const { currentUser } = useMockData();
  const [showAddChild, setShowAddChild] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleAddChild = async (childData: { displayName: string; age: number }) => {
    setLoading(true);
    setError(null);
    
    try {
      // Add child logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Child added:', childData);
      setShowAddChild(false);
    } catch (err: any) {
      setError(err.message || 'Failed to add child');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Card elevation="md" style={styles.familyCard}>
        <Text style={styles.title}>Family Settings</Text>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Children</Text>
            <Button
              title="Add Child"
              size="sm"
              leftIcon={<Plus size={16} color={theme.colors.neutral[0]} />}
              onPress={() => setShowAddChild(true)}
            />
          </View>
          
          {children.length > 0 ? (
            <View style={styles.childrenList}>
              {children.map(child => (
                <View key={child.id} style={styles.childItem}>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.displayName}</Text>
                    <Text style={styles.childAge}>Age: {child.age}</Text>
                  </View>
                  
                  <View style={styles.childActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {}}
                    >
                      <Edit2 size={16} color={theme.colors.primary[500]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => {}}
                    >
                      <Trash2 size={16} color={theme.colors.semantic.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No children added yet. Click the "Add Child" button to get started.
              </Text>
            </View>
          )}
        </View>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </Card>
      
      {showAddChild && (
        <Card elevation="md" style={styles.formCard}>
          <AddChildForm
            onSubmit={handleAddChild}
            onCancel={() => setShowAddChild(false)}
            loading={loading}
          />
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.spacing.lg,
  },
  familyCard: {
    padding: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
  },
  childrenList: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.spacing.md,
    gap: theme.spacing.spacing.sm,
  },
  childItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.md,
    ...theme.spacing.shadow.sm,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  childAge: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  childActions: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.spacing.xs,
  },
  emptyState: {
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.md,
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginTop: theme.spacing.spacing.sm,
  },
  formCard: {
    padding: theme.spacing.spacing.lg,
  },
});

export default FamilySettings;