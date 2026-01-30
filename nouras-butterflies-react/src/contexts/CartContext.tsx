// Cart Context for Noura's Butterflies
// Provides shopping cart state management and operations

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem, PromoCode } from '../types/cart';
import { logger } from '../utils/logger';
import { trackEvent } from '../utils/performance';

// Cart context interface
interface CartContextType {
  // State
  cartItems: CartItem[];
  promoCode: PromoCode | undefined;
  isCartOpen: boolean;

  // Computed values
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount: number;
  isEmpty: boolean;

  // Actions
  addToCart: (
    productId: string,
    productTitle: string,
    productImage: string,
    price: number,
    quantity?: number,
    variant?: CartItem['variant']
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => Promise<boolean>;
  removePromoCode: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Cart object
  cart: Cart;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Constants
const SHIPPING_THRESHOLD = 200; // Free shipping over $200
const SHIPPING_RATE = 15; // Standard shipping rate
const TAX_RATE = 0.15; // 15% tax rate

// Cart Provider component
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  logger.debug('[Context] Initializing CartProvider...');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<PromoCode | undefined>();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    logger.debug('[Cart] Loading cart from localStorage...');
    try {
      const storedCart = localStorage.getItem('nouras-cart');
      const storedPromo = localStorage.getItem('nouras-promo');

      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          if (Array.isArray(parsedCart) && parsedCart.length >= 0) {
            setCartItems(parsedCart);
            logger.debug('[Cart] Loaded', parsedCart.length, 'items from cart');
          } else {
            logger.warn('[Cart] Invalid cart data structure, using empty cart');
          }
        } catch (error) {
          logger.error('[Cart] Failed to parse stored cart:', error);
        }
      } else {
        logger.debug('[Cart] No stored cart found');
      }

      if (storedPromo) {
        try {
          const parsedPromo = JSON.parse(storedPromo);
          if (parsedPromo && parsedPromo.code) {
            setPromoCode(parsedPromo);
            logger.debug('[Cart] Loaded promo code:', parsedPromo.code);
          } else {
            logger.warn('[Cart] Invalid promo code data');
          }
        } catch (error) {
          logger.error('[Cart] Failed to parse stored promo code:', error);
        }
      } else {
        logger.debug('[Cart] No stored promo code found');
      }
    } catch (error) {
      logger.error('[Cart] Error loading cart data:', error);
    } finally {
      setIsInitialized(true);
      logger.debug('[Cart] Cart initialization completed');
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (cartItems && cartItems.length >= 0) {
          localStorage.setItem('nouras-cart', JSON.stringify(cartItems));
          logger.debug('[Cart] Saved', cartItems.length, 'items to localStorage');
        }
      } catch (error) {
        logger.error('[Cart] Failed to save cart to localStorage:', error);
      }
    }
  }, [cartItems, isInitialized]);

  // Save promo code to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        if (promoCode) {
          localStorage.setItem('nouras-promo', JSON.stringify(promoCode));
          logger.debug('[Cart] Saved promo code:', promoCode.code);
        } else {
          localStorage.removeItem('nouras-promo');
          logger.debug('[Cart] Removed promo code from localStorage');
        }
      } catch (error) {
        logger.error('[Cart] Failed to save promo code to localStorage:', error);
      }
    }
  }, [promoCode, isInitialized]);

  /**
   * Computed cart totals based on items and promo discounts.
   * Includes shipping thresholds, taxable amounts, and effective discounts.
   */
  const itemCount = cartItems ? cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0) : 0;

  const subtotal = cartItems
    ? cartItems.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0)
    : 0;

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : cartItems?.length > 0 ? SHIPPING_RATE : 0;

  const productDiscount = promoCode
    ? promoCode.type === 'percentage'
      ? subtotal * (promoCode.discount / 100)
      : promoCode.type === 'fixed' && promoCode.code !== 'FREESHIP'
        ? promoCode.discount
        : 0
    : 0;

  const shippingDiscount = promoCode?.code === 'FREESHIP' ? SHIPPING_RATE : 0;

  const taxableAmount = Math.max(0, subtotal - productDiscount);
  const tax = taxableAmount * TAX_RATE;

  const effectiveShipping = Math.max(0, shipping - shippingDiscount);

  const discount = productDiscount + shippingDiscount;

  const total = subtotal + effectiveShipping + tax - productDiscount;

  const isEmpty = !cartItems || cartItems.length === 0;

  // Cart object
  const cart: Cart = {
    items: cartItems,
    itemCount,
    subtotal,
    shipping: effectiveShipping,
    tax,
    total,
    discount,
    promoCode,
    isEmpty,
  };

  // Analytics tracking helper
  const trackCartEvent = (action: string, properties: Record<string, any>) => {
    try {
      trackEvent('cart', action, JSON.stringify(properties), properties['cartValue'] || 0);
    } catch (error) {
      logger.error('[Cart] Failed to track analytics event:', error);
    }
  };

  // Analytics helper methods
  const getAddToCartSource = (): string => {
    const referrer = document.referrer;
    const url = window.location.href;
    
    if (url.includes('/search')) return 'search';
    if (url.includes('/category')) return 'category';
    if (url.includes('/product/')) return 'product_page';
    if (url.includes('/recommendations')) return 'recommendation';
    if (referrer.includes('google.com')) return 'google_search';
    if (referrer.includes('facebook.com') || referrer.includes('instagram.com')) return 'social';
    if (referrer.includes('email')) return 'email';
    return 'direct';
  };

  const getPromoCodeSource = (): string => {
    const url = window.location.href;
    if (url.includes('/checkout')) return 'checkout';
    if (url.includes('/cart')) return 'cart';
    if (document.referrer.includes('email')) return 'email';
    if (document.referrer.includes('social')) return 'social';
    return 'manual';
  };

  const getCurrentCheckoutStep = (): string => {
    const url = window.location.href;
    if (url.includes('/checkout')) return 'checkout';
    if (url.includes('/cart')) return 'cart';
    return 'other';
  };

  // Actions
  /**
   * Add an item to the cart with optional variant and quantity.
   * Validates required fields before mutating cart state.
   */
  const addToCart = (
    productId: string,
    productTitle: string,
    productImage: string,
    price: number,
    quantity = 1,
    variant?: CartItem['variant']
  ) => {
    if (!productId || !productTitle || price <= 0) {
      logger.error('[Cart] Invalid product data for addToCart:', {
        productId,
        productTitle,
        price,
      });
      return;
    }

    logger.debug('[Cart] Adding to cart:', { productId, productTitle, quantity, price });

    const previousCartValue = subtotal;
    const previousItemCount = itemCount;
    const isExistingItem = cartItems?.some(
      (item) =>
        item?.productId === productId && JSON.stringify(item?.variant) === JSON.stringify(variant)
    );

    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) {
        logger.warn('[Cart] Cart items is not an array, resetting');
        prevItems = [];
      }

      const existingItem = prevItems.find(
        (item) =>
          item?.productId === productId && JSON.stringify(item?.variant) === JSON.stringify(variant)
      );

      if (existingItem) {
        logger.debug('[Cart] Updating existing item:', existingItem.id);
        return prevItems.map((item) =>
          item?.id === existingItem.id
            ? { ...item, quantity: (item?.quantity || 0) + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          productId,
          productTitle,
          productImage,
          variant,
          quantity: Math.max(1, quantity),
          price,
        };
        logger.debug('[Cart] Adding new item:', newItem.id);
        return [...prevItems, newItem];
      }
    });

    // Track analytics event
    trackCartEvent('add_item', {
      productId,
      productTitle,
      price,
      quantity,
      variant,
      previousCartValue,
      newCartValue: previousCartValue + (price * quantity),
      previousItemCount,
      newItemCount: previousItemCount + quantity,
      isExistingItem,
      referrer: document.referrer,
      source: getAddToCartSource(),
    });
  };

  const removeFromCart = (itemId: string) => {
    if (!itemId) {
      logger.error('[Cart] Cannot remove item: no itemId provided');
      return;
    }

    logger.debug('[Cart] Removing item:', itemId);
    
    const itemToRemove = cartItems?.find(item => item?.id === itemId);
    const previousCartValue = subtotal;
    const previousItemCount = itemCount;
    
    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) {
        logger.warn('[Cart] Cart items is not an array during removeFromCart');
        return [];
      }
      return prevItems.filter((item) => item?.id !== itemId);
    });

    // Track analytics event
    if (itemToRemove) {
      trackCartEvent('remove_item', {
        itemId,
        productId: itemToRemove.productId,
        productTitle: itemToRemove.productTitle,
        price: itemToRemove.price,
        quantity: itemToRemove.quantity,
        previousCartValue,
        newCartValue: previousCartValue - (itemToRemove.price * itemToRemove.quantity),
        previousItemCount,
        newItemCount: previousItemCount - itemToRemove.quantity,
        reason: 'user_removed',
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (!itemId) {
      logger.error('[Cart] Cannot update quantity: no itemId provided');
      return;
    }

    if (quantity <= 0) {
      logger.debug('[Cart] Quantity <= 0, removing item:', itemId);
      removeFromCart(itemId);
      return;
    }

    logger.debug('[Cart] Updating quantity:', itemId, 'to', quantity);
    
    const itemToUpdate = cartItems?.find(item => item?.id === itemId);
    const previousQuantity = itemToUpdate?.quantity || 0;
    const previousCartValue = subtotal;
    const isIncrease = quantity > previousQuantity;
    
    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) {
        logger.warn('[Cart] Cart items is not an array during updateQuantity');
        return [];
      }

      return prevItems.map((item) =>
        item?.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      );
    });

    // Track analytics event
    if (itemToUpdate && previousQuantity !== quantity) {
      const quantityChange = quantity - previousQuantity;
      trackCartEvent('update_quantity', {
        itemId,
        productId: itemToUpdate.productId,
        productTitle: itemToUpdate.productTitle,
        previousQuantity,
        newQuantity: quantity,
        quantityChange,
        price: itemToUpdate.price,
        cartValueImpact: quantityChange * itemToUpdate.price,
        previousCartValue,
        newCartValue: previousCartValue + (quantityChange * itemToUpdate.price),
        isIncrease,
        isDecrease: !isIncrease,
      });
    }
  };

  const clearCart = () => {
    logger.debug('[Cart] Clearing cart');
    
    const previousCartValue = subtotal;
    const previousItemCount = itemCount;
    const itemsCleared = cartItems?.length || 0;
    
    setCartItems([]);
    setPromoCode(undefined);

    // Track analytics event
    trackCartEvent('clear_cart', {
      previousCartValue,
      previousItemCount,
      itemsCleared,
      reason: 'user_cleared',
      checkoutStep: getCurrentCheckoutStep(),
    });
  };

  /**
   * Validate and apply promo codes against the current subtotal.
   * Returns true when a promo is successfully applied.
   */
  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!code || typeof code !== 'string') {
      logger.error('[Cart] Invalid promo code provided');
      
      // Track failed attempt
      trackCartEvent('apply_promo', {
        promoCode: code,
        success: false,
        reason: 'invalid_format',
        cartValue: subtotal,
      });
      
      return false;
    }

    logger.debug('[Cart] Applying promo code:', code);

    // Mock promo code validation
    const validPromos: Record<string, PromoCode> = {
      BUTTERFLY10: {
        code: 'BUTTERFLY10',
        discount: 10,
        type: 'percentage',
        description: '10% off your order',
        minOrderAmount: 50,
        isActive: true,
      },
      FLAT20: {
        code: 'FLAT20',
        discount: 20,
        type: 'fixed',
        description: '$20 off your order',
        minOrderAmount: 100,
        isActive: true,
      },
      FREESHIP: {
        code: 'FREESHIP',
        discount: SHIPPING_RATE,
        type: 'freeship',
        description: 'Free shipping',
        isActive: true,
      },
    };

    const upperCode = code.toUpperCase().trim();
    const promo = validPromos[upperCode];

    if (!promo) {
      logger.debug('[Cart] Invalid promo code:', upperCode);
      
      // Track failed attempt
      trackCartEvent('apply_promo', {
        promoCode: upperCode,
        success: false,
        reason: 'invalid_code',
        cartValue: subtotal,
        source: getPromoCodeSource(),
      });
      
      return false;
    }

    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      logger.debug(
        '[Cart] Promo code minimum order not met. Required:',
        promo.minOrderAmount,
        'Current:',
        subtotal
      );
      
      // Track failed attempt
      trackCartEvent('apply_promo', {
        promoCode: upperCode,
        success: false,
        reason: 'minimum_not_met',
        cartValue: subtotal,
        minimumRequired: promo.minOrderAmount,
        shortfall: promo.minOrderAmount - subtotal,
      });
      
      return false;
    }

    const previousDiscount = discount;
    setPromoCode(promo);
    logger.debug('[Cart] Promo code applied successfully:', promo.code);
    
    // Track successful application
    trackCartEvent('apply_promo', {
      promoCode: upperCode,
      success: true,
      promoType: promo.type,
      discountAmount: promo.type === 'percentage' ? subtotal * (promo.discount / 100) : promo.discount,
      previousDiscount,
      newDiscount: discount,
      cartValue: subtotal,
      source: this.getPromoCodeSource(),
    });
    
    return true;
  };

  const removePromoCode = () => {
    logger.debug('[Cart] Removing promo code');
    
    const previousPromo = promoCode;
    const previousDiscount = discount;
    
    setPromoCode(undefined);
    
    // Track analytics event
    if (previousPromo) {
      trackCartEvent('remove_promo', {
        promoCode: previousPromo.code,
        promoType: previousPromo.type,
        previousDiscount,
        newDiscount: 0,
        cartValue: subtotal,
      });
    }
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value: CartContextType = {
    // State
    cartItems,
    promoCode,
    isCartOpen,

    // Computed values
    itemCount,
    subtotal,
    shipping,
    tax,
    total,
    discount,
    isEmpty,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    toggleCart,
    openCart,
    closeCart,

    // Cart object
    cart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook to use cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    logger.error('[Cart] useCart hook called outside CartProvider');
    throw new Error('useCart must be used within a CartProvider');
  }
  if (!context) {
    logger.error('[Cart] CartContext is null or undefined');
    throw new Error('CartContext is not properly initialized');
  }
  return context;
};

export default CartContext;
