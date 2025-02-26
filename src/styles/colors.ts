// Primary brand colors
export const PRIMARY = {
  50: '#E6F7FF',
  100: '#BAE7FF',
  200: '#91D5FF',
  300: '#69C0FF',
  400: '#40A9FF',
  500: '#1890FF', // Main primary color
  600: '#096DD9',
  700: '#0050B3',
  800: '#003A8C',
  900: '#002766',
};

// Secondary mint green
export const SECONDARY = {
  50: '#E6FFFB',
  100: '#B5F5EC',
  200: '#87E8DE',
  300: '#5CDBD3',
  400: '#36CFC9',
  500: '#13C2C2', // Main secondary color
  600: '#08979C',
  700: '#006D75',
  800: '#00474F',
  900: '#002329',
};

// Accent yellow for gamification elements
export const ACCENT = {
  50: '#FFFBE6',
  100: '#FFF1B8',
  200: '#FFE58F',
  300: '#FFD666',
  400: '#FFC53D',
  500: '#FAAD14', // Main accent color
  600: '#D48806',
  700: '#AD6800',
  800: '#874D00',
  900: '#613400',
};

// Neutral colors
export const NEUTRAL = {
  0: '#FFFFFF',
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
  1000: '#000000',
};

// Semantic colors
export const SEMANTIC = {
  success: '#52C41A',
  warning: '#FAAD14',
  error: '#F5222D',
  info: '#1890FF',
};

// Category colors
export const CATEGORY = {
  educational: PRIMARY[500],
  social: SECONDARY[500],
  'house chores': ACCENT[500],
  physical: '#FF7A45',
};

// Define color schemes
export const LIGHT_THEME = {
  background: NEUTRAL[50],
  surface: NEUTRAL[0],
  textPrimary: NEUTRAL[900],
  textSecondary: NEUTRAL[600],
  border: NEUTRAL[200],
};

export const DARK_THEME = {
  background: NEUTRAL[900],
  surface: NEUTRAL[800],
  textPrimary: NEUTRAL[50],
  textSecondary: NEUTRAL[300],
  border: NEUTRAL[700],
};