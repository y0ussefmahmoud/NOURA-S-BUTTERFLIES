import React, { Suspense, useMemo, useState } from 'react';
import type { ValidationRule } from '../../hooks/useFormValidation';
import { Input } from './Input';
import { Icon } from './Icon';
import { FieldExample } from './FieldExample';
import {
  formatPhoneNumber,
  formatPostalCode,
  formatCardNumber,
  formatExpiryDate,
} from '../../utils/formatters';

const Tooltip = React.lazy(async () => {
  const module = await import('./Tooltip');
  return { default: module.Tooltip };
});

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number';
  value: string;
  onChange: (value: string) => void;
  validation?: ValidationRule;
  tooltip?: string | React.ReactNode;
  helperText?: string;
  placeholder?: string;
  required?: boolean;
  mask?: 'phone' | 'card' | 'expiry' | 'postal';
  autocomplete?: React.InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  error?: string | null;
  success?: boolean;
  warning?: string | null;
  suggestion?: string | null;
  maxLength?: number;
  showExamples?: boolean;
  examples?: string[];
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onBlur?: () => void;
  onFocus?: () => void;
}

const getMaskValue = (value: string, mask?: FormFieldProps['mask']) => {
  switch (mask) {
    case 'phone':
      return formatPhoneNumber(value);
    case 'card':
      return formatCardNumber(value);
    case 'expiry':
      return formatExpiryDate(value);
    case 'postal':
      return formatPostalCode(value);
    default:
      return value;
  }
};

export const FormField: React.FC<FormFieldProps> = React.memo(
  ({
    name,
    label,
    type = 'text',
    value,
    onChange,
    tooltip,
    helperText,
    placeholder,
    required,
    mask,
    autocomplete,
    inputMode,
    error,
    success,
    warning,
    suggestion,
    maxLength,
    showExamples = false,
    examples = [],
    leftIcon,
    rightIcon,
    onBlur,
    onFocus,
  }) => {
    const [isFocused, setIsFocused] = useState(false);
    const resolvedValue = useMemo(() => getMaskValue(value, mask), [mask, value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextValue = getMaskValue(event.target.value, mask);
      onChange(nextValue);
    };

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={name} className="text-sm font-medium text-text-dark dark:text-text-light">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {tooltip && (
            <Suspense fallback={null}>
              <Tooltip content={tooltip}>
                <button
                  type="button"
                  className="text-text-muted hover:text-primary transition-colors"
                  aria-label="Field info"
                >
                  <Icon name="info" size="sm" />
                </button>
              </Tooltip>
            </Suspense>
          )}
        </div>
        <Input
          id={name}
          type={type}
          value={resolvedValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          inputMode={inputMode}
          autoComplete={autocomplete}
          error={error || undefined}
          success={success}
          leftIcon={leftIcon}
          rightIcon={rightIcon}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
        />
        {warning && <p className="text-sm text-orange-500">{warning}</p>}
        {suggestion && !error && <p className="text-sm text-text-muted">{suggestion}</p>}
        {helperText && !error && !suggestion && (
          <p className="text-sm text-text-muted">{helperText}</p>
        )}
        <FieldExample
          isVisible={isFocused && showExamples}
          title="أمثلة صحيحة"
          examples={examples}
        />
      </div>
    );
  }
);

FormField.displayName = 'FormField';
