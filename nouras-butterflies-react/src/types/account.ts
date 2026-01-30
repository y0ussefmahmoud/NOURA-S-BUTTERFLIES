import type { Product } from './product';

export interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total: number;
  items: {
    id: string;
    product: Product;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
  addedDate: string;
  notes?: string;
}

export interface ComparisonProduct {
  id: string;
  product: Product;
  addedDate: string;
}

export interface TrackingEvent {
  id: string;
  timestamp: string;
  location: string;
  status: string;
  description: string;
}

export interface OrderTracking {
  orderNumber: string;
  currentStatus: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  events: TrackingEvent[];
  carrier: string;
  trackingNumber: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
