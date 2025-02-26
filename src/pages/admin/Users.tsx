import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import AdminLayout from '../../components/layout/AdminLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import UserDetailCard from '../../components/admin/UserDetailCard';
import { useMockData } from '../../context/MockDataContext';
import { User, Parent, Child } from '../../services/mockData';
import { Search, Filter, UserPlus } from 'lucide-react-native';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'parent' | 'child'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const allUsers = await mockDataService.users.getAll();
        setUsers(allUsers);
      } catch (err: any) {
        console.error('Error loading users:', err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);
  
  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });
  
  // Group users by role
  const groupedUsers = filteredUsers.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {} as Record<string, User[]>);
  
  if (loading) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Users</Text>
          <Button
            title="Add User"
            leftIcon={<UserPlus size={20} color={theme.colors.neutral[0]} />}
            onPress={() => {}}
          />
        </View>
        
        {/* Search and Filters */}
        <View style={styles.filters}>
          <Input
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search users..."
            leftIcon={<Search size={20} color={theme.colors.neutral[400]} />}
            containerStyle={styles.searchInput}
          />
          <Select
            value={roleFilter}
            onChange={(value) => setRoleFilter(value as typeof roleFilter)}
            options={[
              { value: 'all', label: 'All Users' },
              { value: 'parent', label: 'Parents' },
              { value: 'child', label: 'Children' },
            ]}
            containerStyle={styles.roleFilter}
          />
        </View>
        
        {/* Users List */}
        <View style={styles.content}>
          <View style={styles.usersList}>
            {Object.entries(groupedUsers).map(([role, roleUsers]) => (
              <View key={role} style={styles.roleSection}>
                <Text style={styles.roleTitle}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}s ({roleUsers.length})
                </Text>
                {roleUsers.map(user => (
                  <UserDetailCard
                    key={user.id}
                    user={user}
                    onSelect={() => setSelectedUser(user)}
                    selected={selectedUser?.id === user.id}
                  />
                ))}
              </View>
            ))}
            
            {filteredUsers.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No users found</Text>
                <Text style={styles.emptyStateText}>
                  {searchQuery
                    ? `No users match "${searchQuery}"`
                    : "No users available"}
                </Text>
                {searchQuery && (
                  <Button
                    title="Clear Search"
                    variant="outline"
                    onPress={() => setSearchQuery('')}
                    style={styles.clearButton}
                  />
                )}
              </View>
            )}
          </View>
          
          {selectedUser && (
            <Card elevation="md" style={styles.userDetail}>
              <Text style={styles.detailTitle}>User Details</Text>
              {/* Add detailed user information and actions here */}
              <Text style={styles.comingSoon}>Detailed view coming soon</Text>
            </Card>
          )}
        </View>
      </View>
    </AdminLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: theme.spacing.spacing.lg,
  },
  searchInput: {
    flex: 1,
    marginRight: theme.spacing.spacing.md,
  },
  roleFilter: {
    width: 200,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  usersList: {
    flex: 2,
    marginRight: theme.spacing.spacing.lg,
  },
  roleSection: {
    marginBottom: theme.spacing.spacing.xl,
  },
  roleTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  userDetail: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
  },
  detailTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.spacing.xl,
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
  },
  emptyStateTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.sm,
  },
  emptyStateText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  clearButton: {
    minWidth: 120,
  },
  comingSoon: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.spacing.lg,
  },
});

export default Users;