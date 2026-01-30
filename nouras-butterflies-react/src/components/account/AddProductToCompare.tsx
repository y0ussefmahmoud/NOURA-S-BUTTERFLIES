import React, { useState, useEffect } from 'react';
import type { Product } from '../../types/product';

interface AddProductToCompareProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  existingProducts: Product[];
}

// Mock products data - would normally come from API
const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Butterfly Glow Serum',
    slug: 'butterfly-glow-serum',
    description: 'A radiant serum that gives your skin a butterfly-like glow',
    price: 89.99,
    images: [{ url: '/api/placeholder/100/100', alt: 'Butterfly Glow Serum' }],
    rating: 4.8,
    reviewCount: 124,
    badges: [{ type: 'bestseller' }, { type: 'vegan' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
  {
    id: 'p2',
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
  {
    id: 'p3',
    name: 'Monarch Body Butter',
    slug: 'monarch-body-butter',
    description: 'Rich, nourishing body butter inspired by monarch butterflies',
    price: 45.0,
    images: [{ url: '/api/placeholder/100/100', alt: 'Monarch Body Butter' }],
    rating: 4.7,
    reviewCount: 156,
    badges: [{ type: 'cruelty-free' }],
    category: 'skincare',
    inStock: true,
    variants: [],
  },
  {
    id: 'p4',
    name: 'Butterfly Kiss Lip Balm',
    slug: 'butterfly-kiss-lip-balm',
    description: 'Hydrating lip balm with butterfly pea extract',
    price: 28.0,
    images: [{ url: '/api/placeholder/100/100', alt: 'Butterfly Kiss Lip Balm' }],
    rating: 4.5,
    reviewCount: 67,
    badges: [{ type: 'organic' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
  {
    id: 'p5',
    name: 'Wing Effect Eyeshadow Palette',
    slug: 'wing-effect-eyeshadow-palette',
    description: 'Versatile eyeshadow palette for butterfly-wing effects',
    price: 125.0,
    images: [{ url: '/api/placeholder/100/100', alt: 'Wing Effect Eyeshadow Palette' }],
    rating: 4.9,
    reviewCount: 203,
    badges: [{ type: 'bestseller' }, { type: 'cruelty-free' }],
    category: 'makeup',
    inStock: true,
    variants: [],
  },
];

export const AddProductToCompare: React.FC<AddProductToCompareProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);

  const existingProductIds = new Set(existingProducts.map((p) => p.id));

  useEffect(() => {
    let filtered = mockProducts.filter((product) => !existingProductIds.has(product.id));

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, existingProductIds]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'skincare', label: 'Skincare' },
    { value: 'makeup', label: 'Makeup' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-serif text-gray-900">Add Product to Compare</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <span className="material-symbols-rounded text-gray-500">close</span>
            </button>
          </div>

          {/* Search and Filter */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="material-symbols-rounded absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-rounded text-6xl text-gray-300 mb-4">
                  search_off
                </span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex space-x-4">
                      <img
                        src={product.images[0]?.url || '/api/placeholder/80/80'}
                        alt={product.images[0]?.alt || product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                          {product.name}
                        </h3>

                        <div className="flex items-center mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`material-symbols-rounded text-xs ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              >
                                {i < Math.floor(product.rating) ? 'star' : 'star_outline'}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.reviewCount})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-gray-900">
                            {formatPrice(product.price)}
                          </span>

                          <button
                            onClick={() => {
                              onAdd(product);
                              onClose();
                            }}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {existingProducts.length}/4 products selected for comparison
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
