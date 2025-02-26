import React from 'react';
import { useButton } from '@react-aria/button';
import { useFocusRing } from '@react-aria/focus';
import { lightTheme as theme } from '../../styles/theme';

interface ButtonProps {
  title: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className,
  style,
  'aria-label': ariaLabel,
}) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      onPress: onClick,
      isDisabled: disabled || loading,
      'aria-label': ariaLabel || title,
    },
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();

  return (
    <button
      {...buttonProps}
      {...focusProps}
      ref={ref}
      className={`
        button
        ${variant}
        ${size}
        ${fullWidth ? 'full-width' : ''}
        ${isFocusVisible ? 'focus-visible' : ''}
        ${className || ''}
      `}
      style={style}
    >
      {loading ? (
        <span className="loader" />
      ) : (
        <span className="content">
          {leftIcon && <span className="icon left">{leftIcon}</span>}
          <span className="title">{title}</span>
          {rightIcon && <span className="icon right">{rightIcon}</span>}
        </span>
      )}
      
      <style jsx>{`
        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          border-radius: ${theme.spacing.borderRadius.md}px;
          font-family: ${theme.typography.fontFamily.body};
          font-weight: ${theme.typography.fontWeight.medium};
          cursor: pointer;
          transition: all 150ms ease;
          outline: none;
        }
        
        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .button.focus-visible {
          outline: 2px solid ${theme.colors.primary[500]};
          outline-offset: 2px;
        }
        
        .button.full-width {
          width: 100%;
        }
        
        /* Variants */
        .primary {
          background: ${theme.colors.primary[500]};
          color: ${theme.colors.neutral[0]};
        }
        
        .primary:hover:not(:disabled) {
          background: ${theme.colors.primary[600]};
        }
        
        .secondary {
          background: ${theme.colors.secondary[500]};
          color: ${theme.colors.neutral[0]};
        }
        
        .secondary:hover:not(:disabled) {
          background: ${theme.colors.secondary[600]};
        }
        
        .outline {
          background: transparent;
          border: 1px solid ${theme.colors.primary[500]};
          color: ${theme.colors.primary[500]};
        }
        
        .outline:hover:not(:disabled) {
          background: ${theme.colors.primary[50]};
        }
        
        .text {
          background: transparent;
          color: ${theme.colors.primary[500]};
          padding: 0;
        }
        
        .text:hover:not(:disabled) {
          text-decoration: underline;
        }
        
        /* Sizes */
        .sm {
          padding: ${theme.spacing.spacing.xs}px ${theme.spacing.spacing.sm}px;
          font-size: ${theme.typography.fontSize.sm}px;
          min-height: 32px;
        }
        
        .md {
          padding: ${theme.spacing.spacing.sm}px ${theme.spacing.spacing.md}px;
          font-size: ${theme.typography.fontSize.md}px;
          min-height: 40px;
        }
        
        .lg {
          padding: ${theme.spacing.spacing.md}px ${theme.spacing.spacing.lg}px;
          font-size: ${theme.typography.fontSize.lg}px;
          min-height: 48px;
        }
        
        /* Content */
        .content {
          display: flex;
          align-items: center;
          gap: ${theme.spacing.spacing.xs}px;
        }
        
        .icon {
          display: flex;
          align-items: center;
        }
        
        /* Loader */
        .loader {
          width: 20px;
          height: 20px;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-right-color: transparent;
          animation: spin 0.75s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
};

export default Button;