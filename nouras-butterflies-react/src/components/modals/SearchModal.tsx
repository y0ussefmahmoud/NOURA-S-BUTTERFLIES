import React, { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { mockProducts } from '../../data/mockProducts';
import { ProductCard } from '../product/ProductCard';
import { SearchResults } from './SearchResults';
import { TrendingSearches } from './TrendingSearches';
import type { Product } from '../../types/product';

export interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ open, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalId = useId();
  const titleId = `search-modal-title-${modalId}`;
  const descriptionId = `search-modal-description-${modalId}`;

  const { containerRef } = useFocusTrap({
    isActive: open,
    restoreFocus: true,
    onEscape: onClose,
  });

  const handleContainerRef = (node: HTMLDivElement | null) => {
    modalRef.current = node;
    if (containerRef && typeof containerRef === 'object' && 'current' in containerRef) {
      (containerRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Focus search input when modal opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle search
  useEffect(() => {
    if (debouncedSearchQuery.trim() === '') {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simulate search delay
    const timer = setTimeout(() => {
      const filteredProducts = mockProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );

      setSearchResults(filteredProducts);
      setIsLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTrendingSearchClick = (query: string) => {
    setSearchQuery(query);
  };

  const handleProductClick = (product: Product) => {
    // Navigate to product page
    window.location.href = `/product/${product.slug}`;
  };

  if (!open) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0">
      {/* Frosted glass backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[12px] transition-opacity duration-200"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={handleContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-7xl mx-auto bg-white dark:bg-surface-dark rounded-b-2xl shadow-2xl mt-0 max-h-[90vh] overflow-hidden"
      >
        {/* Decorative butterfly elements */}
        <div className="absolute top-4 left-4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-6xl text-[#C8A962]">flutter_dash</span>
        </div>
        <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-6xl text-[#C8A962]">flutter_dash</span>
        </div>

        {/* Search Header */}
        <div className="relative p-6 border-b border-border-light dark:border-border-dark">
          <div className="max-w-3xl mx-auto mb-4">
            <h2 id={titleId} className="text-2xl font-semibold text-text-dark dark:text-text-light">
              Search
            </h2>
            <p id={descriptionId} className="text-sm text-text-muted dark:text-text-muted">
              Search for products, collections, or ingredients.
            </p>
          </div>
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors z-10"
            aria-label="Close search"
          >
            <span className="material-symbols-outlined text-text-muted hover:text-text-dark text-2xl">
              close
            </span>
          </button>

          {/* Search Input */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted text-2xl">
                search
              </span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products, collections, or ingredients..."
                className="w-full pl-12 pr-4 py-4 text-xl border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#C8A962] bg-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Clear search"
                >
                  <span className="material-symbols-outlined text-text-muted">clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Content */}
        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-120px)] overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {searchQuery.trim() === '' ? (
              <div className="p-6">
                {/* Instant Suggestions */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
                    Instant Suggestions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mockProducts.slice(0, 8).map((product) => (
                      <div key={product.id} onClick={() => handleProductClick(product)}>
                        <ProductCard
                          product={product}
                          showQuickAdd={false}
                          onCardClick={handleProductClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <SearchResults
                products={searchResults}
                isLoading={isLoading}
                query={searchQuery}
                onProductClick={handleProductClick}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border-light dark:border-border-dark bg-gray-50 dark:bg-gray-900/50">
            <div className="p-6 space-y-6">
              {/* Trending Searches */}
              <TrendingSearches onSearchClick={handleTrendingSearchClick} />

              {/* Recently Viewed */}
              <div>
                <h3 className="text-sm font-semibold text-text-dark dark:text-text-light mb-3">
                  Recently Viewed
                </h3>
                <div className="space-y-3">
                  {mockProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.images[0]?.thumbnail}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-dark dark:text-text-light truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotional Badge */}
              <div className="bg-gradient-to-r from-[#C8A962] to-[#c8a95f] text-white p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-xl">workspace_premium</span>
                  <span className="font-semibold">Butterfly Rewards</span>
                </div>
                <p className="text-sm opacity-90">
                  Earn points on every purchase and unlock exclusive benefits!
                </p>
                <button className="mt-3 text-sm font-medium underline hover:no-underline">
                  Learn More →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

SearchModal.displayName = 'SearchModal';
