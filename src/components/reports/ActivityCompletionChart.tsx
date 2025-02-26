import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Submission } from '../../services/mockData';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface ActivityCompletionChartProps {
  submissions: Submission[];
  dateRange: 'week' | 'month' | 'year';
  childId: string | null;
}

const ActivityCompletionChart: React.FC<ActivityCompletionChartProps> = ({
  submissions,
  dateRange,
  childId,
}) => {
  // Process data for the chart
  const processData = () => {
    if (!childId) return [];

    const now = new Date();
    const data = [];
    const childSubmissions = submissions.filter(s => s.childId === childId);

    switch (dateRange) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const daySubmissions = childSubmissions.filter(s => {
            const submissionDate = new Date(s.submittedAt);
            return submissionDate.toDateString() === date.toDateString();
          });

          data.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: daySubmissions.filter(s => s.status === 'approved').length,
            pending: daySubmissions.filter(s => s.status === 'pending').length,
            rejected: daySubmissions.filter(s => s.status === 'rejected').length,
          });
        }
        break;

      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const daySubmissions = childSubmissions.filter(s => {
            const submissionDate = new Date(s.submittedAt);
            return submissionDate.toDateString() === date.toDateString();
          });

          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            completed: daySubmissions.filter(s => s.status === 'approved').length,
            pending: daySubmissions.filter(s => s.status === 'pending').length,
            rejected: daySubmissions.filter(s => s.status === 'rejected').length,
          });
        }
        break;

      case 'year':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          const monthSubmissions = childSubmissions.filter(s => {
            const submissionDate = new Date(s.submittedAt);
            return (
              submissionDate.getMonth() === date.getMonth() &&
              submissionDate.getFullYear() === date.getFullYear()
            );
          });

          data.push({
            date: date.toLocaleDateString('en-US', { month: 'short' }),
            completed: monthSubmissions.filter(s => s.status === 'approved').length,
            pending: monthSubmissions.filter(s => s.status === 'pending').length,
            rejected: monthSubmissions.filter(s => s.status === 'rejected').length,
          });
        }
        break;
    }

    return data;
  };

  const chartData = processData();

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          Activity completion chart is only available on web
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="completed"
            name="Completed"
            fill={theme.colors.semantic.success}
            stackId="a"
          />
          <Bar
            dataKey="pending"
            name="Pending"
            fill={theme.colors.accent[500]}
            stackId="a"
          />
          <Bar
            dataKey="rejected"
            name="Rejected"
            fill={theme.colors.semantic.error}
            stackId="a"
          />
        </BarChart>
      </ResponsiveContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 300,
  },
  placeholder: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.spacing.xl,
  },
});

export default ActivityCompletionChart;