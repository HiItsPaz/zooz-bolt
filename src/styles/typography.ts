import { Platform } from 'react-native';

// Font families
export const FONT_FAMILY = {
  heading: Platform.OS === 'web' 
    ? "'Nunito', sans-serif"
    : 'Nunito',
  body: Platform.OS === 'web'
    ? "'Inter', sans-serif"
    : 'Inter',
};

// Font sizes
export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Font weights
export const FONT_WEIGHT = {
  light: '300',
  regular: '400',
  medium: '500',
  bold: '700',
  extrabold: '800',
};

// Line heights
export const LINE_HEIGHT = {
  tight: 1.2,
  normal: 1.5,
  loose: 1.8,
};

// Text styles
export const TEXT_STYLE = {
  h1: {
    fontFamily: FONT_FAMILY.heading,
    fontSize: FONT_SIZE['4xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  h2: {
    fontFamily: FONT_FAMILY.heading,
    fontSize: FONT_SIZE['3xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  h3: {
    fontFamily: FONT_FAMILY.heading,
    fontSize: FONT_SIZE['2xl'],
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  h4: {
    fontFamily: FONT_FAMILY.heading,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    lineHeight: LINE_HEIGHT.tight,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.normal,
  },
  body: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.normal,
  },
  caption: {
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.regular,
    lineHeight: LINE_HEIGHT.normal,
  },
  button: {
    fontFamily: FONT_FAMILY.heading,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
    lineHeight: LINE_HEIGHT.tight,
  },
};