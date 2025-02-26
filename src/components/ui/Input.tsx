import React, { useRef } from 'react';
import { useFocusRing } from '@react-aria/focus';
import { useTextField } from '@react-aria/textfield';
import { lightTheme as theme } from '../../styles/theme';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email' | 'number';
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  maxLength?: number;
  autoComplete?: string;
  'aria-label'?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  label,
  placeholder,
  type = 'text',
  error,
  helperText,
  disabled = false,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className,
  style,
  id,
  name,
  maxLength,
  autoComplete,
  'aria-label': ariaLabel,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const { isFocusVisible, focusProps } = useFocusRing();
  
  const { labelProps, inputProps } = useTextField(
    {
      value,
      onChange,
      label,
      placeholder,
      type,
      isDisabled: disabled,
      isRequired: required,
      maxLength,
      autoComplete,
      id,
      name,
      'aria-label': ariaLabel,
    },
    ref
  );

  return (
    <div 
      className={`input-container ${className || ''} ${disabled ? 'disabled' : ''}`}
      style={style}
    >
      {label && (
        <label {...labelProps} className="input-label">
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}
      
      <div className={`input-wrapper ${isFocusVisible ? 'focus-visible' : ''} ${error ? 'error' : ''}`}>
        {leftIcon && <span className="input-icon left">{leftIcon}</span>}
        
        <input
          {...inputProps}
          {...focusProps}
          ref={ref}
          className="input-field"
        />
        
        {rightIcon && (
          <button 
            type="button"
            className="input-icon right"
            onClick={onRightIconClick}
            disabled={disabled || !onRightIconClick}
          >
            {rightIcon}
          </button>
        )}
      </div>
      
      {(error || helperText) && (
        <span className={`helper-text ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}
      
      <style jsx>{`
        .input-container {
          width: 100%;
          margin-bottom: ${theme.spacing.spacing.sm}px;
        }
        
        .input-label {
          display: block;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textPrimary};
          margin-bottom: 4px;
        }
        
        .required-star {
          color: ${theme.colors.semantic.error};
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.spacing.borderRadius.md}px;
          background: ${theme.colors.surface};
          transition: all 150ms ease;
        }
        
        .input-wrapper.focus-visible {
          outline: 2px solid ${theme.colors.primary[500]};
          outline-offset: 2px;
        }
        
        .input-wrapper.error {
          border-color: ${theme.colors.semantic.error};
        }
        
        .input-field {
          flex: 1;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textPrimary};
          padding: ${theme.spacing.spacing.sm}px;
          border: none;
          background: none;
          outline: none;
          width: 100%;
        }
        
        .input-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${theme.spacing.spacing.sm}px;
          color: ${theme.colors.neutral[400]};
        }
        
        .input-icon.right {
          border: none;
          background: none;
          cursor: pointer;
        }
        
        .input-icon.right:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .helper-text {
          display: block;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.sm}px;
          color: ${theme.colors.textSecondary};
          margin-top: 4px;
        }
        
        .helper-text.error {
          color: ${theme.colors.semantic.error};
        }
        
        .disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Input;