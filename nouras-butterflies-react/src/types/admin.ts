import type { User } from './user';
import type { Product } from './product';

// Order Management Types
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  variant?: {
    name: string;
    value: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  customer?: string;
  paymentStatus?: string[];
}

// Customer Management Types
export interface Customer extends User {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
  tags: string[];
  notes?: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  preferences: {
    newsletter: boolean;
    sms: boolean;
    promotions: boolean;
  };
}

export interface CustomerStats {
  lifetimeValue: number;
  averageOrderValue: number;
  orderFrequency: number;
  lastPurchaseDays: number;
  preferredCategories: string[];
}

// Product Management Types
export interface AdminProduct extends Product {
  sku: string;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  cost: number;
  supplier: {
    name: string;
    contact: string;
    leadTime: number;
  };
  createdBy: string;
  lastModified: Date;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  variants: AdminProductVariant[];
}

export interface AdminProductVariant {
  id: string;
  name: string;
  value: string;
  color?: string;
  inStock: boolean;
  price: number;
  sku: string;
  inventory: number;
  image?: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  ingredients: string;
  category: string;
  sku: string;
  basePrice: number;
  discountPercentage: number;
  images: string[];
  isVegan: boolean;
  isNatural: boolean;
  showOnHomepage: boolean;
  inventory: {
    quantity: number;
    lowStockThreshold: number;
    trackQuantity: boolean;
    allowBackorder: boolean;
  };
  cost: number;
  supplier: {
    name: string;
    contact: string;
    leadTime: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface InventoryAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  severity: 'low' | 'critical' | 'out';
  createdAt: Date;
}

// Analytics Types
export interface SalesMetrics {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  averageOrderValue: {
    current: number;
    previous: number;
    growth: number;
  };
}

export interface TopProduct {
  id: string;
  name: string;
  image: string;
  revenue: number;
  unitsSold: number;
  growth: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: Date;
}

// Admin User Types
export type AdminRole = 'admin' | 'manager' | 'staff';

export interface AdminUser extends User {
  role: AdminRole;
  permissions: string[];
  department?: string;
  lastLogin?: Date;
}

export interface AdminRolePermissions {
  admin: string[];
  manager: string[];
  staff: string[];
}

// UI State Types
export interface DataTableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface DataTableAction<T> {
  label: string;
  icon?: string;
  onClick: (row: T) => void;
  variant?: 'default' | 'danger';
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'checkbox' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

// Notification Types
export interface AdminNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

// Settings Types
export interface StoreSettings {
  name: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  currency: string;
  timezone: string;
}

export interface PaymentSettings {
  gateway: 'stripe' | 'paypal' | 'square';
  publicKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
}

export interface ShippingSettings {
  freeShippingThreshold: number;
  flatRate: number;
  zones: ShippingZone[];
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: {
    standard: number;
    express: number;
  };
}
