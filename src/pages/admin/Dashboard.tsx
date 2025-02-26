import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import { useMockData } from '../../context/MockDataContext';
import { Users, Activity as ActivityIcon, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [users, activities, submissions] = await Promise.all([
          mockDataService.users.getAll(),
          mockDataService.activities.getAll(),
          mockDataService.submissions.getAll(),
        ]);
        
        setStats({
          totalUsers: users.length,
          totalActivities: activities.length,
          pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
          completedSubmissions: submissions.filter(s => s.status === 'approved').length,
        });
      } catch (err: any) {
        console.error('Error loading dashboard stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    
    loadStats();
  }, []);
  
  if (loading) {
    return (
      <AdminLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card elevation="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <Users size={24} color={theme.colors.primary[500]} />
            </View>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </Card>
          
          <Card elevation="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <ActivityIcon size={24} color={theme.colors.secondary[500]} />
            </View>
            <Text style={styles.statValue}>{stats.totalActivities}</Text>
            <Text style={styles.statLabel}>Activity Templates</Text>
          </Card>
          
          <Card elevation="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <AlertCircle size={24} color={theme.colors.accent[500]} />
            </View>
            <Text style={styles.statValue}>{stats.pendingSubmissions}</Text>
            <Text style={styles.statLabel}>Pending Submissions</Text>
          </Card>
          
          <Card elevation="md" style={styles.statCard}>
            <View style={styles.statIcon}>
              <CheckCircle size={24} color={theme.colors.semantic.success} />
            </View>
            <Text style={styles.statValue}>{stats.completedSubmissions}</Text>
            <Text style={styles.statLabel}>Completed Activities</Text>
          </Card>
        </View>
        
        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Card elevation="sm" padding="lg">
            {/* Add activity feed here */}
            <Text style={styles.comingSoon}>Activity feed coming soon</Text>
          </Card>
        </View>
        
        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Status</Text>
          <Card elevation="sm" padding="lg">
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusHealthy]} />
              <Text style={styles.statusText}>All systems operational</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusHealthy]} />
              <Text style={styles.statusText}>Database connected</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, styles.statusHealthy]} />
              <Text style={styles.statusText}>Storage service active</Text>
            </View>
          </Card>
        </View>
      </ScrollView>
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
  title: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.md,
    marginBottom: theme.spacing.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: 200,
    padding: theme.spacing.spacing.lg,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.spacing.sm,
  },
  statValue: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
  },
  statLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  comingSoon: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.sm,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.spacing.sm,
  },
  statusHealthy: {
    backgroundColor: theme.colors.semantic.success,
  },
  statusWarning: {
    backgroundColor: theme.colors.semantic.warning,
  },
  statusError: {
    backgroundColor: theme.colors.semantic.error,
  },
  statusText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
});

export default Dashboard;