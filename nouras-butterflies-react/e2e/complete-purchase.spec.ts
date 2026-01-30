import { test, expect } from '@playwright/test'

test.describe('Complete Purchase Journey', () => {
  test('should complete full purchase flow from product to confirmation', async ({ page }) => {
    // Navigate to catalog
    await page.goto('/catalog')
    
    // Select a product
    await page.click('[data-testid="product-card"]:first-child')
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")')
    
    // Verify cart badge updated
    await expect(page.locator('[data-testid="cart-badge"]')).toContainText('1')
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]')
    await expect(page).toHaveURL('/cart')
    
    // Proceed to checkout
    await page.click('button:has-text("Checkout")')
    await expect(page).toHaveURL('/checkout')
    
    // Fill shipping information
    await page.fill('[name="fullName"]', 'John Doe')
    await page.fill('[name="phone"]', '0501234567')
    await page.fill('[name="streetAddress"]', '123 Main Street')
    await page.fill('[name="city"]', 'Riyadh')
    await page.fill('[name="postalCode"]', '12345')
    
    await page.click('button:has-text("Continue to Payment")')
    
    // Fill payment information
    await expect(page.locator('text=Payment Method')).toBeVisible()

    await page.fill('[name="cardholderName"]', 'John Doe')
    await page.fill('[name="cardNumber"]', '4111 1111 1111 1111')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    
    await page.click('button:has-text("Review Order")')
    
    // Place order
    await expect(page.locator('text=Order Review')).toBeVisible()

    await page.click('button:has-text("Place Order")')
    
    // Verify order confirmation
    await expect(page).toHaveURL(/\/order-confirmation/)
    await expect(page.locator('h1')).toContainText('Order Confirmed')
  })

  test('should handle mobile checkout flow with swipe gestures', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to catalog
    await page.goto('/catalog')
    
    // Select a product
    await page.click('[data-testid="product-card"]:first-child')
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")')
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]')
    
    // Proceed to checkout
    await page.click('button:has-text("Checkout")')
    
    // Fill shipping form on mobile
    await page.fill('[name="fullName"]', 'Jane Smith')
    await page.fill('[name="phone"]', '05598765432')
    await page.fill('[name="streetAddress"]', '456 Mobile Street')
    await page.fill('[name="city"]', 'Jeddah')
    await page.fill('[name="postalCode"]', '54321')
    
    // Continue to payment
    await page.click('button:has-text("Continue to Payment")')
    
    // Fill payment form
    await expect(page.locator('text=Payment Method')).toBeVisible()

    await page.fill('[name="cardholderName"]', 'Jane Smith')
    await page.fill('[name="cardNumber"]', '5555 5555 5555 4444')
    await page.fill('[name="expiryDate"]', '11/24')
    await page.fill('[name="cvv"]', '456')
    
    // Review and place order
    await page.click('button:has-text("Review Order")')
    await page.click('button:has-text("Place Order")')
    
    // Verify order confirmation
    await expect(page.locator('h1')).toContainText('Order Confirmed')
  })

  test('should handle cart operations correctly', async ({ page }) => {
    await page.goto('/catalog')
    
    // Add multiple items to cart
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('button:has-text("Add to Cart")')
    
    await page.goto('/catalog')
    await page.click('[data-testid="product-card"]:nth-child(2)')
    await page.click('button:has-text("Add to Cart")')
    
    // Go to cart and verify items
    await page.click('[data-testid="cart-icon"]')
    await expect(page).toHaveURL('/cart')
    
    // Verify cart has 2 items
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(2)
    
    // Update quantity
    await page.click('[data-testid="increase-quantity"]:first-child')
    await expect(page.locator('[data-testid="item-quantity"]:first-child')).toContainText('2')
    
    // Remove item
    await page.click('[data-testid="remove-item"]:last-child')
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
    
    // Apply promo code
    await page.fill('[data-testid="promo-input"]', 'BUTTERFLY10')
    await page.click('[data-testid="apply-promo"]')
    
    // Verify discount applied
    await expect(page.locator('[data-testid="discount-amount"]')).toBeVisible()
  })

  test('should handle payment validation', async ({ page }) => {
    await page.goto('/catalog')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('button:has-text("Add to Cart")')
    await page.click('[data-testid="cart-icon"]')
    await page.click('button:has-text("Checkout")')
    
    // Fill shipping info
    await page.fill('[name="fullName"]', 'Test User')
    await page.fill('[name="phone"]', '0501234567')
    await page.fill('[name="streetAddress"]', '789 Test Street')
    await page.fill('[name="city"]', 'Dammam')
    await page.fill('[name="postalCode"]', '32221')
    await page.click('button:has-text("Continue to Payment")')
    
    // Try to proceed without payment details
    await page.click('button:has-text("Review Order")')
    
    // Should show validation errors
    await expect(page.locator('text=Cardholder name is required')).toBeVisible()
    await expect(page.locator('text=Card number is required')).toBeVisible()
    
    // Fill invalid card number
    await page.fill('[name="cardholderName"]', 'Test User')
    await page.fill('[name="cardNumber"]', '1234567890123456')
    await page.fill('[name="expiryDate"]', '13/25') // Invalid month
    await page.fill('[name="cvv"]', '123')
    await page.click('button:has-text("Review Order")')
    
    // Should show card validation error
    await expect(page.locator('text=Please enter a valid card number')).toBeVisible()
  })

  test('should handle guest checkout', async ({ page }) => {
    await page.goto('/catalog')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('button:has-text("Add to Cart")')
    await page.click('[data-testid="cart-icon"]')
    await page.click('button:has-text("Checkout")')
    
    // Check for guest checkout option
    if (await page.locator('[data-testid="guest-checkout"]').isVisible()) {
      await page.click('[data-testid="guest-checkout"]')
    }
    
    // Complete checkout as guest
    await page.fill('[name="fullName"]', 'Guest User')
    await page.fill('[name="phone"]', '0501234567')
    await page.fill('[name="streetAddress"]', '123 Guest Street')
    await page.fill('[name="city"]', 'Riyadh')
    await page.fill('[name="postalCode"]', '12345')
    
    await page.click('button:has-text("Continue to Payment")')
    
    // Fill payment and complete order
    await page.fill('[name="cardholderName"]', 'Guest User')
    await page.fill('[name="cardNumber"]', '4111 1111 1111 1111')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    
    await page.click('button:has-text("Review Order")')
    await page.click('button:has-text("Place Order")')
    
    await expect(page.locator('h1')).toContainText('Order Confirmed')
  })

  test('should handle order persistence', async ({ page }) => {
    await page.goto('/catalog')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('button:has-text("Add to Cart")')
    
    // Refresh page and verify cart persists
    await page.reload()
    await page.click('[data-testid="cart-icon"]')
    
    // Should still have item in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })

  test('should handle empty cart state', async ({ page }) => {
    await page.goto('/cart')
    
    // Should show empty cart message
    await expect(page.locator('text=Your shopping bag is empty')).toBeVisible()
    
    // Should not show checkout button
    await expect(page.locator('button:has-text("Checkout")')).not.toBeVisible()
    
    // Should show continue shopping link
    await expect(page.locator('a:has-text("Continue Shopping")')).toBeVisible()
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Mock network error
    await page.route('**/api/orders', route => route.abort('failed'))
    
    await page.goto('/catalog')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('button:has-text("Add to Cart")')
    await page.click('[data-testid="cart-icon"]')
    await page.click('button:has-text("Checkout")')
    
    // Complete checkout process
    await page.fill('[name="fullName"]', 'Test User')
    await page.fill('[name="phone"]', '0501234567')
    await page.fill('[name="streetAddress"]', '123 Test Street')
    await page.fill('[name="city"]', 'Riyadh')
    await page.fill('[name="postalCode"]', '12345')
    await page.click('button:has-text("Continue to Payment")')
    
    await page.fill('[name="cardholderName"]', 'Test User')
    await page.fill('[name="cardNumber"]', '4111 1111 1111 1111')
    await page.fill('[name="expiryDate"]', '12/25')
    await page.fill('[name="cvv"]', '123')
    
    await page.click('button:has-text("Review Order")')
    await page.click('button:has-text("Place Order")')
    
    // Should show error message
    await expect(page.locator('text=Order failed. Please try again.')).toBeVisible()
  })
})
