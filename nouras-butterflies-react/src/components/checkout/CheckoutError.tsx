import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface CheckoutErrorProps {
  error?: string;
  onRetry?: () => void;
  onBackToCart?: () => void;
  className?: string;
}

export const CheckoutError: React.FC<CheckoutErrorProps> = ({
  error = 'An error occurred while processing your order. Please try again.',
  onRetry,
  onBackToCart,
  className,
}) => {
  const navigate = useNavigate();

  const handleBackToCart = () => {
    if (onBackToCart) {
      onBackToCart();
    } else {
      navigate('/cart');
    }
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    }
  };

  return (
    <div
      className={cn(
        'min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 flex items-center justify-center px-4',
        className
      )}
    >
      <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="error" size="lg" className="text-red-600 dark:text-red-400" />
        </div>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-4">
          Oops! Something went wrong
        </h2>

        <p className="text-text-muted mb-8">{error}</p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onRetry && (
            <Button onClick={handleRetry} fullWidth leftIcon="refresh">
              Try Again
            </Button>
          )}

          <Button onClick={handleBackToCart} variant="outline" fullWidth leftIcon="arrow_back">
            Back to Cart
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-text-dark dark:text-text-light mb-3">
            Need Help?
          </h3>
          <div className="space-y-2 text-sm">
            <a
              href="mailto:support@nourasbutterflies.com"
              className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name="contact_support" size="sm" />
              Contact Support
            </a>
            <a
              href="tel:+9668001234567"
              className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <Icon name="phone" size="sm" />
              +966 800 123 4567
            </a>
          </div>
        </div>

        {/* Reassurance Message */}
        <div className="mt-6 p-4 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-lg border border-accent-pink/20">
          <p className="text-xs text-text-muted">
            Your cart items are safe and will be preserved. You can continue shopping or try
            checkout again.
          </p>
        </div>
      </div>
    </div>
  );
};

CheckoutError.displayName = 'CheckoutError';
