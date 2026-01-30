export interface CartItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  variant?: {
    id: string;
    name: string;
    shade?: string;
  };
  quantity: number;
  price: number;
  originalPrice?: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  promoCode?: PromoCode;
  isEmpty: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  deliveryInstructions?: string;
}

export type PaymentMethod = 'credit-card' | 'mada' | 'fawry' | 'cod';

export interface PaymentDetails {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentDetails?: PaymentDetails;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface PromoCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed' | 'freeship';
  description?: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: Date;
  isActive: boolean;
}
