import React from 'react';
import type { CartItem as CartItemType } from '../../types/cart';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  className?: string;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  className,
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={item.productImage}
          alt={item.productTitle}
          className="w-32 h-32 object-cover rounded-lg"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-1">
            {item.productTitle}
          </h3>

          {item.variant && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {item.variant.name}
              {item.variant.shade && <span className="ml-2">• {item.variant.shade}</span>}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-500 line-through">
                ${item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity Controls and Remove Button */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <Button
              variant="icon"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1}
              aria-label={`Decrease quantity of ${item.productTitle}`}
            >
              remove
            </Button>

            <span className="px-3 py-1 text-sm font-medium text-text-dark dark:text-text-light min-w-[3rem] text-center">
              {item.quantity}
            </span>

            <Button
              variant="icon"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              aria-label={`Increase quantity of ${item.productTitle}`}
            >
              add
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            leftIcon="delete"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            aria-label={`Remove ${item.productTitle} from cart`}
          >
            Remove
          </Button>
        </div>
      </div>

      {/* Item Total (Mobile) */}
      <div className="md:hidden flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className="text-sm text-gray-600 dark:text-gray-400">Item Total</span>
        <span className="text-lg font-bold text-text-dark dark:text-text-light">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>

      {/* Item Total (Desktop) */}
      <div className="hidden md:flex flex-col justify-center items-end">
        <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">Item Total</span>
        <span className="text-xl font-bold text-text-dark dark:text-text-light">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export const CartItem = React.memo(CartItemComponent);

CartItem.displayName = 'CartItem';
