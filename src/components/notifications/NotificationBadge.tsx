import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Animated } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';

interface NotificationBadgeProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  size = 'md',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (count > 0) {
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
    } else {
      Animated.spring(scaleAnim, {
        toValue: 0,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [count]);
  
  if (count === 0) return null;
  
  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return { width: 16, height: 16, fontSize: 10 };
      case 'lg':
        return { width: 24, height: 24, fontSize: 14 };
      default:
        return { width: 20, height: 20, fontSize: 12 };
    }
  };
  
  const { width, height, fontSize } = getBadgeSize();
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width,
          height,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text
        style={[
          styles.count,
          { fontSize },
        ]}
      >
        {count > 99 ? '99+' : count}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: theme.colors.semantic.error,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  count: {
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default NotificationBadge;