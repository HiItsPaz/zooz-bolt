import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { User, Settings, Users, Bell } from 'lucide-react-native';

type SettingsSection = 'profile' | 'family' | 'notifications' | 'security';

interface SettingsNavigationProps {
  activeSection: SettingsSection;
  onSelectSection: (section: SettingsSection) => void;
  variant?: 'vertical' | 'horizontal';
}

const SettingsNavigation: React.FC<SettingsNavigationProps> = ({
  activeSection,
  onSelectSection,
  variant = 'vertical',
}) => {
  const navigationItems = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
    },
    {
      id: 'family' as const,
      label: 'Family',
      icon: Users,
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
    },
    {
      id: 'security' as const,
      label: 'Security',
      icon: Settings,
    },
  ];
  
  return (
    <View style={[
      styles.container,
      variant === 'horizontal' && styles.horizontalContainer,
    ]}>
      {navigationItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.navItem,
            variant === 'horizontal' && styles.horizontalNavItem,
            activeSection === item.id && styles.activeNavItem,
            variant === 'horizontal' && activeSection === item.id && styles.horizontalActiveNavItem,
          ]}
          onPress={() => onSelectSection(item.id)}
        >
          <item.icon
            size={20}
            color={activeSection === item.id ? theme.colors.primary[500] : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.navLabel,
              activeSection === item.id && styles.activeNavLabel,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.sm,
    ...theme.spacing.shadow.sm,
  },
  horizontalContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.spacing.lg,
    justifyContent: 'space-between',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.spacing.sm,
    marginBottom: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  horizontalNavItem: {
    marginBottom: 0,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: theme.spacing.spacing.xs,
  },
  activeNavItem: {
    backgroundColor: theme.colors.primary[50],
  },
  horizontalActiveNavItem: {
    backgroundColor: theme.colors.primary[50],
  },
  navLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.spacing.sm,
  },
  activeNavLabel: {
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default SettingsNavigation;