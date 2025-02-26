import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { Check, Minus } from 'lucide-react-native';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  error?: string;
  indeterminate?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  checkboxStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  testID?: string;
  id?: string;
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  error,
  indeterminate = false,
  containerStyle,
  checkboxStyle,
  labelStyle,
  errorStyle,
  testID,
  id,
  name,
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const renderCheckboxContent = () => {
    if (indeterminate) {
      return <Minus size={14} color={theme.colors.neutral[0]} />;
    }
    
    if (checked) {
      return <Check size={14} color={theme.colors.neutral[0]} />;
    }
    
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        onPress={handleToggle}
        disabled={disabled}
        style={styles.touchable}
        accessibilityRole="checkbox"
        accessibilityState={{ checked, disabled }}
        testID={testID}
      >
        <View
          style={[
            styles.checkbox,
            checked && styles.checkedBox,
            indeterminate && styles.indeterminateBox,
            disabled && styles.disabledBox,
            error && styles.errorBox,
            checkboxStyle,
          ]}
        >
          {renderCheckboxContent()}
        </View>
        
        {label && (
          <Text
            style={[
              styles.label,
              disabled && styles.disabledText,
              error && styles.errorText,
              labelStyle,
            ]}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
      
      {error && (
        <Text style={[styles.errorMessage, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.spacing.sm,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: theme.colors.neutral[400],
    borderRadius: theme.spacing.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  checkedBox: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  indeterminateBox: {
    backgroundColor: theme.colors.primary[500],
    borderColor: theme.colors.primary[500],
  },
  disabledBox: {
    backgroundColor: theme.colors.neutral[100],
    borderColor: theme.colors.neutral[300],
    opacity: 0.6,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
    }),
  },
  errorBox: {
    borderColor: theme.colors.semantic.error,
  },
  label: {
    ...theme.typography.textStyle.body,
    marginLeft: theme.spacing.spacing.sm,
    color: theme.colors.textPrimary,
  },
  disabledText: {
    color: theme.colors.neutral[400],
  },
  errorText: {
    color: theme.colors.semantic.error,
  },
  errorMessage: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.semantic.error,
    marginTop: 4,
    marginLeft: 28,
  },
});

export default Checkbox;