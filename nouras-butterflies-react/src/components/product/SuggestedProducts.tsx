import React, { useState, useRef } from 'react';
import { QuickViewModal } from './QuickViewModal';
import type { Product } from '../../types/product';

interface SuggestedProductsProps {
  products: Product[];
  onQuickView?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

const SuggestedProducts: React.FC<SuggestedProductsProps> = ({
  products,
  onQuickView,
  onViewDetails,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleViewDetails = (product: Product) => {
    onViewDetails?.(product);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setSelectedProduct(null);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 320; // Width of one product card plus gap
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mb-24">
      <h2 className="text-2xl font-serif text-gray-900 dark:text-white text-center mb-12">
        Flutter With These
      </h2>

      <div className="relative">
        {/* Navigation Buttons */}
        {products.length > 4 && (
          <>
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-colors duration-200"
              aria-label="Scroll left"
            >
              <span className="material-symbols-rounded">chevron_left</span>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/90 backdrop-blur shadow-lg hover:bg-white transition-colors duration-200"
              aria-label="Scroll right"
            >
              <span className="material-symbols-rounded">chevron_right</span>
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="group relative flex-shrink-0 w-72">
              <div className="relative overflow-hidden rounded-xl bg-white dark:bg-white/5 border border-primary/5">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.images[0]?.url || ''}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => handleQuickView(product)}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-2 rounded-full text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  Quick View
                </button>
                <button
                  onClick={() => handleViewDetails(product)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full text-gray-900 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  <span className="material-symbols-rounded text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <QuickViewModal
          open={isQuickViewOpen}
          onClose={handleCloseQuickView}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default SuggestedProducts;
