import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OrderTrackingProgress } from '../components/account/OrderTrackingProgress';
import { TrackingHistoryTable } from '../components/account/TrackingHistoryTable';
import { OrderSummaryCard } from '../components/account/OrderSummaryCard';
import { Button } from '../components/ui/Button';
import type { OrderTracking, OrderHistoryItem } from '../types/account';

// Mock order tracking data
const mockOrderTracking: OrderTracking = {
  orderNumber: 'ORD-2024-001',
  currentStatus: 'shipped',
  estimatedDelivery: '2024-01-20T18:00:00Z',
  carrier: 'Butterfly Express',
  trackingNumber: 'TRK123456789',
  events: [
    {
      id: '1',
      timestamp: '2024-01-15T10:30:00Z',
      location: 'Riyadh, Saudi Arabia',
      status: 'Processing',
      description: 'Order received and processing started',
    },
    {
      id: '2',
      timestamp: '2024-01-15T14:20:00Z',
      location: 'Riyadh Distribution Center',
      status: 'Picked Up',
      description: 'Package picked up by carrier',
    },
    {
      id: '3',
      timestamp: '2024-01-16T09:15:00Z',
      location: 'Riyadh Distribution Center',
      status: 'In Transit',
      description: 'Package in transit to destination',
    },
    {
      id: '4',
      timestamp: '2024-01-17T16:45:00Z',
      location: 'Jeddah, Saudi Arabia',
      status: 'Shipped',
      description: 'Package shipped and on the way',
    },
  ],
};

// Mock order details
const mockOrderDetails: OrderHistoryItem = {
  id: '1',
  orderNumber: 'ORD-2024-001',
  date: '2024-01-15T10:30:00Z',
  status: 'shipped',
  total: 156.99,
  items: [
    {
      id: '1',
      product: {
        id: '1',
        name: 'Butterfly Glow Serum',
        slug: 'butterfly-glow-serum',
        description: 'A radiant serum that gives your skin a butterfly-like glow',
        price: 89.99,
        images: [{ url: '/api/placeholder/100/100', alt: 'Butterfly Glow Serum' }],
        rating: 4.8,
        reviewCount: 124,
        badges: [{ type: 'bestseller' }],
        category: 'skincare',
        inStock: true,
        variants: [],
      },
      quantity: 1,
      price: 89.99,
    },
    {
      id: '2',
      product: {
        id: '2',
        name: 'Flutter Mascara',
        slug: 'flutter-mascara',
        description: 'Volumizing mascara for butterfly-effect lashes',
        price: 67.0,
        images: [{ url: '/api/placeholder/100/100', alt: 'Flutter Mascara' }],
        rating: 4.6,
        reviewCount: 89,
        badges: [{ type: 'new' }],
        category: 'makeup',
        inStock: true,
        variants: [],
      },
      quantity: 1,
      price: 67.0,
    },
  ],
  shippingAddress: {
    fullName: 'Sarah Johnson',
    streetAddress: '123 Beauty Lane, Apartment 4B',
    city: 'Riyadh',
    postalCode: '12345',
    country: 'Saudi Arabia',
  },
  trackingNumber: 'TRK123456789',
  estimatedDelivery: '2024-01-20T18:00:00Z',
};

export const OrderTrackingPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber?: string }>();
  const navigate = useNavigate();
  const [searchOrderNumber, setSearchOrderNumber] = useState(orderNumber || '');
  const [searchEmail, setSearchEmail] = useState('');
  const [trackingData, setTrackingData] = useState<OrderTracking | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(!orderNumber);

  const steps = [
    { id: 0, label: 'Order Placed', icon: 'shopping_cart', completed: true },
    { id: 1, label: 'Processing', icon: 'pending', completed: true },
    { id: 2, label: 'Shipped', icon: 'local_shipping', completed: true },
    { id: 3, label: 'Out for Delivery', icon: 'delivery_dining', completed: false },
    { id: 4, label: 'Delivered', icon: 'check_circle', completed: false },
  ];

  const getCurrentStep = (status: string) => {
    switch (status) {
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchOrderNumber.trim() || !searchEmail.trim()) {
      setError('Please enter both order number and email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation
      if (searchOrderNumber === 'ORD-2024-001' && searchEmail === 'user@example.com') {
        setTrackingData(mockOrderTracking);
        setOrderDetails(mockOrderDetails);
        setIsSearchMode(false);

        // Update URL
        navigate(`/track-order/${searchOrderNumber}`, { replace: true });
      } else {
        setError('Order not found. Please check your order number and email address.');
      }
    } catch (err) {
      setError('Failed to track order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setIsSearchMode(true);
    setTrackingData(null);
    setOrderDetails(null);
    setError(null);
    setSearchOrderNumber('');
    setSearchEmail('');
    navigate('/track-order', { replace: true });
  };

  // Load tracking data if order number is in URL
  useEffect(() => {
    if (orderNumber && !trackingData) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setTrackingData(mockOrderTracking);
        setOrderDetails(mockOrderDetails);
        setIsLoading(false);
      }, 1000);
    }
  }, [orderNumber, trackingData]);

  if (isLoading && !trackingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <p className="text-gray-600">Tracking your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">Track Your Butterflies</h1>
              <p className="text-gray-600">
                Follow your order's journey from our studio to your doorstep
              </p>
            </div>

            {!isSearchMode && (
              <Button
                variant="outline"
                onClick={handleNewSearch}
                className="text-pink-600 border-pink-600 hover:bg-pink-50"
              >
                Track Another Order
              </Button>
            )}
          </div>
        </div>

        {/* Search Section */}
        {isSearchMode && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="orderNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Order Number
                  </label>
                  <input
                    type="text"
                    id="orderNumber"
                    value={searchOrderNumber}
                    onChange={(e) => setSearchOrderNumber(e.target.value)}
                    placeholder="e.g., ORD-2024-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Tracking Order...
                  </span>
                ) : (
                  'Track Journey'
                )}
              </Button>
            </form>

            {/* Demo Notice */}
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <span className="material-symbols-rounded text-blue-600 text-lg mr-3 mt-0.5">
                  info
                </span>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Demo Account</h4>
                  <p className="text-sm text-blue-800">
                    Use order number <strong>ORD-2024-001</strong> and email{' '}
                    <strong>user@example.com</strong> to see a sample tracking result.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tracking Results */}
        {trackingData && orderDetails && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Tracking Progress & History */}
            <div className="lg:col-span-2 space-y-6">
              <OrderTrackingProgress
                currentStep={getCurrentStep(trackingData.currentStatus)}
                steps={steps}
                estimatedDelivery={trackingData.estimatedDelivery}
              />

              <TrackingHistoryTable
                events={trackingData.events}
                timezone="AST (Arabian Standard Time)"
              />

              {/* Tracking Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-serif text-gray-900 mb-4">Tracking Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Carrier</p>
                    <p className="font-medium text-gray-900">{trackingData.carrier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tracking Number</p>
                    <p className="font-medium text-gray-900">{trackingData.trackingNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummaryCard
                order={orderDetails}
                shippingAddress={orderDetails.shippingAddress}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
