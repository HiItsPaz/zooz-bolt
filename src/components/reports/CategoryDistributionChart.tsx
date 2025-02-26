import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Activity, Submission } from '../../services/mockData';
import { ACTIVITY_CATEGORIES } from '../../constants';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from 'recharts';

interface CategoryDistributionChartProps {
  activities: Activity[];
  submissions: Submission[];
  childId: string | null;
}

const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({
  activities,
  submissions,
  childId,
}) => {
  const processData = () => {
    if (!childId) return [];

    const categoryData = ACTIVITY_CATEGORIES.map(category => {
      const categoryActivities = activities.filter(a => a.category === category.id);
      const completedActivities = submissions.filter(
        s =>
          s.childId === childId &&
          s.status === 'approved' &&
          categoryActivities.some(a => a.id === s.activityId)
      );

      return {
        name: category.label,
        value: completedActivities.length,
        color: theme.colors.category[category.id],
      };
    });

    return categoryData.filter(item => item.value > 0);
  };

  const chartData = processData();

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          Category distribution chart is only available on web
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
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

export default CategoryDistributionChart;