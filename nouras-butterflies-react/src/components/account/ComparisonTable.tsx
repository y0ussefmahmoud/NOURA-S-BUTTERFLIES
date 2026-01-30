import React from 'react';
import type { Product } from '../../types/product';

interface ComparisonTableProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onAddProduct: () => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  products,
  onRemove,
  onAddProduct,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getSpecificationValue = (product: Product, spec: string) => {
    // This would normally come from product details or specifications
    // For now, we'll return mock data based on the product
    switch (spec) {
      case 'Price':
        return formatPrice(product.price);
      case 'Key Ingredients':
        return 'Butterfly Pea Extract, Vitamin C, Hyaluronic Acid';
      case 'Skin Type':
        return 'All Skin Types';
      case 'Benefit':
        return 'Brightening, Hydrating, Anti-aging';
      case 'Certification':
        return product.badges.some((b) => b.type === 'vegan')
          ? 'Vegan, Cruelty-Free'
          : 'Cruelty-Free';
      case 'Size':
        return '30ml / 1.0 fl oz';
      case 'Application':
        return 'Apply to clean skin, morning and evening';
      default:
        return 'N/A';
    }
  };

  const specifications = [
    'Price',
    'Key Ingredients',
    'Skin Type',
    'Benefit',
    'Certification',
    'Size',
    'Application',
  ];

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="material-symbols-rounded text-6xl text-gray-300 mb-4">compare</span>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products to compare</h3>
        <p className="text-gray-500 mb-6">Add products to compare their features side by side.</p>
        <button
          onClick={onAddProduct}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
        >
          Add Products
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Mobile Notice */}
      <div className="lg:hidden bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="flex items-center">
          <span className="material-symbols-rounded text-blue-600 mr-2">info</span>
          <p className="text-sm text-blue-800">Swipe horizontally to see all product details</p>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          {/* Product Headers */}
          <thead>
            <tr>
              <th className="sticky left-0 bg-gray-50 p-4 text-left font-medium text-gray-900 border-r border-gray-200">
                Product
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="p-4 text-center border-r border-gray-200 last:border-r-0"
                >
                  <div className="space-y-3">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={product.images[0]?.url || '/api/placeholder/120/120'}
                        alt={product.images[0]?.alt || product.name}
                        className="w-24 h-24 mx-auto object-cover rounded-lg"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() => onRemove(product.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        aria-label="Remove product"
                      >
                        <span className="material-symbols-rounded text-sm">close</span>
                      </button>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center justify-center">
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
                      <span className="text-xs text-gray-500 ml-1">({product.reviewCount})</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => console.log('Add to cart:', product.name)}
                      disabled={!product.inStock}
                      className={`
                        w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200
                        ${
                          product.inStock
                            ? 'bg-pink-500 hover:bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                      `}
                    >
                      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </th>
              ))}

              {/* Add Product Column */}
              {products.length < 4 && (
                <th className="p-4 border-r border-gray-200 last:border-r-0">
                  <button
                    onClick={onAddProduct}
                    className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-pink-400 hover:bg-pink-50 transition-colors duration-200"
                  >
                    <span className="material-symbols-rounded text-2xl text-gray-400 mb-2">
                      add
                    </span>
                    <span className="text-sm text-gray-600">Add Product</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>

          {/* Specification Rows */}
          <tbody>
            {specifications.map((spec, index) => (
              <tr key={spec} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="sticky left-0 p-4 font-medium text-gray-900 border-r border-gray-200">
                  {spec}
                </td>
                {products.map((product) => (
                  <td
                    key={product.id}
                    className="p-4 text-center text-sm text-gray-700 border-r border-gray-200 last:border-r-0"
                  >
                    {getSpecificationValue(product, spec)}
                  </td>
                ))}
                {products.length < 4 && (
                  <td className="p-4 text-center text-sm text-gray-400 border-r border-gray-200 last:border-r-0">
                    —
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sustainability Badges Section */}
      <div className="border-t border-gray-200 p-6 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sustainability & Ethics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2 text-sm">{product.name}</h4>
              <div className="space-y-2">
                {product.badges.map((badge, index) => (
                  <div key={index} className="flex items-center text-xs">
                    <span className="material-symbols-rounded text-green-500 mr-2 text-sm">
                      check_circle
                    </span>
                    <span className="text-gray-600">
                      {badge.text ||
                        badge.type.charAt(0).toUpperCase() + badge.type.slice(1).replace('-', ' ')}
                    </span>
                  </div>
                ))}
                {product.badges.length === 0 && (
                  <div className="text-xs text-gray-500">No specific certifications</div>
                )}
              </div>
            </div>
          ))}
          {products.length < 4 && (
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-sm text-gray-500">Add product to see badges</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
