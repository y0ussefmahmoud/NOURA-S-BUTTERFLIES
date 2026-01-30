export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'review';

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description?: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  isActive: boolean;
}

export interface CheckoutFormData {
  shippingAddress: {
    fullName: string;
    phone: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    deliveryInstructions?: string;
  };
  paymentMethod: 'credit-card' | 'mada' | 'fawry' | 'cod';
  paymentDetails: {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
  };
  promoCode?: string;
  saveAddress: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description: string;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  itemCount: number;
}
