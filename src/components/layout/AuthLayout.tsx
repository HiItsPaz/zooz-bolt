import React from 'react';
import { Link } from 'react-router-dom';
import { lightTheme as theme } from '../../styles/theme';
import { APP_NAME } from '../../constants';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  isChildAuth?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  isChildAuth = false,
}) => {
  const footerLinks = [
    { id: 'privacy', label: 'Privacy Policy', to: '/privacy' },
    { id: 'terms', label: 'Terms of Service', to: '/terms' },
    { id: 'help', label: 'Help Center', to: '/help' },
  ];

  return (
    <div className="auth-layout">
      <main className="auth-container">
        <div className="content-section">
          <div className="header-section">
            <Link to="/" className="app-name">
              {APP_NAME}
            </Link>
            <h1 className="title">{title}</h1>
            {subtitle && <p className="subtitle">{subtitle}</p>}
          </div>

          <div className="form-section">
            {children}
          </div>
        </div>
        
        <div className="image-section">
          <img
            src={isChildAuth 
              ? 'https://images.unsplash.com/photo-1628258334105-2a0b3d6efee1'
              : 'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e'
            }
            alt="Auth background"
            className="background-image"
          />
        </div>
      </main>

      <footer className="footer">
        <nav className="footer-nav">
          {footerLinks.map(link => (
            <Link key={link.id} to={link.to} className="footer-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </footer>

      <style jsx>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: ${theme.colors.background};
        }

        .auth-container {
          flex: 1;
          display: flex;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }

        .content-section {
          flex: 1;
          padding: ${theme.spacing.spacing.xl}px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .header-section {
          margin-bottom: ${theme.spacing.spacing.xl}px;
        }

        .app-name {
          display: block;
          font-family: ${theme.typography.fontFamily.heading};
          font-size: ${theme.typography.fontSize['2xl']}px;
          color: ${theme.colors.primary[500]};
          text-decoration: none;
          margin-bottom: ${theme.spacing.spacing.md}px;
        }

        .title {
          font-family: ${theme.typography.fontFamily.heading};
          font-size: ${theme.typography.fontSize['3xl']}px;
          color: ${theme.colors.textPrimary};
          margin-bottom: ${theme.spacing.spacing.sm}px;
        }

        .subtitle {
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textSecondary};
        }

        .form-section {
          max-width: 400px;
        }

        .image-section {
          flex: 1;
          display: none;
          padding: ${theme.spacing.spacing.lg}px;

          @media (min-width: 768px) {
            display: block;
          }
        }

        .background-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: ${theme.spacing.borderRadius.lg}px;
        }

        .footer {
          padding: ${theme.spacing.spacing.md}px;
          border-top: 1px solid ${theme.colors.border};
        }

        .footer-nav {
          display: flex;
          justify-content: center;
          gap: ${theme.spacing.spacing.md}px;
        }

        .footer-link {
          color: ${theme.colors.textSecondary};
          text-decoration: none;
          font-size: ${theme.typography.fontSize.sm}px;
          padding: ${theme.spacing.spacing.xs}px;
          transition: color 150ms ease;

          &:hover {
            color: ${theme.colors.primary[500]};
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;