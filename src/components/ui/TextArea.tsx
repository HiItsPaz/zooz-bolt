import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { lightTheme as theme } from '../../styles/theme';
import { mergeStyles, conditionalStyle } from '../../utils/styleUtils';

export interface TextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  autoGrow?: boolean;
  minHeight?: number;
  maxHeight?: number;
  maxLength?: number;
  showCounter?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  textAreaStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  helperStyle?: StyleProp<TextStyle>;
  counterStyle?: StyleProp<TextStyle>;
  testID?: string;
  id?: string;
  name?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  helperText,
  disabled = false,
  required = false,
  autoGrow = false,
  minHeight = 80,
  maxHeight = 200,
  maxLength,
  showCounter = false,
  containerStyle,
  textAreaStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  helperStyle,
  counterStyle,
  testID,
  id,
  name,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [height, setHeight] = useState(minHeight);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    if (autoGrow) {
      const contentHeight = event.nativeEvent.contentSize.height;
      setHeight(Math.min(Math.max(contentHeight, minHeight), maxHeight));
    }
  };
  
  const textAreaContainerStyles = [
    styles.textAreaContainer,
    { minHeight },
    autoGrow && { height },
    conditionalStyle(isFocused, styles.focusedTextArea),
    conditionalStyle(error, styles.errorTextArea),
    conditionalStyle(disabled, styles.disabledTextArea),
    textAreaStyle,
  ];
  
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
      )}
      
      <View style={mergeStyles(textAreaContainerStyles)}>
        <TextInput
          style={[
            styles.input,
            autoGrow && { height: 'auto' },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.neutral[400]}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          maxLength={maxLength}
          onContentSizeChange={handleContentSizeChange}
          testID={testID}
          id={Platform.OS === 'web' ? id : undefined}
          accessibilityLabel={label || placeholder}
          accessibilityRole="text"
          accessibilityState={{ disabled }}
          accessibilityRequired={required}
        />
      </View>
      
      <View style={styles.bottomRow}>
        {(error || helperText) && (
          <Text 
            style={[
              styles.helperText, 
              error ? [styles.errorText, errorStyle] : helperStyle
            ]}
          >
            {error || helperText}
          </Text>
        )}
        
        {(showCounter && maxLength) && (
          <Text style={[styles.counter, counterStyle]}>
            {`${value.length}/${maxLength}`}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: theme.spacing.spacing.sm,
  },
  label: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  requiredStar: {
    color: theme.colors.semantic.error,
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.borderRadius.md,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.spacing.sm,
  },
  input: {
    ...theme.typography.textStyle.body,
    color: theme.colors.textPrimary,
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
    minHeight: 80,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 4,
  },
  helperText: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  errorText: {
    color: theme.colors.semantic.error,
  },
  counter: {
    ...theme.typography.textStyle.bodySmall,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.spacing.sm,
  },
  
  focusedTextArea: {
    borderColor: theme.colors.primary[500],
    ...Platform.select({
      web: {
        outlineWidth: 0,
        boxShadow: `0 0 0 2px ${theme.colors.primary[200]}`,
      },
    }),
  },
  errorTextArea: {
    borderColor: theme.colors.semantic.error,
  },
  disabledTextArea: {
    backgroundColor: theme.colors.neutral[100],
    opacity: 0.7,
    ...Platform.select({
      web: {
        cursor: 'not-allowed',
      },
    }),
  },
});

export default TextArea;