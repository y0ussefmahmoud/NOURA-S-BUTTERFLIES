import type { CategoryFilter, PhilosophyFilter, SortOptionConfig } from '../types/catalog';

export const categoryOptions: CategoryFilter[] = [
  { id: 'lip-gloss', name: 'Lipstick & Gloss', count: 24, checked: false },
  { id: 'face-illuminators', name: 'Face Illuminators', count: 18, checked: false },
  { id: 'eye-palettes', name: 'Eye Palettes', count: 12, checked: false },
  { id: 'blush-bronzer', name: 'Blush & Bronzer', count: 15, checked: false },
  { id: 'foundations', name: 'Foundations', count: 20, checked: false },
  { id: 'mascaras', name: 'Mascaras', count: 8, checked: false },
  { id: 'eyeliners', name: 'Eyeliners', count: 10, checked: false },
  { id: 'primers', name: 'Primers', count: 6, checked: false },
];

export const philosophyOptions: PhilosophyFilter[] = [
  { id: 'vegan', name: '100% Vegan Only', icon: 'eco', active: false },
  { id: 'fragrance-free', name: 'Fragrance Free', icon: 'psychology_alt', active: false },
  { id: 'cruelty-free', name: 'Cruelty Free', icon: 'favorite', active: false },
  { id: 'organic', name: 'Organic Ingredients', icon: 'spa', active: false },
  { id: 'sustainable', name: 'Sustainable Packaging', icon: 'recycling', active: false },
];

export const sortOptions: SortOptionConfig[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'best-rated', label: 'Best Rated' },
];
