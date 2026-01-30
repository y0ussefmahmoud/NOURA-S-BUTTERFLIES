import React, { useState } from 'react';
import type { Product } from '../../types/product';
import { Button } from '../ui/Button';

interface WishlistProductCardProps {
  product: Product;
  onRemove: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  className?: string;
}

export const WishlistProductCard: React.FC<WishlistProductCardProps> = ({
  product,
  onRemove,
  onAddToCart,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getDiscountPercentage = (price: number, compareAtPrice?: number) => {
    if (!compareAtPrice || compareAtPrice <= price) return null;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  };

  const discountPercentage = getDiscountPercentage(product.price, product.compareAtPrice);

  return (
    <div
      className={`
        bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 relative group
        ${isHovered ? 'transform -translate-y-1' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Remove Button */}
      <button
        onClick={() => onRemove(product.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50"
        aria-label="Remove from wishlist"
      >
        <span className="material-symbols-rounded text-red-500 text-lg">close</span>
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {!imageError && product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.images[0].alt || product.name}
            onError={handleImageError}
            className={`
              w-full h-full object-cover transition-transform duration-300
              ${isHovered ? 'scale-105' : ''}
            `}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="material-symbols-rounded text-gray-400 text-4xl">image</span>
          </div>
        )}

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.badges.slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-500 text-white"
              >
                {badge.text ||
                  badge.type.charAt(0).toUpperCase() + badge.type.slice(1).replace('-', ' ')}
              </span>
            ))}
          </div>
        )}

        {/* Discount Badge */}
        {discountPercentage && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              -{discountPercentage}%
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-pink-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`material-symbols-rounded text-sm ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              >
                {i < Math.floor(product.rating) ? 'star' : 'star_outline'}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`
            w-full py-2 text-sm font-medium transition-colors duration-200
            ${
              product.inStock
                ? 'bg-pink-500 hover:bg-pink-600 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {product.inStock ? (
            <span className="flex items-center justify-center">
              <span className="material-symbols-rounded text-sm mr-1">shopping_cart</span>
              Add to Cart
            </span>
          ) : (
            'Out of Stock'
          )}
        </Button>
      </div>
    </div>
  );
};
