import React, { useState } from 'react';
import { ProductGrid, QuickViewModal } from '../components/product';
import { Button } from '../components/ui/Button';
import { mockProducts } from '../data/mockProducts';
import type { Product, ProductVariant } from '../types/product';

const ProductCatalogDemo: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<
    Array<{ productId: string; quantity: number; variant?: ProductVariant }>
  >([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleAddToCart = (productId: string) => {
    setCart((prev) => [...prev, { productId, quantity: 1 }]);
    // Show toast notification
    console.log(`Added product ${productId} to cart`);
  };

  const handleQuickView = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      setQuickViewProduct(product);
    }
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleQuickViewAddToCart = (
    productId: string,
    quantity: number,
    variant?: ProductVariant
  ) => {
    setCart((prev) => [...prev, { productId, quantity, variant }]);
    console.log(`Added ${quantity} of product ${productId} to cart`, variant);
  };

  const editorialCardProps = {
    title: 'Transform Your Beauty Routine',
    quote:
      'Like a butterfly emerging from its chrysalis, discover your true beauty with our transformative products.',
    ctaText: 'Explore Our Philosophy',
    ctaHref: '/about',
    icon: 'flutter_dash',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Noura's Butterflies</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                Shop
              </a>
              <a href="#" className="text-gray-700 hover:text-primary transition-colors">
                About
              </a>
              <button className="relative p-2 text-gray-700 hover:text-primary transition-colors">
                <span className="material-symbols-rounded">favorite</span>
                {favorites.size > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.size}
                  </span>
                )}
              </button>
              <button className="relative p-2 text-gray-700 hover:text-primary transition-colors">
                <span className="material-symbols-rounded">shopping_bag</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/20 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Butterfly-Inspired Beauty
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of transformative beauty products that celebrate the
            metamorphosis of self-care and self-expression.
          </p>
          <Button variant="primary" size="lg">
            Shop All Products
          </Button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Filter:</span>
              <button className="px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-colors">
                All Products
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                New Arrivals
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                Bestsellers
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                Vegan
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort:</span>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
                <option>Best Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">All Products</h3>
          <p className="text-gray-600">Showing {mockProducts.length} products</p>
        </div>

        <ProductGrid
          products={mockProducts}
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap="lg"
          onAddToCart={handleAddToCart}
          onQuickView={handleQuickView}
          onToggleFavorite={handleToggleFavorite}
          editorialCardIndex={2}
          editorialCardProps={editorialCardProps}
        />
      </main>

      {/* Pagination */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-center space-x-2">
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleQuickViewAddToCart}
      />
    </div>
  );
};

export default ProductCatalogDemo;
