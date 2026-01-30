import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';

interface MobileOrderSummaryProps {
  cart: ReturnType<typeof useCart>['cart'];
  onApplyPromo: (code: string) => void;
  buttonText?: string;
  showPromoInput?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onButtonClick?: () => void;
}

export const MobileOrderSummary: React.FC<MobileOrderSummaryProps> = ({
  cart,
  onApplyPromo,
  buttonText,
  showPromoInput = false,
  isCollapsed = false,
  onToggleCollapse,
  onButtonClick,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(!isCollapsed);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onToggleCollapse?.();

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      onApplyPromo(promoCode.trim());
      setPromoCode('');
    }
  };

  const handleButtonClick = () => {
    onButtonClick?.();

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  };

  return (
    <div className="lg:hidden sticky bottom-0 z-50 bg-white dark:bg-surface-dark shadow-lg border-t border-gray-200 dark:border-gray-700">
      {/* Collapsed State - Compact Bar */}
      {!isExpanded && (
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
                <span className="text-lg font-bold text-text-dark dark:text-text-light">
                  ${cart.total.toFixed(2)}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {buttonText && (
                <Button onClick={handleButtonClick} className="flex-1 touch-target" size="sm">
                  {buttonText}
                </Button>
              )}
              <button
                onClick={handleToggle}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
                aria-label="Expand order summary"
              >
                <Icon name="expand_more" size="sm" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded State - Full Details */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-text-dark dark:text-text-light">Order Summary</h3>
            <button
              onClick={handleToggle}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-target"
              aria-label="Collapse order summary"
            >
              <Icon name="expand_less" size="sm" />
            </button>
          </div>

          {/* Items */}
          <div className="p-4 space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.productImage}
                    alt={item.productTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-text-dark dark:text-text-light truncate">
                    {item.productTitle}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-medium text-text-dark dark:text-text-light">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code */}
          {showPromoInput && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-surface-dark text-text-dark dark:text-text-light focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <Button
                  onClick={handleApplyPromo}
                  variant="outline"
                  size="sm"
                  className="touch-target"
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="text-text-dark dark:text-text-light">
                ${cart.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="text-text-dark dark:text-text-light">
                ${cart.shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="text-text-dark dark:text-text-light">${cart.tax.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span>-${cart.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-text-dark dark:text-text-light pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          {/* CTA Button */}
          {buttonText && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button onClick={handleButtonClick} className="w-full touch-target" size="lg">
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
