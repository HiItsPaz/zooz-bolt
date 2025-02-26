import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ChildLayout from '../../components/layout/ChildLayout';
import Card from '../../components/ui/Card';
import AchievementBadge from '../../components/gamification/AchievementBadge';
import LevelProgressionBar from '../../components/gamification/LevelProgressionBar';
import StreakTracker from '../../components/gamification/StreakTracker';
import ChallengesList from '../../components/gamification/ChallengesList';
import { useMockData } from '../../context/MockDataContext';
import {  as Trophy,  as Star,  as Target } from 'lucide-react-native';

export default function Achievements() {
  const { currentUser } = useMockData();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'challenges'>('achievements');
  
  // Mock data (replace with real data in production)
  const mockAchievements = [
    {
      id: '1',
      title: 'Early Bird',
      description: 'Complete 5 activities before 10 AM',
      icon: 'https://images.unsplash.com/photo-1495427513693-3f40da04b3fd?w=100&h=100&fit=crop',
      isUnlocked: true,
      progress: 5,
      maxProgress: 5,
    },
    {
      id: '2',
      title: 'Math Wizard',
      description: 'Complete 10 math activities',
      icon: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=100&h=100&fit=crop',
      isUnlocked: false,
      progress: 6,
      maxProgress: 10,
    },
    // Add more achievements
  ];
  
  const mockChallenges = [
    {
      id: '1',
      title: 'Weekend Scholar',
      description: 'Complete 3 educational activities this weekend',
      category: 'weekly',
      difficulty: 'medium',
      rewardTokens: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      isCompleted: false,
      progress: 1,
      maxProgress: 3,
    },
    // Add more challenges
  ];
  
  return (
    <ChildLayout>
      <ScrollView style={styles.container}>
        {/* Level Progress */}
        <Card elevation="md" style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <Star size={24} color={theme.colors.primary[500]} />
              <Text style={styles.levelTitle}>Current Level</Text>
            </View>
            <View style={styles.xpInfo}>
              <Text style={styles.xpLabel}>Total XP</Text>
              <Text style={styles.xpValue}>1,234</Text>
            </View>
          </View>
          
          <LevelProgressionBar
            currentLevel={5}
            currentXP={234}
            xpForNextLevel={500}
            showInfo
          />
        </Card>
        
        {/* Activity Streak */}
        <View style={styles.section}>
          <StreakTracker
            currentStreak={3}
            longestStreak={7}
            activityDates={[
              new Date(),
              new Date(Date.now() - 24 * 60 * 60 * 1000),
              new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            ]}
          />
        </View>
        
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'achievements' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('achievements')}
          >
            <Trophy 
              size={20} 
              color={selectedTab === 'achievements' 
                ? theme.colors.primary[500] 
                : theme.colors.neutral[400]
              } 
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'achievements' && styles.activeTabText,
              ]}
            >
              Achievements
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'challenges' && styles.activeTab,
            ]}
            onPress={() => setSelectedTab('challenges')}
          >
            <Target 
              size={20} 
              color={selectedTab === 'challenges' 
                ? theme.colors.primary[500] 
                : theme.colors.neutral[400]
              } 
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === 'challenges' && styles.activeTabText,
              ]}
            >
              Challenges
            </Text>
          </TouchableOpacity>
        </View>
        
        {selectedTab === 'achievements' ? (
          <View style={styles.achievementsGrid}>
            {mockAchievements.map(achievement => (
              <AchievementBadge
                key={achievement.id}
                {...achievement}
                size="lg"
              />
            ))}
          </View>
        ) : (
          <ChallengesList
            challenges={mockChallenges}
            onSelectChallenge={challenge => {
              console.log('Selected challenge:', challenge);
            }}
            onAcceptChallenge={challengeId => {
              console.log('Accepted challenge:', challengeId);
            }}
          />
        )}
      </ScrollView>
    </ChildLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.md,
  },
  levelCard: {
    padding: theme.spacing.spacing.lg,
    marginBottom: theme.spacing.spacing.lg,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  levelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.sm,
  },
  levelTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
  },
  xpInfo: {
    alignItems: 'flex-end',
  },
  xpLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  xpValue: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.primary[500],
  },
  section: {
    marginBottom: theme.spacing.spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.xs,
    marginBottom: theme.spacing.spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.spacing.xs,
    paddingVertical: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
  },
  activeTab: {
    backgroundColor: theme.colors.surface,
    ...theme.spacing.shadow.sm,
  },
  tabText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: theme.spacing.spacing.xl,
  },
});