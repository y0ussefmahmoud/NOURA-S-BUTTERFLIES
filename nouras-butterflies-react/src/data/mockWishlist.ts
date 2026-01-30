import type { WishlistItem } from '../types/account';
import type { Product } from '../types/product';

// Mock products for wishlist
const mockWishlistProducts: Product[] = [
  {
    id: '1',
    name: 'Butterfly Glow Serum',
    slug: 'butterfly-glow-serum',
    description: 'A radiant serum that gives your skin a butterfly-like glow',
    price: 89.99,
    compareAtPrice: 120.0,
    images: [
      { url: '/api/placeholder/200/200', alt: 'Butterfly Glow Serum' },
      { url: '/api/placeholder/200/200', alt: 'Butterfly Glow Serum - Side View' },
    ],
    rating: 4.8,
    reviewCount: 124,
    badges: [{ type: 'bestseller' }, { type: 'vegan' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
  {
    id: '2',
    name: 'Flutter Mascara',
    slug: 'flutter-mascara',
    description: 'Volumizing mascara for butterfly-effect lashes',
    price: 67.0,
    compareAtPrice: 85.0,
    images: [
      { url: '/api/placeholder/200/200', alt: 'Flutter Mascara' },
      { url: '/api/placeholder/200/200', alt: 'Flutter Mascara - Application' },
    ],
    rating: 4.6,
    reviewCount: 89,
    badges: [{ type: 'new' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: '3',
    name: 'Monarch Body Butter',
    slug: 'monarch-body-butter',
    description: 'Rich, nourishing body butter inspired by monarch butterflies',
    price: 45.0,
    images: [
      { url: '/api/placeholder/200/200', alt: 'Monarch Body Butter' },
      { url: '/api/placeholder/200/200', alt: 'Monarch Body Butter - Texture' },
    ],
    rating: 4.7,
    reviewCount: 156,
    badges: [{ type: 'vegan' }, { type: 'cruelty-free' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
  {
    id: '4',
    name: 'Butterfly Kiss Lip Balm',
    slug: 'butterfly-kiss-lip-balm',
    description: 'Hydrating lip balm with butterfly pea extract',
    price: 28.0,
    images: [
      { url: '/api/placeholder/200/200', alt: 'Butterfly Kiss Lip Balm' },
      { url: '/api/placeholder/200/200', alt: 'Butterfly Kiss Lip Balm - Swatch' },
    ],
    rating: 4.5,
    reviewCount: 67,
    badges: [{ type: 'organic' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: '5',
    name: 'Wing Effect Eyeshadow Palette',
    slug: 'wing-effect-eyeshadow-palette',
    description: 'Versatile eyeshadow palette for butterfly-wing effects',
    price: 125.0,
    compareAtPrice: 150.0,
    images: [
      { url: '/api/placeholder/200/200', alt: 'Wing Effect Eyeshadow Palette' },
      { url: '/api/placeholder/200/200', alt: 'Wing Effect Eyeshadow Palette - Swatches' },
    ],
    rating: 4.9,
    reviewCount: 203,
    badges: [{ type: 'bestseller' }, { type: 'limited-edition' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
];

// Mock wishlist items
export const mockWishlistItems: WishlistItem[] = mockWishlistProducts.map((product, index) => ({
  id: `wishlist-${product.id}`,
  product,
  addedDate: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(), // Each item added a day apart
  notes: index % 2 === 0 ? 'Love the packaging!' : undefined,
}));

// Helper functions to get mock wishlist data
export const getMockWishlistByUserId = (userId: string): WishlistItem[] => {
  // In a real app, you'd filter by userId
  // For mock purposes, return all items
  return mockWishlistItems;
};

export const getMockWishlistCount = (userId: string): number => {
  return getMockWishlistByUserId(userId).length;
};

export const isProductInWishlist = (productId: string): boolean => {
  return mockWishlistItems.some((item) => item.product.id === productId);
};

export const addProductToWishlist = (product: Product): WishlistItem => {
  const newItem: WishlistItem = {
    id: `wishlist-${Date.now()}`,
    product,
    addedDate: new Date().toISOString(),
  };

  return newItem;
};

export const removeProductFromWishlist = (productId: string): WishlistItem | null => {
  const index = mockWishlistItems.findIndex((item) => item.product.id === productId);
  if (index !== -1) {
    return mockWishlistItems[index];
  }
  return null;
};

// Default mock wishlist for testing
export const defaultMockWishlist = mockWishlistItems;

// Mock recommendations for wishlist
export const mockWishlistRecommendations: Product[] = [
  {
    id: 'rec-1',
    name: 'Butterfly Glow Highlighter',
    slug: 'butterfly-glow-highlighter',
    description: 'A luminous highlighter that gives your skin a butterfly-like radiance',
    price: 45.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Butterfly Glow Highlighter' }],
    rating: 4.7,
    reviewCount: 89,
    badges: [{ type: 'new' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: 'rec-2',
    name: 'Flutter Kiss Lip Gloss',
    slug: 'flutter-kiss-lip-gloss',
    description: 'Shimmery lip gloss with butterfly-wing effect',
    price: 28.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Flutter Kiss Lip Gloss' }],
    rating: 4.5,
    reviewCount: 67,
    badges: [{ type: 'new' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: 'rec-3',
    name: 'Monarch Body Butter',
    slug: 'monarch-body-butter',
    description: 'Rich, nourishing body butter inspired by monarch butterflies',
    price: 35.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Monarch Body Butter' }],
    rating: 4.8,
    reviewCount: 124,
    badges: [{ type: 'vegan' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
];
