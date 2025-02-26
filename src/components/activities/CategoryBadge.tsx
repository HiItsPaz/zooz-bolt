import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { ACTIVITY_CATEGORIES } from '../../constants';

export type CategoryType = 'educational' | 'social' | 'house chores' | 'physical';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  showIcon = true,
  style,
  textStyle,
}) => {
  const categoryInfo = ACTIVITY_CATEGORIES.find(cat => cat.id === category) || ACTIVITY_CATEGORIES[0];
  
  const getCategoryColor = (category: CategoryType) => {
    switch (category) {
      case 'educational':
        return theme.colors.primary[500];
      case 'social':
        return theme.colors.secondary[500];
      case 'house chores':
        return theme.colors.accent[500];
      case 'physical':
        return '#FF7A45';
      default:
        return theme.colors.primary[500];
    }
  };
  
  const backgroundColor = getCategoryColor(category);
  
  const getCategoryIcon = (category: CategoryType) => {
    switch (category) {
      case 'educational':
        return '📚';
      case 'social':
        return '👥';
      case 'house chores':
        return '🏠';
      case 'physical':
        return '⚽';
      default:
        return '📝';
    }
  };
  
  const icon = getCategoryIcon(category);
  
  return (
    <View 
      style={[
        styles.badge,
        styles[`${size}Badge`],
        { backgroundColor },
        style,
      ]}
    >
      {showIcon && <Text style={styles.icon}>{icon}</Text>}
      <Text 
        style={[
          styles.text,
          styles[`${size}Text`],
          textStyle,
        ]}
      >
        {categoryInfo.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 4,
    fontSize: 12,
  },
  text: {
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  smBadge: {
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  mdBadge: {
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  lgBadge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  smText: {
    ...theme.typography.textStyle.caption,
  },
  mdText: {
    ...theme.typography.textStyle.bodySmall,
  },
  lgText: {
    ...theme.typography.textStyle.body,
  },
});

export default CategoryBadge;