import React from 'react';
import { cn } from '../../../utils/cn';
import type { OrderStatus } from '../../../types/admin';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: 'pending',
      label: 'Pending',
    },
    processing: {
      color: 'bg-blue-100 text-blue-800',
      icon: 'autorenew',
      label: 'Processing',
    },
    shipped: {
      color: 'bg-admin-sage/20 text-admin-sage',
      icon: 'local_shipping',
      label: 'Shipped',
    },
    delivered: {
      color: 'bg-green-100 text-green-800',
      icon: 'check_circle',
      label: 'Delivered',
    },
    cancelled: {
      color: 'bg-admin-coral/20 text-admin-coral',
      icon: 'cancel',
      label: 'Cancelled',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full',
        config.color,
        className
      )}
    >
      <span className="material-symbols-outlined text-sm">{config.icon}</span>
      {config.label}
    </div>
  );
};
