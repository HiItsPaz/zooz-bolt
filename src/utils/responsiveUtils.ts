import { Dimensions, Platform, PixelRatio } from 'react-native';

// Base dimensions (design is based on)
const baseWidth = 375; // iPhone 8 width
const baseHeight = 667; // iPhone 8 height

// Get device dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Scale factor for responsive sizing
export const widthScale = screenWidth / baseWidth;
export const heightScale = screenHeight / baseHeight;

// Responsive font size
export const responsiveFontSize = (size: number): number => {
  const newSize = size * widthScale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Responsive width
export const responsiveWidth = (width: number): number => {
  return Math.round(width * widthScale);
};

// Responsive height
export const responsiveHeight = (height: number): number => {
  return Math.round(height * heightScale);
};

// Convert pixel value to rem-like unit (based on font size)
export const rem = (value: number): number => {
  const baseSize = Platform.OS === 'ios' ? 16 : 14;
  return value * (baseSize / 16);
};

// Get platform-specific touch target size
export const getTouchTargetSize = (): number => {
  return Platform.OS === 'ios' ? 44 : 48;
};

// Calculate dynamic spacing based on screen size
export const getDynamicSpacing = (baseSize: number): number => {
  const scale = Math.min(widthScale, heightScale);
  return Math.round(baseSize * scale);
};

// Get platform-specific shadow styles
export const getPlatformShadow = (elevation: number) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: elevation / 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: elevation,
    };
  }
  
  return {
    elevation,
  };
};

// Check if device is a small screen
export const isSmallScreen = (): boolean => {
  return screenWidth < 360;
};

// Check if device is a large screen
export const isLargeScreen = (): boolean => {
  return screenWidth > 768;
};

// Get safe area insets for notched devices
export const getSafeAreaInsets = () => {
  // This would normally use react-native-safe-area-context
  // For now, return default values
  return {
    top: Platform.OS === 'ios' ? 44 : 0,
    bottom: Platform.OS === 'ios' ? 34 : 0,
    left: 0,
    right: 0,
  };
};