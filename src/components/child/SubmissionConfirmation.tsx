import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Button from '../ui/Button';
import TokenDisplay from '../ui/TokenDisplay';
import { Activity } from '../../services/mockData';
import { CircleCheck as CheckCircle } from 'lucide-react-native';

interface SubmissionConfirmationProps {
  activity: Activity;
  onClose: () => void;
}

const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({
  activity,
  onClose,
}) => {
  const animation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.sequence([
      // Scale up
      Animated.spring(animation, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              {
                scale: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
            opacity: animation,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          <CheckCircle size={64} color={theme.colors.semantic.success} />
        </View>
        
        <Text style={styles.title}>Quest Submitted!</Text>
        <Text style={styles.subtitle}>{activity.title}</Text>
        
        <View style={styles.rewardSection}>
          <Text style={styles.rewardText}>You'll earn</Text>
          <TokenDisplay 
            amount={activity.tokenValue} 
            size="xl" 
            animated 
            showPlus
          />
          <Text style={styles.rewardText}>tokens when approved</Text>
        </View>
        
        <Text style={styles.message}>
          Your quest submission has been sent to your parent for approval.
          You'll be notified when they review it!
        </Text>
        
        <Button
          title="Back to Quests"
          onPress={onClose}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.spacing.xl,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    ...theme.spacing.shadow.lg,
  },
  iconContainer: {
    marginBottom: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.semantic.success,
    marginBottom: theme.spacing.spacing.xs,
  },
  subtitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xl,
    textAlign: 'center',
  },
  rewardSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.xl,
  },
  rewardText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginVertical: theme.spacing.spacing.sm,
  },
  message: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.xl,
  },
  button: {
    minWidth: 200,
  },
});

export default SubmissionConfirmation;