import { useState, useCallback, useRef } from 'react';
import { useAnnouncer } from './useAnnouncer';

export type ValidationMode = 'onBlur' | 'onChange' | 'onSubmit' | 'progressive';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  custom?: (value: string) => string | null;
  async?: (value: string) => Promise<string | null>;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string | null;
}

export interface TouchedFields {
  [key: string]: boolean;
}

export interface UseFormValidationOptions {
  mode?: ValidationMode;
  announceErrors?: boolean;
  errorMessages?: {
    required?: (fieldName: string) => string;
    email?: string;
    minLength?: (min: number) => string;
    maxLength?: (max: number) => string;
    pattern?: string;
    custom?: string;
  };
}

export interface UseFormValidationReturn {
  errors: FormErrors;
  touchedFields: TouchedFields;
  isValidating: boolean;
  validateField: (name: string, value: string) => Promise<string | null>;
  validateFieldWithFeedback: (
    name: string,
    value: string
  ) => Promise<{
    isValid: boolean;
    error: string | null;
    warning: string | null;
    suggestion: string | null;
  }>;
  validateForm: (formData: { [key: string]: string }) => Promise<boolean>;
  clearErrors: () => void;
  clearFieldError: (name: string) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  isFieldTouched: (name: string) => boolean;
  shouldShowError: (name: string) => boolean;
  announceError: (fieldName: string, error: string) => void;
  announceSuccess: (fieldName: string) => void;
}

export const useFormValidation = (
  rules: ValidationRules,
  options: UseFormValidationOptions = {}
): UseFormValidationReturn => {
  const { mode = 'onBlur', announceErrors = true, errorMessages = {} } = options;

  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [isValidating, setIsValidating] = useState(false);
  const { announce } = useAnnouncer();
  const validationTimeouts = useRef<Map<string, number>>(new Map());
  const asyncTimeouts = useRef<Map<string, number>>(new Map());

  const getDefaultErrorMessage = useCallback(
    (type: string, fieldName: string, rule?: ValidationRule): string => {
      const fieldNameCapitalized =
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');

      switch (type) {
        case 'required':
          return (
            errorMessages.required?.(fieldNameCapitalized) || `${fieldNameCapitalized} is required`
          );
        case 'email':
          return errorMessages.email || 'Please enter a valid email address';
        case 'minLength':
          return (
            errorMessages.minLength?.(rule?.minLength || 0) ||
            `Minimum ${rule?.minLength} characters required`
          );
        case 'maxLength':
          return (
            errorMessages.maxLength?.(rule?.maxLength || 0) ||
            `Maximum ${rule?.maxLength} characters allowed`
          );
        case 'pattern':
          return errorMessages.pattern || 'Invalid format';
        case 'custom':
          return errorMessages.custom || 'Invalid input';
        default:
          return 'Invalid input';
      }
    },
    [errorMessages]
  );

  const announceError = useCallback(
    (fieldName: string, error: string) => {
      if (announceErrors) {
        announce(`${fieldName}: ${error}`, 'assertive');
      }
    },
    [announceErrors, announce]
  );

  const announceSuccess = useCallback(
    (fieldName: string) => {
      if (announceErrors) {
        announce(`${fieldName} is valid`, 'polite');
      }
    },
    [announceErrors, announce]
  );

  const validateFormatRules = useCallback(
    (value: string, rule: ValidationRule, fieldName: string): string | null => {
      if (rule.email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          return getDefaultErrorMessage('email', fieldName, rule);
        }
      }

      if (rule.minLength && value.length < rule.minLength) {
        return getDefaultErrorMessage('minLength', fieldName, rule);
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        return getDefaultErrorMessage('maxLength', fieldName, rule);
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        return getDefaultErrorMessage('pattern', fieldName, rule);
      }

      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          return customError;
        }
      }

      return null;
    },
    [getDefaultErrorMessage]
  );

  const validateField = useCallback(
    async (name: string, value: string): Promise<string | null> => {
      const rule = rules[name];
      if (!rule) return null;

      // Clear any existing timeout for this field
      const existingTimeout = validationTimeouts.current.get(name);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Required validation
      if (rule.required && !value.trim()) {
        const error = getDefaultErrorMessage('required', name, rule);
        return error;
      }

      // Skip other validations if field is empty and not required
      if (!value.trim() && !rule.required) {
        return null;
      }

      const formatError = validateFormatRules(value, rule, name);
      if (formatError) {
        return formatError;
      }

      // Async validation
      if (rule.async) {
        setIsValidating(true);
        try {
          const error = await rule.async(value);
          return error;
        } finally {
          setIsValidating(false);
        }
      }

      return null;
    },
    [rules, getDefaultErrorMessage]
  );

  const validateFieldProgressive = useCallback(
    async (name: string, value: string): Promise<string | null> => {
      const rule = rules[name];
      if (!rule) return null;

      if (rule.required && !value.trim()) {
        return getDefaultErrorMessage('required', name, rule);
      }

      if (!value.trim() && !rule.required) {
        return null;
      }

      await new Promise((resolve) => window.setTimeout(resolve, 300));
      const formatError = validateFormatRules(value, rule, name);
      if (formatError) return formatError;

      if (rule.async) {
        const existingTimeout = asyncTimeouts.current.get(name);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        return new Promise((resolve) => {
          const timeoutId = window.setTimeout(async () => {
            setIsValidating(true);
            try {
              const asyncError = await rule.async?.(value);
              resolve(asyncError || null);
            } finally {
              setIsValidating(false);
              asyncTimeouts.current.delete(name);
            }
          }, 500);

          asyncTimeouts.current.set(name, timeoutId);
        });
      }

      return null;
    },
    [rules, getDefaultErrorMessage, validateFormatRules]
  );

  const validateFieldWithFeedback = useCallback(
    async (name: string, value: string) => {
      const error =
        mode === 'progressive'
          ? await validateFieldProgressive(name, value)
          : await validateField(name, value);

      const rule = rules[name];
      let warning: string | null = null;
      let suggestion: string | null = null;

      if (!error && rule?.minLength && value.length > 0 && value.length < rule.minLength + 2) {
        warning = `Almost there — add ${rule.minLength - value.length} more characters.`;
      }

      if (!error && rule?.pattern) {
        suggestion = 'Check the required format before submitting.';
      }

      return {
        isValid: !error,
        error,
        warning,
        suggestion,
      };
    },
    [mode, rules, validateField, validateFieldProgressive]
  );

  const validateForm = useCallback(
    async (formData: { [key: string]: string }): Promise<boolean> => {
      setIsValidating(true);
      const newErrors: FormErrors = {};
      let isValid = true;

      try {
        await Promise.all(
          Object.keys(rules).map(async (fieldName) => {
            const error = await validateField(fieldName, formData[fieldName] || '');
            if (error) {
              newErrors[fieldName] = error;
              isValid = false;
            }
          })
        );

        setErrors(newErrors);

        // Announce form validation results
        if (!isValid && announceErrors) {
          const errorCount = Object.keys(newErrors).length;
          announce(
            `Form has ${errorCount} ${errorCount === 1 ? 'error' : 'errors'}. Please review and correct.`,
            'assertive'
          );
        }

        return isValid;
      } finally {
        setIsValidating(false);
      }
    },
    [rules, validateField, announceErrors, announce]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((name: string) => {
    setErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  }, []);

  const setFieldError = useCallback(
    (name: string, error: string | null) => {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));

      if (error && announceErrors) {
        announceError(name, error);
      }
    },
    [announceErrors, announceError]
  );

  const setFieldTouched = useCallback((name: string, touched: boolean) => {
    setTouchedFields((prev) => ({
      ...prev,
      [name]: touched,
    }));
  }, []);

  const isFieldTouched = useCallback(
    (name: string) => {
      return touchedFields[name] || false;
    },
    [touchedFields]
  );

  const shouldShowError = useCallback(
    (name: string) => {
      const hasError = !!errors[name];
      const isTouched = touchedFields[name];

      switch (mode) {
        case 'onChange':
          return hasError && isTouched;
        case 'onBlur':
          return hasError && isTouched;
        case 'onSubmit':
          return hasError;
        case 'progressive':
          return hasError && isTouched;
        default:
          return hasError;
      }
    },
    [errors, touchedFields, mode]
  );

  return {
    errors,
    touchedFields,
    isValidating,
    validateField,
    validateFieldWithFeedback,
    validateForm,
    clearErrors,
    clearFieldError,
    setFieldError,
    setFieldTouched,
    isFieldTouched,
    shouldShowError,
    announceError,
    announceSuccess,
  };
};
