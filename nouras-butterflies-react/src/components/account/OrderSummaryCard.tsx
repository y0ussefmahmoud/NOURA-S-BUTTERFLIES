import React from 'react';
import type { OrderHistoryItem } from '../../types/account';

interface OrderSummaryCardProps {
  order: OrderHistoryItem;
  shippingAddress?: {
    fullName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order, shippingAddress }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateSubtotal = () => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateShipping = () => {
    // Mock shipping calculation
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 10.0;
  };

  const calculateTax = () => {
    // Mock tax calculation (15%)
    return calculateSubtotal() * 0.15;
  };

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const tax = calculateTax();
  const total = subtotal + shipping + tax;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-4">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-serif text-gray-900">Order Summary</h3>
        <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
      </div>

      {/* Order Items */}
      <div className="px-6 py-4 border-b border-gray-200 max-h-64 overflow-y-auto">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              {/* Product Image */}
              <img
                src={item.product.images[0]?.url || '/api/placeholder/60/60'}
                alt={item.product.images[0]?.alt || item.product.name}
                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              />

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>

              {/* Item Total */}
              <div className="text-sm font-medium text-gray-900">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium text-gray-900">
              {shipping === 0 ? 'FREE' : formatPrice(shipping)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium text-gray-900">{formatPrice(tax)}</span>
          </div>

          {/* Free Shipping Notice */}
          {shipping > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
              <div className="flex items-center">
                <span className="material-symbols-rounded text-green-600 text-sm mr-2">
                  local_shipping
                </span>
                <p className="text-xs text-green-800">
                  Add {formatPrice(100 - subtotal)} more for FREE shipping!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold text-pink-600">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="px-6 py-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">{shippingAddress.fullName}</p>
            <p>{shippingAddress.streetAddress}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
          </div>
        </div>
      )}

      {/* Order Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="space-y-2">
          <button
            onClick={() => console.log('Track order:', order.orderNumber)}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Track Package
          </button>

          <button
            onClick={() => console.log('Download invoice:', order.orderNumber)}
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
          >
            Download Invoice
          </button>
        </div>
      </div>

      {/* Customer Support */}
      <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
        <div className="flex items-center">
          <span className="material-symbols-rounded text-blue-600 text-lg mr-3">support_agent</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900">Need Help?</p>
            <p className="text-xs text-blue-800">
              Contact our customer support for any questions about your order.
            </p>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Contact</button>
        </div>
      </div>
    </div>
  );
};
