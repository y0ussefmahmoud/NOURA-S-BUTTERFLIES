import React from 'react';
import type { PaymentMethod } from '../../types/cart';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

interface PaymentOption {
  id: PaymentMethod;
  title: string;
  description: string;
  icon: string;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onChange,
  className,
}) => {
  const paymentOptions: PaymentOption[] = [
    {
      id: 'credit-card',
      title: 'Credit/Debit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: 'credit_card',
    },
    {
      id: 'mada',
      title: 'Mada',
      description: 'Pay with your Mada debit card',
      icon: 'account_balance_wallet',
    },
    {
      id: 'fawry',
      title: 'Fawry Pay',
      description: 'Pay using Fawry payment service',
      icon: 'payments',
    },
    {
      id: 'cod',
      title: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: 'local_shipping',
    },
  ];

  const handleMethodChange = (method: PaymentMethod) => {
    onChange(method);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
        Select Payment Method
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentOptions.map((option) => {
          const isSelected = selectedMethod === option.id;

          return (
            <div
              key={option.id}
              className={cn(
                'relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200',
                'hover:border-primary/50 hover:shadow-md',
                isSelected
                  ? 'border-primary bg-primary/5 shadow-butterfly-glow'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-dark'
              )}
              onClick={() => handleMethodChange(option.id)}
              role="radio"
              aria-checked={isSelected}
              aria-labelledby={`payment-${option.id}-title`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleMethodChange(option.id);
                }
              }}
            >
              {/* Radio Button Indicator */}
              <div className="absolute top-4 right-4">
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 transition-all duration-200',
                    isSelected
                      ? 'border-primary bg-primary'
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-surface-dark'
                  )}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Content */}
              <div className="flex items-start gap-3">
                <Icon
                  name={option.icon}
                  size="lg"
                  className={cn(
                    'transition-colors duration-200',
                    isSelected ? 'text-primary' : 'text-text-muted'
                  )}
                />

                <div className="flex-1">
                  <h4
                    id={`payment-${option.id}-title`}
                    className={cn(
                      'font-semibold mb-1',
                      isSelected ? 'text-primary' : 'text-text-dark dark:text-text-light'
                    )}
                  >
                    {option.title}
                  </h4>
                  <p className="text-sm text-text-muted">{option.description}</p>
                </div>
              </div>

              {/* Additional Info for Specific Methods */}
              {option.id === 'credit-card' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Icon name="lock" size="sm" />
                    <span>Secure payment processing</span>
                  </div>
                </div>
              )}

              {option.id === 'cod' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-text-muted">
                    <p>Additional service fee may apply</p>
                    <p>Available in selected areas only</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Note */}
      <div className="mt-6 p-4 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-lg border border-accent-pink/20">
        <div className="flex items-center gap-2 text-sm text-text-dark dark:text-text-light">
          <Icon name="security" size="sm" className="text-primary" />
          <span>
            Your payment information is encrypted and secure. We never store your card details.
          </span>
        </div>
      </div>
    </div>
  );
};

PaymentMethodSelector.displayName = 'PaymentMethodSelector';
