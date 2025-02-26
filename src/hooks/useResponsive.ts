import { useState, useEffect } from 'react';
import { useWindowDimensions, Platform, ScaledSize } from 'react-native';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';
export type BreakpointSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface ResponsiveInfo {
  deviceType: DeviceType;
  orientation: Orientation;
  breakpoint: BreakpointSize;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
}

const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

export const useResponsive = (): ResponsiveInfo => {
  const window = useWindowDimensions();
  const [dimensions, setDimensions] = useState<ScaledSize>(window);
  
  useEffect(() => {
    setDimensions(window);
  }, [window]);
  
  // Determine device type
  const getDeviceType = (): DeviceType => {
    if (Platform.OS !== 'web') return 'mobile';
    if (dimensions.width < breakpoints.md) return 'mobile';
    if (dimensions.width < breakpoints.lg) return 'tablet';
    return 'desktop';
  };
  
  // Determine orientation
  const getOrientation = (): Orientation => {
    return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
  };
  
  // Determine breakpoint
  const getBreakpoint = (): BreakpointSize => {
    if (dimensions.width < breakpoints.sm) return 'xs';
    if (dimensions.width < breakpoints.md) return 'sm';
    if (dimensions.width < breakpoints.lg) return 'md';
    if (dimensions.width < breakpoints.xl) return 'lg';
    return 'xl';
  };
  
  const deviceType = getDeviceType();
  const orientation = getOrientation();
  const breakpoint = getBreakpoint();
  
  return {
    deviceType,
    orientation,
    breakpoint,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape',
    width: dimensions.width,
    height: dimensions.height,
  };
};

export default useResponsive;