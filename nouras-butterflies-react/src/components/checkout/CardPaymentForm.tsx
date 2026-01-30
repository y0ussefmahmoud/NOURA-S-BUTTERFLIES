import React, { useEffect, useMemo, useState } from 'react';
import type { PaymentDetails } from '../../types/cart';
import type { FormErrors } from '../../types/checkout';
import { Icon } from '../ui/Icon';
import { FormField } from '../ui/FormField';
import { FormErrorSummary } from '../ui/FormErrorSummary';
import { cn } from '../../utils/cn';
import { sanitizeInput } from '../../utils/sanitization';
import { useFormValidation } from '../../hooks/useFormValidation';
import {
  validateCardNumber,
  validateCVV,
  validateExpiryDate,
  validateName,
} from '../../utils/validation';

interface CardPaymentFormProps {
  paymentDetails: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
  errors: FormErrors;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const CardPaymentForm: React.FC<CardPaymentFormProps> = ({
  paymentDetails,
  onChange,
  errors,
  className,
  onFocus,
  onBlur,
}) => {
  const [showCvv, setShowCvv] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [fieldFeedback, setFieldFeedback] = useState<
    Record<string, { error: string | null; warning: string | null; suggestion: string | null }>
  >({});

  const validationRules = useMemo(
    () => ({
      cardholderName: {
        required: true,
        custom: (value: string) =>
          validateName(value).isValid ? null : 'Please enter a valid cardholder name',
      },
      cardNumber: {
        required: true,
        custom: (value: string) =>
          validateCardNumber(value) ? null : 'رقم البطاقة غير صحيح. تأكد من إدخال الرقم بالكامل',
      },
      expiryDate: {
        required: true,
        custom: (value: string) =>
          validateExpiryDate(value) ? null : 'Please enter a valid expiry date (MM/YY)',
      },
      cvv: {
        required: true,
        custom: (value: string) =>
          validateCVV(value) ? null : 'Please enter a valid CVV (3-4 digits)',
      },
    }),
    []
  );

  const { validateFieldWithFeedback } = useFormValidation(validationRules, { mode: 'progressive' });

  const handleInputChange = (field: keyof PaymentDetails, value: string | boolean) => {
    // Sanitize string values before updating state
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;

    onChange({
      ...paymentDetails,
      [field]: sanitizedValue,
    });

    if (typeof sanitizedValue === 'string' && field in validationRules) {
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

  const handleInputBlur = () => {
    onBlur?.();
  };

  const getCardType = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'visa';
    if (/^(5[1-5])/.test(cleaned)) return 'mastercard';
    if (/^(34|37)/.test(cleaned)) return 'amex';
    return 'unknown';
  };

  const cardType = getCardType(paymentDetails.cardNumber);
  const cardNumberComplete =
    paymentDetails.cardNumber.replace(/\D/g, '').length >= (cardType === 'amex' ? 15 : 16);
  const expiryComplete = paymentDetails.expiryDate.length === 5;
  const cvvComplete = paymentDetails.cvv.length >= (cardType === 'amex' ? 4 : 3);
  const cardNumberError = fieldFeedback.cardNumber?.error || errors.cardNumber;
  const expiryError = fieldFeedback.expiryDate?.error || errors.expiryDate;
  const cvvError = fieldFeedback.cvv?.error || errors.cvv;
  const stepTwoReady = cardNumberComplete && !cardNumberError;
  const stepThreeReady = stepTwoReady && expiryComplete && cvvComplete && !expiryError && !cvvError;

  useEffect(() => {
    if (stepThreeReady) {
      setCurrentStep(3);
    } else if (stepTwoReady) {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [stepThreeReady, stepTwoReady]);

  const progressLabel = useMemo(() => {
    if (currentStep === 1) return 'Step 1 of 3';
    if (currentStep === 2) return 'Step 2 of 3';
    return 'Step 3 of 3';
  }, [currentStep]);

  const fieldSuccess = (value: string, error?: string | null) => Boolean(value) && !error;

  return (
    <div className={cn('space-y-6', className)}>
      <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
        Card Details
      </h3>

      <div className="flex items-center justify-between rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-text-muted">
        <span>{progressLabel}</span>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((step) => (
            <span
              key={step}
              className={cn(
                'h-2 w-10 rounded-full transition-colors',
                currentStep >= step ? 'bg-primary' : 'bg-border-light'
              )}
            />
          ))}
        </div>
      </div>

      <FormErrorSummary errors={errors} />

      {/* Cardholder Name */}
      <FormField
        name="cardholderName"
        label="Cardholder Name"
        value={paymentDetails.cardholderName}
        onChange={(value) => handleInputChange('cardholderName', value)}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        error={fieldFeedback.cardholderName?.error || errors.cardholderName}
        placeholder="John Doe"
        required
        tooltip="أدخل الاسم كما يظهر على البطاقة"
        helperText="Enter the name as it appears on your card"
        success={fieldSuccess(
          paymentDetails.cardholderName,
          fieldFeedback.cardholderName?.error || errors.cardholderName
        )}
        warning={fieldFeedback.cardholderName?.warning}
        suggestion={fieldFeedback.cardholderName?.suggestion}
      />

      {/* Card Number */}
      <div>
        <FormField
          name="cardNumber"
          label="Card Number"
          type="text"
          value={paymentDetails.cardNumber}
          onChange={(value) => handleInputChange('cardNumber', value)}
          onFocus={() => {
            handleInputFocus();
            setCurrentStep(1);
          }}
          onBlur={handleInputBlur}
          error={cardNumberError}
          placeholder="1234 5678 9012 3456"
          required
          maxLength={19}
          mask="card"
          leftIcon={<Icon name="credit_card" size="sm" />}
          tooltip="نقبل Visa و Mastercard و American Express"
          helperText="We accept Visa, Mastercard, and American Express"
          success={fieldSuccess(paymentDetails.cardNumber, cardNumberError)}
          warning={fieldFeedback.cardNumber?.warning}
          suggestion={fieldFeedback.cardNumber?.suggestion}
        />

        {/* Card Type Display */}
        {cardType !== 'unknown' && (
          <div className="mt-2 flex items-center gap-2">
            <Icon name="credit_card" size="sm" className="text-primary" />
            <span className="text-sm text-text-muted capitalize">{cardType} card detected</span>
          </div>
        )}
      </div>

      {/* Expiry Date and CVV - 2 columns */}
      {stepTwoReady && (
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <FormField
            name="expiryDate"
            label="Expiry Date"
            value={paymentDetails.expiryDate}
            onChange={(value) => handleInputChange('expiryDate', value)}
            onFocus={() => {
              handleInputFocus();
              setCurrentStep(2);
            }}
            onBlur={handleInputBlur}
            error={expiryError}
            placeholder="MM/YY"
            required
            maxLength={5}
            mask="expiry"
            tooltip="الشهر/السنة (MM/YY)"
            helperText="Format: MM/YY"
            success={fieldSuccess(paymentDetails.expiryDate, expiryError)}
            warning={fieldFeedback.expiryDate?.warning}
            suggestion={fieldFeedback.expiryDate?.suggestion}
          />

          <FormField
            name="cvv"
            label="CVV"
            type={showCvv ? 'text' : 'password'}
            value={paymentDetails.cvv}
            onChange={(value) => handleInputChange('cvv', value)}
            onFocus={() => {
              handleInputFocus();
              setCurrentStep(2);
            }}
            onBlur={handleInputBlur}
            error={cvvError}
            placeholder={cardType === 'amex' ? '1234' : '123'}
            required
            maxLength={cardType === 'amex' ? 4 : 3}
            tooltip="الرمز المكون من 3-4 أرقام على ظهر البطاقة"
            helperText="3-4 digit code on back of card"
            rightIcon={
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="text-text-muted hover:text-text-dark transition-colors"
                aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
              >
                <Icon name={showCvv ? 'visibility_off' : 'visibility'} size="sm" />
              </button>
            }
            success={fieldSuccess(paymentDetails.cvv, cvvError)}
            warning={fieldFeedback.cvv?.warning}
            suggestion={fieldFeedback.cvv?.suggestion}
          />
        </div>
      )}

      {/* Save Card Checkbox */}
      {stepThreeReady && (
        <div className="flex items-start gap-3 p-4 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-lg border border-accent-pink/20 animate-fadeIn">
          <input
            type="checkbox"
            id="save-card"
            checked={paymentDetails.saveCard}
            onChange={(e) => handleInputChange('saveCard', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary mt-1"
          />
          <div className="flex-1">
            <label
              htmlFor="save-card"
              className="text-sm font-medium text-text-dark dark:text-text-light cursor-pointer"
            >
              Save card for future purchases
            </label>
            <p className="text-xs text-text-muted mt-1">
              Your card information will be securely encrypted and stored for faster checkout next
              time.
            </p>
          </div>
        </div>
      )}

      {/* Security Information */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-text-dark dark:text-text-light">
          Security & Protection
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Icon name="lock" size="sm" className="text-green-600" />
            <span>256-bit SSL Encryption</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Icon name="verified_user" size="sm" className="text-green-600" />
            <span>PCI DSS Compliant</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Icon name="security" size="sm" className="text-green-600" />
            <span>Fraud Protection</span>
          </div>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span>We accept:</span>
        <div className="flex items-center gap-2">
          <Icon name="credit_card" size="sm" />
          <span>Visa</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="credit_card" size="sm" />
          <span>Mastercard</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="credit_card" size="sm" />
          <span>Amex</span>
        </div>
      </div>
    </div>
  );
};

CardPaymentForm.displayName = 'CardPaymentForm';
