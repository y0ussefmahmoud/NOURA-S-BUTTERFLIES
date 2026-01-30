import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import type { ShippingAddress, PaymentMethod, PaymentDetails } from '../types/cart';
import type { FormErrors } from '../types/checkout';
import { OrderSummary } from '../components/cart/OrderSummary';
import { MobileOrderSummary } from '../components/checkout/MobileOrderSummary';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { CardPaymentForm } from '../components/checkout/CardPaymentForm';
import { AddressForm } from '../components/checkout/AddressForm';
import { CheckoutTimeline } from '../components/checkout/CheckoutTimeline';
import { Button } from '../components/ui/Button';
import { Icon } from '../components/ui/Icon';
import { trackEvent } from '../utils/performance';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, applyPromoCode } = useCart();

  // Analytics tracking helper
  const trackCheckoutEvent = (action: string, properties: Record<string, any>) => {
    try {
      trackEvent('checkout', action, JSON.stringify(properties), cart.total);
    } catch (error) {
      console.error('[Checkout] Failed to track analytics event:', error);
    }
  };

  // Track checkout initiation
  React.useEffect(() => {
    if (!cart.isEmpty) {
      trackCheckoutEvent('checkout_start', {
        cartValue: cart.total,
        itemCount: cart.itemCount,
        currency: 'SAR',
        timestamp: Date.now(),
        referrer: document.referrer,
      });
    }
  }, []); // Only run once on mount

  // Form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: 'Saudi Arabia',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkout flow state
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  // Mobile swipe navigation state
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [isFormFocused, setIsFormFocused] = useState(false);
  const [isMobileSummaryCollapsed, setIsMobileSummaryCollapsed] = useState(false);
  const swipeContainerRef = useRef<HTMLDivElement>(null);

  // Step index for swipe navigation
  const stepIndex = currentStep === 'shipping' ? 0 : currentStep === 'payment' ? 1 : 2;
  const steps: Array<'shipping' | 'payment' | 'review'> = ['shipping', 'payment', 'review'];

  // Handle mobile swipe navigation with velocity detection
  const handleTouchStart = (e: React.TouchEvent) => {
    // Disable swipe during form input focus
    if (isFormFocused) return;

    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isFormFocused || !touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || isFormFocused) return;

    const distance = touchStart - touchEnd;
    const timeDiff = Date.now() - touchStartTime;
    const velocity = Math.abs(distance) / timeDiff;

    // Minimum distance and velocity for swipe
    const minDistance = 50;
    const minVelocity = 0.3;

    const isLeftSwipe = distance > minDistance || (distance > 20 && velocity > minVelocity);
    const isRightSwipe = distance < -minDistance || (distance < -20 && velocity > minVelocity);

    // Haptic feedback for successful swipe
    const triggerHapticFeedback = () => {
      if (
        'vibrate' in navigator &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        navigator.vibrate(50);
      }
    };

    // Swipe left to go to next step
    if (isLeftSwipe && stepIndex < steps.length - 1) {
      const nextStep = steps[stepIndex + 1];

      // Validate current step before proceeding
      if (nextStep === 'payment' && validateShippingForm()) {
        setCompletedSteps([...completedSteps, 'shipping']);
        setCurrentStep('payment');
        triggerHapticFeedback();
      } else if (nextStep === 'review' && validatePaymentForm()) {
        setCompletedSteps([...completedSteps, 'payment']);
        setCurrentStep('review');
        triggerHapticFeedback();
      }
    }

    // Swipe right to go to previous step
    if (isRightSwipe && stepIndex > 0) {
      const prevStep = steps[stepIndex - 1];
      setCurrentStep(prevStep);
      triggerHapticFeedback();
    }

    // Reset touch state
    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartTime(0);
  };

  // Handle form focus state to disable swipe during input
  const handleFormFocus = () => setIsFormFocused(true);
  const handleFormBlur = () => setIsFormFocused(false);

  const validateShippingForm = (): boolean => {
    const errors: FormErrors = {};

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(shippingAddress.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!shippingAddress.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }

    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }

    if (!shippingAddress.postalCode.trim()) {
      errors.postalCode = 'Postal code is required';
    }

    if (!shippingAddress.country.trim()) {
      errors.country = 'Country is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = (): boolean => {
    const errors: FormErrors = {};

    if (paymentMethod === 'credit-card') {
      if (!paymentDetails.cardholderName.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }

      if (!paymentDetails.cardNumber.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (paymentDetails.cardNumber.replace(/\s/g, '').length < 13) {
        errors.cardNumber = 'Please enter a valid card number';
      }

      if (!paymentDetails.expiryDate.trim()) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
        errors.expiryDate = 'Please use MM/YY format';
      }

      if (!paymentDetails.cvv.trim()) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
        errors.cvv = 'CVV must be 3-4 digits';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = () => {
    const stepCompletionTime = Date.now() - stepStartTime;
    
    if (validateShippingForm()) {
      setCompletedSteps([...completedSteps, 'shipping']);
      
      // Track shipping step completion
      trackCheckoutEvent('checkout_step', {
        stepName: 'shipping',
        stepNumber: 1,
        stepCompletionTime,
        cartValue: cart.total,
        success: true,
        addressProvided: !!shippingAddress.streetAddress,
        phoneProvided: !!shippingAddress.phone,
      });
      
      setCurrentStep('payment');
      setStepStartTime(Date.now());
    } else {
      // Track shipping step failure
      trackCheckoutEvent('checkout_step', {
        stepName: 'shipping',
        stepNumber: 1,
        stepCompletionTime,
        cartValue: cart.total,
        success: false,
        errors: Object.keys(formErrors),
      });
    }
  };

  const handlePaymentSubmit = () => {
    const stepCompletionTime = Date.now() - stepStartTime;
    
    if (validatePaymentForm()) {
      setCompletedSteps([...completedSteps, 'payment']);
      
      // Track payment step completion
      trackCheckoutEvent('checkout_step', {
        stepName: 'payment',
        stepNumber: 2,
        stepCompletionTime,
        cartValue: cart.total,
        success: true,
        paymentMethod,
        cardSaved: paymentDetails.saveCard,
      });
      
      setCurrentStep('review');
      setStepStartTime(Date.now());
    } else {
      // Track payment step failure
      trackCheckoutEvent('checkout_step', {
        stepName: 'payment',
        stepNumber: 2,
        stepCompletionTime,
        cartValue: cart.total,
        success: false,
        errors: Object.keys(formErrors),
        paymentMethod,
      });
    }
  };

  const handlePlaceOrder = async () => {
    const stepCompletionTime = Date.now() - stepStartTime;
    setIsSubmitting(true);
    setFormErrors({});

    try {
      // Track order placement attempt
      trackCheckoutEvent('place_order_attempt', {
        cartValue: cart.total,
        itemCount: cart.itemCount,
        paymentMethod,
        shippingAddress: shippingAddress.city,
        hasPromo: !!cart.promoCode,
      });

      // Simulate order processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate order number
      const orderNumber = `NB-${Date.now().toString().slice(-6)}`;

      // Track successful order placement
      trackCheckoutEvent('checkout_complete', {
        orderNumber,
        orderValue: cart.total,
        paymentMethod,
        shippingMethod: 'standard',
        itemCount: cart.itemCount,
        hasPromo: !!cart.promoCode,
        discountAmount: cart.discount,
        totalCheckoutTime: Date.now() - (window as any).checkoutStartTime || 0,
        stepCompletionTime,
      });

      // Clear cart and navigate to confirmation
      clearCart();
      navigate(`/order-confirmation/${orderNumber}`, {
        state: {
          orderNumber,
          shippingAddress,
          paymentMethod,
          cart,
        },
      });
    } catch (error) {
      // Track order placement failure
      trackCheckoutEvent('place_order_failed', {
        cartValue: cart.total,
        itemCount: cart.itemCount,
        paymentMethod,
        error: error instanceof Error ? error.message : 'Unknown error',
        stepCompletionTime,
      });
      
      setFormErrors({ submit: 'Failed to place order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToCart = () => {
    // Track checkout abandonment
    trackCheckoutEvent('checkout_abandon', {
      step: currentStep,
      cartValue: cart.total,
      itemCount: cart.itemCount,
      reason: 'back_to_cart',
      timeSpent: Date.now() - (window as any).checkoutStartTime || 0,
    });
    
    navigate('/cart');
  };

  const handleEditShipping = () => {
    setCurrentStep('shipping');
  };

  const handleEditPayment = () => {
    setCurrentStep('payment');
  };

  // Track checkout start time
  React.useEffect(() => {
    (window as any).checkoutStartTime = Date.now();
  }, []);

  // Track form field interactions
  const trackFieldInteraction = (fieldName: string, fieldType: string) => {
    trackCheckoutEvent('form_field_interaction', {
      fieldName,
      fieldType,
      step: currentStep,
      timestamp: Date.now(),
    });
  };

  // Track payment method selection
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    trackCheckoutEvent('payment_method_selected', {
      method,
      previousMethod: paymentMethod,
      cartValue: cart.total,
    });
    setPaymentMethod(method);
  };

  // Track promo code application
  const handlePromoCodeApply = async (code: string) => {
    const success = await applyPromoCode(code);
    
    trackCheckoutEvent('promo_code_applied', {
      code,
      success,
      cartValue: cart.total,
      step: 'shipping',
    });
    
    return success;
  };

  if (cart.isEmpty) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 flex items-center justify-center">
        <div className="text-center">
          <Icon name="shopping_cart" size="xl" className="text-text-muted mb-4" />
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
            Your cart is empty
          </h2>
          <p className="text-text-muted mb-4">Add some products to your cart before checkout</p>
          <Button onClick={handleBackToCart}>Back to Cart</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-pink/20 to-accent-purple/20">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Mobile Progress Bar */}
        <div className="md:hidden sticky top-16 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-text-dark dark:text-text-light">
              Step {currentStep === 'shipping' ? '1' : currentStep === 'payment' ? '2' : '3'} of 3
            </span>
            <span className="text-xs text-text-muted">
              {currentStep === 'shipping'
                ? 'Shipping'
                : currentStep === 'payment'
                  ? 'Payment'
                  : 'Review'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width:
                  currentStep === 'shipping'
                    ? '33.33%'
                    : currentStep === 'payment'
                      ? '66.66%'
                      : '100%',
              }}
            />
          </div>
        </div>

        {/* Breadcrumbs - Desktop Only */}
        <div className="hidden md:flex items-center gap-2 text-sm text-text-muted mb-6">
          <button onClick={handleBackToCart} className="hover:text-primary transition-colors">
            Cart
          </button>
          <Icon name="chevron_right" size="sm" />
          <span className="text-text-dark dark:text-text-light">Information</span>
          <Icon name="chevron_right" size="sm" />
          <span className="text-text-dark dark:text-text-light">Payment</span>
          <Icon name="chevron_right" size="sm" />
          <span className="text-text-dark dark:text-text-light">Review</span>
        </div>

        {/* Checkout Timeline - Desktop Only */}
        <div className="hidden md:block mb-8">
          <CheckoutTimeline currentStep={currentStep} completedSteps={completedSteps as any[]} />
        </div>

        {/* Main Content - Mobile First with Swipe Container */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8">
          {/* Swipeable Content Container */}
          <div
            ref={swipeContainerRef}
            className="lg:col-span-8 order-2 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Shipping Information */}
            {currentStep === 'shipping' && (
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                <AddressForm
                  address={shippingAddress}
                  onChange={setShippingAddress}
                  errors={formErrors}
                  onFocus={handleFormFocus}
                  onBlur={handleFormBlur}
                />
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button
                    onClick={handleBackToCart}
                    variant="outline"
                    className="w-full sm:w-auto touch-target"
                  >
                    Back to Cart
                  </Button>
                  <Button onClick={handleShippingSubmit} className="flex-1 touch-target">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {currentStep === 'payment' && (
              <div className="space-y-4 md:space-y-6">
                {/* Shipping Address Summary */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-text-dark dark:text-text-light">
                      Shipping Information
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditShipping}
                      className="touch-target"
                    >
                      Change
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-text-dark dark:text-text-light">
                      {shippingAddress.fullName}
                    </p>
                    <p className="text-text-muted">{shippingAddress.phone}</p>
                    <p className="text-text-muted">{shippingAddress.streetAddress}</p>
                    <p className="text-text-muted">
                      {shippingAddress.city}, {shippingAddress.postalCode}
                    </p>
                    <p className="text-text-muted">{shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <PaymentMethodSelector
                    selectedMethod={paymentMethod}
                    onChange={setPaymentMethod}
                  />
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'credit-card' && (
                  <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                    <CardPaymentForm
                      paymentDetails={paymentDetails}
                      onChange={setPaymentDetails}
                      errors={formErrors}
                      onFocus={handleFormFocus}
                      onBlur={handleFormBlur}
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => setCurrentStep('shipping')}
                    variant="outline"
                    className="w-full sm:w-auto touch-target"
                  >
                    Back
                  </Button>
                  <Button onClick={handlePaymentSubmit} className="flex-1 touch-target">
                    Review Order
                  </Button>
                </div>
              </div>
            )}

            {/* Order Review */}
            {currentStep === 'review' && (
              <div className="space-y-4 md:space-y-6">
                {/* Final Review */}
                <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 p-4 md:p-6">
                  <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-4">
                    Order Review
                  </h3>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-text-dark dark:text-text-light mb-2">
                      Shipping Address
                    </h4>
                    <div className="text-sm text-text-muted">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.streetAddress}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-text-dark dark:text-text-light mb-2">
                      Payment Method
                    </h4>
                    <div className="text-sm text-text-muted">
                      <p className="capitalize">
                        {paymentMethod === 'credit-card'
                          ? 'Credit/Debit Card'
                          : paymentMethod === 'mada'
                            ? 'Mada'
                            : paymentMethod === 'fawry'
                              ? 'Fawry Pay'
                              : 'Cash on Delivery'}
                      </p>
                      {paymentMethod === 'credit-card' && paymentDetails.cardNumber && (
                        <p>•••• •••• •••• {paymentDetails.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                  </div>

                  {/* Rewards Info */}
                  <div className="p-4 bg-accent-pink/10 dark:bg-accent-pink/5 rounded-lg border border-accent-pink/20">
                    <div className="flex items-center gap-2 text-sm text-text-dark dark:text-text-light">
                      <Icon name="stars" size="sm" className="text-primary" />
                      <span>
                        You will earn <strong>{Math.floor(cart.total * 0.01)}</strong> points with
                        this purchase
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleEditPayment}
                    variant="outline"
                    className="w-full sm:w-auto touch-target"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    loading={isSubmitting}
                    className="flex-1 touch-target"
                    size="lg"
                  >
                    Place Order
                  </Button>
                </div>

                {formErrors.submit && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{formErrors.submit}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Order Summary - Sticky Bottom */}
          <div className="lg:hidden order-3">
            <MobileOrderSummary
              cart={cart}
              onApplyPromo={applyPromoCode}
              buttonText={currentStep === 'review' ? 'Place Order' : undefined}
              showPromoInput={currentStep === 'shipping'}
              isCollapsed={isMobileSummaryCollapsed}
              onToggleCollapse={() => setIsMobileSummaryCollapsed(!isMobileSummaryCollapsed)}
              onButtonClick={currentStep === 'review' ? handlePlaceOrder : undefined}
            />
          </div>

          {/* Order Summary Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-4 order-3">
            <OrderSummary
              cart={cart}
              onApplyPromo={applyPromoCode}
              buttonText={currentStep === 'review' ? 'Place Order' : undefined}
              showPromoInput={currentStep === 'shipping'}
              isSticky={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
