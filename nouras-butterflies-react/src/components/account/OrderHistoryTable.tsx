import React from 'react';
import type { OrderHistoryItem } from '../../types/account';

interface OrderHistoryTableProps {
  orders: OrderHistoryItem[];
  onViewDetails: (orderNumber: string) => void;
}

export const OrderHistoryTable: React.FC<OrderHistoryTableProps> = ({ orders, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return 'pending';
      case 'shipped':
        return 'local_shipping';
      case 'out_for_delivery':
        return 'delivery_dining';
      case 'delivered':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-rounded text-6xl text-gray-300 mb-4">shopping_bag</span>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">When you place your first order, it will appear here.</p>
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getStatusColor(order.status)}
                      `}
                    >
                      <span className="material-symbols-rounded text-xs mr-1">
                        {getStatusIcon(order.status)}
                      </span>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onViewDetails(order.orderNumber)}
                      className="text-pink-600 hover:text-pink-900 transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Layout */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">#{order.orderNumber}</h3>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(order.date)}</p>
                </div>
                <span
                  className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${getStatusColor(order.status)}
                  `}
                >
                  <span className="material-symbols-rounded text-xs mr-1">
                    {getStatusIcon(order.status)}
                  </span>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                </div>
                <button
                  onClick={() => onViewDetails(order.orderNumber)}
                  className="text-pink-600 hover:text-pink-900 text-sm font-medium transition-colors duration-200"
                >
                  View Details
                </button>
              </div>

              {/* Order Items Preview */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  {order.items.slice(0, 3).map((item, index) => (
                    <img
                      key={index}
                      src={item.product.images[0]?.url || '/api/placeholder/40/40'}
                      alt={item.product.images[0]?.alt || item.product.name}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{order.items.length - 3}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500 ml-2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
