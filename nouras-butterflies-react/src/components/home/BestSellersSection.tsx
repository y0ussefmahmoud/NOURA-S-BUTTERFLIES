import React from 'react';
import { Link } from 'react-router-dom';
import { ProductGrid } from '../product/ProductGrid';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { mockProducts } from '../../data/mockProducts';

export const BestSellersSection: React.FC = () => {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  // Filter products for bestsellers
  const bestSellerProducts = mockProducts.filter((product) => product.isBestseller);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={ref}
          className={`mb-12 text-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
        >
          {/* Subtitle */}
          <div className="mb-4">
            <span className="inline-block rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 px-4 py-2 text-sm font-medium text-white">
              Customer Favorites
            </span>
          </div>

          {/* Title */}
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Best Sellers
          </h2>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Discover our most-loved products that have captured the hearts of beauty enthusiasts
            worldwide.
          </p>

          {/* View All Link */}
          <div className="flex justify-center">
            <Link
              to="/products?sort=bestsellers"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              View All Products
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Product Grid */}
        <div className={`${isVisible ? 'animate-fadeInUp animation-delay-200' : 'opacity-0'}`}>
          <ProductGrid
            products={bestSellerProducts}
            columns={{ mobile: 1, tablet: 2, desktop: 4 }}
          />
        </div>
      </div>
    </section>
  );
};
