import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../hooks/useWishlist';
import { WishlistProductCard } from '../components/account/WishlistProductCard';
import { Button } from '../components/ui/Button';
import type { Product } from '../types/product';

// Mock recommendations data
const mockRecommendations: Product[] = [
  {
    id: 'rec1',
    name: 'Butterfly Glow Highlighter',
    slug: 'butterfly-glow-highlighter',
    description: 'A luminous highlighter that gives your skin a butterfly-like radiance',
    price: 45.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Butterfly Glow Highlighter' }],
    rating: 4.7,
    reviewCount: 89,
    badges: [{ type: 'bestseller' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: 'rec2',
    name: 'Flutter Kiss Lip Gloss',
    slug: 'flutter-kiss-lip-gloss',
    description: 'Shimmery lip gloss with butterfly-wing effect',
    price: 28.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Flutter Kiss Lip Gloss' }],
    rating: 4.5,
    reviewCount: 67,
    badges: [{ type: 'new' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: 'rec3',
    name: 'Monarch Body Butter',
    slug: 'monarch-body-butter',
    description: 'Rich, nourishing body butter inspired by monarch butterflies',
    price: 35.0,
    images: [{ url: '/api/placeholder/200/200', alt: 'Monarch Body Butter' }],
    rating: 4.8,
    reviewCount: 124,
    badges: [{ type: 'vegan' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
];

export const WishlistPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const [isSharing, setIsSharing] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleAddToCart = (product: Product) => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.name);
    // This would integrate with the existing cart context
  };

  const handleShareWishlist = async () => {
    setIsSharing(true);
    try {
      // Create shareable URL
      const shareUrl = `${window.location.origin}/wishlist/${user.id}`;

      if (navigator.share) {
        await navigator.share({
          title: `${user.name}'s Wishlist - Noura's Butterflies`,
          text: 'Check out my favorite beauty products!',
          url: shareUrl,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Wishlist link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing wishlist:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleBuyAll = () => {
    // TODO: Add all wishlist items to cart
    console.log('Add all to cart');
    // This would add all items to the cart and redirect to checkout
  };

  const handleBrowseProducts = () => {
    navigate('/products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">My Fluttering Favorites</h1>
              <p className="text-gray-600">
                {wishlist.length === 0
                  ? 'Your wishlist is empty. Start adding some beautiful products!'
                  : `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`}
              </p>
            </div>

            {wishlist.length > 0 && (
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                <Button
                  variant="outline"
                  onClick={handleShareWishlist}
                  disabled={isSharing}
                  className="text-pink-600 border-pink-600 hover:bg-pink-50"
                >
                  <span className="material-symbols-rounded text-lg mr-1">share</span>
                  {isSharing ? 'Sharing...' : 'Share Wishlist'}
                </Button>

                <Button onClick={handleBuyAll} className="bg-pink-500 hover:bg-pink-600 text-white">
                  <span className="material-symbols-rounded text-lg mr-1">shopping_cart</span>
                  Buy All
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((item) => (
                <WishlistProductCard
                  key={item.id}
                  product={item.product}
                  onRemove={removeFromWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 mb-12">
            <div className="mb-6">
              <span className="material-symbols-rounded text-8xl text-gray-300">
                favorite_border
              </span>
            </div>
            <h2 className="text-2xl font-serif text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding your favorite butterfly-inspired beauty products to create your perfect
              wishlist.
            </p>
            <Button
              onClick={handleBrowseProducts}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8"
            >
              Browse Products
            </Button>
          </div>
        )}

        {/* Recommendations Section */}
        {wishlist.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-serif text-gray-900 mb-2">Pairs Beautifully With...</h2>
              <p className="text-gray-600">
                Based on your wishlist, we think you'll love these products too
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockRecommendations.map((product) => (
                <WishlistProductCard
                  key={product.id}
                  product={product}
                  onRemove={() => {}} // No remove button for recommendations
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}

        {/* Clear Wishlist Action */}
        {wishlist.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <span className="material-symbols-rounded text-lg mr-1">delete_sweep</span>
              Clear Wishlist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
