import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductGallery } from '../components/product/ProductGallery';
import { ProductInfo } from '../components/product/ProductInfo';
import IngredientsList from '../components/product/IngredientsList';
import HowToUse from '../components/product/HowToUse';
import ReviewsSection from '../components/product/ReviewsSection';
import SuggestedProducts from '../components/product/SuggestedProducts';
import { ImageLightbox } from '../components/product/ImageLightbox';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useModals } from '../contexts/ModalsContext';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';
import { mockProducts } from '../data/mockProducts';
import type { Product, ProductVariant } from '../types/product';

const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openProductReviewModal } = useModals();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);

  const { ref: heroRef, isVisible: heroVisible } = useIntersectionObserver({ threshold: 0.1 }) as {
    ref: React.RefObject<HTMLDivElement>;
    isVisible: boolean;
  };
  const { ref: bentoRef, isVisible: bentoVisible } = useIntersectionObserver({
    threshold: 0.1,
  }) as { ref: React.RefObject<HTMLDivElement>; isVisible: boolean };
  const { ref: reviewsRef, isVisible: reviewsVisible } = useIntersectionObserver({
    threshold: 0.1,
  }) as { ref: React.RefObject<HTMLDivElement>; isVisible: boolean };
  const { ref: suggestedRef, isVisible: suggestedVisible } = useIntersectionObserver({
    threshold: 0.1,
  }) as { ref: React.RefObject<HTMLDivElement>; isVisible: boolean };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        const foundProduct = mockProducts.find((p) => p.slug === slug);
        if (!foundProduct) {
          setError('Product not found');
          return;
        }

        setProduct(foundProduct);
        // Set first variant as default if available
        if (foundProduct.variants.length > 0) {
          setSelectedVariant(foundProduct.variants[0]);
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    console.log('Adding to cart:', {
      productId: product.id,
      productName: product.name,
      variant: selectedVariant,
      quantity,
    });

    // TODO: Integrate with cart context
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // TODO: Navigate to checkout
    navigate('/checkout');
  };

  const handleQuickView = (viewedProduct: Product) => {
    // Quick View only opens modal, navigation handled by onViewDetails
  };

  const handleViewDetails = (viewedProduct: Product) => {
    navigate(`/product/${viewedProduct.slug}`);
  };

  const handleImageClick = (index: number) => {
    setLightboxInitialIndex(index);
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleWriteReview = () => {
    if (product) {
      openProductReviewModal(product);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
        <div className="animate-pulse">
          <div className="grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
            <div className="lg:col-span-7 h-96 bg-gray-200 rounded-xl" />
            <div className="lg:col-span-5 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
        <div className="text-center py-20">
          <h1 className="text-2xl font-serif text-gray-900 dark:text-white mb-4">
            {error || 'Product not found'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const suggestedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 4);

  // SEO metadata
  const seoData = useSEO('product', {
    productName: product.name,
    category: product.category,
  });

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="product"
      />
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 py-8">
      {/* Breadcrumbs would go here */}

      {/* Product Hero Section */}
      <div
        ref={heroRef}
        className={`grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 transition-all duration-700 ${
          heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} onImageClick={handleImageClick} />
        </div>
        <div className="lg:col-span-5">
          <ProductInfo
            product={product}
            selectedVariant={selectedVariant}
            quantity={quantity}
            onVariantChange={setSelectedVariant}
            onQuantityChange={setQuantity}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>

      {/* Bento Sections */}
      {product.productDetails && (
        <div
          ref={bentoRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 transition-all duration-700 ${
            bentoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {product.productDetails.ingredients && (
            <div className="lg:col-span-2">
              <IngredientsList
                ingredients={product.productDetails.ingredients}
                fullIngredientsList={product.productDetails.fullIngredientsList}
              />
            </div>
          )}

          {product.productDetails.howToUse && (
            <div className="lg:col-span-1">
              <HowToUse
                steps={product.productDetails.howToUse.steps}
                videoThumbnail={product.productDetails.howToUse.videoThumbnail}
              />
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      {product.productDetails?.reviews && (
        <div
          ref={reviewsRef}
          className={`transition-all duration-700 ${
            reviewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <ReviewsSection
            reviews={product.productDetails.reviews}
            onWriteReview={handleWriteReview}
          />
        </div>
      )}

      {/* Suggested Products */}
      <div
        ref={suggestedRef}
        className={`transition-all duration-700 ${
          suggestedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <SuggestedProducts
          products={suggestedProducts}
          onQuickView={handleQuickView}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Image Lightbox */}
      {product && (
        <ImageLightbox
          images={product.images}
          initialIndex={lightboxInitialIndex}
          isOpen={isLightboxOpen}
          onClose={handleCloseLightbox}
        />
      )}
      </div>
    </>
  );
};

export default ProductDetailsPage;
