import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider } from '@/contexts/CartContext'
import { useCart } from '@/hooks/useCart'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('useCart Hook', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.itemCount).toBe(1)
    expect(result.current.subtotal).toBe(50)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item first
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    // Update quantity
    act(() => {
      result.current.updateQuantity('1', 3)
    })

    expect(result.current.cartItems[0].quantity).toBe(3)
    expect(result.current.itemCount).toBe(3)
    expect(result.current.subtotal).toBe(150)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item first
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    // Remove item
    act(() => {
      result.current.removeFromCart('1')
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.isEmpty).toBe(true)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add multiple items
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Product 1',
        productImage: '/test1.jpg',
        price: 50,
        quantity: 1
      })
      result.current.addToCart({
        productId: '2',
        productTitle: 'Product 2',
        productImage: '/test2.jpg',
        price: 30,
        quantity: 2
      })
    })

    expect(result.current.cartItems).toHaveLength(2)

    // Clear cart
    act(() => {
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.isEmpty).toBe(true)
  })

  it('should calculate shipping correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item below threshold
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    expect(result.current.shipping).toBe(15) // Standard shipping

    // Add more to exceed threshold
    act(() => {
      result.current.addToCart({
        productId: '2',
        productTitle: 'Expensive Product',
        productImage: '/test2.jpg',
        price: 200,
        quantity: 1
      })
    })

    expect(result.current.shipping).toBe(0) // Free shipping
  })

  it('should calculate tax correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 100,
        quantity: 1
      })
    })

    expect(result.current.tax).toBe(15) // 100 * 0.15
  })

  it('should apply promo code', async () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item first
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 100,
        quantity: 1
      })
    })

    // Apply promo code
    let promoApplied = false
    await act(async () => {
      promoApplied = await result.current.applyPromoCode('BUTTERFLY10')
    })

    expect(promoApplied).toBe(true)
    expect(result.current.discount).toBeGreaterThan(0)
    expect(result.current.promoCode).toBeDefined()
  })

  it('should remove promo code', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Apply promo code first
    act(() => {
      result.current.setPromoCode({
        code: 'TEST10',
        discount: 10,
        type: 'percentage',
        isActive: true
      })
    })

    expect(result.current.promoCode).toBeDefined()

    // Remove promo code
    act(() => {
      result.current.removePromoCode()
    })

    expect(result.current.promoCode).toBeUndefined()
    expect(result.current.discount).toBe(0)
  })

  it('should handle cart open/close state', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.isCartOpen).toBe(false)

    // Open cart
    act(() => {
      result.current.openCart()
    })

    expect(result.current.isCartOpen).toBe(true)

    // Close cart
    act(() => {
      result.current.closeCart()
    })

    expect(result.current.isCartOpen).toBe(false)

    // Toggle cart
    act(() => {
      result.current.toggleCart()
    })

    expect(result.current.isCartOpen).toBe(true)
  })

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    // Check localStorage
    const storedCart = localStorage.getItem('nouras-cart')
    expect(storedCart).toBeTruthy()
    
    const parsedCart = JSON.parse(storedCart!)
    expect(parsedCart).toHaveLength(1)
    expect(parsedCart[0].productId).toBe('1')
  })

  it('should load cart from localStorage', () => {
    // Pre-populate localStorage
    const mockCart = [
      {
        id: '1',
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 2
      }
    ]
    localStorage.setItem('nouras-cart', JSON.stringify(mockCart))

    const { result } = renderHook(() => useCart(), { wrapper })
    
    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].productId).toBe('1')
    expect(result.current.cartItems[0].quantity).toBe(2)
  })

  it('should handle invalid localStorage data', () => {
    // Set invalid data
    localStorage.setItem('nouras-cart', 'invalid-json')

    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Should fallback to empty cart
    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.isEmpty).toBe(true)
  })

  it('should handle items with variants', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1,
        variant: {
          id: 'variant-1',
          name: 'Red',
          shade: 'Bright Red'
        }
      })
    })

    expect(result.current.cartItems[0].variant).toBeDefined()
    expect(result.current.cartItems[0].variant?.name).toBe('Red')
  })

  it('should update quantity to zero removes item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add item first
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    expect(result.current.cartItems).toHaveLength(1)

    // Update quantity to zero
    act(() => {
      result.current.updateQuantity('1', 0)
    })

    expect(result.current.cartItems).toHaveLength(0)
  })

  it('should handle adding same item multiple times', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add same item twice
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1
      })
    })

    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 2
      })
    })

    // Should have one item with combined quantity
    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].quantity).toBe(3)
    expect(result.current.itemCount).toBe(3)
  })

  it('should handle different items with same product but different variants', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    // Add same product with different variants
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1,
        variant: { id: 'red', name: 'Red' }
      })
    })

    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 50,
        quantity: 1,
        variant: { id: 'blue', name: 'Blue' }
      })
    })

    // Should have two separate items
    expect(result.current.cartItems).toHaveLength(2)
    expect(result.current.itemCount).toBe(2)
  })

  it('should calculate total correctly with all components', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    act(() => {
      result.current.addToCart({
        productId: '1',
        productTitle: 'Test Product',
        productImage: '/test.jpg',
        price: 100,
        quantity: 2
      })
    })

    // subtotal: 200, shipping: 0 (free), tax: 30 (15% of 200), total: 230
    expect(result.current.subtotal).toBe(200)
    expect(result.current.shipping).toBe(0)
    expect(result.current.tax).toBe(30)
    expect(result.current.total).toBe(230)
  })

  it('should handle cart object structure', () => {
    const { result } = renderHook(() => useCart(), { wrapper })
    
    const cart = result.current.cart
    
    expect(cart).toHaveProperty('items')
    expect(cart).toHaveProperty('itemCount')
    expect(cart).toHaveProperty('subtotal')
    expect(cart).toHaveProperty('shipping')
    expect(cart).toHaveProperty('tax')
    expect(cart).toHaveProperty('total')
    expect(cart).toHaveProperty('discount')
    expect(cart).toHaveProperty('isEmpty')
  })
})
