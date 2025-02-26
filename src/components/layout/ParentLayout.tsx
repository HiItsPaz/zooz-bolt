import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import Header from './Header';
import Footer from './Footer';

interface ParentLayoutProps {
  children: React.ReactNode;
  userName?: string;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (item: string) => void;
  footerLinks?: Array<{ id: string; label: string; to: string }>;
}

export const ParentLayout: React.FC<ParentLayoutProps> = ({
  children,
  userName,
  unreadNotifications = 0,
  onNotificationsPress,
  onProfilePress,
  onMenuItemPress,
  footerLinks = [],
}) => {
  const location = useLocation();

  return (
    <div className="parent-layout">
      <Header
        userRole="parent"
        userName={userName}
        unreadNotifications={unreadNotifications}
        onNotificationsPress={onNotificationsPress}
        onProfilePress={onProfilePress}
        onMenuItemPress={onMenuItemPress}
      />

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>

      <Footer links={footerLinks} />

      <style jsx>{`
        .parent-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: ${theme.colors.background};
        }

        .main-content {
          flex: 1;
          padding: ${theme.spacing.spacing.md}px;
        }

        .content-container {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default ParentLayout;