import React, { useCallback, useMemo, useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Rating } from '../ui/Rating';
import { Button } from '../ui/Button';
import { ProductBadge } from './ProductBadge';
import { useModals } from '@/contexts/ModalsContext';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onToggleFavorite?: (productId: string) => void;
  onCardClick?: (product: Product) => void;
  onWriteReview?: (product: Product) => void;
  layout?: 'grid' | 'list';
  showQuickAdd?: boolean;
  isFavorite?: boolean;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleFavorite,
  onCardClick,
  onWriteReview,
  layout = 'grid',
  showQuickAdd = true,
  isFavorite = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { openProductReviewModal } = useModals();

  const handleTouchStart = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Keep hover state for a short duration to allow interaction
    setTimeout(() => setIsHovered(false), 3000);
  }, []);

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart?.(product.id);
    },
    [onAddToCart, product.id]
  );

  const handleQuickView = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onQuickView?.(product.id);
    },
    [onQuickView, product.id]
  );

  const handleToggleFavorite = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite?.(product.id);
    },
    [onToggleFavorite, product.id]
  );

  const handleWriteReview = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      openProductReviewModal(product);
      onWriteReview?.(product);
    },
    [openProductReviewModal, onWriteReview, product]
  );

  const handleCardClick = useCallback(() => {
    // Use router-friendly navigation if provided, otherwise fallback to window.location
    if (onCardClick) {
      onCardClick(product);
    } else {
      window.location.href = `/product/${product.slug}`;
    }
  }, [onCardClick, product]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const discountPercentage = useMemo(() => {
    return product.compareAtPrice
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;
  }, [product.compareAtPrice, product.price]);

  return (
    <div
      className={`group cursor-pointer ${layout === 'list' ? 'flex gap-4' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
      <Card hoverable className={`overflow-hidden ${layout === 'list' ? 'flex-1' : ''}`}>
        {/* Image Container */}
        <div className={`relative ${layout === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
            {!imageError ? (
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.alt || product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <span className="material-symbols-rounded text-gray-400 text-4xl">
                  image_not_supported
                </span>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.badges.slice(0, 2).map((badge, index) => (
                <ProductBadge key={index} badge={badge} compact />
              ))}
              {discountPercentage > 0 && (
                <Badge variant="error" size="sm">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-3 right-3 p-3 rounded-full bg-white/90 backdrop-blur transition-all duration-300 touch-target ${
                isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } hover:bg-white hover:scale-110 [@media(pointer:coarse)]:opacity-100 [@media(pointer:coarse)]:translate-y-0`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span
                className={`material-symbols-rounded text-lg ${
                  isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'
                }`}
              >
                {isFavorite ? 'favorite' : 'favorite_border'}
              </span>
            </button>

            {/* Quick Add Overlay */}
            {showQuickAdd && product.inStock && (
              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform duration-300 ${
                  isHovered ? 'translate-y-0' : 'translate-y-full'
                } [@media(pointer:coarse)]:translate-y-0`}
              >
                <div className="flex gap-2">
                  <Button size="sm" variant="primary" onClick={handleAddToCart} className="flex-1">
                    <span className="material-symbols-rounded text-sm mr-1">shopping_bag</span>
                    Quick Add
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleQuickView}
                    className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30"
                  >
                    <span className="material-symbols-rounded text-sm">visibility</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="new" size="lg" className="bg-white/90 backdrop-blur">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className={`p-4 ${layout === 'list' ? 'flex-1' : ''}`}>
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <Rating value={product.rating} size="sm" readonly />
            <span className="text-sm text-gray-500">({product.reviewCount})</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-lg text-gray-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Additional Badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.badges.slice(2).map((badge, index) => (
              <ProductBadge key={index} badge={badge} compact />
            ))}
          </div>

          {/* Write Review Button */}
          {onWriteReview && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleWriteReview}
              className="w-full text-sm border-[#C8A962] text-[#C8A962] hover:bg-[#C8A962] hover:text-white"
            >
              Write Review
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

const areEqual = (prev: ProductCardProps, next: ProductCardProps): boolean => {
  const prevProduct = prev.product;
  const nextProduct = next.product;

  return (
    prevProduct.id === nextProduct.id &&
    prevProduct.price === nextProduct.price &&
    prevProduct.compareAtPrice === nextProduct.compareAtPrice &&
    prevProduct.rating === nextProduct.rating &&
    prevProduct.reviewCount === nextProduct.reviewCount &&
    prevProduct.inStock === nextProduct.inStock &&
    prevProduct.name === nextProduct.name &&
    prevProduct.description === nextProduct.description &&
    prevProduct.slug === nextProduct.slug &&
    prevProduct.images === nextProduct.images &&
    prevProduct.badges === nextProduct.badges &&
    prev.layout === next.layout &&
    prev.showQuickAdd === next.showQuickAdd &&
    prev.isFavorite === next.isFavorite &&
    prev.onAddToCart === next.onAddToCart &&
    prev.onQuickView === next.onQuickView &&
    prev.onToggleFavorite === next.onToggleFavorite &&
    prev.onCardClick === next.onCardClick &&
    prev.onWriteReview === next.onWriteReview
  );
};

export const ProductCard = React.memo(ProductCardComponent, areEqual);

ProductCard.displayName = 'ProductCard';
