import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ChildLayout from '../../components/layout/ChildLayout';
import { useMockData } from '../../context/MockDataContext';
import useActivities from '../../hooks/useActivities';
import { Activity } from '../../services/mockData';
import { ACTIVITY_CATEGORIES } from '../../constants';
import QuestCard from '../../components/child/QuestCard';
import Button from '../../components/ui/Button';
import { Search, Filter } from 'lucide-react-native';
import Input from '../../components/ui/Input';

const Activities = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { activities, loading, refreshActivities } = useActivities();
  
  // Filter activities based on search and category
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = !selectedCategory || activity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Handle activity selection
  const handleActivitySelect = (activity: Activity) => {
    // Navigate to activity detail
    console.log('Selected activity:', activity.id);
  };
  
  // Render activity item
  const renderActivity = ({ item }: { item: Activity }) => (
    <QuestCard
      activity={item}
      submissions={[]} // We'll implement this later
      onPress={() => handleActivitySelect(item)}
      style={styles.questCard}
    />
  );
  
  // Loading state
  if (loading) {
    return (
      <ChildLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading quests...</Text>
        </View>
      </ChildLayout>
    );
  }
  
  return (
    <ChildLayout>
      <View style={styles.container}>
        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search quests..."
            leftIcon={<Search size={20} color={theme.colors.neutral[400]} />}
            containerStyle={styles.searchInput}
          />
          <Button
            title="Filter"
            variant="outline"
            size="sm"
            leftIcon={<Filter size={20} />}
            onPress={() => {}} // We'll implement filters later
          />
        </View>
        
        {/* Category Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryFilters}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              !selectedCategory && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                !selectedCategory && styles.activeCategoryButtonText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {ACTIVITY_CATEGORIES.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.activeCategoryButton,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id && styles.activeCategoryButtonText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Activities Grid */}
        <FlatList
          data={filteredActivities}
          renderItem={renderActivity}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.activitiesRow}
          contentContainerStyle={styles.activitiesList}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No quests found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery
                  ? `No quests match "${searchQuery}"`
                  : "You don't have any quests available right now."}
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
          refreshing={loading}
          onRefresh={refreshActivities}
        />
      </View>
    </ChildLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.md,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing.spacing.sm,
  },
  categoryFilters: {
    marginBottom: theme.spacing.spacing.md,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.spacing.md,
    paddingVertical: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    marginRight: theme.spacing.spacing.sm,
  },
  activeCategoryButton: {
    backgroundColor: theme.colors.primary[500],
  },
  categoryButtonText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
  activeCategoryButtonText: {
    color: theme.colors.neutral[0],
  },
  activitiesList: {
    paddingBottom: theme.spacing.spacing.xl,
  },
  activitiesRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.spacing.md,
  },
  questCard: {
    width: '48%',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.spacing.xl,
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

export default Activities;