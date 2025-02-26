import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TemplateForm from '../../components/admin/TemplateForm';
import { useMockData } from '../../context/MockDataContext';
import { Activity } from '../../services/mockData';
import { ACTIVITY_CATEGORIES } from '../../constants';
import { Search, Plus, Copy, Trash } from 'lucide-react-native';

const Templates = () => {
  const [templates, setTemplates] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Activity | null>(null);
  
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const templatesData = await mockDataService.activities.getTemplates();
        setTemplates(templatesData);
      } catch (err: any) {
        console.error('Error loading templates:', err);
        setError(err.message || 'Failed to load activity templates');
      } finally {
        setLoading(false);
      }
    };
    
    loadTemplates();
  }, []);
  
  // Filter templates based on search and category
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Group templates by category
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, Activity[]>);
  
  if (loading) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading templates...</Text>
        </View>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Activity Templates</Text>
          <Button
            title="Create Template"
            leftIcon={<Plus size={20} color={theme.colors.neutral[0]} />}
            onPress={() => {
              setSelectedTemplate(null);
              setShowForm(true);
            }}
          />
        </View>
        
        {/* Search and Filters */}
        <View style={styles.filters}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search templates..."
            leftIcon={<Search size={20} color={theme.colors.neutral[400]} />}
            containerStyle={styles.searchInput}
          />
          <Select
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value)}
            options={[
              { value: 'all', label: 'All Categories' },
              ...ACTIVITY_CATEGORIES.map(cat => ({
                value: cat.id,
                label: cat.label,
              })),
            ]}
            containerStyle={styles.categoryFilter}
          />
        </View>
        
        {/* Templates Grid */}
        <View style={styles.content}>
          {showForm ? (
            <Card elevation="md" style={styles.formCard}>
              <TemplateForm
                template={selectedTemplate}
                onSubmit={async (data) => {
                  // Handle template creation/update
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            </Card>
          ) : (
            <View style={styles.templatesGrid}>
              {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                <View key={category} style={styles.categorySection}>
                  <Text style={styles.categoryTitle}>
                    {ACTIVITY_CATEGORIES.find(cat => cat.id === category)?.label || category}
                  </Text>
                  <View style={styles.templatesList}>
                    {categoryTemplates.map(template => (
                      <Card
                        key={template.id}
                        elevation="sm"
                        style={styles.templateCard}
                        onPress={() => {
                          setSelectedTemplate(template);
                          setShowForm(true);
                        }}
                      >
                        <Text style={styles.templateTitle}>{template.title}</Text>
                        <Text 
                          style={styles.templateDescription}
                          numberOfLines={2}
                        >
                          {template.description}
                        </Text>
                        
                        <View style={styles.templateFooter}>
                          <View style={styles.tokenValue}>
                            <Text style={styles.tokenLabel}>Tokens:</Text>
                            <Text style={styles.tokenAmount}>{template.tokenValue}</Text>
                          </View>
                          
                          <View style={styles.templateActions}>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => {
                                // Handle template duplication
                              }}
                            >
                              <Copy size={16} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => {
                                // Handle template deletion
                              }}
                            >
                              <Trash size={16} color={theme.colors.semantic.error} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Card>
                    ))}
                  </View>
                </View>
              ))}
              
              {filteredTemplates.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No templates found</Text>
                  <Text style={styles.emptyStateText}>
                    {searchQuery
                      ? `No templates match "${searchQuery}"`
                      : "No templates available"}
                  </Text>
                  {searchQuery && (
                    <Button
                      title="Clear Search"
                      variant="outline"
                      onPress={() => setSearchQuery('')}
                      style={styles.clearButton}
                    />
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: theme.spacing.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing.spacing.md,
  },
  categoryFilter: {
    width: 200,
  },
  content: {
    flex: 1,
  },
  formCard: {
    padding: theme.spacing.spacing.lg,
  },
  templatesGrid: {
    flex: 1,
  },
  categorySection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  categoryTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  templatesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.md,
  },
  templateCard: {
    width: 300,
    padding: theme.spacing.spacing.md,
  },
  templateTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  templateDescription: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.md,
  },
  templateFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.spacing.sm,
  },
  tokenValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.spacing.xs,
  },
  tokenAmount: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  templateActions: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.sm,
  },
  actionButton: {
    padding: theme.spacing.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.spacing.xl,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
  },
  emptyStateTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  clearButton: {
    minWidth: 120,
  },
});

export default Templates;