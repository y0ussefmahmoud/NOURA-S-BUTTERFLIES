import React, { useState, useEffect, useRef } from 'react';
import type { InputProps } from '../../types/components';
import { cn } from '../../utils/cn';
import { sanitizeInput } from '../../utils/sanitization';
import { useAnnouncer } from '../../hooks/useAnnouncer';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * Input component with validation states and variants
 *
 * @param variant - Visual style of the input
 * @param size - Size of the input
 * @param error - Error state or error message
 * @param success - Success state
 * @param disabled - Whether input is disabled
 * @param leftIcon - Icon to display on the left
 * @param rightIcon - Icon to display on the right
 * @param label - Label for the input
 * @param helperText - Helper text below the input
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'default',
      size = 'md',
      error,
      success = false,
      disabled = false,
      leftIcon,
      rightIcon,
      label,
      helperText,
      maxLength,
      sanitize = true,
      allowedCharacters,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [charCount, setCharCount] = useState(0);
    const { announce } = useAnnouncer();
    const inputRef = useRef<HTMLInputElement>(null);
    const passwordButtonRef = useRef<HTMLButtonElement>(null);

    // Merge refs
    const mergedRef = (node: HTMLInputElement) => {
      inputRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const charCountId = `${inputId}-charcount`;
    const statusId = `${inputId}-status`;

    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;
    const hasError = !!error;

    // Announce errors when they change
    useEffect(() => {
      if (hasError && typeof error === 'string') {
        announce(`${label || 'Field'} error: ${error}`, 'assertive');
      }
    }, [hasError, error, label, announce]);

    // Announce character count changes for screen readers
    useEffect(() => {
      if (maxLength && charCount > 0) {
        const remaining = maxLength - charCount;
        announce(`${charCount} of ${maxLength} characters used, ${remaining} remaining`, 'polite');
      }
    }, [charCount, maxLength, announce]);

    const baseClasses = 'w-full transition-all focus:outline-none';

    const variantClasses = {
      default:
        'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-primary',
      search:
        'bg-accent-pink dark:bg-surface-dark border-none rounded-full focus:ring-2 focus:ring-primary',
      rounded:
        'bg-surface-light dark:bg-surface-dark border-none rounded-full focus:ring-2 focus:ring-primary',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-4 text-base',
      lg: 'px-8 py-5 text-lg',
    };

    const stateClasses = hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : success
        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
        : '';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
      : '';

    const paddingClasses = {
      default: {
        left: leftIcon ? 'pl-12' : '',
        right: rightIcon || isPassword ? 'pr-12' : '',
      },
      search: {
        left: 'pl-10',
        right: rightIcon ? 'pr-12' : 'pr-4',
      },
      rounded: {
        left: leftIcon ? 'pl-12' : '',
        right: rightIcon || isPassword ? 'pr-12' : '',
      },
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      stateClasses,
      disabledClasses,
      paddingClasses[variant].left,
      paddingClasses[variant].right,
      className
    );

    // Build ARIA attributes
    const ariaAttributes: Record<string, any> = {
      'aria-invalid': hasError,
      'aria-required': props.required,
      'aria-disabled': disabled,
    };

    // Build describedby attribute
    const describedByParts: string[] = [];
    if (hasError && typeof error === 'string') describedByParts.push(errorId);
    if (helperText) describedByParts.push(helperId);
    if (maxLength) describedByParts.push(charCountId);
    if (ariaDescribedBy) describedByParts.push(ariaDescribedBy);

    if (describedByParts.length > 0) {
      ariaAttributes['aria-describedby'] = describedByParts.join(' ');
    }

    if (ariaLabel) {
      ariaAttributes['aria-label'] = ariaLabel;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Apply sanitization if enabled
      if (sanitize) {
        value = sanitizeInput(value);
      }

      // Apply character restrictions if specified
      if (allowedCharacters && !allowedCharacters.test(value)) {
        value = value.replace(new RegExp(`[^${allowedCharacters.source}]`, 'g'), '');
      }

      // Update character count
      if (maxLength) {
        setCharCount(value.length);
      }

      // Create new event with sanitized value
      const sanitizedEvent = {
        ...e,
        target: {
          ...e.target,
          value,
        },
      };

      if (props.onChange) {
        props.onChange(sanitizedEvent);
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (!sanitize) return;

      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');
      const sanitizedText = sanitizeInput(pastedText);

      // Get current cursor position and selection
      const start = e.currentTarget.selectionStart || 0;
      const end = e.currentTarget.selectionEnd || 0;
      const currentValue = e.currentTarget.value;

      // Insert sanitized text
      const newValue =
        currentValue.substring(0, start) + sanitizedText + currentValue.substring(end);

      // Create and dispatch input event
      const inputEvent = new Event('input', { bubbles: true });
      e.currentTarget.value = newValue;
      e.currentTarget.dispatchEvent(inputEvent);
    };

    const handlePasswordToggle = () => {
      const newState = !showPassword;
      setShowPassword(newState);
      announce(`Password ${newState ? 'shown' : 'hidden'}`, 'polite');
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-dark dark:text-text-light mb-2"
          >
            {label}
            {props.required && (
              <span className="text-red-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined">
                {typeof leftIcon === 'string' ? leftIcon : leftIcon}
              </span>
            </div>
          )}

          <input
            ref={mergedRef}
            id={inputId}
            type={actualType}
            className={classes}
            disabled={disabled}
            maxLength={maxLength}
            onChange={handleInputChange}
            onPaste={sanitize ? handlePaste : undefined}
            {...ariaAttributes}
            {...props}
          />

          {(rightIcon || isPassword) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isPassword ? (
                <button
                  ref={passwordButtonRef}
                  type="button"
                  onClick={handlePasswordToggle}
                  className="text-text-muted hover:text-text-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              ) : (
                <span className="material-symbols-outlined text-text-muted" aria-hidden="true">
                  {typeof rightIcon === 'string' ? rightIcon : rightIcon}
                </span>
              )}
            </div>
          )}

          {success && !hasError && (
            <div
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500"
              aria-hidden="true"
            >
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          )}
        </div>

        {/* Live region for status announcements */}
        <div id={statusId} aria-live="polite" aria-atomic="true" className="sr-only" />

        {hasError && typeof error === 'string' && (
          <p id={errorId} className="mt-2 text-sm text-red-500" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="mt-2 text-sm text-text-muted">
            {helperText}
          </p>
        )}

        {maxLength && (
          <p
            id={charCountId}
            className="mt-2 text-xs text-text-muted text-right"
            aria-label={`Character count: ${charCount} of ${maxLength}`}
          >
            <VisuallyHidden>
              {charCount} of {maxLength} characters used
            </VisuallyHidden>
            <span aria-hidden="true">
              {charCount}/{maxLength}
            </span>
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
