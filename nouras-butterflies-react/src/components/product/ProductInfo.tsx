import React from 'react';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { ProductBadge } from './ProductBadge';
import type { Product, ProductVariant } from '../../types/product';

interface ShadeSelectorProps {
  variants: ProductVariant[];
  selectedVariant?: ProductVariant;
  onVariantChange: (variant: ProductVariant) => void;
}

export const ShadeSelector: React.FC<ShadeSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
}) => {
  if (variants.length === 0) return null;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Shade: {selectedVariant?.name || 'Select a shade'}
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => onVariantChange(variant)}
            disabled={!variant.inStock}
            className={`relative w-10 h-10 rounded-full border-2 transition-all duration-300 ${
              selectedVariant?.id === variant.id
                ? 'border-primary ring-2 ring-primary ring-offset-2 scale-110'
                : 'border-transparent hover:border-primary/50'
            } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={`Select ${variant.name} shade`}
            aria-pressed={selectedVariant?.id === variant.id}
          >
            {variant.color && (
              <div
                className="w-full h-full rounded-full"
                style={{ backgroundColor: variant.color }}
              />
            )}
            {!variant.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-rounded text-white text-xs bg-black/50 rounded-full p-0.5">
                  block
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

interface QuantityPickerProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
}

export const QuantityPicker: React.FC<QuantityPickerProps> = ({
  quantity,
  onQuantityChange,
  maxQuantity = 99,
  minQuantity = 1,
}) => {
  const handleDecrease = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= minQuantity && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
      <div className="inline-flex items-center rounded-full border border-gray-300">
        <button
          onClick={handleDecrease}
          disabled={quantity <= minQuantity}
          className="p-2 rounded-l-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <span className="material-symbols-rounded">remove</span>
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min={minQuantity}
          max={maxQuantity}
          className="w-16 text-center border-0 focus:ring-0 focus:outline-none"
          aria-label="Quantity"
        />
        <button
          onClick={handleIncrease}
          disabled={quantity >= maxQuantity}
          className="p-2 rounded-r-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <span className="material-symbols-rounded">add</span>
        </button>
      </div>
    </div>
  );
};

interface ProductInfoProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity: number;
  onVariantChange?: (variant: ProductVariant) => void;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: () => void;
  onBuyNow?: () => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedVariant,
  quantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
}) => {
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Rating and Reviews */}
      <div className="flex items-center gap-4">
        <Rating value={product.rating} size="lg" readonly />
        <div>
          <span className="font-medium text-gray-900">{product.rating}</span>
          <span className="text-gray-500 ms-1">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Product Title */}
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">{product.name}</h1>

      {/* Product Description */}
      <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {product.compareAtPrice && (
          <>
            <span className="text-xl text-gray-500 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                Save {discountPercentage}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Shade Selector */}
      {product.variants.length > 0 && onVariantChange && (
        <ShadeSelector
          variants={product.variants}
          selectedVariant={selectedVariant}
          onVariantChange={onVariantChange}
        />
      )}

      {/* Quantity Picker */}
      {onQuantityChange && (
        <QuantityPicker
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          maxQuantity={
            selectedVariant
              ? selectedVariant.inStock
                ? 99
                : 0
              : product.variants.length === 0
                ? product.inStock
                  ? 99
                  : 0
                : 0
          }
        />
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="primary"
          size="lg"
          onClick={onAddToCart}
          disabled={!product.inStock}
          className="flex-1"
        >
          <span className="material-symbols-rounded ms-2">shopping_bag</span>
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={onBuyNow}
          disabled={!product.inStock}
          className="flex-1"
        >
          <span className="material-symbols-rounded ms-2">bolt</span>
          Buy Now
        </Button>
      </div>

      {/* Philosophy Badges */}
      {product.badges.length > 0 && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
          {product.badges.map((badge, index) => (
            <ProductBadge key={index} badge={badge} />
          ))}
        </div>
      )}

      {/* Product Features */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <span className="material-symbols-rounded text-green-500">check_circle</span>
          <span className="text-gray-700">Free shipping on orders over $50</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-rounded text-green-500">check_circle</span>
          <span className="text-gray-700">30-day return policy</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="material-symbols-rounded text-green-500">check_circle</span>
          <span className="text-gray-700">Cruelty-free and vegan formula</span>
        </div>
      </div>
    </div>
  );
};
