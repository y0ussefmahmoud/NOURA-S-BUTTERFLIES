import type { FilterState, SortOption } from '../types/catalog';

export const serializeFilters = (filters: FilterState): URLSearchParams => {
  const params = new URLSearchParams();

  if (filters.categories.length > 0) {
    params.set('categories', filters.categories.join(','));
  }

  if (filters.philosophies.length > 0) {
    params.set('philosophies', filters.philosophies.join(','));
  }

  if (
    filters.priceRange.current[0] !== filters.priceRange.min ||
    filters.priceRange.current[1] !== filters.priceRange.max
  ) {
    params.set('priceMin', filters.priceRange.current[0].toString());
    params.set('priceMax', filters.priceRange.current[1].toString());
  }

  if (filters.sortBy !== 'featured') {
    params.set('sort', filters.sortBy);
  }

  return params;
};

export const deserializeFilters = (params: URLSearchParams): Partial<FilterState> => {
  const filters: Partial<FilterState> = {};

  const categories = params.get('categories');
  if (categories) {
    filters.categories = categories.split(',').filter(Boolean);
  }

  const philosophies = params.get('philosophies');
  if (philosophies) {
    filters.philosophies = philosophies.split(',').filter(Boolean);
  }

  const priceMin = params.get('priceMin');
  const priceMax = params.get('priceMax');
  if (priceMin || priceMax) {
    filters.priceRange = {
      min: 0,
      max: 500,
      current: [priceMin ? parseInt(priceMin, 10) : 0, priceMax ? parseInt(priceMax, 10) : 500],
    };
  }

  const sort = params.get('sort') as SortOption;
  if (
    sort &&
    ['featured', 'best-sellers', 'price-asc', 'price-desc', 'newest', 'best-rated'].includes(sort)
  ) {
    filters.sortBy = sort;
  }

  return filters;
};

export const updateURL = (filters: FilterState): void => {
  if (typeof window !== 'undefined') {
    const params = serializeFilters(filters);
    const newURL = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newURL);
  }
};
