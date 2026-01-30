import React, { useState, useMemo, useEffect } from 'react';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { ProductGrid } from '../components/product/ProductGrid';
import { FilterSidebar } from '../components/catalog/FilterSidebar';
import { SortDropdown } from '../components/catalog/SortDropdown';
import { Pagination } from '../components/catalog/Pagination';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer';
import { useProductFilters } from '../hooks/useProductFilters';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';
import type { Product } from '../types/product';

// Mock product data - this would typically come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Butterfly Kiss Lip Gloss',
    slug: 'butterfly-kiss-lip-gloss',
    description: 'A beautiful pink lip gloss with butterfly-inspired shimmer',
    price: 24,
    compareAtPrice: 32,
    images: [{ url: '/images/products/lip-gloss-1.jpg', alt: 'Butterfly Kiss Lip Gloss' }],
    rating: 4.5,
    reviewCount: 128,
    badges: [{ type: 'vegan' }, { type: 'cruelty-free' }],
    category: 'lip-gloss',
    inStock: true,
    variants: [],
    isBestseller: true,
  },
  {
    id: '2',
    name: 'Rose Gold Illuminator',
    slug: 'rose-gold-illuminator',
    description: 'A luminous face illuminator with natural rose gold tones',
    price: 38,
    images: [{ url: '/images/products/illuminator-1.jpg', alt: 'Rose Gold Illuminator' }],
    rating: 4.8,
    reviewCount: 89,
    badges: [{ type: 'organic' }],
    category: 'face-illuminators',
    inStock: true,
    variants: [],
  },
  // Add more mock products as needed
];

const PRODUCTS_PER_PAGE = 12;

const ProductCatalogPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SEO metadata
  const seoData = useSEO('products');

  const { filters, setFilters, resetFilters, filteredProducts, totalCount, activeFilterCount } =
    useProductFilters(mockProducts);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Simulate 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
  };

  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: 'Products' }];

  const editorialCardProps = {
    title: "Nature's Beauty",
    quote: 'Embrace your natural beauty with our butterfly-inspired collection',
    ctaText: 'Discover Our Philosophy',
    ctaHref: '/about',
    icon: 'flutter_dash',
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbItems} />

      {/* Page Header */}
      <div className="mt-8 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl lg:text-6xl font-black mb-4">
              <span className="italic text-primary">Nature's</span> Beauty Collection
            </h1>
            <p className="text-lg opacity-80 max-w-2xl">
              Discover our complete range of butterfly-inspired cosmetics, crafted with love and
              care for your natural beauty.
            </p>
          </div>

          {/* Sort Dropdown - Desktop Only */}
          <div className="hidden lg:block">
            <SortDropdown
              value={filters.sortBy}
              onChange={(sortBy) => handleFilterChange({ ...filters, sortBy })}
            />
          </div>
        </div>

        {/* Sort Dropdown - Mobile Only */}
        <div className="lg:hidden mt-6">
          <SortDropdown
            value={filters.sortBy}
            onChange={(sortBy) => handleFilterChange({ ...filters, sortBy })}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filter Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            disabled={isLoading}
          />
        </div>

        {/* Product Section */}
        <div className="flex-1">
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {paginatedProducts.length} of {totalCount} products
                {activeFilterCount > 0 && (
                  <span className="ml-2">
                    ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
                  </span>
                )}
              </p>

              {activeFilterCount > 0 && (
                <button onClick={handleReset} className="text-sm text-primary hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Product Grid */}
          {paginatedProducts.length > 0 || isLoading ? (
            <>
              <ProductGrid
                products={paginatedProducts}
                columns={{ mobile: 1, tablet: 2, desktop: 3 }}
                editorialCardIndex={2}
                editorialCardProps={editorialCardProps}
                loading={isLoading}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <span className="material-symbols-rounded text-6xl text-gray-300 mb-4">
                search_off
              </span>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or browse all products
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 px-6 py-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
      >
        <span className="material-symbols-rounded">filter_list</span>
        Filters
        {activeFilterCount > 0 && (
          <span className="px-2 py-1 bg-white text-primary text-xs rounded-full font-medium">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        activeFilterCount={activeFilterCount}
        disabled={isLoading}
      />
      </div>
    </>
  );
};

export default ProductCatalogPage;
