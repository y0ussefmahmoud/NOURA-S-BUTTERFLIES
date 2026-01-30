import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ComparisonTable } from '../components/account/ComparisonTable';
import { AddProductToCompare } from '../components/account/AddProductToCompare';
import type { Product } from '../types/product';

export const ComparisonPage: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load comparison products from localStorage on mount
  useEffect(() => {
    try {
      const storedComparison = localStorage.getItem('nouras-comparison');
      if (storedComparison) {
        const parsedComparison = JSON.parse(storedComparison);
        setProducts(parsedComparison);
      }
    } catch (error) {
      console.error('Error loading comparison from localStorage:', error);
    }
  }, []);

  // Save comparison products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('nouras-comparison', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving comparison to localStorage:', error);
    }
  }, [products]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleRemoveProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  const handleAddProduct = (product: Product) => {
    if (products.length >= 4) {
      alert('You can compare up to 4 products at a time.');
      return;
    }

    if (!products.some((p) => p.id === product.id)) {
      setProducts((prev) => [...prev, product]);
    }
  };

  const handleOpenAddModal = () => {
    if (products.length >= 4) {
      alert('You can compare up to 4 products at a time. Please remove a product first.');
      return;
    }
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif text-gray-900 mb-2">Compare Your Favorites</h1>
              <p className="text-gray-600">
                Compare up to 4 products side by side to make the perfect choice
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              disabled={products.length >= 4}
              className={`
                mt-4 sm:mt-0 px-6 py-2 rounded-lg font-medium transition-colors duration-200
                ${
                  products.length >= 4
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-pink-500 hover:bg-pink-600 text-white'
                }
              `}
            >
              <span className="material-symbols-rounded text-lg mr-1">add</span>
              Add Product
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Comparison Progress</span>
              <span className="text-sm text-gray-500">{products.length}/4 products</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(products.length / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable
          products={products}
          onRemove={handleRemoveProduct}
          onAddProduct={handleOpenAddModal}
        />

        {/* Tips Section */}
        {products.length > 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start">
              <span className="material-symbols-rounded text-blue-600 text-xl mr-3 mt-0.5">
                lightbulb
              </span>
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Comparison Tips</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Swipe horizontally on mobile to see all product details</li>
                  <li>• Look for key ingredients that match your skin type</li>
                  <li>• Consider sustainability certifications that matter to you</li>
                  <li>• Compare prices and sizes to find the best value</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Empty State Tips */}
        {products.length === 0 && (
          <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-8">
            <div className="text-center">
              <span className="material-symbols-rounded text-5xl text-pink-500 mb-4">
                compare_arrows
              </span>
              <h3 className="text-xl font-serif text-gray-900 mb-3">
                How to Use Product Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="material-symbols-rounded text-pink-500 mr-2">looks_one</span>
                    <h4 className="font-medium text-gray-900">Add Products</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Click "Add Product" to select up to 4 items to compare
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="material-symbols-rounded text-pink-500 mr-2">looks_two</span>
                    <h4 className="font-medium text-gray-900">Review Details</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Compare ingredients, benefits, and certifications side by side
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="material-symbols-rounded text-pink-500 mr-2">looks_3</span>
                    <h4 className="font-medium text-gray-900">Make Choice</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    Add your favorite to cart or save to wishlist
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductToCompare
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
        existingProducts={products}
      />
    </div>
  );
};
