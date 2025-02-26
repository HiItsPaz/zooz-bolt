import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import { Transaction } from '../../services/mockData';
import {  as ArrowUpRight,  as ArrowDownRight,  as TrendingUp,  as Wallet } from 'lucide-react-native';

interface TokenStatsSummaryProps {
  transactions: Transaction[];
  period?: 'week' | 'month' | 'year' | 'all';
}

const TokenStatsSummary: React.FC<TokenStatsSummaryProps> = ({
  transactions,
  period = 'all',
}) => {
  const stats = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    // Set time range based on period
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(0); // Beginning of time for 'all'
    }
    
    // Filter transactions by date range
    const periodTransactions = transactions.filter(t => 
      new Date(t.createdAt) >= startDate && new Date(t.createdAt) <= now
    );
    
    // Calculate statistics
    const earned = periodTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const spent = periodTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const balance = earned - spent;
    
    // Calculate average earnings per activity
    const earnedTransactions = periodTransactions.filter(t => t.amount > 0);
    const averageEarning = earnedTransactions.length > 0
      ? earned / earnedTransactions.length
      : 0;
    
    // Get most common platform for spending
    const platformCounts = periodTransactions
      .filter(t => t.amount < 0 && t.platform)
      .reduce((acc, t) => {
        acc[t.platform!] = (acc[t.platform!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
    const topPlatform = Object.entries(platformCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    
    return {
      earned,
      spent,
      balance,
      averageEarning,
      topPlatform,
      totalTransactions: periodTransactions.length,
    };
  }, [transactions, period]);
  
  return (
    <Card elevation="md" style={styles.container}>
      <Text style={styles.title}>Token Statistics</Text>
      
      <View style={styles.mainStats}>
        <View style={styles.statCard}>
          <View style={[styles.iconContainer, styles.earnedIcon]}>
            <ArrowUpRight size={24} color={theme.colors.semantic.success} />
          </View>
          <Text style={styles.statLabel}>Earned</Text>
          <Text style={[styles.statValue, styles.earnedValue]}>
            {stats.earned}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.iconContainer, styles.spentIcon]}>
            <ArrowDownRight size={24} color={theme.colors.semantic.error} />
          </View>
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={[styles.statValue, styles.spentValue]}>
            {stats.spent}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.iconContainer, styles.balanceIcon]}>
            <Wallet size={24} color={theme.colors.primary[500]} />
          </View>
          <Text style={styles.statLabel}>Balance</Text>
          <Text style={[styles.statValue, styles.balanceValue]}>
            {stats.balance}
          </Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={[styles.iconContainer, styles.averageIcon]}>
            <TrendingUp size={24} color={theme.colors.secondary[500]} />
          </View>
          <Text style={styles.statLabel}>Avg. Earned</Text>
          <Text style={[styles.statValue, styles.averageValue]}>
            {stats.averageEarning.toFixed(1)}
          </Text>
        </View>
      </View>
      
      <View style={styles.additionalStats}>
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Total Transactions</Text>
          <Text style={styles.statDetail}>{stats.totalTransactions}</Text>
        </View>
        
        {stats.topPlatform && (
          <View style={styles.statRow}>
            <Text style={styles.statTitle}>Most Used Platform</Text>
            <Text style={styles.statDetail}>{stats.topPlatform}</Text>
          </View>
        )}
        
        <View style={styles.statRow}>
          <Text style={styles.statTitle}>Spending Rate</Text>
          <Text style={styles.statDetail}>
            {stats.earned > 0 
              ? `${((stats.spent / stats.earned) * 100).toFixed(1)}%`
              : '0%'
            }
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.spacing.lg,
  },
  title: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  mainStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.md,
    marginBottom: theme.spacing.spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.spacing.sm,
  },
  earnedIcon: {
    backgroundColor: theme.colors.semantic.success + '20',
  },
  spentIcon: {
    backgroundColor: theme.colors.semantic.error + '20',
  },
  balanceIcon: {
    backgroundColor: theme.colors.primary[100],
  },
  averageIcon: {
    backgroundColor: theme.colors.secondary[100],
  },
  statLabel: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.spacing.xs,
  },
  statValue: {
    ...theme.typography.textStyle.h3,
    fontWeight: theme.typography.fontWeight.bold,
  },
  earnedValue: {
    color: theme.colors.semantic.success,
  },
  spentValue: {
    color: theme.colors.semantic.error,
  },
  balanceValue: {
    color: theme.colors.primary[500],
  },
  averageValue: {
    color: theme.colors.secondary[500],
  },
  additionalStats: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  statDetail: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default TokenStatsSummary;