import React, { useEffect, useMemo, useState } from 'react';
import type { ShippingAddress } from '../../types/cart';
import type { FormErrors } from '../../types/checkout';
import { FormField } from '../ui/FormField';
import { FormErrorSummary } from '../ui/FormErrorSummary';
import { AddressAutocomplete } from '../ui/AddressAutocomplete';
import { cn } from '../../utils/cn';
import { sanitizeInput } from '../../utils/sanitization';
import { formatPhoneNumber, formatPostalCode } from '../../utils/formatters';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  getPhoneErrorMessage,
  validateAddress,
  validateCity,
  validateCountry,
  validateName,
  validatePostalCode,
  validatePhone,
} from '../../utils/validation';

interface AddressFormProps {
  address: ShippingAddress;
  onChange: (address: ShippingAddress) => void;
  errors: FormErrors;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
  address,
  onChange,
  errors,
  className,
  onFocus,
  onBlur,
}) => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [showAdditional, setShowAdditional] = useState(false);
  const [fieldFeedback, setFieldFeedback] = useState<
    Record<string, { error: string | null; warning: string | null; suggestion: string | null }>
  >({});

  const validationRules = useMemo(
    () => ({
      fullName: {
        required: true,
        custom: (value: string) =>
          validateName(value).isValid ? null : 'Please enter a valid full name',
      },
      phone: {
        required: true,
        custom: (value: string) =>
          validatePhone(value).isValid
            ? null
            : getPhoneErrorMessage(value) || 'Invalid phone number',
      },
      streetAddress: {
        required: true,
        custom: (value: string) =>
          validateAddress(value).isValid ? null : 'Please enter a valid street address',
      },
      city: {
        required: true,
        custom: (value: string) =>
          validateCity(value).isValid ? null : 'Please enter a valid city name',
      },
      postalCode: {
        required: true,
        custom: (value: string) =>
          validatePostalCode(value) ? null : 'Please enter a valid 5-digit postal code',
      },
      country: {
        required: true,
        custom: (value: string) =>
          validateCountry(value).isValid ? null : 'Please enter a valid country name',
      },
    }),
    []
  );

  const { validateFieldWithFeedback } = useFormValidation(validationRules, { mode: 'progressive' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('checkout_additional_fields');
    if (saved) {
      setShowAdditional(saved === 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('checkout_additional_fields', String(showAdditional));
  }, [showAdditional]);

  useEffect(() => {
    if (errors.postalCode && !showAdditional) {
      setShowAdditional(true);
    }
  }, [errors.postalCode, showAdditional]);

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    // Sanitize input before updating state
    const sanitizedValue = sanitizeInput(value);

    onChange({
      ...address,
      [field]: sanitizedValue,
    });

    // Real-time validation for better UX
    setTouchedFields((prev) => new Set(prev).add(field));

    if (field in validationRules) {
      void validateFieldWithFeedback(field, sanitizedValue).then((result) => {
        setFieldFeedback((prev) => ({
          ...prev,
          [field]: {
            error: result.error,
            warning: result.warning,
            suggestion: result.suggestion,
          },
        }));
      });
    }
  };

  const handleInputFocus = () => {
    onFocus?.();
  };

  const handleInputBlur = (field: keyof ShippingAddress) => {
    onBlur?.();
    setTouchedFields((prev) => new Set(prev).add(field));
    // Real-time validation can be added here
  };

  const getFieldError = (field: keyof ShippingAddress) => {
    if (!touchedFields.has(field)) return undefined;
    return fieldFeedback[field]?.error || errors[field];
  };

  const isFieldValid = (field: keyof ShippingAddress) => {
    return touchedFields.has(field) && !(fieldFeedback[field]?.error || errors[field]);
  };

  const errorSummary = useMemo(() => {
    const summary: Record<string, string | undefined> = {};
    Object.entries(errors).forEach(([key, value]) => {
      if (value) summary[key] = value;
    });
    return summary;
  }, [errors]);

  return (
    <div className={cn('space-y-4 md:space-y-6', className)}>
      <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
        Shipping Information
      </h3>

      <FormErrorSummary errors={errorSummary} />

      {/* Name and Phone - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="fullName"
          label="Full Name"
          value={address.fullName}
          onChange={(value) => handleInputChange('fullName', value)}
          onFocus={handleInputFocus}
          onBlur={() => handleInputBlur('fullName')}
          error={getFieldError('fullName')}
          placeholder="Enter your full name"
          required
          autocomplete="name"
          tooltip="اكتب الاسم الكامل كما يظهر في الهوية"
          success={isFieldValid('fullName')}
          warning={fieldFeedback.fullName?.warning}
          suggestion={fieldFeedback.fullName?.suggestion}
        />

        <FormField
          name="phone"
          label="Phone Number"
          type="tel"
          value={address.phone}
          onChange={(value) => handleInputChange('phone', formatPhoneNumber(value))}
          onFocus={handleInputFocus}
          onBlur={() => handleInputBlur('phone')}
          error={getFieldError('phone')}
          placeholder="05X XXX XXXX"
          required
          autocomplete="tel"
          inputMode="tel"
          helperText="We'll use this to contact you about your order"
          tooltip="رقم هاتفك السعودي للتواصل بشأن الطلب"
          mask="phone"
          success={isFieldValid('phone')}
          showExamples
          examples={['05X XXX XXXX', '+966 5X XXX XXXX']}
          warning={fieldFeedback.phone?.warning}
          suggestion={fieldFeedback.phone?.suggestion}
        />
      </div>

      {/* Street Address - Full width with clear button */}
      <div className="space-y-2">
        <label
          htmlFor="streetAddress"
          className="text-sm font-medium text-text-dark dark:text-text-light"
        >
          Street Address <span className="text-red-500">*</span>
        </label>
        <AddressAutocomplete
          value={address.streetAddress}
          onChange={(value) => handleInputChange('streetAddress', value)}
          onSelect={(selection) => {
            handleInputChange('streetAddress', selection.address);
            if (selection.city) handleInputChange('city', selection.city);
            if (selection.postalCode) handleInputChange('postalCode', selection.postalCode);
            if (selection.country) handleInputChange('country', selection.country);
          }}
          placeholder="123 Main Street, Apartment 4B"
          inputId="streetAddress"
        />
        <p className="text-sm text-text-muted">
          Include apartment, suite, or unit number if applicable.
        </p>
        {getFieldError('streetAddress') && (
          <p className="text-sm text-red-500">{getFieldError('streetAddress')}</p>
        )}
        {fieldFeedback.streetAddress?.warning && (
          <p className="text-sm text-orange-500">{fieldFeedback.streetAddress.warning}</p>
        )}
        {fieldFeedback.streetAddress?.suggestion && !getFieldError('streetAddress') && (
          <p className="text-sm text-text-muted">{fieldFeedback.streetAddress.suggestion}</p>
        )}
      </div>

      {/* City and Postal Code - Mobile First */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          name="city"
          label="City"
          value={address.city}
          onChange={(value) => handleInputChange('city', value)}
          onFocus={handleInputFocus}
          onBlur={() => handleInputBlur('city')}
          error={getFieldError('city')}
          placeholder="Riyadh"
          required
          autocomplete="address-level2"
          tooltip="المدينة تساعدنا في تحديد أسرع مسار للتوصيل"
          success={isFieldValid('city')}
          warning={fieldFeedback.city?.warning}
          suggestion={fieldFeedback.city?.suggestion}
        />

        <FormField
          name="postalCode"
          label="Postal Code"
          value={address.postalCode}
          onChange={(value) => handleInputChange('postalCode', formatPostalCode(value))}
          onFocus={handleInputFocus}
          onBlur={() => handleInputBlur('postalCode')}
          error={getFieldError('postalCode')}
          placeholder="12345"
          required
          maxLength={5}
          inputMode="numeric"
          mask="postal"
          tooltip="الرمز البريدي المكون من 5 أرقام"
          success={isFieldValid('postalCode')}
          warning={fieldFeedback.postalCode?.warning}
          suggestion={fieldFeedback.postalCode?.suggestion}
        />
      </div>

      {/* Country - Full width with clear button */}
      <FormField
        name="country"
        label="Country"
        value={address.country}
        onChange={(value) => handleInputChange('country', value)}
        onFocus={handleInputFocus}
        onBlur={() => handleInputBlur('country')}
        error={getFieldError('country')}
        placeholder="Saudi Arabia"
        required
        autocomplete="country-name"
        tooltip="تأكد من اختيار الدولة الصحيحة للشحن"
        success={isFieldValid('country')}
        warning={fieldFeedback.country?.warning}
        suggestion={fieldFeedback.country?.suggestion}
      />

      <button
        type="button"
        className="flex items-center justify-between w-full rounded-xl border border-border-light px-4 py-3 text-sm text-text-dark"
        onClick={() => setShowAdditional((prev) => !prev)}
        aria-expanded={showAdditional}
      >
        <span>Additional information</span>
        <span className="material-symbols-outlined text-text-muted">
          {showAdditional ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {showAdditional && (
        <div className="space-y-4 animate-fadeIn">
          {/* Delivery Instructions */}
          <div className="p-4 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-lg border border-accent-pink/20">
            <h4 className="text-sm font-semibold text-text-dark dark:text-text-light mb-2">
              Delivery Instructions (Optional)
            </h4>
            <textarea
              className="w-full px-4 py-3 text-sm bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary resize-none touch-target"
              rows={3}
              placeholder="Any special instructions for delivery (e.g., call upon arrival, leave with building security)"
              value={address.deliveryInstructions || ''}
              onChange={(e) => {
                const sanitizedValue = sanitizeInput(e.target.value);
                handleInputChange('deliveryInstructions', sanitizedValue);
              }}
            />
            {getFieldError('deliveryInstructions') && (
              <p className="text-sm text-red-500">{getFieldError('deliveryInstructions')}</p>
            )}
          </div>

          {/* Address Type Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-text-dark dark:text-text-light">[...]</h4>
            <div className="flex flex-wrap gap-3">
              {['Home', 'Office', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary hover:bg-primary/10 transition-colors touch-target"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Address Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="save-address"
          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary touch-target"
        />
        <label
          htmlFor="save-address"
          className="text-sm text-text-dark dark:text-text-light cursor-pointer"
        >
          Save this address for future orders
        </label>
      </div>
    </div>
  );
};

AddressForm.displayName = 'AddressForm';
