import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Modal, Animated, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import TokenDisplay from '../ui/TokenDisplay';
import {  as Star,  as Gift,  as Trophy } from 'lucide-react-native';

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  rewards: {
    tokens?: number;
    newFeatures?: string[];
    achievements?: string[];
  };
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  visible,
  newLevel,
  rewards,
  onClose,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const starsAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      // Reset animations
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      starsAnim.setValue(0);
      
      // Start animation sequence
      Animated.sequence([
        // Scale up modal
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        // Rotate level badge
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Show rewards
        Animated.spring(starsAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <View style={styles.confetti}>
            {/* Add confetti animation here */}
          </View>
          
          <Animated.View
            style={[
              styles.levelBadge,
              {
                transform: [
                  { rotate },
                ],
              },
            ]}
          >
            <Star size={48} color={theme.colors.neutral[0]} fill={theme.colors.neutral[0]} />
            <Text style={styles.levelNumber}>{newLevel}</Text>
          </Animated.View>
          
          <Text style={styles.title}>Level Up!</Text>
          <Text style={styles.subtitle}>
            Congratulations! You've reached Level {newLevel}!
          </Text>
          
          <Animated.View
            style={[
              styles.rewardsContainer,
              {
                opacity: starsAnim,
                transform: [
                  {
                    translateY: starsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {rewards.tokens && (
              <View style={styles.rewardCard}>
                <Gift size={24} color={theme.colors.primary[500]} />
                <Text style={styles.rewardTitle}>Token Bonus</Text>
                <TokenDisplay amount={rewards.tokens} size="lg" showPlus animated />
              </View>
            )}
            
            {rewards.newFeatures && rewards.newFeatures.length > 0 && (
              <View style={styles.rewardSection}>
                <Text style={styles.rewardSectionTitle}>New Features Unlocked</Text>
                {rewards.newFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Star size={16} color={theme.colors.accent[500]} />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {rewards.achievements && rewards.achievements.length > 0 && (
              <View style={styles.rewardSection}>
                <Text style={styles.rewardSectionTitle}>Achievements Earned</Text>
                {rewards.achievements.map((achievement, index) => (
                  <View key={index} style={styles.achievementItem}>
                    <Trophy size={16} color={theme.colors.secondary[500]} />
                    <Text style={styles.achievementText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
          
          <Button
            title="Awesome!"
            onPress={onClose}
            style={styles.button}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.xl,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    ...theme.spacing.shadow.lg,
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  levelBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.lg,
  },
  levelNumber: {
    position: 'absolute',
    ...theme.typography.textStyle.h2,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.xl,
  },
  rewardsContainer: {
    width: '100%',
    marginBottom: theme.spacing.spacing.xl,
  },
  rewardCard: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.md,
  },
  rewardTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
    marginVertical: theme.spacing.spacing.sm,
  },
  rewardSection: {
    marginBottom: theme.spacing.spacing.md,
  },
  rewardSectionTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.accent[50],
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.xs,
  },
  featureText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.accent[700],
    marginLeft: theme.spacing.spacing.sm,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary[50],
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.md,
    marginBottom: theme.spacing.spacing.xs,
  },
  achievementText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.secondary[700],
    marginLeft: theme.spacing.spacing.sm,
  },
  button: {
    minWidth: 200,
  },
});

export default LevelUpModal;