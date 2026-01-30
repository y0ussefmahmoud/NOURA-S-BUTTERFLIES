import type { Order, CartItem, ShippingAddress, PaymentMethod } from '../types/cart';

// Mock product data
const mockProducts = [
  {
    id: 'butterfly-lipstick-1',
    title: 'Butterfly Kiss Lipstick - Rose Garden',
    image: '/api/placeholder/128/128',
    price: 45.99,
    originalPrice: 59.99,
  },
  {
    id: 'butterfly-eyeshadow-1',
    title: 'Wings of Color Eyeshadow Palette',
    image: '/api/placeholder/128/128',
    price: 68.0,
  },
  {
    id: 'butterfly-mascara-1',
    title: 'Flutter Lash Mascara - Black',
    image: '/api/placeholder/128/128',
    price: 32.5,
    originalPrice: 38.0,
  },
  {
    id: 'butterfly-foundation-1',
    title: 'Butterfly Glow Foundation - Natural Beige',
    image: '/api/placeholder/128/128',
    price: 52.0,
    variants: [
      { id: 'shade-1', name: 'Natural Beige', shade: 'NB10' },
      { id: 'shade-2', name: 'Warm Honey', shade: 'WH20' },
      { id: 'shade-3', name: 'Cool Ivory', shade: 'CI05' },
    ],
  },
  {
    id: 'butterfly-perfume-1',
    title: 'Butterfly Dreams Eau de Parfum',
    image: '/api/placeholder/128/128',
    price: 89.99,
    originalPrice: 120.0,
  },
];

// Generate mock cart items
const generateMockCartItems = (count: number = 3): CartItem[] => {
  const items: CartItem[] = [];

  for (let i = 0; i < count && i < mockProducts.length; i++) {
    const product = mockProducts[i];
    const variant = product.variants
      ? product.variants[Math.floor(Math.random() * product.variants.length)]
      : undefined;

    items.push({
      id: `cart-item-${Date.now()}-${i}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.image,
      variant,
      quantity: Math.floor(Math.random() * 2) + 1,
      price: product.price,
      originalPrice: product.originalPrice,
    });
  }

  return items;
};

// Mock shipping addresses
const mockShippingAddresses: ShippingAddress[] = [
  {
    fullName: 'Fatima Al-Rashid',
    phone: '+966 50 123 4567',
    streetAddress: '123 Olaya Street, Apartment 4B, Al-Malaz District',
    city: 'Riyadh',
    postalCode: '11564',
    country: 'Saudi Arabia',
  },
  {
    fullName: 'Nora Al-Saud',
    phone: '+966 56 987 6543',
    streetAddress: '456 King Abdullah Road, Villa 78, An-Nahdah',
    city: 'Jeddah',
    postalCode: '21442',
    country: 'Saudi Arabia',
  },
  {
    fullName: 'Amina Hassan',
    phone: '+966 53 456 7890',
    streetAddress: '789 Prince Mohammed Street, Floor 5, Al-Hamra',
    city: 'Dammam',
    postalCode: '32223',
    country: 'Saudi Arabia',
  },
];

// Generate mock order
const generateMockOrder = (status: Order['status'] = 'pending'): Order => {
  const items = generateMockCartItems(Math.floor(Math.random() * 3) + 1);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 15;
  const tax = subtotal * 0.15;
  const discount = Math.random() > 0.7 ? Math.random() * 20 : 0;
  const total = subtotal + shipping + tax - discount;

  const orderNumber = `NB-${Date.now().toString().slice(-6)}`;
  const createdAt = new Date();
  const estimatedDelivery = new Date(createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return {
    id: `order-${Date.now()}`,
    orderNumber,
    status,
    items,
    shippingAddress:
      mockShippingAddresses[Math.floor(Math.random() * mockShippingAddresses.length)],
    paymentMethod: (['credit-card', 'mada', 'fawry', 'cod'] as PaymentMethod[])[
      Math.floor(Math.random() * 4)
    ],
    subtotal,
    shipping,
    tax,
    discount,
    total,
    createdAt,
    estimatedDelivery,
    trackingNumber: status !== 'pending' ? `NB${Date.now().toString().slice(-8)}` : undefined,
  };
};

// Pre-defined mock orders for testing
export const mockOrders: Order[] = [
  generateMockOrder('pending'),
  generateMockOrder('processing'),
  generateMockOrder('shipped'),
  generateMockOrder('delivered'),
];

// Get order by ID (mock function)
export const getMockOrderById = (orderId: string): Order | null => {
  return mockOrders.find((order) => order.id === orderId) || null;
};

// Get order by order number (mock function)
export const getMockOrderByNumber = (orderNumber: string): Order | null => {
  return mockOrders.find((order) => order.orderNumber === orderNumber) || null;
};

// Generate multiple orders for testing
export const generateMockOrders = (count: number): Order[] => {
  const orders: Order[] = [];
  const statuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered'];

  for (let i = 0; i < count; i++) {
    orders.push(generateMockOrder(statuses[i % statuses.length]));
  }

  return orders;
};

// Mock cart with items
export const mockCart = {
  items: generateMockCartItems(3),
  itemCount: 3,
  subtotal: 156.48,
  shipping: 15.0,
  tax: 23.47,
  total: 194.95,
  discount: 0,
  isEmpty: false,
};

// Mock empty cart
export const mockEmptyCart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  discount: 0,
  isEmpty: true,
};

// Mock order confirmation data
export const mockOrderConfirmation = {
  orderNumber: 'NB-123456',
  shippingAddress: mockShippingAddresses[0],
  paymentMethod: 'credit-card' as PaymentMethod,
  cart: mockCart,
};

// Mock recent orders for user profile
export const mockRecentOrders = generateMockOrders(5);

// Mock order statistics
export const mockOrderStats = {
  totalOrders: 12,
  totalSpent: 1456.78,
  averageOrderValue: 121.4,
  pendingOrders: 2,
  deliveredOrders: 10,
};

// Export default mock data
export default {
  mockOrders,
  mockCart,
  mockEmptyCart,
  mockOrderConfirmation,
  mockRecentOrders,
  mockOrderStats,
  generateMockOrder,
  getMockOrderById,
  getMockOrderByNumber,
  generateMockOrders,
};
