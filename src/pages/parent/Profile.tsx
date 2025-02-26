import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, useWindowDimensions } from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import ParentLayout from '../../components/layout/ParentLayout';
import Card from '../../components/ui/Card';
import SettingsNavigation from '../../components/parent/SettingsNavigation';
import ParentProfileForm from '../../components/parent/ParentProfileForm';
import FamilySettings from '../../components/parent/FamilySettings';
import NotificationSettings from '../../components/parent/NotificationSettings';
import { useMockData } from '../../context/MockDataContext';

type SettingsSection = 'profile' | 'family' | 'notifications' | 'security';

const Profile = () => {
  const { width } = useWindowDimensions();
  const { currentUser } = useMockData();
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = width < 768;
  
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ParentProfileForm />;
      case 'family':
        return <FamilySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return (
          <Card elevation="md" style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            <Text style={styles.comingSoon}>Security settings coming soon</Text>
          </Card>
        );
      default:
        return null;
    }
  };
  
  return (
    <ParentLayout>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Settings & Profile</Text>
        
        <View style={styles.content}>
          {!isMobile && (
            <View style={styles.navigation}>
              <SettingsNavigation
                activeSection={activeSection}
                onSelectSection={setActiveSection}
              />
            </View>
          )}
          
          <ScrollView style={styles.mainContent}>
            {isMobile && (
              <SettingsNavigation
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                variant="horizontal"
              />
            )}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            {renderContent()}
          </ScrollView>
        </View>
      </View>
    </ParentLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.spacing.lg,
  },
  pageTitle: {
    ...theme.typography.textStyle.h2,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.xl,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  navigation: {
    width: 240,
    marginRight: theme.spacing.spacing.xl,
  },
  mainContent: {
    flex: 1,
  },
  section: {
    marginBottom: theme.spacing.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.textStyle.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.spacing.lg,
  },
  comingSoon: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: theme.spacing.spacing.xl,
  },
  errorText: {
    ...theme.typography.textStyle.body,
    color: theme.colors.semantic.error,
    marginBottom: theme.spacing.spacing.md,
  },
});

export default Profile;