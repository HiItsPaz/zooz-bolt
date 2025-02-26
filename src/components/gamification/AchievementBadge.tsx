import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Star, Lock } from 'lucide-react';

interface AchievementBadgeProps {
  id: string;
  title: string;
  icon: string;
  isUnlocked: boolean;
  progress?: number;
  maxProgress?: number;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  isNew?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  title,
  icon,
  isUnlocked,
  progress,
  maxProgress,
  size = 'md',
  onClick,
  isNew = false,
  className,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(isNew ? 0 : 1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (isNew) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Add a subtle rotation animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isNew]);
  
  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return { badge: 60, icon: 24 };
      case 'lg':
        return { badge: 120, icon: 48 };
      default:
        return { badge: 80, icon: 32 };
    }
  };
  
  const { badge: badgeSize, icon: iconSize } = getBadgeSize();
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });
  
  return (
    <View
      style={[
        styles.container,
        { width: badgeSize },
        style,
        className,
      ]}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <Animated.View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            transform: [
              { scale: scaleAnim },
              { rotate: isNew ? rotate : '0deg' },
            ],
          },
          isUnlocked ? styles.unlockedBadge : styles.lockedBadge,
        ]}
      >
        {isUnlocked ? (
          <img
            src={icon}
            alt={title}
            style={[styles.icon, { width: iconSize, height: iconSize }]}
          />
        ) : (
          <Lock size={iconSize} color={theme.colors.neutral[400]} />
        )}
        
        {isNew && (
          <View style={styles.newBadge}>
            <Star size={12} color={theme.colors.neutral[0]} fill={theme.colors.neutral[0]} />
          </View>
        )}
      </Animated.View>
      
      <Text 
        style={[
          styles.title,
          size === 'sm' && styles.smallTitle,
          !isUnlocked && styles.lockedTitle,
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      
      {progress !== undefined && maxProgress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(progress / maxProgress) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {progress}/{maxProgress}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    cursor: 'pointer',
    outline: 'none',
    '&:focus-visible': {
      outline: `2px solid ${theme.colors.primary[500]}`,
      outlineOffset: 2,
    },
  },
  badge: {
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.spacing.xs,
    ...theme.spacing.shadow.md,
  },
  unlockedBadge: {
    backgroundColor: theme.colors.primary[500],
  },
  lockedBadge: {
    backgroundColor: theme.colors.neutral[200],
  },
  icon: {
    borderRadius: '50%',
    objectFit: 'cover',
  },
  newBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.accent[500],
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.neutral[0],
  },
  title: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.xs,
  },
  smallTitle: {
    fontSize: 10,
  },
  lockedTitle: {
    color: theme.colors.textSecondary,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.neutral[200],
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary[500],
  },
  progressText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.textSecondary,
  },
});

export default AchievementBadge;