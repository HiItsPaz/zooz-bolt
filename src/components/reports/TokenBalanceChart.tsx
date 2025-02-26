import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { mockDataService } from '../../services/mockData';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface TokenBalanceChartProps {
  childId: string | null;
  dateRange: 'week' | 'month' | 'year';
}

const TokenBalanceChart: React.FC<TokenBalanceChartProps> = ({
  childId,
  dateRange,
}) => {
  const [data, setData] = useState<Array<{ date: string; balance: number }>>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!childId) return;

      try {
        const transactions = await mockDataService.transactions.getForChild(childId);
        const now = new Date();
        const chartData = [];

        switch (dateRange) {
          case 'week':
            for (let i = 6; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              const balance = transactions.reduce((acc, t) => {
                const transactionDate = new Date(t.createdAt);
                if (transactionDate <= date) {
                  return acc + t.amount;
                }
                return acc;
              }, 0);

              chartData.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                balance,
              });
            }
            break;

          case 'month':
            for (let i = 29; i >= 0; i--) {
              const date = new Date(now);
              date.setDate(date.getDate() - i);
              const balance = transactions.reduce((acc, t) => {
                const transactionDate = new Date(t.createdAt);
                if (transactionDate <= date) {
                  return acc + t.amount;
                }
                return acc;
              }, 0);

              chartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                balance,
              });
            }
            break;

          case 'year':
            for (let i = 11; i >= 0; i--) {
              const date = new Date(now);
              date.setMonth(date.getMonth() - i);
              const balance = transactions.reduce((acc, t) => {
                const transactionDate = new Date(t.createdAt);
                if (transactionDate <= date) {
                  return acc + t.amount;
                }
                return acc;
              }, 0);

              chartData.push({
                date: date.toLocaleDateString('en-US', { month: 'short' }),
                balance,
              });
            }
            break;
        }

        setData(chartData);
      } catch (error) {
        console.error('Error loading token balance data:', error);
      }
    };

    loadData();
  }, [childId, dateRange]);

  if (Platform.OS !== 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>
          Token balance chart is only available on web
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={theme.colors.primary[500]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
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

export default TokenBalanceChart;