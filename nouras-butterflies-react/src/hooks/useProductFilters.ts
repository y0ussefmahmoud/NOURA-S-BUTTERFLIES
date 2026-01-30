import { useState, useEffect, useMemo } from 'react';
import type { FilterState } from '../types/catalog';
import type { Product } from '../types/product';
import { deserializeFilters, updateURL } from '../utils/urlParams';

const defaultFilterState: FilterState = {
  categories: [],
  philosophies: [],
  priceRange: {
    min: 0,
    max: 500,
    current: [0, 500],
  },
  sortBy: 'featured',
};

export const useProductFilters = (products: Product[] = []) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilterState);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlFilters = deserializeFilters(params);

      setFilters((prev) => ({
        ...prev,
        ...urlFilters,
        priceRange: {
          ...prev.priceRange,
          ...urlFilters.priceRange,
        },
      }));
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    updateURL(filters);
  }, [filters]);

  const applyFilters = useMemo(() => {
    return (products: Product[], filters: FilterState): Product[] => {
      let filtered = [...products];

      // Filter by categories
      if (filters.categories.length > 0) {
        filtered = filtered.filter((product) => filters.categories.includes(product.category));
      }

      // Filter by philosophies (badges)
      if (filters.philosophies.length > 0) {
        filtered = filtered.filter((product) =>
          filters.philosophies.some((philosophy) =>
            product.badges.some((badge) => badge.type === philosophy)
          )
        );
      }

      // Filter by price range
      // Ensure valid price range (min <= max)
      const minPrice = Math.min(filters.priceRange.current[0], filters.priceRange.current[1]);
      const maxPrice = Math.max(filters.priceRange.current[0], filters.priceRange.current[1]);

      filtered = filtered.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );

      // Sort products
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          filtered.sort((a, b) => b.id.localeCompare(a.id));
          break;
        case 'best-rated':
          filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'best-sellers':
          filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
          break;
        case 'featured':
        default:
          // Keep original order for featured
          break;
      }

      return filtered;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return applyFilters(products, filters);
  }, [products, filters, applyFilters]);

  const totalCount = filteredProducts.length;

  const resetFilters = () => {
    setFilters(defaultFilterState);
  };

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.philosophies.length > 0) count += filters.philosophies.length;
    if (
      filters.priceRange.current[0] !== filters.priceRange.min ||
      filters.priceRange.current[1] !== filters.priceRange.max
    )
      count += 1;
    if (filters.sortBy !== 'featured') count += 1;
    return count;
  };

  return {
    filters,
    setFilters: updateFilters,
    resetFilters,
    filteredProducts,
    totalCount,
    activeFilterCount: getActiveFilterCount(),
  };
};
