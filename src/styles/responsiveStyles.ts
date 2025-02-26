import { StyleSheet } from 'react-native';
import { responsiveWidth, responsiveHeight, responsiveFontSize } from '../utils/responsiveUtils';
import { lightTheme as theme } from './theme';

// Grid system for responsive layouts
export const grid = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.spacing.xs,
  },
  col1: { width: '8.33%' },
  col2: { width: '16.66%' },
  col3: { width: '25%' },
  col4: { width: '33.33%' },
  col5: { width: '41.66%' },
  col6: { width: '50%' },
  col7: { width: '58.33%' },
  col8: { width: '66.66%' },
  col9: { width: '75%' },
  col10: { width: '83.33%' },
  col11: { width: '91.66%' },
  col12: { width: '100%' },
  colAuto: { flexGrow: 1, flexShrink: 1, flexBasis: 0 },
});

// Responsive spacing
export const spacing = {
  responsive: {
    xs: responsiveWidth(theme.spacing.spacing.xs),
    sm: responsiveWidth(theme.spacing.spacing.sm),
    md: responsiveWidth(theme.spacing.spacing.md),
    lg: responsiveWidth(theme.spacing.spacing.lg),
    xl: responsiveWidth(theme.spacing.spacing.xl),
  },
};

// Responsive typography
export const typography = {
  responsive: {
    h1: {
      ...theme.typography.textStyle.h1,
      fontSize: responsiveFontSize(theme.typography.fontSize['4xl']),
    },
    h2: {
      ...theme.typography.textStyle.h2,
      fontSize: responsiveFontSize(theme.typography.fontSize['3xl']),
    },
    h3: {
      ...theme.typography.textStyle.h3,
      fontSize: responsiveFontSize(theme.typography.fontSize['2xl']),
    },
    h4: {
      ...theme.typography.textStyle.h4,
      fontSize: responsiveFontSize(theme.typography.fontSize.xl),
    },
    body: {
      ...theme.typography.textStyle.body,
      fontSize: responsiveFontSize(theme.typography.fontSize.md),
    },
    bodySmall: {
      ...theme.typography.textStyle.bodySmall,
      fontSize: responsiveFontSize(theme.typography.fontSize.sm),
    },
  },
};

// Touch targets
export const touchTargets = StyleSheet.create({
  standard: {
    minHeight: 44,
    minWidth: 44,
    padding: theme.spacing.spacing.sm,
  },
  large: {
    minHeight: 56,
    minWidth: 56,
    padding: theme.spacing.spacing.md,
  },
});

// Layout containers
export const containers = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  contentContainer: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    padding: theme.spacing.spacing.md,
  },
});

// Responsive modals
export const modals = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.spacing.md,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    ...theme.spacing.shadow.lg,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
  },
});

// Media queries for web
export const mediaQueries = {
  smallOnly: '@media (max-width: 576px)',
  mediumUp: '@media (min-width: 577px)',
  largeUp: '@media (min-width: 992px)',
  portrait: '@media (orientation: portrait)',
  landscape: '@media (orientation: landscape)',
};