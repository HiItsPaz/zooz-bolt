import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';

export type TokenDisplaySize = 'sm' | 'md' | 'lg' | 'xl';

interface TokenDisplayProps {
  amount: number;
  size?: TokenDisplaySize;
  animated?: boolean;
  showText?: boolean;
  showPlus?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  amount,
  size = 'md',
  animated = false,
  showText = true,
  showPlus = false,
  className,
  style,
}) => {
  const animationValue = useRef(new Animated.Value(0)).current;
  const [displayAmount, setDisplayAmount] = React.useState(0);
  
  useEffect(() => {
    if (animated) {
      setDisplayAmount(0);
      animationValue.setValue(0);
      
      Animated.timing(animationValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();
      
      const interval = setInterval(() => {
        setDisplayAmount(prev => {
          if (prev < amount) {
            return Math.min(prev + Math.max(1, Math.floor(amount / 20)), amount);
          }
          clearInterval(interval);
          return amount;
        });
      }, 50);
      
      return () => clearInterval(interval);
    } else {
      setDisplayAmount(amount);
    }
  }, [amount, animated]);
  
  const getSizeDimensions = (size: TokenDisplaySize) => {
    switch (size) {
      case 'sm':
        return { containerSize: 24, iconSize: 14, textSize: 12 };
      case 'md':
        return { containerSize: 32, iconSize: 18, textSize: 14 };
      case 'lg':
        return { containerSize: 40, iconSize: 24, textSize: 16 };
      case 'xl':
        return { containerSize: 60, iconSize: 36, textSize: 20 };
      default:
        return { containerSize: 32, iconSize: 18, textSize: 14 };
    }
  };
  
  const { containerSize, iconSize, textSize } = getSizeDimensions(size);
  const formattedAmount = showPlus && amount > 0 ? `+${displayAmount}` : `${displayAmount}`;
  
  return (
    <View 
      style={[
        styles.container,
        { style },
        className,
      ]}
    >
      <Animated.View
        style={[
          styles.tokenCircle,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: containerSize / 2,
            transform: animated ? [
              { scale: animationValue },
            ] : [],
          },
        ]}
      >
        <Text style={[styles.tokenIcon, { fontSize: iconSize }]}>🪙</Text>
      </Animated.View>
      
      {showText && (
        <Text 
          style={[
            styles.tokenText, 
            { fontSize: textSize },
          ]}
        >
          {formattedAmount}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenCircle: {
    backgroundColor: theme.colors.accent[100],
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.spacing.shadow.sm,
  },
  tokenIcon: {
    textAlign: 'center',
  },
  tokenText: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.spacing.xs,
  },
});

export default TokenDisplay;