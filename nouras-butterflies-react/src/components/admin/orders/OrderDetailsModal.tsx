import React from 'react';
import { cn } from '../../../utils/cn';
import type { Order, OrderStatus } from '../../../types/admin';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
  onPrintInvoice?: (orderId: string) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onPrintInvoice,
}) => {
  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus: OrderStatus) => {
    onUpdateStatus?.(order.id, newStatus);
  };

  const handlePrintInvoice = () => {
    onPrintInvoice?.(order.id);
  };

  const statusOptions: OrderStatus[] = [
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white dark:bg-surface-dark rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Order #{order.orderNumber}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-gray-500">close</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.customer.email}
                  </p>
                </div>
                {order.customer.phone && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.customer.phone}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Items</h3>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {item.product.name}
                            </p>
                            {item.variant && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {item.variant.name}: {item.variant.value}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">${item.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.tax.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    ${order.shipping.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Shipping Address</h3>
              <div className="text-gray-700 dark:text-gray-300">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Method</p>
                  <p className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                  <span
                    className={cn(
                      'inline-block px-2 py-1 text-xs font-medium rounded-full',
                      order.paymentStatus === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.paymentStatus === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Order Timeline</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Order Placed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {order.createdAt.toLocaleDateString()} at{' '}
                      {order.createdAt.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {order.shippedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Shipped</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shippedAt.toLocaleDateString()} at{' '}
                        {order.shippedAt.toLocaleTimeString()}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-admin-primary">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Order Delivered</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.deliveredAt.toLocaleDateString()} at{' '}
                        {order.deliveredAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Update Order Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={status === order.status}
                    className={cn(
                      'px-3 py-1 text-sm rounded-full border transition-colors duration-200',
                      status === order.status
                        ? 'bg-admin-primary text-white border-admin-primary cursor-not-allowed'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between">
              <div className="flex gap-3">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Invoice
                </button>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
