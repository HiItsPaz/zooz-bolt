import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ParentLayout from '../../components/layout/ParentLayout';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { useMockData } from '../../context/MockDataContext';
import { mockDataService } from '../../services/mockData';
import ActivityCompletionChart from '../../components/reports/ActivityCompletionChart';
import TokenBalanceChart from '../../components/reports/TokenBalanceChart';
import CategoryDistributionChart from '../../components/reports/CategoryDistributionChart';
import ChildSelector from '../../components/parent/ChildSelector';
import { Child, Activity, Submission } from '../../services/mockData';
import { Download, Calendar } from 'lucide-react-native';

const Reports = () => {
  const { currentUser } = useMockData();
  const [selectedChild, setSelectedChild] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    activities: Activity[];
    submissions: Submission[];
    children: Child[];
  }>({
    activities: [],
    submissions: [],
    children: [],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Load data from mock service
        const [activities, submissions, children] = await Promise.all([
          mockDataService.activities.getAll(),
          mockDataService.submissions.getAll(),
          mockDataService.users.getChildrenForParent(currentUser?.id || ''),
        ]);

        setData({
          activities,
          submissions,
          children: children as Child[],
        });

        if (children.length > 0 && !selectedChild) {
          setSelectedChild(children[0].id);
        }
      } catch (err: any) {
        console.error('Error loading report data:', err);
        setError(err.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  const handleExport = () => {
    // Export report logic here
    console.log('Exporting report...');
  };

  if (loading) {
    return (
      <ParentLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading reports...</Text>
        </View>
      </ParentLayout>
    );
  }

  return (
    <ParentLayout>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Button
            title="Export Report"
            variant="outline"
            size="sm"
            leftIcon={<Download size={16} color={theme.colors.primary[500]} />}
            onPress={handleExport}
          />
        </View>

        <View style={styles.filters}>
          <View style={styles.filterGroup}>
            <Select
              value={selectedChild || ''}
              onChange={setSelectedChild}
              options={data.children.map(child => ({
                value: child.id,
                label: child.displayName,
              }))}
              placeholder="Select Child"
              containerStyle={styles.childSelect}
            />
            <Select
              value={dateRange}
              onChange={(value) => setDateRange(value as typeof dateRange)}
              options={[
                { value: 'week', label: 'Past Week' },
                { value: 'month', label: 'Past Month' },
                { value: 'year', label: 'Past Year' },
              ]}
              containerStyle={styles.dateSelect}
            />
          </View>
        </View>

        {error ? (
          <Card elevation="md" style={styles.errorCard}>
            <Text style={styles.errorTitle}>Error Loading Reports</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Try Again"
              variant="outline"
              onPress={() => {
                // Reload data
              }}
              style={styles.retryButton}
            />
          </Card>
        ) : (
          <View style={styles.content}>
            <View style={styles.chartRow}>
              <Card elevation="md" style={styles.chartCard}>
                <Text style={styles.chartTitle}>Activity Completion</Text>
                <ActivityCompletionChart
                  submissions={data.submissions}
                  dateRange={dateRange}
                  childId={selectedChild}
                />
              </Card>
              <Card elevation="md" style={styles.chartCard}>
                <Text style={styles.chartTitle}>Token Balance History</Text>
                <TokenBalanceChart
                  childId={selectedChild}
                  dateRange={dateRange}
                />
              </Card>
            </View>

            <View style={styles.chartRow}>
              <Card elevation="md" style={styles.chartCard}>
                <Text style={styles.chartTitle}>Category Distribution</Text>
                <CategoryDistributionChart
                  activities={data.activities}
                  submissions={data.submissions}
                  childId={selectedChild}
                />
              </Card>
              <Card elevation="md" style={styles.chartCard}>
                <Text style={styles.chartTitle}>Activity Trends</Text>
                {/* Add activity trends chart component */}
                <Text style={styles.comingSoon}>Activity trends coming soon</Text>
              </Card>
            </View>

            <Card elevation="md" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Performance Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>85%</Text>
                  <Text style={styles.summaryLabel}>Completion Rate</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>12</Text>
                  <Text style={styles.summaryLabel}>Activities This Week</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>450</Text>
                  <Text style={styles.summaryLabel}>Tokens Earned</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>4.8</Text>
                  <Text style={styles.summaryLabel}>Avg. Rating</Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </ParentLayout>
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
    marginBottom: theme.spacing.spacing.lg,
  },
  filterGroup: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.md,
  },
  childSelect: {
    flex: 2,
  },
  dateSelect: {
    flex: 1,
  },
  content: {
    gap: theme.spacing.spacing.lg,
  },
  chartRow: {
    flexDirection: 'row',
    gap: theme.spacing.spacing.lg,
    ...Platform.select({
      web: {
        flexWrap: 'nowrap',
      },
      default: {
        flexWrap: 'wrap',
      },
    }),
  },
  chartCard: {
    flex: 1,
    minWidth: Platform.OS === 'web' ? 0 : '100%',
    padding: theme.spacing.spacing.lg,
  },
  chartTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  summaryCard: {
    padding: theme.spacing.spacing.lg,
  },
  summaryTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.lg,
  },
  summaryItem: {
    flex: 1,
    minWidth: 200,
    backgroundColor: theme.colors.neutral[50],
    padding: theme.spacing.spacing.lg,
    borderRadius: theme.spacing.borderRadius.md,
    alignItems: 'center',
  },
  summaryValue: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.primary[500],
    marginBottom: theme.spacing.spacing.xs,
  },
  summaryLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  errorCard: {
    padding: theme.spacing.spacing.xl,
    alignItems: 'center',
  },
  errorTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.sm,
  },
  errorText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.semantic.error,
    textAlign: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  retryButton: {
    minWidth: 120,
  },
  comingSoon: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.spacing.xl,
  },
});

export default Reports;