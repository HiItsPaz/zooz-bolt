import React, { useState } from 'react';
import { View, StyleSheet, Text, Switch } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import Card from '../ui/Card';
import Checkbox from '../ui/Checkbox';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { useMockData } from '../../context/MockDataContext';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    inAppNotifications: true,
    activitySubmissions: true,
    approvalRequests: true,
    tokenUpdates: true,
    dailyDigest: true,
    weeklyReport: true,
    digestTime: '18:00',
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Save notification settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved:', settings);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card elevation="md" style={styles.container}>
      <Text style={styles.title}>Notification Preferences</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <View style={styles.optionGroup}>
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Email Notifications</Text>
            <Switch
              value={settings.emailNotifications}
              onValueChange={(value) => 
                setSettings(prev => ({ ...prev, emailNotifications: value }))
              }
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>Push Notifications</Text>
            <Switch
              value={settings.pushNotifications}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, pushNotifications: value }))
              }
            />
          </View>
          
          <View style={styles.option}>
            <Text style={styles.optionLabel}>In-App Notifications</Text>
            <Switch
              value={settings.inAppNotifications}
              onValueChange={(value) =>
                setSettings(prev => ({ ...prev, inAppNotifications: value }))
              }
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <View style={styles.optionGroup}>
          <Checkbox
            label="Activity Submissions"
            checked={settings.activitySubmissions}
            onChange={(checked) =>
              setSettings(prev => ({ ...prev, activitySubmissions: checked }))
            }
          />
          
          <Checkbox
            label="Approval Requests"
            checked={settings.approvalRequests}
            onChange={(checked) =>
              setSettings(prev => ({ ...prev, approvalRequests: checked }))
            }
          />
          
          <Checkbox
            label="Token Updates"
            checked={settings.tokenUpdates}
            onChange={(checked) =>
              setSettings(prev => ({ ...prev, tokenUpdates: checked }))
            }
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Summary & Reports</Text>
        <View style={styles.optionGroup}>
          <Checkbox
            label="Daily Activity Digest"
            checked={settings.dailyDigest}
            onChange={(checked) =>
              setSettings(prev => ({ ...prev, dailyDigest: checked }))
            }
          />
          
          <Checkbox
            label="Weekly Progress Report"
            checked={settings.weeklyReport}
            onChange={(checked) =>
              setSettings(prev => ({ ...prev, weeklyReport: checked }))
            }
          />
          
          <View style={styles.timeOption}>
            <Text style={styles.optionLabel}>Daily Digest Time</Text>
            <Select
              value={settings.digestTime}
              onChange={(value) =>
                setSettings(prev => ({ ...prev, digestTime: value }))
              }
              options={[
                { value: '08:00', label: '8:00 AM' },
                { value: '12:00', label: '12:00 PM' },
                { value: '18:00', label: '6:00 PM' },
                { value: '20:00', label: '8:00 PM' },
              ]}
            />
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiet Hours</Text>
        <View style={styles.optionGroup}>
          <View style={styles.timeOption}>
            <Text style={styles.optionLabel}>Start Time</Text>
            <Select
              value={settings.quietHoursStart}
              onChange={(value) =>
                setSettings(prev => ({ ...prev, quietHoursStart: value }))
              }
              options={[
                { value: '20:00', label: '8:00 PM' },
                { value: '21:00', label: '9:00 PM' },
                { value: '22:00', label: '10:00 PM' },
                { value: '23:00', label: '11:00 PM' },
              ]}
            />
          </View>
          
          <View style={styles.timeOption}>
            <Text style={styles.optionLabel}>End Time</Text>
            <Select
              value={settings.quietHoursEnd}
              onChange={(value) =>
                setSettings(prev => ({ ...prev, quietHoursEnd: value }))
              }
              options={[
                { value: '06:00', label: '6:00 AM' },
                { value: '07:00', label: '7:00 AM' },
                { value: '08:00', label: '8:00 AM' },
                { value: '09:00', label: '9:00 AM' },
              ]}
            />
          </View>
        </View>
      </View>
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
      
      <View style={styles.actions}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={loading}
        />
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
    marginBottom: theme.spacing.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h4,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.md,
  },
  optionGroup: {
    backgroundColor: theme.colors.neutral[50],
    borderRadius: theme.spacing.borderRadius.md,
    padding: theme.spacing.spacing.md,
    gap: theme.spacing.spacing.md,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
  },
  timeOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.md,
  },
  actions: {
    marginTop: theme.spacing.spacing.xl,
    alignItems: 'flex-end',
  },
});

export default NotificationSettings;