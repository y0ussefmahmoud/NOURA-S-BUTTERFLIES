export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  membershipTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  role?: 'customer' | 'admin' | 'manager' | 'staff';
  permissions?: string[];
}

export interface SavedAddress {
  id: string;
  label: 'home' | 'work' | 'other';
  isDefault: boolean;
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}
