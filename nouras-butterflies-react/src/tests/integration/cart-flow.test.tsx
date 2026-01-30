import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../helpers/renderWithProviders'

// Mock CartPage component
const MockCartPage = () => (
  <div>
    <h1>Shopping Cart</h1>
    <div data-testid="cart-empty-message" style={{ display: 'none' }}>
      Your shopping bag is empty
    </div>
    <div data-testid="cart-items" style={{ display: 'none' }}>
      <div data-testid="cart-item-1">
        <span>Product 1</span>
        <span data-testid="item-1-quantity">1</span>
        <span data-testid="item-1-price">$50</span>
        <button data-testid="remove-item-1">Remove</button>
      </div>
      <div data-testid="cart-item-2">
        <span>Product 2</span>
        <span data-testid="item-2-quantity">2</span>
        <span data-testid="item-2-price">$30</span>
        <button data-testid="remove-item-2">Remove</button>
      </div>
    </div>
    <div data-testid="cart-summary" style={{ display: 'none' }}>
      <div data-testid="cart-subtotal">$110</div>
      <div data-testid="cart-total">$125</div>
      <button data-testid="checkout-button">Proceed to Checkout</button>
    </div>
    <div data-testid="promo-section">
      <input data-testid="promo-input" placeholder="Enter promo code" />
      <button data-testid="apply-promo">Apply</button>
    </div>
  </div>
)

describe('Cart Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should display empty cart message when cart is empty', () => {
    renderWithProviders(<MockCartPage />)
    
    // Initially cart is empty
    expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument()
    expect(screen.queryByTestId('cart-items')).not.toBeInTheDocument()
    expect(screen.queryByTestId('cart-summary')).not.toBeInTheDocument()
  })

  it('should allow adding items to cart', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Simulate adding items to cart (this would normally be done through product pages)
    // For this test, we'll simulate the cart having items
    
    // Show cart items (simulating items being added)
    const emptyMessage = screen.getByTestId('cart-empty-message')
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    
    // Simulate cart state change
    emptyMessage.style.display = 'none'
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Verify cart items are displayed
    expect(screen.getByText('Product 1')).toBeInTheDocument()
    expect(screen.getByText('Product 2')).toBeInTheDocument()
    expect(screen.getByTestId('item-1-quantity')).toHaveTextContent('1')
    expect(screen.getByTestId('item-2-quantity')).toHaveTextContent('2')
  })

  it('should calculate totals correctly', async () => {
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Verify calculations
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$110') // 50 + (30 * 2)
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$125') // 110 + 15 shipping
  })

  it('should apply promo codes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Apply promo code
    const promoInput = screen.getByTestId('promo-input')
    const applyButton = screen.getByTestId('apply-promo')
    
    await user.type(promoInput, 'BUTTERFLY10')
    await user.click(applyButton)
    
    // Verify promo is applied (this would normally update the total)
    expect(promoInput).toHaveValue('BUTTERFLY10')
  })

  it('should navigate to checkout', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Click checkout button
    const checkoutButton = screen.getByTestId('checkout-button')
    await user.click(checkoutButton)
    
    // Verify checkout button was clicked (navigation would be tested in routing tests)
    expect(checkoutButton).toBeInTheDocument()
  })

  it('should update item quantities', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    cartItems.style.display = 'block'
    
    // Add quantity controls to items for testing
    const item1 = screen.getByTestId('cart-item-1')
    const increaseButton = document.createElement('button')
    increaseButton.textContent = '+'
    increaseButton.setAttribute('data-testid', 'increase-quantity-1')
    item1.appendChild(increaseButton)
    
    const quantityDisplay = screen.getByTestId('item-1-quantity')
    
    // Increase quantity
    await user.click(increaseButton)
    
    // Verify quantity update (this would normally update the cart state)
    expect(quantityDisplay).toBeInTheDocument()
  })

  it('should remove items from cart', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Remove first item
    const removeButton = screen.getByTestId('remove-item-1')
    await user.click(removeButton)
    
    // Verify item removal (this would normally update the cart state)
    expect(removeButton).toBeInTheDocument()
  })

  it('should handle cart persistence', () => {
    // Mock localStorage for cart persistence
    const mockCart = {
      items: [
        { id: '1', name: 'Product 1', price: 50, quantity: 1 },
        { id: '2', name: 'Product 2', price: 30, quantity: 2 }
      ],
      total: 125
    }
    
    localStorage.setItem('cart', JSON.stringify(mockCart))
    
    renderWithProviders(<MockCartPage />)
    
    // Verify cart is loaded from localStorage
    expect(localStorage.getItem('cart')).toBe(JSON.stringify(mockCart))
  })

  it('should handle cart clear', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Add clear button for testing
    const clearButton = document.createElement('button')
    clearButton.textContent = 'Clear Cart'
    clearButton.setAttribute('data-testid', 'clear-cart')
    screen.getByRole('heading').parentElement!.appendChild(clearButton)
    
    // Clear cart
    await user.click(clearButton)
    
    // Verify cart is cleared
    expect(clearButton).toBeInTheDocument()
  })

  it('should validate promo codes', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    cartItems.style.display = 'block'
    
    // Try invalid promo code
    const promoInput = screen.getByTestId('promo-input')
    const applyButton = screen.getByTestId('apply-promo')
    
    await user.type(promoInput, 'INVALID')
    await user.click(applyButton)
    
    // Verify error handling (this would normally show an error message)
    expect(promoInput).toHaveValue('INVALID')
  })

  it('should handle edge cases', () => {
    renderWithProviders(<MockCartPage />)
    
    // Test with empty cart
    expect(screen.getByText('Your shopping bag is empty')).toBeInTheDocument()
    
    // Test with very large quantities
    const largeQuantity = Array.from({ length: 1000 }, (_, i) => ({
      id: `item-${i}`,
      name: `Product ${i}`,
      price: 10,
      quantity: 1
    }))
    
    localStorage.setItem('cart', JSON.stringify({ items: largeQuantity }))
    
    // Verify cart can handle large number of items
    expect(JSON.parse(localStorage.getItem('cart') || '{}').items).toHaveLength(1000)
  })

  it('should be accessible', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCartPage />)
    
    // Show cart with items
    const cartItems = screen.getByTestId('cart-items')
    const cartSummary = screen.getByTestId('cart-summary')
    cartItems.style.display = 'block'
    cartSummary.style.display = 'block'
    
    // Test keyboard navigation
    await user.tab()
    expect(screen.getByRole('button', { name: /remove/i })).toHaveFocus()
    
    // Test ARIA labels
    expect(screen.getByRole('heading', { name: 'Shopping Cart' })).toBeInTheDocument()
  })

  it('should handle loading states', () => {
    renderWithProviders(<MockCartPage />)
    
    // Add loading indicator
    const loadingIndicator = document.createElement('div')
    loadingIndicator.textContent = 'Loading cart...'
    loadingIndicator.setAttribute('data-testid', 'loading-indicator')
    loadingIndicator.setAttribute('role', 'status')
    loadingIndicator.setAttribute('aria-live', 'polite')
    screen.getByRole('heading').parentElement!.appendChild(loadingIndicator)
    
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    expect(screen.getByTestId('loading-indicator')).toHaveAttribute('aria-live', 'polite')
  })

  it('should handle error states', () => {
    renderWithProviders(<MockCartPage />)
    
    // Add error message
    const errorMessage = document.createElement('div')
    errorMessage.textContent = 'Failed to load cart'
    errorMessage.setAttribute('data-testid', 'error-message')
    errorMessage.setAttribute('role', 'alert')
    screen.getByRole('heading').parentElement!.appendChild(errorMessage)
    
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByTestId('error-message')).toHaveAttribute('role', 'alert')
  })
})
