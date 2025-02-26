import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { APP_NAME } from '../../constants';
import { Bell, Menu, ChevronDown } from 'lucide-react-native';

interface HeaderProps {
  userRole?: 'parent' | 'child' | 'admin';
  userName?: string;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (item: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userRole,
  userName,
  unreadNotifications = 0,
  onNotificationsPress,
  onProfilePress,
  onMenuItemPress,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isWeb = Platform.OS === 'web';
  const isSmallScreen = isWeb && Dimensions.get('window').width < 768;

  const getMenuItems = () => {
    switch (userRole) {
      case 'parent':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'activities', label: 'Activities' },
          { id: 'approvals', label: 'Approvals' },
          { id: 'children', label: 'Children' },
          { id: 'reports', label: 'Reports' },
        ];
      case 'child':
        return [
          { id: 'home', label: 'Home' },
          { id: 'quests', label: 'Quests' },
          { id: 'tokens', label: 'Tokens' },
          { id: 'achievements', label: 'Achievements' },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: 'Users' },
          { id: 'templates', label: 'Templates' },
          { id: 'settings', label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const headerBackgroundColor = 
    userRole === 'child' ? theme.colors.primary[500] : 
    userRole === 'admin' ? theme.colors.neutral[800] : 
    theme.colors.surface;

  const headerTextColor = 
    userRole === 'child' || userRole === 'admin' ? 
    theme.colors.neutral[0] : theme.colors.textPrimary;

  return (
    <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logoText, { color: headerTextColor }]}>
            {APP_NAME}
          </Text>
        </View>

        {(!isSmallScreen && userRole) && (
          <View style={styles.navigationContainer}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.navItem}
                onPress={() => onMenuItemPress?.(item.id)}
              >
                <Text style={[styles.navText, { color: headerTextColor }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {userRole && (
          <View style={styles.rightContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onNotificationsPress}
            >
              <Bell size={20} color={headerTextColor} />
              {unreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              onPress={onProfilePress}
            >
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {userName ? userName.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
              {!isSmallScreen && (
                <>
                  <Text style={[styles.userName, { color: headerTextColor }]}>
                    {userName || 'User'}
                  </Text>
                  <ChevronDown size={16} color={headerTextColor} style={styles.chevron} />
                </>
              )}
            </TouchableOpacity>

            {isSmallScreen && (
              <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                <Menu size={24} color={headerTextColor} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {isSmallScreen && menuOpen && userRole && (
        <View style={styles.mobileMenu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.mobileMenuItem}
              onPress={() => {
                onMenuItemPress?.(item.id);
                setMenuOpen(false);
              }}
            >
              <Text style={styles.mobileMenuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: theme.spacing.zIndex.sticky,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.spacing.md,
    paddingVertical: theme.spacing.spacing.sm,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    ...theme.typography.textStyle.h3,
    fontWeight: theme.typography.fontWeight.bold,
  },
  navigationContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: theme.spacing.spacing.xl,
  },
  navItem: {
    marginRight: theme.spacing.spacing.lg,
    paddingVertical: theme.spacing.spacing.xs,
  },
  navText: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.medium,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    position: 'relative',
    marginRight: theme.spacing.spacing.md,
    padding: theme.spacing.spacing.xs,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: theme.colors.semantic.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCount: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.spacing.xs,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...theme.typography.textStyle.body,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral[0],
  },
  userName: {
    ...theme.typography.textStyle.body,
    marginLeft: theme.spacing.spacing.xs,
  },
  chevron: {
    marginLeft: theme.spacing.spacing.xs,
  },
  menuButton: {
    marginLeft: theme.spacing.spacing.md,
    padding: theme.spacing.spacing.xs,
  },
  mobileMenu: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.spacing.shadow.md,
  },
  mobileMenuItem: {
    paddingVertical: theme.spacing.spacing.md,
    paddingHorizontal: theme.spacing.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  mobileMenuText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
});

export default Header;