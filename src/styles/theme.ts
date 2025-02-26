import { Platform } from 'react-native';
import * as Colors from './colors';
import * as Typography from './typography';
import * as Spacing from './spacing';

// Interface for our theme object
export interface Theme {
  colors: {
    primary: typeof Colors.PRIMARY;
    secondary: typeof Colors.SECONDARY;
    accent: typeof Colors.ACCENT;
    neutral: typeof Colors.NEUTRAL;
    semantic: typeof Colors.SEMANTIC;
    category: typeof Colors.CATEGORY;
    background: string;
    surface: string;
    textPrimary: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    fontFamily: typeof Typography.FONT_FAMILY;
    fontSize: typeof Typography.FONT_SIZE;
    fontWeight: typeof Typography.FONT_WEIGHT;
    lineHeight: typeof Typography.LINE_HEIGHT;
    textStyle: typeof Typography.TEXT_STYLE;
  };
  spacing: {
    spacing: typeof Spacing.SPACING;
    borderRadius: typeof Spacing.BORDER_RADIUS;
    shadow: typeof Spacing.SHADOW;
    zIndex: typeof Spacing.Z_INDEX;
  };
  // Add mobile-specific properties
  platform: {
    isWeb: boolean;
    isMobile: boolean;
  };
}

// Create light theme
export const lightTheme: Theme = {
  colors: {
    primary: Colors.PRIMARY,
    secondary: Colors.SECONDARY,
    accent: Colors.ACCENT,
    neutral: Colors.NEUTRAL,
    semantic: Colors.SEMANTIC,
    category: Colors.CATEGORY,
    ...Colors.LIGHT_THEME,
  },
  typography: {
    fontFamily: Typography.FONT_FAMILY,
    fontSize: Typography.FONT_SIZE,
    fontWeight: Typography.FONT_WEIGHT,
    lineHeight: Typography.LINE_HEIGHT,
    textStyle: Typography.TEXT_STYLE,
  },
  spacing: {
    spacing: Spacing.SPACING,
    borderRadius: Spacing.BORDER_RADIUS,
    shadow: Spacing.SHADOW,
    zIndex: Spacing.Z_INDEX,
  },
  platform: {
    isWeb: Platform.OS === 'web',
    isMobile: Platform.OS !== 'web',
  },
};

// Create dark theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    ...Colors.DARK_THEME,
  },
};

// Default theme
export const theme = lightTheme;

// Export types
export type ThemeType = 'light' | 'dark';
export type ColorTheme = typeof lightTheme.colors;
export type TypographyTheme = typeof lightTheme.typography;
export type SpacingTheme = typeof lightTheme.spacing;