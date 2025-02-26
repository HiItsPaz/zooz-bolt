import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import {  as Flame,  as CalendarIcon,  as Trophy } from 'lucide-react-native';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  activityDates: Date[];
  startDate?: Date;
  endDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({
  currentStreak,
  longestStreak,
  activityDates,
  startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
  endDate = new Date(),
  onDateSelect,
}) => {
  // Generate calendar data
  const generateCalendarDays = () => {
    const days = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      const date = new Date(current);
      const hasActivity = activityDates.some(
        d => d.toDateString() === date.toDateString()
      );
      
      days.push({
        date,
        hasActivity,
      });
      
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.streakBadge}>
          <Flame size={24} color={theme.colors.semantic.error} />
          <View>
            <Text style={styles.streakCount}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>Day Streak</Text>
          </View>
        </View>
        
        <View style={styles.recordStreak}>
          <Trophy size={16} color={theme.colors.accent[500]} />
          <Text style={styles.recordText}>
            Best: {longestStreak} days
          </Text>
        </View>
      </View>
      
      <View style={styles.calendar}>
        <View style={styles.calendarHeader}>
          <CalendarIcon size={16} color={theme.colors.textSecondary} />
          <Text style={styles.calendarTitle}>Activity Calendar</Text>
        </View>
        
        <View style={styles.daysGrid}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                day.hasActivity && styles.activeDay,
              ]}
              onPress={() => onDateSelect?.(day.date)}
            >
              <View 
                style={[
                  styles.dayDot,
                  day.hasActivity && styles.activeDayDot,
                ]} 
              />
              <Text 
                style={[
                  styles.dayText,
                  day.hasActivity && styles.activeDayText,
                ]}
              >
                {day.date.getDate()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {currentStreak > 0 && (
        <View style={styles.motivationCard}>
          <Flame size={20} color={theme.colors.semantic.error} />
          <Text style={styles.motivationText}>
            {currentStreak >= longestStreak
              ? "You're on fire! This is your best streak ever! 🔥"
              : `Keep it up! Only ${longestStreak - currentStreak} more days to beat your record! 💪`}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.lg,
    ...theme.spacing.shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.spacing.lg,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.semantic.error + '10',
    padding: theme.spacing.spacing.sm,
    borderRadius: theme.spacing.borderRadius.lg,
    gap: theme.spacing.spacing.sm,
  },
  streakCount: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.semantic.error,
    fontWeight: theme.typography.fontWeight.bold,
  },
  streakLabel: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.semantic.error,
  },
  recordStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.xs,
    backgroundColor: theme.colors.accent[50],
    paddingHorizontal: theme.spacing.spacing.sm,
    paddingVertical: theme.spacing.spacing.xs,
    borderRadius: theme.spacing.borderRadius.full,
  },
  recordText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.accent[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
  calendar: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.lg,
    padding: theme.spacing.spacing.md,
    marginBottom: theme.spacing.spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.xs,
    marginBottom: theme.spacing.spacing.sm,
  },
  calendarTitle: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.spacing.xs,
  },
  dayCell: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.spacing.borderRadius.sm,
  },
  activeDay: {
    backgroundColor: theme.colors.primary[100],
  },
  dayDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  activeDayDot: {
    backgroundColor: theme.colors.primary[500],
  },
  dayText: {
    ...theme.typography.textStyle.caption,
    color: theme.colors.textSecondary,
  },
  activeDayText: {
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.medium,
  },
  motivationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.spacing.sm,
    backgroundColor: theme.colors.semantic.error + '10',
    padding: theme.spacing.spacing.md,
    borderRadius: theme.spacing.borderRadius.lg,
  },
  motivationText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.semantic.error,
    flex: 1,
  },
});

export default StreakTracker;