import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import Header from './Header';
import Footer from './Footer';
import { Home, Scroll, Coins, Trophy } from 'lucide-react';

interface ChildLayoutProps {
  children: React.ReactNode;
  userName?: string;
  tokenBalance?: number;
  unreadNotifications?: number;
  onNotificationsPress?: () => void;
  onProfilePress?: () => void;
  onMenuItemPress?: (item: string) => void;
}

export const ChildLayout: React.FC<ChildLayoutProps> = ({
  children,
  userName,
  tokenBalance = 0,
  unreadNotifications = 0,
  onNotificationsPress,
  onProfilePress,
  onMenuItemPress,
}) => {
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, to: '/child' },
    { id: 'quests', label: 'Quests', icon: Scroll, to: '/child/quests' },
    { id: 'tokens', label: 'Tokens', icon: Coins, to: '/child/tokens' },
    { id: 'prizes', label: 'Prizes', icon: Trophy, to: '/child/prizes' },
  ];

  return (
    <div className="child-layout">
      <Header
        userRole="child"
        userName={userName}
        unreadNotifications={unreadNotifications}
        onNotificationsPress={onNotificationsPress}
        onProfilePress={onProfilePress}
        onMenuItemPress={onMenuItemPress}
      />

      <div className="token-bar">
        <div className="token-display">
          <Coins size={20} color={theme.colors.neutral[0]} />
          <span className="token-count">{tokenBalance}</span>
        </div>
      </div>

      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>

      <nav className="game-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={item.id}
              to={item.to}
              className={`nav-button ${isActive ? 'active' : ''}`}
            >
              <Icon size={24} color={isActive ? theme.colors.primary[500] : theme.colors.neutral[400]} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <style jsx>{`
        .child-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: ${theme.colors.background};
        }

        .token-bar {
          background-color: ${theme.colors.primary[400]};
          padding: ${theme.spacing.spacing.xs}px ${theme.spacing.spacing.md}px;
          display: flex;
          justify-content: flex-end;
        }

        .token-display {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.spacing.xs}px;
          background-color: ${theme.colors.primary[300]};
          padding: ${theme.spacing.spacing.xs}px ${theme.spacing.spacing.sm}px;
          border-radius: 20px;
        }

        .token-count {
          font-family: ${theme.typography.fontFamily.body};
          font-weight: ${theme.typography.fontWeight.bold};
          color: ${theme.colors.neutral[0]};
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

        .game-nav {
          display: flex;
          justify-content: space-around;
          background-color: ${theme.colors.primary[500]};
          padding: ${theme.spacing.spacing.sm}px;
          border-top: 1px solid ${theme.colors.primary[600]};
        }

        .nav-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: ${theme.spacing.spacing.xs}px;
          min-width: 60px;
          text-decoration: none;
          color: ${theme.colors.neutral[0]};
          transition: color 150ms ease;

          &:hover {
            color: ${theme.colors.primary[300]};
          }

          &.active {
            color: ${theme.colors.primary[300]};
          }
        }

        .nav-label {
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.sm}px;
        }
      `}</style>
    </div>
  );
};

export default ChildLayout;