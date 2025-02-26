import React from 'react';
import { View, StyleSheet, useWindowDimensions, StyleProp, ViewStyle } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { useResponsive } from '../../hooks/useResponsive';

type ContainerWidth = 'sm' | 'md' | 'lg' | 'full' | 'auto';
type ContainerPadding = 'none' | 'sm' | 'md' | 'lg';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  width?: ContainerWidth;
  padding?: ContainerPadding;
  centered?: boolean;
  fullHeight?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  width = 'md',
  padding = 'md',
  centered = false,
  fullHeight = false,
  style,
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const { deviceType, breakpoint } = useResponsive();
  
  // Calculate max width based on container type and screen size
  const getMaxWidth = () => {
    if (width === 'full') return '100%';
    if (width === 'auto') return undefined;
    
    const maxWidths = {
      sm: {
        xs: '100%',
        sm: '540px',
        md: '540px',
        lg: '540px',
        xl: '540px',
      },
      md: {
        xs: '100%',
        sm: '720px',
        md: '960px',
        lg: '960px',
        xl: '960px',
      },
      lg: {
        xs: '100%',
        sm: '100%',
        md: '960px',
        lg: '1140px',
        xl: '1320px',
      },
    };
    
    return maxWidths[width][breakpoint];
  };
  
  // Calculate padding based on screen size and container type
  const getPadding = () => {
    const paddings = {
      none: 0,
      sm: theme.spacing.spacing.sm,
      md: theme.spacing.spacing.md,
      lg: theme.spacing.spacing.lg,
    };
    
    // Adjust padding for mobile
    if (deviceType === 'mobile') {
      return padding === 'lg' ? theme.spacing.spacing.md : paddings[padding];
    }
    
    return paddings[padding];
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          maxWidth: getMaxWidth(),
          padding: getPadding(),
          height: fullHeight ? '100%' : undefined,
        },
        centered && styles.centered,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 'auto',
  },
  centered: {
    alignItems: 'center',
  },
});

export default ResponsiveContainer;