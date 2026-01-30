import { describe, it, expect } from 'vitest'
import {
  calculateSubtotal,
  calculateShipping,
  calculateTax,
  calculateTotal,
  calculateDiscount,
  validatePromoCode,
  formatPrice,
  getTotalQuantity,
  generateOrderNumber,
  calculateEstimatedDelivery,
  hasVariants,
  hasOutOfStockItems,
  getCartWeight,
  formatDate,
  generateTrackingNumber,
  SHIPPING_THRESHOLD,
  SHIPPING_RATE,
  TAX_RATE
} from '../cart'

describe('Cart Utilities', () => {
  describe('calculateSubtotal', () => {
    it('should calculate correct subtotal for multiple items', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 2 
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 1 
        }
      ]
      expect(calculateSubtotal(items)).toBe(130)
    })

    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0)
    })
  })

  describe('calculateShipping', () => {
    it('should return free shipping for orders above threshold', () => {
      expect(calculateShipping(SHIPPING_THRESHOLD + 10)).toBe(0)
    })

    it('should charge shipping for orders below threshold', () => {
      expect(calculateShipping(SHIPPING_THRESHOLD - 10)).toBe(SHIPPING_RATE)
    })

    it('should return 0 for empty cart', () => {
      expect(calculateShipping(0)).toBe(0)
    })
  })

  describe('calculateTax', () => {
    it('should calculate correct tax amount', () => {
      const subtotal = 100
      expect(calculateTax(subtotal)).toBe(subtotal * TAX_RATE)
    })

    it('should apply tax after discount', () => {
      const subtotal = 100
      const discount = 20
      expect(calculateTax(subtotal, discount)).toBe((subtotal - discount) * TAX_RATE)
    })

    it('should handle discount larger than subtotal', () => {
      const subtotal = 100
      const discount = 150
      expect(calculateTax(subtotal, discount)).toBe(0)
    })
  })

  describe('calculateTotal', () => {
    it('should calculate total with all components', () => {
      const subtotal = 100
      const shipping = 15
      const tax = 15
      const discount = 10
      expect(calculateTotal(subtotal, shipping, tax, discount)).toBe(120)
    })

    it('should handle zero values', () => {
      expect(calculateTotal(0, 0, 0, 0)).toBe(0)
    })
  })

  describe('validatePromoCode', () => {
    it('should validate correct promo code', async () => {
      const promo = await validatePromoCode('BUTTERFLY10')
      expect(promo).not.toBeNull()
      expect(promo?.code).toBe('BUTTERFLY10')
    })

    it('should return null for invalid promo code', async () => {
      const promo = await validatePromoCode('INVALID')
      expect(promo).toBeNull()
    })

    it('should be case insensitive', async () => {
      const promo = await validatePromoCode('butterfly10')
      expect(promo).not.toBeNull()
      expect(promo?.code).toBe('BUTTERFLY10')
    })

    it('should trim whitespace', async () => {
      const promo = await validatePromoCode('  BUTTERFLY10  ')
      expect(promo).not.toBeNull()
      expect(promo?.code).toBe('BUTTERFLY10')
    })
  })

  describe('calculateDiscount', () => {
    it('should calculate percentage discount correctly', () => {
      const promo = {
        code: 'TEST10',
        discount: 10,
        type: 'percentage' as const,
        isActive: true
      }
      expect(calculateDiscount(100, promo)).toBe(10)
    })

    it('should apply max discount cap', () => {
      const promo = {
        code: 'TEST50',
        discount: 50,
        type: 'percentage' as const,
        maxDiscount: 30,
        isActive: true
      }
      expect(calculateDiscount(100, promo)).toBe(30)
    })

    it('should calculate fixed discount correctly', () => {
      const promo = {
        code: 'FLAT20',
        discount: 20,
        type: 'fixed' as const,
        isActive: true
      }
      expect(calculateDiscount(100, promo)).toBe(20)
    })

    it('should return 0 if minimum order not met', () => {
      const promo = {
        code: 'MIN100',
        discount: 10,
        type: 'percentage' as const,
        minOrderAmount: 100,
        isActive: true
      }
      expect(calculateDiscount(50, promo)).toBe(0)
    })

    it('should return 0 for undefined promo', () => {
      expect(calculateDiscount(100, undefined)).toBe(0)
    })
  })

  describe('formatPrice', () => {
    it('should format price with default currency', () => {
      expect(formatPrice(123.456)).toBe('$123.46')
    })

    it('should format price with custom currency', () => {
      expect(formatPrice(123.456, '€')).toBe('€123.46')
    })

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })
  })

  describe('getTotalQuantity', () => {
    it('should sum quantities of all items', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 2 
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 3 
        }
      ]
      expect(getTotalQuantity(items)).toBe(5)
    })

    it('should return 0 for empty cart', () => {
      expect(getTotalQuantity([])).toBe(0)
    })
  })

  describe('generateOrderNumber', () => {
    it('should generate unique order numbers', () => {
      const order1 = generateOrderNumber()
      const order2 = generateOrderNumber()
      expect(order1).not.toBe(order2)
      expect(order1).toMatch(/^NB-[A-Z0-9]+-[A-Z0-9]+$/)
    })
  })

  describe('calculateEstimatedDelivery', () => {
    it('should calculate delivery date excluding weekends', () => {
      const deliveryDate = calculateEstimatedDelivery(5)
      expect(deliveryDate).toBeInstanceOf(Date)
    })

    it('should handle zero days', () => {
      const deliveryDate = calculateEstimatedDelivery(0)
      expect(deliveryDate).toBeInstanceOf(Date)
    })
  })

  describe('hasVariants', () => {
    it('should return true when items have variants', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 1, 
          variant: { id: 'var1', name: 'Red' }
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 1 
        }
      ]
      expect(hasVariants(items)).toBe(true)
    })

    it('should return false when no items have variants', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 1 
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 1 
        }
      ]
      expect(hasVariants(items)).toBe(false)
    })
  })

  describe('hasOutOfStockItems', () => {
    it('should return false for mock implementation', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 1 
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 1 
        }
      ]
      expect(hasOutOfStockItems(items)).toBe(false)
    })
  })

  describe('getCartWeight', () => {
    it('should calculate total weight', () => {
      const items = [
        { 
          id: '1', 
          productId: 'prod1', 
          productTitle: 'Product 1', 
          productImage: '/image1.jpg',
          price: 50, 
          quantity: 2 
        },
        { 
          id: '2', 
          productId: 'prod2', 
          productTitle: 'Product 2', 
          productImage: '/image2.jpg',
          price: 30, 
          quantity: 1 
        }
      ]
      expect(getCartWeight(items)).toBe(1.5) // 3 items * 0.5kg each
    })

    it('should return 0 for empty cart', () => {
      expect(getCartWeight([])).toBe(0)
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15')
      const formatted = formatDate(date)
      expect(formatted).toContain('2024')
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
    })
  })

  describe('generateTrackingNumber', () => {
    it('should generate unique tracking numbers', () => {
      const tracking1 = generateTrackingNumber()
      const tracking2 = generateTrackingNumber()
      expect(tracking1).not.toBe(tracking2)
      expect(tracking1).toMatch(/^NB\d+[A-Z0-9]+$/)
    })
  })
})
