import React from 'react';
import type { OrderHistoryItem } from '../../types/account';
import { Button } from '../ui/Button';

interface OrderHistoryCardProps {
  order: OrderHistoryItem;
  onViewDetails: (orderNumber: string) => void;
  className?: string;
}

export const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({
  order,
  onViewDetails,
  className = '',
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Order Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">Placed on {formatDate(order.date)}</p>
        </div>
        <div className="text-right">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
          <p className="text-lg font-semibold text-gray-900 mt-1">{formatPrice(order.total)}</p>
        </div>
      </div>

      {/* Order Items Preview */}
      <div className="mb-4">
        <div className="flex items-center space-x-4 mb-3">
          <span className="text-sm text-gray-600">
            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
          </span>
          {order.trackingNumber && (
            <span className="text-sm text-gray-600">Tracking: {order.trackingNumber}</span>
          )}
        </div>

        {/* Show first 2 items as preview */}
        <div className="space-y-2">
          {order.items.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {item.product.images[0] ? (
                  <img
                    src={item.product.images[0].url}
                    alt={item.product.images[0].alt || item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-rounded text-gray-400 text-lg">image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.product.name}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
            </div>
          ))}

          {/* Show "and more" if there are additional items */}
          {order.items.length > 2 && (
            <p className="text-sm text-gray-500 italic">
              and {order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>
      </div>

      {/* Delivery Information */}
      {order.estimatedDelivery && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <span className="material-symbols-rounded text-lg mr-2">local_shipping</span>
            <span>Estimated delivery: {formatDate(order.estimatedDelivery)}</span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={() => onViewDetails(order.orderNumber)}
          className="text-pink-600 border-pink-600 hover:bg-pink-50"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
