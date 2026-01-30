import React, { useState } from 'react';
import type { Cart } from '../../types/cart';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Icon } from '../ui/Icon';
import { cn } from '../../utils/cn';

interface OrderSummaryProps {
  cart: Cart;
  onApplyPromo?: (code: string) => Promise<boolean>;
  onCheckout?: () => void;
  showPromoInput?: boolean;
  isSticky?: boolean;
  buttonText?: string;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  cart,
  onApplyPromo,
  onCheckout,
  showPromoInput = true,
  isSticky = false,
  buttonText = cart.items.length > 0 ? 'Proceed to Checkout' : 'Continue Shopping',
  className,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = async () => {
    if (!promoCode.trim() || !onApplyPromo) return;

    setIsApplyingPromo(true);
    setPromoError('');

    try {
      const success = await onApplyPromo(promoCode.trim());
      if (!success) {
        setPromoError('Invalid promo code');
      } else {
        setPromoCode('');
      }
    } catch (error) {
      setPromoError('Failed to apply promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyPromo();
    }
  };

  const formatPrice = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const isShippingFree = cart.shipping === 0 && cart.subtotal > 0;

  return (
    <div
      className={cn(
        'bg-[#f2efe9] dark:bg-surface-dark rounded-xl border border-primary p-6',
        isSticky && 'sticky top-32',
        className
      )}
    >
      <h2 className="text-xl font-bold text-text-dark dark:text-text-light mb-6">Order Summary</h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-text-dark dark:text-text-light">
          <span>Subtotal ({cart.itemCount} items)</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>

        <div className="flex justify-between text-text-dark dark:text-text-light">
          <span>Shipping</span>
          <span>
            {isShippingFree ? (
              <span className="text-green-600 font-medium">Complimentary</span>
            ) : (
              formatPrice(cart.shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-text-dark dark:text-text-light">
          <span>Tax</span>
          <span>{formatPrice(cart.tax)}</span>
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({cart.promoCode?.code})</span>
            <span>-{formatPrice(cart.discount)}</span>
          </div>
        )}

        <div className="border-t border-primary pt-3">
          <div className="flex justify-between text-lg font-bold text-text-dark dark:text-text-light">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>

      {/* Promo Code Input */}
      {showPromoInput && cart.items.length > 0 && (
        <div className="mb-6">
          <div className="flex gap-2">
            <Input
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              onKeyPress={handleKeyPress}
              error={promoError}
              className="flex-1"
            />
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode.trim() || isApplyingPromo}
              loading={isApplyingPromo}
              className="px-4"
            >
              Apply
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        disabled={cart.items.length === 0}
        fullWidth
        size="lg"
        className="mb-4"
      >
        {buttonText}
      </Button>

      {/* Trust Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-text-muted mb-4">
        <Icon name="lock" size="sm" />
        <span>Secure Checkout</span>
      </div>

      {/* Inspirational Quote */}
      <div className="border-2 border-dashed border-primary/30 rounded-lg p-4 text-center">
        <p className="text-sm text-text-dark dark:text-text-light italic">
          "Like a butterfly emerging from its cocoon, your beauty transformation begins with a
          single step."
        </p>
      </div>

      {/* Rewards Info */}
      {cart.items.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-text-muted">
            You will earn{' '}
            <span className="font-bold text-primary">{Math.floor(cart.total * 0.01)}</span> points
            with this purchase
          </p>
        </div>
      )}
    </div>
  );
};

OrderSummary.displayName = 'OrderSummary';
