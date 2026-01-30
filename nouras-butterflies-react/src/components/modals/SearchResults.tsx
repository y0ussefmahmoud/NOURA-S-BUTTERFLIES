import React from 'react';
import { ProductCard } from '../product/ProductCard';
import type { Product } from '../../types/product';

export interface SearchResultsProps {
  products: Product[];
  isLoading: boolean;
  query: string;
  onProductClick: (product: Product) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  products,
  isLoading,
  query,
  onProductClick,
}) => {
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#C8A962]" />
          <span className="text-text-muted">Searching...</span>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 aspect-[4/5] rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="max-w-md mx-auto">
          <div className="mb-4">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600">
              search_off
            </span>
          </div>
          <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-2">
            No results found for "{query}"
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try searching for different keywords or browse our popular collections below.
          </p>

          {/* Search suggestions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-text-dark dark:text-text-light mb-2">
                Popular Collections
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Lip Gloss', 'Blush', 'Skincare', 'Face Powder'].map((category) => (
                  <button
                    key={category}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-[#C8A962] hover:text-white rounded-full text-sm transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-text-dark dark:text-text-light mb-2">
                Popular Products
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Hydrating Lip Glow', 'Radiant Cheek Tint', 'Silk Finish Powder'].map(
                  (product) => (
                    <button
                      key={product}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-[#C8A962] hover:text-white rounded-full text-sm transition-colors"
                    >
                      {product}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
          Search Results
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} onClick={() => onProductClick(product)}>
            <ProductCard product={product} showQuickAdd={false} onCardClick={onProductClick} />
          </div>
        ))}
      </div>
    </div>
  );
};

SearchResults.displayName = 'SearchResults';
