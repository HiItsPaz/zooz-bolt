import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';

export type ContainerWidth = 'sm' | 'md' | 'lg' | 'full';

interface ContainerProps {
  children: React.ReactNode;
  width?: ContainerWidth;
  centered?: boolean;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  width = 'md',
  centered = false,
  backgroundColor,
  style,
}) => {
  const maxWidths = {
    sm: 640,
    md: 1024,
    lg: 1280,
    full: '100%',
  };

  return (
    <View
      style={[
        styles.container,
        { maxWidth: maxWidths[width] },
        centered && styles.centered,
        backgroundColor && { backgroundColor },
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
    paddingHorizontal: theme.spacing.spacing.md,
  },
  centered: {
    alignItems: 'center',
  },
});

export default Container;