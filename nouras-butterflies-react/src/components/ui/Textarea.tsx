import React, { useState, useRef, useEffect } from 'react';
import type { TextareaProps } from '../../types/components';
import { cn } from '../../utils/cn';
import { sanitizeInput, sanitizeHTML } from '../../utils/sanitization';

/**
 * Textarea component with validation states and auto-grow option
 *
 * @param rows - Number of visible rows
 * @param resize - Resize behavior
 * @param error - Error state or error message
 * @param success - Success state
 * @param disabled - Whether textarea is disabled
 * @param label - Label for the textarea
 * @param helperText - Helper text below the textarea
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      rows = 4,
      resize = 'vertical',
      error,
      success = false,
      disabled = false,
      label,
      helperText,
      maxLength,
      sanitize = true,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = useState(0);
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const hasError = !!error;

    const baseClasses =
      'w-full bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl px-6 py-4 text-base transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary';

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    const stateClasses = hasError
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : success
        ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
        : '';

    const disabledClasses = disabled
      ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
      : '';

    const classes = cn(
      baseClasses,
      resizeClasses[resize],
      stateClasses,
      disabledClasses,
      className
    );

    // Auto-grow functionality
    useEffect(() => {
      const textarea = textareaRef.current;
      if (textarea && props.autoGrow !== false) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [props.value, props.autoGrow, textareaRef]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      let value = e.target.value;

      // Apply sanitization if enabled
      if (sanitize) {
        // For textareas, we might want to allow some HTML formatting
        // but sanitize it to prevent XSS
        if (/<[^>]*>/.test(value)) {
          // Contains HTML, sanitize it
          value = sanitizeHTML(value);
        } else {
          // Plain text, use input sanitization
          value = sanitizeInput(value);
        }
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

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!sanitize) return;

      e.preventDefault();
      const pastedText = e.clipboardData.getData('text');

      // Sanitize pasted content
      let sanitizedText;
      if (/<[^>]*>/.test(pastedText)) {
        sanitizedText = sanitizeHTML(pastedText);
      } else {
        sanitizedText = sanitizeInput(pastedText);
      }

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

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-text-dark dark:text-text-light mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={textareaRef}
            id={textareaId}
            rows={rows}
            className={classes}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : helperText ? helperId : undefined}
            aria-required={props.required}
            maxLength={maxLength}
            onChange={handleInputChange}
            onPaste={sanitize ? handlePaste : undefined}
            {...props}
          />

          {success && !hasError && (
            <div className="absolute top-4 right-4 text-green-500">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
          )}
        </div>

        {hasError && typeof error === 'string' && (
          <p id={errorId} className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="mt-2 text-sm text-text-muted">
            {helperText}
          </p>
        )}

        {maxLength && (
          <p className="mt-2 text-xs text-text-muted text-right">
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
