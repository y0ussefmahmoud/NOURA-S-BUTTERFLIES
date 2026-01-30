export interface FilterState {
  categories: string[];
  philosophies: string[];
  priceRange: PriceRange;
  sortBy: SortOption;
}

export interface CategoryFilter {
  id: string;
  name: string;
  count: number;
  checked: boolean;
}

export interface PhilosophyFilter {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

export type SortOption =
  | 'featured'
  | 'best-sellers'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'best-rated';

export interface PriceRange {
  min: number;
  max: number;
  current: [number, number];
}

export interface SortOptionConfig {
  value: SortOption;
  label: string;
}
