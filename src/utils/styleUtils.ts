import { StyleSheet } from 'react-native';

export const conditionalStyle = (condition: boolean, style: any) => 
  condition ? style : {};

// A function to merge multiple style objects
export const mergeStyles = (...styles: any[]) => 
  StyleSheet.flatten(styles.filter(Boolean));

// Convert a color to an rgba value with opacity
export const withOpacity = (color: string, opacity: number): string => {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // Handle rgb colors
  if (color.startsWith('rgb(')) {
    const rgb = color.replace('rgb(', '').replace(')', '').split(',');
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  }
  
  // Handle rgba colors
  if (color.startsWith('rgba(')) {
    const rgba = color.replace('rgba(', '').replace(')', '').split(',');
    return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${opacity})`;
  }
  
  return color;
};