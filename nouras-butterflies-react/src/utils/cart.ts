import type { CartItem, PromoCode } from '../types/cart';

// Constants
export const SHIPPING_THRESHOLD = 200;
export const SHIPPING_RATE = 15;
export const TAX_RATE = 0.15; // 15% tax rate

/**
 * Calculate subtotal from cart items
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Calculate shipping cost based on subtotal
 */
export const calculateShipping = (subtotal: number): number => {
  if (subtotal === 0) return 0;
  return subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
};

/**
 * Calculate tax based on subtotal and discount
 */
export const calculateTax = (subtotal: number, discount: number = 0): number => {
  const taxableAmount = Math.max(0, subtotal - discount);
  return taxableAmount * TAX_RATE;
};

/**
 * Calculate total including shipping, tax, and discount
 */
export const calculateTotal = (
  subtotal: number,
  shipping: number,
  tax: number,
  discount: number = 0
): number => {
  return subtotal + shipping + tax - discount;
};

/**
 * Format price with currency symbol
 */
export const formatPrice = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Validate promo code (mock API call)
 */
export const validatePromoCode = async (code: string): Promise<PromoCode | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const validPromos: Record<string, PromoCode> = {
    BUTTERFLY10: {
      code: 'BUTTERFLY10',
      discount: 10,
      type: 'percentage',
      description: '10% off your order',
      minOrderAmount: 50,
      maxDiscount: 50,
      isActive: true,
    },
    FLAT20: {
      code: 'FLAT20',
      discount: 20,
      type: 'fixed',
      description: '$20 off your order',
      minOrderAmount: 100,
      isActive: true,
    },
    FREESHIP: {
      code: 'FREESHIP',
      discount: SHIPPING_RATE,
      type: 'fixed',
      description: 'Free shipping',
      isActive: true,
    },
    SAVE25: {
      code: 'SAVE25',
      discount: 25,
      type: 'percentage',
      description: '25% off your order',
      minOrderAmount: 200,
      maxDiscount: 100,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
    },
  };

  const upperCode = code.toUpperCase().trim();
  const promo = validPromos[upperCode];

  if (!promo || !promo.isActive) {
    return null;
  }

  // Check if expired
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    return null;
  }

  return promo;
};

/**
 * Generate unique order number
 */
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `NB-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

/**
 * Calculate discount amount based on promo code
 */
export const calculateDiscount = (subtotal: number, promoCode: PromoCode | undefined): number => {
  if (!promoCode) return 0;

  // Check minimum order amount
  if (promoCode.minOrderAmount && subtotal < promoCode.minOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (promoCode.type === 'percentage') {
    discount = subtotal * (promoCode.discount / 100);
    // Apply maximum discount if specified
    if (promoCode.maxDiscount) {
      discount = Math.min(discount, promoCode.maxDiscount);
    }
  } else {
    discount = promoCode.discount;
  }

  return discount;
};

/**
 * Calculate estimated delivery date
 */
export const calculateEstimatedDelivery = (days: number = 7): Date => {
  const deliveryDate = new Date();
  let businessDaysAdded = 0;

  while (businessDaysAdded < days) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (deliveryDate.getDay() !== 6 && deliveryDate.getDay() !== 0) {
      businessDaysAdded++;
    }
  }

  return deliveryDate;
};

/**
 * Check if cart has items with variants
 */
export const hasVariants = (items: CartItem[]): boolean => {
  return items.some((item) => item.variant !== undefined);
};

/**
 * Get total quantity of all items
 */
export const getTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

/**
 * Check if any item is out of stock (mock check)
 */
export const hasOutOfStockItems = (items: CartItem[]): boolean => {
  // This would typically check against inventory
  // For now, we'll assume all items are in stock
  return false;
};

/**
 * Get cart weight for shipping calculations (mock)
 */
export const getCartWeight = (items: CartItem[]): number => {
  // Mock weight calculation - each item weighs 0.5kg
  return items.reduce((sum, item) => sum + 0.5 * item.quantity, 0);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Generate tracking number (mock)
 */
export const generateTrackingNumber = (): string => {
  const prefix = 'NB';
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};
