import React, { useRef, useState } from 'react';
import { useButton } from '@react-aria/button';
import { useSelect } from '@react-aria/select';
import { lightTheme as theme } from '../../styles/theme';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  name?: string;
  'aria-label'?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  style,
  id,
  name,
  'aria-label': ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Get the selected option's label
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  // Handle button press to toggle dropdown
  const { buttonProps } = useButton({
    onPress: () => setIsOpen(!isOpen),
    isDisabled: disabled,
  }, buttonRef);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        const currentIndex = options.findIndex(opt => opt.value === value);
        const nextIndex = e.key === 'ArrowDown'
          ? (currentIndex + 1) % options.length
          : (currentIndex - 1 + options.length) % options.length;
        onChange(options[nextIndex].value);
        break;
      case 'Enter':
      case 'Space':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        listboxRef.current &&
        !listboxRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={`select-container ${className || ''}`} style={style}>
      {label && (
        <label 
          className="select-label"
          htmlFor={id}
        >
          {label}
          {required && <span className="required-star">*</span>}
        </label>
      )}

      <div className={`select-wrapper ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <button
          {...buttonProps}
          ref={buttonRef}
          className="select-button"
          id={id}
          name={name}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || label}
          aria-invalid={!!error}
          aria-required={required}
          onKeyDown={handleKeyDown}
        >
          <span className="select-value">{displayValue}</span>
          <ChevronDown 
            size={16} 
            className={`select-icon ${isOpen ? 'open' : ''}`} 
          />
        </button>

        {isOpen && (
          <ul
            ref={listboxRef}
            className="select-options"
            role="listbox"
            aria-label={label || placeholder}
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`select-option ${value === option.value ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                onClick={() => {
                  if (!option.disabled) {
                    onChange(option.value);
                    setIsOpen(false);
                  }
                }}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(error || helperText) && (
        <span className={`helper-text ${error ? 'error' : ''}`}>
          {error || helperText}
        </span>
      )}

      <style jsx>{`
        .select-container {
          width: 100%;
          margin-bottom: ${theme.spacing.spacing.sm}px;
        }

        .select-label {
          display: block;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textPrimary};
          margin-bottom: 4px;
        }

        .required-star {
          color: ${theme.colors.semantic.error};
        }

        .select-wrapper {
          position: relative;
          width: 100%;
        }

        .select-button {
          width: 100%;
          height: 40px;
          padding: 0 ${theme.spacing.spacing.md}px;
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.spacing.borderRadius.md}px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textPrimary};
          transition: all 150ms ease;
        }

        .select-button:hover:not(:disabled) {
          border-color: ${theme.colors.primary[500]};
        }

        .select-button:focus {
          outline: none;
          border-color: ${theme.colors.primary[500]};
          box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
        }

        .select-value {
          flex: 1;
          text-align: left;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .select-icon {
          margin-left: ${theme.spacing.spacing.sm}px;
          color: ${theme.colors.neutral[400]};
          transition: transform 150ms ease;
        }

        .select-icon.open {
          transform: rotate(180deg);
        }

        .select-options {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          padding: ${theme.spacing.spacing.xs}px 0;
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
          border-radius: ${theme.spacing.borderRadius.md}px;
          box-shadow: ${theme.spacing.shadow.md};
          z-index: ${theme.spacing.zIndex.dropdown};
          max-height: 250px;
          overflow-y: auto;
        }

        .select-option {
          padding: ${theme.spacing.spacing.sm}px ${theme.spacing.spacing.md}px;
          cursor: pointer;
          font-family: ${theme.typography.fontFamily.body};
          font-size: ${theme.typography.fontSize.md}px;
          color: ${theme.colors.textPrimary};
          transition: background-color 150ms ease;
        }

        .select-option:hover:not(.disabled) {
          background: ${theme.colors.primary[50]};
        }

        .select-option.selected {
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
          font-weight: ${theme.typography.fontWeight.medium};
        }

        .select-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .select-wrapper.error .select-button {
          border-color: ${theme.colors.semantic.error};
        }

        .select-wrapper.disabled .select-button {
          background: ${theme.colors.neutral[100]};
          cursor: not-allowed;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default Select;