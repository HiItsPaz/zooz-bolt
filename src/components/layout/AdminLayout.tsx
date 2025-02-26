import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import Header from './Header';
import Footer from './Footer';
import { LayoutDashboard, Users, FileText, LineChart, Settings } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  userName?: string;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (item: string) => void;
  footerLinks?: Array<{ id: string; label: string; to: string }>;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  userName,
  unreadNotifications = 0,
  onNotificationsPress,
  onProfilePress,
  onMenuItemPress,
  footerLinks = [],
}) => {
  const location = useLocation();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    { id: 'users', label: 'Users', icon: Users, to: '/admin/users' },
    { id: 'templates', label: 'Templates', icon: FileText, to: '/admin/templates' },
    { id: 'reports', label: 'Reports', icon: LineChart, to: '/admin/reports' },
    { id: 'settings', label: 'Settings', icon: Settings, to: '/admin/settings' },
  ];

  return (
    <div className="admin-layout">
      <Header
        userRole="admin"
        userName={userName}
        unreadNotifications={unreadNotifications}
        onNotificationsPress={onNotificationsPress}
        onProfilePress={onProfilePress}
        onMenuItemPress={onMenuItemPress}
      />

      <div className="content-container">
        <aside className="sidebar">
          <nav className="sidebar-nav">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      <Footer links={footerLinks} />

      <style jsx>{`
        .admin-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: ${theme.colors.background};
        }

        .content-container {
          flex: 1;
          display: flex;
        }

        .sidebar {
          width: 240px;
          background-color: ${theme.colors.neutral[900]};
          border-right: 1px solid ${theme.colors.neutral[800]};
          display: none;

          @media (min-width: 768px) {
            display: block;
          }
        }

        .sidebar-nav {
          padding: ${theme.spacing.spacing.md}px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.spacing.sm}px;
          padding: ${theme.spacing.spacing.sm}px ${theme.spacing.spacing.md}px;
          color: ${theme.colors.neutral[400]};
          text-decoration: none;
          transition: all 150ms ease;

          &:hover {
            background-color: ${theme.colors.neutral[800]};
            color: ${theme.colors.neutral[200]};
          }

          &.active {
            background-color: ${theme.colors.neutral[800]};
            color: ${theme.colors.neutral[0]};
            border-left: 3px solid ${theme.colors.primary[500]};
          }
        }

        .nav-label {
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
        }

        .main-content {
          flex: 1;
          padding: ${theme.spacing.spacing.lg}px;
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;