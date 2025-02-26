import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import { User, Parent, Child } from '../../services/mockData';
import { User as UserIcon, Mail, Calendar, Users } from 'lucide-react-native';

interface UserDetailCardProps {
  user: User;
  selected?: boolean;
  onSelect?: () => void;
}

const UserDetailCard: React.FC<UserDetailCardProps> = ({
  user,
  selected = false,
  onSelect,
}) => {
  const isParent = user.role === 'parent';
  const isChild = user.role === 'child';
  
  return (
    <Card
      elevation={selected ? 'md' : 'sm'}
      style={[
        styles.container,
        selected && styles.selectedContainer,
      ]}
      onPress={onSelect}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon size={24} color={theme.colors.neutral[400]} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.displayName}</Text>
          {user.email && (
            <View style={styles.infoRow}>
              <Mail size={14} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>{user.email}</Text>
            </View>
          )}
          <View style={styles.infoRow}>
            <Calendar size={14} color={theme.colors.textSecondary} />
            <Text style={styles.infoText}>
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      {isParent && (
        <View style={styles.relationshipInfo}>
          <Users size={14} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            {(user as Parent).children.length} children
          </Text>
        </View>
      )}
      
      {isChild && (
        <View style={styles.childInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{(user as Child).age}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Tokens:</Text>
            <Text style={styles.value}>{(user as Child).tokenBalance}</Text>
          </View>
        </View>
      )}
      
      <View style={[
        styles.statusIndicator,
        user.lastLogin ? styles.activeStatus : styles.inactiveStatus,
      ]} />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.spacing.sm,
    padding: theme.spacing.spacing.md,
  },
  selectedContainer: {
    borderColor: theme.colors.primary[500],
    borderWidth: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.spacing.xs,
  },
  relationshipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.spacing.sm,
    paddingTop: theme.spacing.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  childInfo: {
    marginTop: theme.spacing.spacing.sm,
    paddingTop: theme.spacing.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  label: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    width: 60,
  },
  value: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  statusIndicator: {
    position: 'absolute',
    top: theme.spacing.spacing.sm,
    right: theme.spacing.spacing.sm,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: theme.colors.semantic.success,
  },
  inactiveStatus: {
    backgroundColor: theme.colors.neutral[300],
  },
});

export default UserDetailCard;