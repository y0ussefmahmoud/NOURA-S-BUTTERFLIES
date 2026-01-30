import type { User, SavedAddress } from '../types/user';
import type { OrderHistoryItem } from '../types/account';

// Mock users for testing and development
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'user@example.com',
    avatar: '/api/placeholder/150/150',
    membershipTier: 'gold',
    points: 1250,
    phone: '+966 50 123 4567',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
  },
  {
    id: '2',
    name: 'Fatima Al-Rashid',
    email: 'fatima@example.com',
    avatar: '/api/placeholder/150/150',
    membershipTier: 'platinum',
    points: 3450,
    phone: '+966 55 987 6543',
    createdAt: '2023-03-20T09:15:00Z',
    updatedAt: '2024-01-12T11:45:00Z',
  },
  {
    id: '3',
    name: 'Amina Hassan',
    email: 'amina@example.com',
    avatar: '/api/placeholder/150/150',
    membershipTier: 'silver',
    points: 750,
    phone: '+966 56 234 5678',
    createdAt: '2023-06-10T16:45:00Z',
    updatedAt: '2024-01-08T13:30:00Z',
  },
  {
    id: '4',
    name: 'Layla Mohammed',
    email: 'layla@example.com',
    avatar: '/api/placeholder/150/150',
    membershipTier: 'bronze',
    points: 250,
    phone: '+966 51 345 6789',
    createdAt: '2023-09-05T12:20:00Z',
    updatedAt: '2024-01-05T10:15:00Z',
  },
];

// Mock saved addresses
export const mockSavedAddresses: SavedAddress[] = [
  {
    id: 'addr-1',
    label: 'home',
    isDefault: true,
    fullName: 'Sarah Johnson',
    phone: '+966 50 123 4567',
    streetAddress: '123 Beauty Lane, Apartment 4B',
    city: 'Riyadh',
    postalCode: '12345',
    country: 'Saudi Arabia',
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-01-15T10:30:00Z',
  },
  {
    id: 'addr-2',
    label: 'work',
    isDefault: false,
    fullName: 'Sarah Johnson',
    phone: '+966 50 123 4567',
    streetAddress: '456 Office Tower, Floor 12',
    city: 'Riyadh',
    postalCode: '12346',
    country: 'Saudi Arabia',
    createdAt: '2023-02-20T14:15:00Z',
    updatedAt: '2023-02-20T14:15:00Z',
  },
  {
    id: 'addr-3',
    label: 'other',
    isDefault: false,
    fullName: 'Sarah Johnson',
    phone: '+966 50 123 4567',
    streetAddress: '789 Family Villa, District 5',
    city: 'Jeddah',
    postalCode: '23456',
    country: 'Saudi Arabia',
    createdAt: '2023-08-10T09:30:00Z',
    updatedAt: '2023-08-10T09:30:00Z',
  },
];

// Mock order history
export const mockOrderHistory: OrderHistoryItem[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15T10:30:00Z',
    status: 'delivered',
    total: 156.99,
    items: [
      {
        id: 'item-1',
        product: {
          id: '1',
          name: 'Butterfly Glow Serum',
          slug: 'butterfly-glow-serum',
          description: 'A radiant serum that gives your skin a butterfly-like glow',
          price: 89.99,
          images: [{ url: '/api/placeholder/100/100', alt: 'Butterfly Glow Serum' }],
          rating: 4.8,
          reviewCount: 124,
          badges: [{ type: 'bestseller' }],
          category: 'skincare',
          inStock: true,
          variants: [],
        },
        quantity: 1,
        price: 89.99,
      },
      {
        id: 'item-2',
        product: {
          id: '2',
          name: 'Flutter Mascara',
          slug: 'flutter-mascara',
          description: 'Volumizing mascara for butterfly-effect lashes',
          price: 67.0,
          images: [{ url: '/api/placeholder/100/100', alt: 'Flutter Mascara' }],
          rating: 4.6,
          reviewCount: 89,
          badges: [{ type: 'new' }],
          category: 'makeup',
          inStock: true,
          variants: [],
        },
        quantity: 1,
        price: 67.0,
      },
    ],
    shippingAddress: {
      fullName: 'Sarah Johnson',
      streetAddress: '123 Beauty Lane, Apartment 4B',
      city: 'Riyadh',
      postalCode: '12345',
      country: 'Saudi Arabia',
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20T18:00:00Z',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-10T14:20:00Z',
    status: 'shipped',
    total: 234.5,
    items: [
      {
        id: 'item-3',
        product: {
          id: '3',
          name: 'Monarch Body Butter',
          slug: 'monarch-body-butter',
          description: 'Rich, nourishing body butter inspired by monarch butterflies',
          price: 45.0,
          images: [{ url: '/api/placeholder/100/100', alt: 'Monarch Body Butter' }],
          rating: 4.7,
          reviewCount: 156,
          badges: [{ type: 'vegan' }],
          category: 'skincare',
          inStock: true,
          variants: [],
        },
        quantity: 2,
        price: 45.0,
      },
      {
        id: 'item-4',
        product: {
          id: '4',
          name: 'Butterfly Kiss Lip Balm',
          slug: 'butterfly-kiss-lip-balm',
          description: 'Hydrating lip balm with butterfly pea extract',
          price: 28.0,
          images: [{ url: '/api/placeholder/100/100', alt: 'Butterfly Kiss Lip Balm' }],
          rating: 4.5,
          reviewCount: 67,
          badges: [{ type: 'organic' }],
          category: 'makeup',
          inStock: true,
          variants: [],
        },
        quantity: 3,
        price: 28.0,
      },
    ],
    shippingAddress: {
      fullName: 'Sarah Johnson',
      streetAddress: '456 Office Tower, Floor 12',
      city: 'Riyadh',
      postalCode: '12346',
      country: 'Saudi Arabia',
    },
    trackingNumber: 'TRK987654321',
    estimatedDelivery: '2024-01-18T16:00:00Z',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-2023-045',
    date: '2023-12-20T09:15:00Z',
    status: 'processing',
    total: 189.99,
    items: [
      {
        id: 'item-5',
        product: {
          id: '5',
          name: 'Wing Effect Eyeshadow Palette',
          slug: 'wing-effect-eyeshadow-palette',
          description: 'Versatile eyeshadow palette for butterfly-wing effects',
          price: 125.0,
          images: [{ url: '/api/placeholder/100/100', alt: 'Wing Effect Eyeshadow Palette' }],
          rating: 4.9,
          reviewCount: 203,
          badges: [{ type: 'bestseller' }, { type: 'cruelty-free' }],
          category: 'makeup',
          inStock: true,
          variants: [],
        },
        quantity: 1,
        price: 125.0,
      },
      {
        id: 'item-6',
        product: {
          id: '6',
          name: 'Flutter Foundation',
          slug: 'flutter-foundation',
          description: 'Lightweight foundation with natural butterfly finish',
          price: 64.99,
          images: [{ url: '/api/placeholder/100/100', alt: 'Flutter Foundation' }],
          rating: 4.4,
          reviewCount: 145,
          badges: [],
          category: 'makeup',
          inStock: true,
          variants: [],
        },
        quantity: 1,
        price: 64.99,
      },
    ],
    shippingAddress: {
      fullName: 'Sarah Johnson',
      streetAddress: '123 Beauty Lane, Apartment 4B',
      city: 'Riyadh',
      postalCode: '12345',
      country: 'Saudi Arabia',
    },
    trackingNumber: 'TRK456789123',
    estimatedDelivery: '2023-12-25T12:00:00Z',
  },
];

// Helper functions to get mock data
export const getMockUserById = (id: string): User | undefined => {
  return mockUsers.find((user) => user.id === id);
};

export const getMockUserByEmail = (email: string): User | undefined => {
  return mockUsers.find((user) => user.email === email);
};

export const getMockAddressesByUserId = (_userId: string): SavedAddress[] => {
  // In a real app, you'd filter by userId
  // For mock purposes, return all addresses
  return mockSavedAddresses;
};

export const getMockOrdersByUserId = (_userId: string): OrderHistoryItem[] => {
  // In a real app, you'd filter by userId
  // For mock purposes, return all orders
  return mockOrderHistory;
};

// Default mock user for testing
export const defaultMockUser = mockUsers[0];

// Default mock addresses for testing
export const defaultMockAddresses = mockSavedAddresses;

// Default mock orders for testing
export const defaultMockOrders = mockOrderHistory;
