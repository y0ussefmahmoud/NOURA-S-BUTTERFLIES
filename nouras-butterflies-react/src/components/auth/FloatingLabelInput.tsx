import React, { useMemo, useState, useId } from 'react';
import { Tooltip } from '../ui/Tooltip';
import { Icon } from '../ui/Icon';
import { getPasswordStrength } from '../../utils/validation';

interface FloatingLabelInputProps {
  label: string;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  tooltip?: string | React.ReactNode;
  helperText?: string;
  maxLength?: number;
  showSuccess?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  tooltip,
  helperText,
  maxLength,
  showSuccess = false,
  placeholder,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value));
  const inputId = useId();
  const passwordStrength = useMemo(() => {
    if (type !== 'password' || !value) return null;
    return getPasswordStrength(value);
  }, [type, value]);
  const charCount = value.length;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleChange = (newValue: string) => {
    setHasValue(Boolean(newValue));
    onChange(newValue);
  };

  const shouldFloat = isFocused || hasValue || placeholder;

  return (
    <div className={`relative ${className}`}>
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 border rounded-lg transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
          ${shouldFloat ? 'pt-6' : 'pt-3'}
        `}
      />

      <label
        htmlFor={inputId}
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none flex items-center gap-2
          ${shouldFloat ? 'top-2 text-xs text-gray-500' : 'top-3 text-base text-gray-700'}
          ${error ? 'text-red-500' : ''}
          ${disabled ? 'text-gray-400' : ''}
        `}
      >
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {tooltip && shouldFloat && (
          <Tooltip content={tooltip}>
            <span className="pointer-events-auto text-text-muted">
              <Icon name="info" size="xs" />
            </span>
          </Tooltip>
        )}
      </label>

      {showSuccess && !error && hasValue && (
        <span className="absolute right-3 top-4 text-green-500">
          <Icon name="check_circle" size="sm" />
        </span>
      )}

      {passwordStrength && (
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-16 rounded-full ${
              passwordStrength === 'strong'
                ? 'bg-green-500'
                : passwordStrength === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          />
          <span className="text-text-muted capitalize">{passwordStrength}</span>
        </div>
      )}

      {helperText && !error && <p className="mt-1 text-sm text-text-muted">{helperText}</p>}

      {maxLength && (
        <p className="mt-1 text-xs text-text-muted text-right">
          {charCount}/{maxLength}
        </p>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
