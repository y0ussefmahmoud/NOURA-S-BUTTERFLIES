import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ProgressStepper } from '../components/layout/ProgressStepper';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { SEO } from '../components/SEO';
import { useSEO } from '../hooks/useSEO';
import { cn } from '../utils/cn';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, applyPromoCode, isEmpty } = useCart();

  // SEO metadata
  const seoData = useSEO('cart');

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/catalog');
  };

  // Progress steps for cart flow
  const steps = [
    { id: 'bag', label: 'Bag', icon: 'shopping_basket' },
    { id: 'details', label: 'Details', icon: 'person' },
    { id: 'shipping', label: 'Shipping', icon: 'local_shipping' },
    { id: 'payment', label: 'Payment', icon: 'payments' },
  ];

  if (isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20">
        <div className="container mx-auto px-4 py-8">
          {/* Progress Stepper */}
          <ProgressStepper steps={steps} currentStep={0} />

          {/* Empty Cart State */}
          <div className="max-w-2xl mx-auto text-center py-16">
            {/* Decorative Butterfly */}
            <div className="relative mb-8">
              <Icon
                name="flutter_dash"
                size="xl"
                className="text-primary/20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-12"
              />
              <Icon name="flutter_dash" size="lg" className="text-primary/40 relative z-10" />
            </div>

            <h1 className="text-3xl font-bold text-text-dark dark:text-text-light mb-4">
              Your Shopping Bag is Empty
            </h1>

            <p className="text-lg text-text-muted mb-8 max-w-md mx-auto">
              Discover our beautiful collection of butterfly-inspired products and fill your bag
              with magic!
            </p>

            <Button onClick={handleContinueShopping} size="lg" leftIcon="shopping_bag">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20">
      <div className="container mx-auto px-4 py-8">
        {/* Progress Stepper */}
        <ProgressStepper steps={steps} currentStep={0} />

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-dark dark:text-text-light mb-2">
            Shopping Bag
          </h1>
          <p className="text-text-muted">Review your items and proceed to checkout</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                <Icon name="eco" size="sm" />
                <span className="text-sm">Vegan</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                <Icon name="cruelty_free" size="sm" />
                <span className="text-sm">Cruelty Free</span>
              </div>
              <div className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors">
                <Icon name="recycling" size="sm" />
                <span className="text-sm">Eco-Pack</span>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-4">
            <OrderSummary
              cart={cart}
              onApplyPromo={applyPromoCode}
              onCheckout={handleCheckout}
              isSticky={true}
            />
          </div>
        </div>

        {/* Decorative Butterfly Element */}
        <div className="fixed bottom-10 right-10 opacity-10 pointer-events-none">
          <Icon name="flutter_dash" size="xl" className="text-primary transform rotate-45" />
        </div>
      </div>
    </div>
    </>
  );
};

export default CartPage;
