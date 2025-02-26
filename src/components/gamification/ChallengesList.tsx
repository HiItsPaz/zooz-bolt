import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import Button from '../ui/Button';
import TokenDisplay from '../ui/TokenDisplay';
import {  as Trophy,  as Clock,  as Users,  as Star,  as ChevronRight } from 'lucide-react-native';

interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'special' | 'family';
  difficulty: 'easy' | 'medium' | 'hard';
  rewardTokens: number;
  startDate: Date;
  endDate: Date;
  isCompleted: boolean;
  progress?: number;
  maxProgress?: number;
}

interface ChallengesListProps {
  challenges: Challenge[];
  onSelectChallenge?: (challenge: Challenge) => void;
  onAcceptChallenge?: (challengeId: string) => void;
  showCompleted?: boolean;
}

const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onSelectChallenge,
  onAcceptChallenge,
  showCompleted = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Challenge['category']>('daily');
  
  const filteredChallenges = challenges.filter(challenge => 
    challenge.category === selectedCategory &&
    (showCompleted || !challenge.isCompleted)
  );
  
  const getCategoryIcon = (category: Challenge['category']) => {
    switch (category) {
      case 'daily':
        return <Clock size={20} color={theme.colors.primary[500]} />;
      case 'weekly':
        return <Star size={20} color={theme.colors.secondary[500]} />;
      case 'special':
        return <Trophy size={20} color={theme.colors.accent[500]} />;
      case 'family':
        return <Users size={20} color={theme.colors.semantic.success} />;
    }
  };
  
  const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return theme.colors.semantic.success;
      case 'medium':
        return theme.colors.accent[500];
      case 'hard':
        return theme.colors.semantic.error;
    }
  };
  
  const renderChallenge = ({ item: challenge }: { item: Challenge }) => (
    <Card
      elevation="sm"
      style={[
        styles.challengeCard,
        challenge.isCompleted && styles.completedCard,
      ]}
      onPress={() => onSelectChallenge?.(challenge)}
    >
      <View style={styles.challengeHeader}>
        <View style={styles.challengeInfo}>
          <View 
            style={[
              styles.difficultyBadge,
              { backgroundColor: getDifficultyColor(challenge.difficulty) + '20' },
            ]}
          >
            <Text
              style={[
                styles.difficultyText,
                { color: getDifficultyColor(challenge.difficulty) },
              ]}
            >
              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
            </Text>
          </View>
          
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
        </View>
        
        <TokenDisplay amount={challenge.rewardTokens} size="sm" />
      </View>
      
      <Text style={styles.challengeDescription} numberOfLines={2}>
        {challenge.description}
      </Text>
      
      {challenge.progress !== undefined && challenge.maxProgress !== undefined && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { 
                  width: `${(challenge.progress / challenge.maxProgress) * 100}%`,
                  backgroundColor: getDifficultyColor(challenge.difficulty),
                },
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {challenge.progress}/{challenge.maxProgress}
          </Text>
        </View>
      )}
      
      <View style={styles.challengeFooter}>
        <Text style={styles.timeRemaining}>
          {new Date(challenge.endDate).getTime() - Date.now() > 0
            ? `Ends in ${Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days`
            : 'Expired'}
        </Text>
        
        {!challenge.isCompleted && (
          <Button
            title="Accept"
            size="sm"
            onPress={() => onAcceptChallenge?.(challenge.id)}
            rightIcon={<ChevronRight size={16} color={theme.colors.neutral[0]} />}
          />
        )}
      </View>
    </Card>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.categories}>
        {(['daily', 'weekly', 'special', 'family'] as Challenge['category'][]).map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            {getCategoryIcon(category)}
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredChallenges}
        renderItem={renderChallenge}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.challengesList}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Challenges Available</Text>
            <Text style={styles.emptyText}>
              {selectedCategory === 'daily'
                ? "You've completed all daily challenges! Check back tomorrow!"
                : `No ${selectedCategory} challenges available right now.`}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categories: {
    flexDirection: 'row',
    marginBottom: theme.spacing.spacing.md,
    gap: theme.spacing.spacing.sm,
  },
  categoryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.spacing.xs,
    backgroundColor: theme.colors.neutral[100],
    paddingVertical: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
  },
  activeCategoryButton: {
    backgroundColor: theme.colors.primary[500],
  },
  categoryText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  activeCategoryText: {
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  challengesList: {
    gap: theme.spacing.spacing.md,
  },
  challengeCard: {
    padding: theme.spacing.spacing.md,
  },
  completedCard: {
    opacity: 0.7,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.spacing.sm,
  },
  challengeInfo: {
    flex: 1,
    marginRight: theme.spacing.spacing.md,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs / 2,
    borderRadius: theme.spacing.borderRadius.sm,
    marginBottom: theme.spacing.spacing.xs,
  },
  difficultyText: {
    ...theme.typography.textStyle.caption,
    fontWeight: theme.typography.fontWeight.medium,
  },
  challengeTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  challengeDescription: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.sm,
  },
  progressSection: {
    marginBottom: theme.spacing.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    ...theme.typography .textStyle.caption,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRemaining: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  emptyState: {
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
  },
  emptyTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  emptyText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default ChallengesList;