import React from 'react';
import { lightTheme as theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  children,
  elevation = 'md',
  padding = 'md',
  onClick,
  className,
  style,
}) => {
  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={`card ${elevation} ${padding} ${onClick ? 'clickable' : ''} ${className || ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
      
      <style jsx>{`
        .card {
          background: ${theme.colors.surface};
          border-radius: ${theme.spacing.borderRadius.lg}px;
          border: 1px solid ${theme.colors.border};
          transition: all 150ms ease;
        }
        
        /* Elevation */
        .sm {
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        
        .md {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                     0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .lg {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                     0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        /* Padding */
        .none {
          padding: 0;
        }
        
        .sm {
          padding: ${theme.spacing.spacing.sm}px;
        }
        
        .md {
          padding: ${theme.spacing.spacing.md}px;
        }
        
        .lg {
          padding: ${theme.spacing.spacing.lg}px;
        }
        
        /* Interactive */
        .clickable {
          cursor: pointer;
          border: none;
          text-align: left;
          width: 100%;
          background: none;
          outline: none;
        }
        
        .clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.1),
                     0 4px 8px -2px rgba(0, 0, 0, 0.05);
        }
        
        .clickable:focus-visible {
          outline: 2px solid ${theme.colors.primary[500]};
          outline-offset: 2px;
        }
      `}</style>
    </Component>
  );
};

export default Card;