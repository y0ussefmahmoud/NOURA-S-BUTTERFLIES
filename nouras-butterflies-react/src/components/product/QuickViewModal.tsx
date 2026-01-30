import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { ProductGallery } from './ProductGallery';
import { ShadeSelector, QuantityPicker } from './ProductInfo';
import { Button } from '../ui/Button';
import type { Product, ProductVariant } from '../../types/product';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string, quantity: number, variant?: ProductVariant) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  open,
  onClose,
  onAddToCart,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants.find((v) => v.inStock) || product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleAddToCart = () => {
    if (product) {
      onAddToCart?.(product.id, quantity, selectedVariant);
      onClose();
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout
    window.location.href = '/checkout';
  };

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} size="lg" className="quick-view-modal">
      <div className="bg-white rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gallery */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <ProductGallery
                images={product.images}
                badges={product.badges.slice(0, 2)}
                onImageClick={(index) => {
                  // Could open lightbox here
                  console.log('Image clicked:', index);
                }}
                showThumbnails={product.images.length > 1}
                thumbnailPosition="left"
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-rounded text-sm ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Shade Selector */}
              {product.variants.length > 0 && (
                <ShadeSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={handleVariantChange}
                />
              )}

              {/* Quantity Picker */}
              <QuantityPicker
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
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

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full"
                >
                  <span className="material-symbols-rounded mr-2">shopping_bag</span>
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full"
                >
                  <span className="material-symbols-rounded mr-2">bolt</span>
                  Buy Now
                </Button>
              </div>

              {/* Product Features */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-rounded text-green-500 text-lg">
                    check_circle
                  </span>
                  Free shipping on orders over $50
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-rounded text-green-500 text-lg">
                    check_circle
                  </span>
                  30-day return policy
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-symbols-rounded text-green-500 text-lg">
                    check_circle
                  </span>
                  Cruelty-free and vegan
                </div>
              </div>

              {/* View Full Details Link */}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={`/product/${product.slug}`}
                  className="inline-flex items-center text-primary font-medium hover:underline"
                  onClick={onClose}
                >
                  View Full Details
                  <span className="material-symbols-rounded ml-1 text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .quick-view-modal {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .quick-view-modal .bg-white {
            max-height: 100vh;
            border-radius: 0;
          }
        }
      `}</style>
    </Modal>
  );
};
