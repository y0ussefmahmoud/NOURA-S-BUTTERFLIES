import type { ProductDetails } from './productDetails';

export interface ProductImage {
  url: string;
  alt: string;
  thumbnail?: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  color?: string;
  inStock: boolean;
}

export type ProductBadgeType =
  | 'new'
  | 'bestseller'
  | 'sale'
  | 'vegan'
  | 'cruelty-free'
  | 'paraben-free'
  | 'organic';

export interface ProductBadge {
  type: ProductBadgeType;
  text?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  category: string;
  inStock: boolean;
  variants: ProductVariant[];
  isBestseller?: boolean;
  productDetails?: ProductDetails;
}
