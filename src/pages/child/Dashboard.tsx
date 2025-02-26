import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, Animated, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ChildLayout from '../../components/layout/ChildLayout';
import QuestCard from '../../components/child/QuestCard';
import ProgressTracker from '../../components/child/ProgressTracker';
import RecentActivityList from '../../components/child/RecentActivityList';
import { useMockData } from '../../context/MockDataContext';
import useActivities from '../../hooks/useActivities';
import useSubmissions from '../../hooks/useSubmissions';
import { Activity, Submission } from '../../services/mockData';
import { Trophy, Star, Scroll } from 'lucide-react-native';

const Dashboard = () => {
  const { currentUser } = useMockData();
  const { activities, loading: activitiesLoading } = useActivities();
  const { submissions } = useSubmissions();
  const [tokenBalance] = useState(currentUser?.role === 'child' ? currentUser.tokenBalance : 0);
  const [tokenAnimation] = useState(new Animated.Value(0));
  
  // Animate token balance on mount
  useEffect(() => {
    Animated.spring(tokenAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Group activities by category
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);
  
  // Get recent submissions
  const recentSubmissions = submissions
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);
  
  // Calculate completion stats
  const completedActivities = submissions.filter(s => s.status === 'approved').length;
  const totalActivities = activities.length;
  const completionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  
  return (
    <ChildLayout>
      <ScrollView style={styles.container}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&q=80' }}
            style={styles.heroBackground}
          />
          <View style={styles.heroContent}>
            <Text style={styles.welcomeText}>
              Welcome back, {currentUser?.displayName || 'Adventurer'}!
            </Text>
            <Animated.View
              style={[
                styles.statsContainer,
                {
                  transform: [
                    {
                      scale: tokenAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.statItem}>
                <Trophy size={24} color={theme.colors.accent[500]} />
                <Text style={styles.statValue}>{completedActivities}</Text>
                <Text style={styles.statLabel}>Quests Completed</Text>
              </View>
              <View style={styles.statItem}>
                <Star size={24} color={theme.colors.primary[500]} />
                <Text style={styles.statValue}>{Math.round(completionRate)}%</Text>
                <Text style={styles.statLabel}>Success Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Scroll size={24} color={theme.colors.secondary[500]} />
                <Text style={styles.statValue}>{activities.length}</Text>
                <Text style={styles.statLabel}>Available Quests</Text>
              </View>
            </Animated.View>
          </View>
        </View>
        
        {/* Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <ProgressTracker submissions={submissions} activities={activities} />
        </View>
        
        {/* Available Quests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Quests</Text>
          {Object.entries(groupedActivities).map(([category, categoryActivities]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>
                {category.charAt(0).toUpperCase() + category.slice(1)} Quests
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.questRow}>
                  {categoryActivities.map(activity => (
                    <QuestCard
                      key={activity.id}
                      activity={activity}
                      submissions={submissions}
                      style={styles.questCard}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          ))}
        </View>
        
        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <RecentActivityList submissions={recentSubmissions} activities={activities} />
        </View>
      </ScrollView>
    </ChildLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroSection: {
    height: 300,
    position: 'relative',
    marginBottom: theme.spacing.spacing.xl,
  },
  heroBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    opacity: 0.3,
  },
  heroContent: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
    justifyContent: 'space-between',
  },
  welcomeText: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginVertical: theme.spacing.spacing.xs,
  },
  statLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.spacing.xl,
    paddingHorizontal: theme.spacing.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  categorySection: {
    marginBottom: theme.spacing.spacing.lg,
  },
  categoryTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.sm,
  },
  questRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.spacing.sm,
  },
  questCard: {
    marginRight: theme.spacing.spacing.md,
  },
});

export default Dashboard;