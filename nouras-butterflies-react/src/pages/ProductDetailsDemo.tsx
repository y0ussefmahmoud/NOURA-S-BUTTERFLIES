import React, { useState } from 'react';
import { ProductGallery, ProductInfo } from '../components/product';
import { Button } from '../components/ui/Button';
import { Rating } from '../components/ui/Rating';
import { mockProducts } from '../data/mockProducts';
import type { ProductVariant } from '../types/product';

const ProductDetailsDemo: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    'description' | 'ingredients' | 'how-to-use' | 'reviews'
  >('description');

  // Use the first product as demo
  const product = mockProducts[0];

  // Set initial variant
  React.useEffect(() => {
    if (product.variants.length > 0) {
      const inStockVariant = product.variants.find((v) => v.inStock);
      setSelectedVariant(inStockVariant || product.variants[0]);
    }
  }, [product]);

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`, selectedVariant);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/checkout';
  };

  const suggestedProducts = mockProducts.slice(1, 4);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-gray-900">
                Noura's Butterflies
              </a>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-primary transition-colors">
                ← Back to Products
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </a>
            <span className="text-gray-400">/</span>
            <a href="/products" className="text-gray-500 hover:text-gray-700">
              Products
            </a>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              badges={product.badges.slice(0, 2)}
              onImageClick={(index) => console.log('Image clicked:', index)}
              showThumbnails={product.images.length > 1}
              thumbnailPosition="left"
            />
          </div>

          {/* Product Info */}
          <div>
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              quantity={quantity}
              onVariantChange={handleVariantChange}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Product Details Tabs */}
        <section className="bg-white rounded-2xl p-8 mb-16">
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'ingredients', label: 'Ingredients' },
                { id: 'how-to-use', label: 'How to Use' },
                { id: 'reviews', label: `Reviews (${product.reviewCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Product Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                <p className="text-gray-600 leading-relaxed">
                  Experience the transformative power of our butterfly-inspired beauty products.
                  Each formula is carefully crafted with the finest ingredients to help you reveal
                  your natural beauty and embrace your unique transformation journey.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <span className="material-symbols-rounded text-3xl text-primary mb-2 block">
                      eco
                    </span>
                    <h4 className="font-semibold mb-1">100% Vegan</h4>
                    <p className="text-sm text-gray-600">Cruelty-free formulas</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-rounded text-3xl text-primary mb-2 block">
                      science
                    </span>
                    <h4 className="font-semibold mb-1">Dermatologist Tested</h4>
                    <p className="text-sm text-gray-600">Safe for all skin types</p>
                  </div>
                  <div className="text-center">
                    <span className="material-symbols-rounded text-3xl text-primary mb-2 block">
                      recycle
                    </span>
                    <h4 className="font-semibold mb-1">Sustainable Packaging</h4>
                    <p className="text-sm text-gray-600">Eco-friendly materials</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Key Ingredients</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Butterfly Pea Extract</h4>
                    <p className="text-sm text-gray-600">
                      Rich in antioxidants that protect and nourish your skin.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Rosehip Oil</h4>
                    <p className="text-sm text-gray-600">
                      Promotes cell regeneration and improves skin texture.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Vitamin E</h4>
                    <p className="text-sm text-gray-600">
                      Powerful antioxidant that fights free radical damage.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Hyaluronic Acid</h4>
                    <p className="text-sm text-gray-600">
                      Provides intense hydration and plumps the skin.
                    </p>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Full Ingredients List</h4>
                  <p className="text-sm text-gray-600">
                    Aqua, Caprylic/Capric Triglyceride, Butterfly Pea Extract, Rosehip Oil, Vitamin
                    E, Hyaluronic Acid, Glycerin, Phenoxyethanol, Ethylhexylglycerin, Fragrance,
                    Citronellol, Geraniol, Linalool.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'how-to-use' && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">How to Use</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Prepare Your Canvas</h4>
                      <p className="text-sm text-gray-600">
                        Start with clean, dry skin. Apply your favorite moisturizer and let it
                        absorb completely.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Apply the Product</h4>
                      <p className="text-sm text-gray-600">
                        Using gentle, sweeping motions, apply the product to your skin. Build up
                        coverage as desired.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Blend and Set</h4>
                      <p className="text-sm text-gray-600">
                        Blend edges seamlessly for a natural finish. Set with powder if desired for
                        longer wear.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold mb-2 text-yellow-800">Pro Tips</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Use less than you think you need - our formulas are highly pigmented</li>
                    <li>• Warm the product between fingers for smoother application</li>
                    <li>• Layer thin coats for buildable coverage</li>
                    <li>• Store in a cool, dry place away from direct sunlight</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Customer Reviews</h3>
                  <Button variant="primary" size="sm">
                    Write a Review
                  </Button>
                </div>

                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{product.rating}</div>
                    <Rating value={product.rating} size="md" readonly />
                    <div className="text-sm text-gray-600 mt-1">{product.reviewCount} reviews</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 w-3">{stars}</span>
                        <span className="material-symbols-rounded text-sm text-yellow-400">
                          star
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${stars === 5 ? 60 : stars === 4 ? 25 : stars === 3 ? 10 : stars === 2 ? 3 : 2}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-8">
                          {stars === 5
                            ? '60%'
                            : stars === 4
                              ? '25%'
                              : stars === 3
                                ? '10%'
                                : stars === 2
                                  ? '3%'
                                  : '2%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Rating value={5 - (i - 1)} size="sm" readonly />
                        <span className="text-sm text-gray-600">Verified Purchase</span>
                      </div>
                      <h4 className="font-semibold mb-2">
                        {i === 1
                          ? 'Absolutely Love This Product!'
                          : i === 2
                            ? 'Great Quality'
                            : 'Good Value'}
                      </h4>
                      <p className="text-gray-600 mb-2">
                        {i === 1
                          ? 'This product has transformed my beauty routine. The quality is exceptional and it lasts all day. Highly recommend!'
                          : i === 2
                            ? 'Really impressed with the quality and packaging. The product itself is amazing and works exactly as described.'
                            : 'Good product for the price point. Does what it claims and the shipping was fast.'}
                      </p>
                      <div className="text-sm text-gray-500">
                        Sarah M. • {i === 1 ? '2 days ago' : i === 2 ? '1 week ago' : '2 weeks ago'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Suggested Products */}
        <section>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suggestedProducts.map((suggestedProduct) => (
              <div
                key={suggestedProduct.id}
                className="bg-white rounded-2xl overflow-hidden shadow-soft-card hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/5] bg-gray-50">
                  <img
                    src={suggestedProduct.images[0]?.url}
                    alt={suggestedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{suggestedProduct.name}</h4>
                  <div className="flex items-center gap-2 mb-3">
                    <Rating value={suggestedProduct.rating} size="sm" readonly />
                    <span className="text-sm text-gray-500">({suggestedProduct.reviewCount})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">
                      ${suggestedProduct.price.toFixed(2)}
                    </span>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetailsDemo;
