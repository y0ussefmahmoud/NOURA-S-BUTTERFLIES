import React, { createContext, useContext, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { User } from '../types/user';
import { logger } from '../utils/logger';

interface AdminContextType {
  isAdmin: boolean;
  hasPermission: (permission: string) => boolean;
  canAccess: (resource: string) => boolean;
  userRole: User['role'] | null;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<NonNullable<User['role']>, string[]> = {
  customer: [],
  staff: ['orders.read', 'customers.read'],
  manager: ['orders.read', 'orders.write', 'products.read', 'customers.read', 'analytics.read'],
  admin: [
    'orders.read',
    'orders.write',
    'products.read',
    'products.write',
    'customers.read',
    'customers.write',
    'analytics.read',
    'settings.write',
  ],
};

// Resource access mapping
const RESOURCE_ACCESS: Record<string, string[]> = {
  dashboard: ['orders.read', 'analytics.read'],
  orders: ['orders.read'],
  products: ['products.read'],
  customers: ['customers.read'],
  marketing: ['analytics.read'],
  settings: ['settings.write'],
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const isAdmin =
    isAuthenticated &&
    (user?.role === 'admin' || user?.role === 'manager' || user?.role === 'staff');

  const userRole = user?.role || null;

  const hasPermission = (permission: string): boolean => {
    if (!isAuthenticated || !user?.role) return false;

    const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
    const userPermissions = user.permissions || [];

    return rolePermissions.includes(permission) || userPermissions.includes(permission);
  };

  const canAccess = (resource: string): boolean => {
    if (!isAuthenticated || !user?.role) return false;

    const requiredPermissions = RESOURCE_ACCESS[resource] || [];

    if (requiredPermissions.length === 0) return true;

    return requiredPermissions.some((permission: string) => hasPermission(permission));
  };

  const value: AdminContextType = {
    isAdmin,
    hasPermission,
    canAccess,
    userRole,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    logger.error('[Admin] useAdmin hook called outside AdminProvider');
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
