import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Star, ChevronRight, Info } from 'lucide-react';

interface LevelProgressionBarProps {
  currentLevel: number;
  currentXP: number;
  xpForNextLevel: number;
  onLevelUp?: (newLevel: number) => void;
  showInfo?: boolean;
  onInfoClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const LevelProgressionBar: React.FC<LevelProgressionBarProps> = ({
  currentLevel,
  currentXP,
  xpForNextLevel,
  onLevelUp,
  showInfo = true,
  onInfoClick,
  className,
  style,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Animate progress bar
    Animated.spring(progressAnim, {
      toValue: currentXP / xpForNextLevel,
      tension: 30,
      friction: 8,
      useNativeDriver: false,
    }).start();
    
    // Animate glow effect when close to level up
    if (currentXP / xpForNextLevel > 0.9) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
    }
  }, [currentXP, xpForNextLevel]);
  
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });
  
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });
  
  return (
    <View 
      style={[
        styles.container,
        style,
        className,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.levelBadge}>
          <Star size={16} color={theme.colors.neutral[0]} fill={theme.colors.neutral[0]} />
          <Text style={styles.levelText}>Level {currentLevel}</Text>
        </View>
        
        {showInfo && (
          <button
            className={styles.infoButton}
            onClick={onInfoClick}
            type="button"
          >
            <Info size={16} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>Level Benefits</Text>
            <ChevronRight size={16} color={theme.colors.textSecondary} />
          </button>
        )}
      </View>
      
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressGlow,
            { 
              width: progressWidth,
              opacity: glowOpacity,
            },
          ]} 
        />
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressWidth },
          ]} 
        />
        
        <View style={styles.milestones}>
          {[0, 0.25, 0.5, 0.75, 1].map((milestone, index) => (
            <View 
              key={index}
              style={[
                styles.milestone,
                milestone <= currentXP / xpForNextLevel && styles.completedMilestone,
              ]}
            />
          ))}
        </View>
      </View>
      
      <View style={styles.stats}>
        <Text style={styles.xpText}>
          {currentXP} / {xpForNextLevel} XP
        </Text>
        <Text style={styles.remainingText}>
          {xpForNextLevel - currentXP} XP to Level {currentLevel + 1}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.full,
    gap: theme.spacing.spacing.xs,
  },
  levelText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  infoButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.xs,
    background: 'none',
    border: 'none',
    padding: theme.spacing.spacing.xs,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    '&:hover': {
      opacity: 0.8,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.primary[500]}`,
      outlineOffset: 2,
    },
  },
  infoText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    height: 12,
    backgroundColor: theme.colors.neutral[100],
    borderRadius: theme.spacing.borderRadius.full,
    overflow: 'hidden',
    marginBottom: theme.spacing.spacing.sm,
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: theme.colors.primary[300],
    borderRadius: theme.spacing.borderRadius.full,
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: theme.colors.primary[500],
    borderRadius: theme.spacing.borderRadius.full,
  },
  milestones: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  milestone: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.neutral[300],
  },
  completedMilestone: {
    backgroundColor: theme.colors.neutral[0],
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xpText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  remainingText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
  },
});

export default LevelProgressionBar;