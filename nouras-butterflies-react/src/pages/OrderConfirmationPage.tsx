import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Cart, ShippingAddress, PaymentMethod } from '../types/cart';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { cn } from '../utils/cn';

interface OrderConfirmationState {
  orderNumber: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  cart: Cart;
}

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderConfirmationState | null>(null);
  const [estimatedDelivery, setEstimatedDelivery] = useState<Date | null>(null);

  useEffect(() => {
    // Get order data from navigation state
    const state = location.state as OrderConfirmationState;

    if (!state) {
      // If no state, redirect to cart
      navigate('/cart');
      return;
    }

    setOrderData(state);

    // Calculate estimated delivery (5-7 business days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    setEstimatedDelivery(deliveryDate);
  }, [location.state, navigate]);

  const handleTrackOrder = () => {
    // Navigate to order tracking page (to be implemented)
    navigate(`/order-tracking/${orderData?.orderNumber}`);
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  const handleShareOrder = () => {
    // Share order details (could open a share dialog)
    if (navigator.share && orderData) {
      navigator.share({
        title: `Order ${orderData.orderNumber} - Noura's Butterflies`,
        text: `I just placed an order with Noura's Butterflies! Order #${orderData.orderNumber}`,
        url: window.location.href,
      });
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 flex items-center justify-center">
        <div className="text-center">
          <Icon name="refresh" size="xl" className="animate-spin text-primary mb-4" />
          <p className="text-text-muted">Loading your order details...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 relative">
      {/* Decorative Butterflies */}
      <div className="absolute top-10 left-10 opacity-10 pointer-events-none">
        <Icon name="flutter_dash" size="xl" className="text-primary transform -rotate-12" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-10 pointer-events-none">
        <Icon name="flutter_dash" size="lg" className="text-primary transform rotate-45" />
      </div>
      <div className="absolute top-1/3 right-10 opacity-5 pointer-events-none">
        <Icon name="flutter_dash" size="xl" className="text-primary transform rotate-12" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-butterfly-glow">
            <Icon name="check" size="xl" className="text-white" />
          </div>

          <h1 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
            Thank You for Your Order!
          </h1>

          <p className="text-lg text-text-muted mb-6 max-w-2xl mx-auto">
            Your order has been successfully placed and is now being processed. We've sent a
            confirmation email with all the details.
          </p>

          {/* Order Number Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
            <Icon name="receipt_long" size="md" />
            Order #{orderData.orderNumber}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Order Summary Card */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-text-dark dark:text-text-light mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6">
                {orderData.cart.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-text-dark dark:text-text-light">
                        {item.productTitle}
                      </h3>
                      {item.variant && (
                        <p className="text-sm text-text-muted">
                          {item.variant.name}
                          {item.variant.shade && ` • ${item.variant.shade}`}
                        </p>
                      )}
                      <p className="text-sm text-text-muted">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-text-dark dark:text-text-light">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-text-dark dark:text-text-light">
                  <span>Subtotal</span>
                  <span>{formatPrice(orderData.cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-dark dark:text-text-light">
                  <span>Shipping</span>
                  <span>
                    {orderData.cart.shipping === 0 ? 'Free' : formatPrice(orderData.cart.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-text-dark dark:text-text-light">
                  <span>Tax</span>
                  <span>{formatPrice(orderData.cart.tax)}</span>
                </div>
                {orderData.cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(orderData.cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-text-dark dark:text-text-light pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span>{formatPrice(orderData.cart.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
                Shipping Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-text-dark dark:text-text-light font-medium">
                  {orderData.shippingAddress.fullName}
                </p>
                <p className="text-text-muted">{orderData.shippingAddress.phone}</p>
                <p className="text-text-muted">{orderData.shippingAddress.streetAddress}</p>
                <p className="text-text-muted">
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.postalCode}
                </p>
                <p className="text-text-muted">{orderData.shippingAddress.country}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
                Estimated Delivery
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="local_shipping" size="sm" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-dark dark:text-text-light">
                      {estimatedDelivery ? formatDate(estimatedDelivery) : 'Calculating...'}
                    </p>
                    <p className="text-sm text-text-muted">5-7 business days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="inventory_2" size="sm" className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-dark dark:text-text-light">
                      Standard Shipping
                    </p>
                    <p className="text-sm text-text-muted">Track your package online</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={handleTrackOrder}
            size="lg"
            leftIcon="track_changes"
            className="flex-1 sm:flex-initial"
          >
            Track My Journey
          </Button>
          <Button
            onClick={handleContinueShopping}
            variant="outline"
            size="lg"
            leftIcon="shopping_bag"
            className="flex-1 sm:flex-initial"
          >
            Continue Shopping
          </Button>
        </div>

        {/* Community Section */}
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-6">
            Join Our Butterfly Community
          </h3>
          <div className="flex justify-center gap-6">
            <a
              href="https://instagram.com/nourasbutterflies"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <Icon name="photo_camera" size="lg" />
              <span className="text-sm">Instagram</span>
            </a>
            <button
              onClick={handleShareOrder}
              className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <Icon name="share" size="lg" />
              <span className="text-sm">Share</span>
            </button>
            <a
              href="mailto:support@nourasbutterflies.com"
              className="flex flex-col items-center gap-2 text-text-muted hover:text-primary transition-colors"
            >
              <Icon name="contact_support" size="lg" />
              <span className="text-sm">Contact</span>
            </a>
          </div>
        </div>

        {/* Email Confirmation Note */}
        <div className="text-center text-sm text-text-muted">
          <p>
            A confirmation email has been sent to your registered email address. If you don't
            receive it within 10 minutes, please check your spam folder.
          </p>
        </div>

        {/* Bottom Gradient Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-primary" />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
