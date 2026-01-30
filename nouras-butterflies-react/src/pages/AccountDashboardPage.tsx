import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { AccountSidebar } from '../components/account/AccountSidebar';
import { OrderHistoryTable } from '../components/account/OrderHistoryTable';
import { SavedAddressCard } from '../components/account/SavedAddressCard';
import { WishlistProductCard } from '../components/account/WishlistProductCard';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';
import type { SavedAddress as SavedAddressType } from '../types/user';
import type { OrderHistoryItem } from '../types/account';

// Mock data - will be replaced with actual API calls
const mockOrders: OrderHistoryItem[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-15T10:30:00Z',
    status: 'delivered',
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
          badges: [],
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
          badges: [],
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
      streetAddress: '123 Beauty Lane',
      city: 'Riyadh',
      postalCode: '12345',
      country: 'Saudi Arabia',
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-20T18:00:00Z',
  },
];

const mockAddresses: SavedAddressType[] = [
  {
    id: '1',
    label: 'home',
    isDefault: true,
    fullName: 'Sarah Johnson',
    phone: '+966 50 123 4567',
    streetAddress: '123 Beauty Lane, Apartment 4B',
    city: 'Riyadh',
    postalCode: '12345',
    country: 'Saudi Arabia',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    label: 'work',
    isDefault: false,
    fullName: 'Sarah Johnson',
    phone: '+966 50 123 4567',
    streetAddress: '456 Office Tower, Floor 12',
    city: 'Jeddah',
    postalCode: '54321',
    country: 'Saudi Arabia',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

export const AccountDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders] = useState<OrderHistoryItem[]>(mockOrders);

  // SEO metadata
  const seoData = useSEO('account');
  const [addresses] = useState<SavedAddressType[]>(mockAddresses);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleViewOrderDetails = (orderNumber: string) => {
    navigate(`/track-order/${orderNumber}`);
  };

  const handleEditAddress = (address: SavedAddressType) => {
    // TODO: Implement address editing
    console.log('Edit address:', address);
  };

  const handleDeleteAddress = (addressId: string) => {
    // TODO: Implement address deletion
    console.log('Delete address:', addressId);
  };

  const handleSetDefaultAddress = (addressId: string) => {
    // TODO: Implement setting default address
    console.log('Set default address:', addressId);
  };

  const handleAddAddress = () => {
    // TODO: Implement adding new address
    console.log('Add new address');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: any) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.name);
  };

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="material-symbols-rounded text-gray-600">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          fixed lg:relative inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <div className="h-full overflow-y-auto">
            <AccountSidebar
              user={user}
              isMobile={true}
              onClose={() => setIsMobileMenuOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-2xl font-serif text-gray-900 mb-2">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">
                Manage your orders, addresses, and preferences from your account dashboard.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <span className="material-symbols-rounded text-pink-600 text-2xl">
                      shopping_bag
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <span className="material-symbols-rounded text-blue-600 text-2xl">
                      location_on
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
                    <p className="text-2xl font-semibold text-gray-900">{addresses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <span className="material-symbols-rounded text-yellow-600 text-2xl">stars</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reward Points</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {user.points.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Preview */}
            {wishlist.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-serif text-gray-900">My Wishlist</h2>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/account/wishlist')}
                    className="text-pink-600 border-pink-600 hover:bg-pink-50"
                  >
                    View All ({wishlist.length})
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {wishlist.slice(0, 4).map((wishlistItem) => (
                    <WishlistProductCard
                      key={wishlistItem.id}
                      product={wishlistItem.product}
                      onRemove={handleRemoveFromWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-gray-900">Recent Orders</h2>
                <Button
                  variant="outline"
                  onClick={() => navigate('/account/orders')}
                  className="text-pink-600 border-pink-600 hover:bg-pink-50"
                >
                  View All Orders
                </Button>
              </div>
              <OrderHistoryTable
                orders={orders.slice(0, 3)}
                onViewDetails={handleViewOrderDetails}
              />
            </div>

            {/* Saved Addresses */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-serif text-gray-900">Saved Addresses</h2>
                <Button
                  onClick={handleAddAddress}
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Add New Address
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {addresses.map((address) => (
                  <SavedAddressCard
                    key={address.id}
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefaultAddress}
                    isDefault={address.isDefault}
                  />
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div>
              <h2 className="text-xl font-serif text-gray-900 mb-4">Recommended for You</h2>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
                <div className="text-center">
                  <span className="material-symbols-rounded text-4xl text-pink-500 mb-3">
                    auto_awesome
                  </span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Discover Your Perfect Match
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Based on your purchase history and preferences, we've selected some products you
                    might love.
                  </p>
                  <Button
                    onClick={() => navigate('/products')}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Browse Recommendations
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
