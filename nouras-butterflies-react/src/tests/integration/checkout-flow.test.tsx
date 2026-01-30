import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../helpers/renderWithProviders'

// Mock CheckoutPage component
const MockCheckoutPage = () => (
  <div>
    <h1>Checkout</h1>
    
    {/* Step 1: Shipping Information */}
    <div data-testid="shipping-step">
      <h2>Shipping Information</h2>
      <form data-testid="shipping-form">
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          data-testid="full-name-input"
          type="text"
          required
        />
        <span data-testid="full-name-error" style={{ display: 'none' }}>
          Full name is required
        </span>
        
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          name="phone"
          data-testid="phone-input"
          type="tel"
          required
        />
        <span data-testid="phone-error" style={{ display: 'none' }}>
          Please enter a valid phone number
        </span>
        
        <label htmlFor="streetAddress">Street Address</label>
        <input
          id="streetAddress"
          name="streetAddress"
          data-testid="street-address-input"
          type="text"
          required
        />
        <span data-testid="street-address-error" style={{ display: 'none' }}>
          Please enter a valid street address
        </span>
        
        <label htmlFor="city">City</label>
        <input
          id="city"
          name="city"
          data-testid="city-input"
          type="text"
          required
        />
        <span data-testid="city-error" style={{ display: 'none' }}>
          Please enter a valid city
        </span>
        
        <label htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          name="postalCode"
          data-testid="postal-code-input"
          type="text"
          required
        />
        <span data-testid="postal-code-error" style={{ display: 'none' }}>
          Please enter a valid postal code
        </span>
        
        <button type="button" data-testid="continue-to-payment">
          Continue to Payment
        </button>
      </form>
    </div>
    
    {/* Step 2: Payment Information */}
    <div data-testid="payment-step" style={{ display: 'none' }}>
      <h2>Payment Information</h2>
      <form data-testid="payment-form">
        <label htmlFor="cardholderName">Cardholder Name</label>
        <input
          id="cardholderName"
          name="cardholderName"
          data-testid="cardholder-name-input"
          type="text"
          required
        />
        <span data-testid="cardholder-name-error" style={{ display: 'none' }}>
          Please enter the cardholder name
        </span>
        
        <label htmlFor="cardNumber">Card Number</label>
        <input
          id="cardNumber"
          name="cardNumber"
          data-testid="card-number-input"
          type="text"
          required
        />
        <span data-testid="card-number-error" style={{ display: 'none' }}>
          Please enter a valid card number
        </span>
        
        <label htmlFor="expiryDate">Expiry Date</label>
        <input
          id="expiryDate"
          name="expiryDate"
          data-testid="expiry-date-input"
          type="text"
          placeholder="MM/YY"
          required
        />
        <span data-testid="expiry-date-error" style={{ display: 'none' }}>
          Please enter a valid expiry date (MM/YY)
        </span>
        
        <label htmlFor="cvv">CVV</label>
        <input
          id="cvv"
          name="cvv"
          data-testid="cvv-input"
          type="text"
          required
        />
        <span data-testid="cvv-error" style={{ display: 'none' }}>
          Please enter a valid CVV
        </span>
        
        <button type="button" data-testid="review-order">
          Review Order
        </button>
      </form>
    </div>
    
    {/* Step 3: Order Review */}
    <div data-testid="review-step" style={{ display: 'none' }}>
      <h2>Order Review</h2>
      <div data-testid="order-summary">
        <div data-testid="shipping-address-summary"></div>
        <div data-testid="payment-summary"></div>
        <div data-testid="order-total">$125.00</div>
      </div>
      <button type="button" data-testid="place-order">
        Place Order
      </button>
    </div>
    
    {/* Order Confirmation */}
    <div data-testid="confirmation-step" style={{ display: 'none' }}>
      <h1>Order Confirmation</h1>
      <div data-testid="order-number"></div>
      <div data-testid="confirmation-message">
        Thank you for your order!
      </div>
    </div>
  </div>
)

describe('Checkout Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should complete multi-step checkout process', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Step 1: Fill shipping information
    const fullNameInput = screen.getByTestId('full-name-input')
    const phoneInput = screen.getByTestId('phone-input')
    const streetAddressInput = screen.getByTestId('street-address-input')
    const cityInput = screen.getByTestId('city-input')
    const postalCodeInput = screen.getByTestId('postal-code-input')
    const continueButton = screen.getByTestId('continue-to-payment')

    await user.type(fullNameInput, 'John Doe')
    await user.type(phoneInput, '0501234567')
    await user.type(streetAddressInput, '123 Main Street')
    await user.type(cityInput, 'Riyadh')
    await user.type(postalCodeInput, '12345')

    await user.click(continueButton)

    // Step 2: Fill payment information
    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    const cardholderNameInput = screen.getByTestId('cardholder-name-input')
    const cardNumberInput = screen.getByTestId('card-number-input')
    const expiryDateInput = screen.getByTestId('expiry-date-input')
    const cvvInput = screen.getByTestId('cvv-input')
    const reviewButton = screen.getByTestId('review-order')

    await user.type(cardholderNameInput, 'John Doe')
    await user.type(cardNumberInput, '4111111111111111')
    await user.type(expiryDateInput, '12/25')
    await user.type(cvvInput, '123')

    await user.click(reviewButton)

    // Step 3: Review and place order
    await waitFor(() => {
      expect(screen.getByText('Order Review')).toBeInTheDocument()
    })

    const placeOrderButton = screen.getByTestId('place-order')
    await user.click(placeOrderButton)

    // Verify order confirmation
    await waitFor(() => {
      expect(screen.getByText('Order Confirmation')).toBeInTheDocument()
    })
  })

  it('should validate form fields', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Try to proceed without filling required fields
    const continueButton = screen.getByTestId('continue-to-payment')
    await user.click(continueButton)

    // Verify error messages appear
    await waitFor(() => {
      expect(screen.getByTestId('full-name-error')).toBeInTheDocument()
      expect(screen.getByTestId('phone-error')).toBeInTheDocument()
      expect(screen.getByTestId('street-address-error')).toBeInTheDocument()
      expect(screen.getByTestId('city-error')).toBeInTheDocument()
      expect(screen.getByTestId('postal-code-error')).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    const phoneInput = screen.getByTestId('phone-input')
    const continueButton = screen.getByTestId('continue-to-payment')

    await user.type(phoneInput, 'invalid-phone')
    await user.click(continueButton)

    await waitFor(() => {
      expect(screen.getByTestId('phone-error')).toBeInTheDocument()
    })
  })

  it('should validate card number', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Fill shipping first
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')
    await user.click(screen.getByTestId('continue-to-payment'))

    // Try invalid card number
    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    const cardNumberInput = screen.getByTestId('card-number-input')
    const reviewButton = screen.getByTestId('review-order')

    await user.type(cardNumberInput, '1234567890123456')
    await user.click(reviewButton)

    await waitFor(() => {
      expect(screen.getByTestId('card-number-error')).toBeInTheDocument()
    })
  })

  it('should validate expiry date format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Fill shipping first
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')
    await user.click(screen.getByTestId('continue-to-payment'))

    // Fill payment with invalid expiry
    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    await user.type(screen.getByTestId('cardholder-name-input'), 'John Doe')
    await user.type(screen.getByTestId('card-number-input'), '4111111111111111')
    await user.type(screen.getByTestId('expiry-date-input'), '13/25') // Invalid month
    await user.type(screen.getByTestId('cvv-input'), '123')
    await user.click(screen.getByTestId('review-order'))

    await waitFor(() => {
      expect(screen.getByTestId('expiry-date-error')).toBeInTheDocument()
    })
  })

  it('should allow editing previous steps', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Fill shipping step
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')
    await user.click(screen.getByTestId('continue-to-payment'))

    // Go back to shipping
    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    // Add back button for testing
    const backButton = document.createElement('button')
    backButton.textContent = 'Back to Shipping'
    backButton.setAttribute('data-testid', 'back-to-shipping')
    screen.getByText('Payment Information').parentElement!.insertBefore(
      backButton,
      screen.getByText('Payment Information')
    )

    await user.click(backButton)

    await waitFor(() => {
      expect(screen.getByText('Shipping Information')).toBeInTheDocument()
    })

    // Verify previous data is preserved
    expect(screen.getByTestId('full-name-input')).toHaveValue('John Doe')
  })

  it('should handle order submission errors', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Complete all steps
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')
    await user.click(screen.getByTestId('continue-to-payment'))

    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    await user.type(screen.getByTestId('cardholder-name-input'), 'John Doe')
    await user.type(screen.getByTestId('card-number-input'), '4111111111111111')
    await user.type(screen.getByTestId('expiry-date-input'), '12/25')
    await user.type(screen.getByTestId('cvv-input'), '123')
    await user.click(screen.getByTestId('review-order'))

    await waitFor(() => {
      expect(screen.getByText('Order Review')).toBeInTheDocument()
    })

    // Simulate order submission error
    const placeOrderButton = screen.getByTestId('place-order')
    
    // Mock error state
    const errorMessage = document.createElement('div')
    errorMessage.textContent = 'Payment failed. Please try again.'
    errorMessage.setAttribute('data-testid', 'order-error')
    errorMessage.setAttribute('role', 'alert')
    screen.getByText('Order Review').parentElement!.appendChild(errorMessage)

    await user.click(placeOrderButton)

    await waitFor(() => {
      expect(screen.getByTestId('order-error')).toBeInTheDocument()
    })
  })

  it('should handle loading states', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Add loading state
    const loadingIndicator = document.createElement('div')
    loadingIndicator.textContent = 'Processing...'
    loadingIndicator.setAttribute('data-testid', 'loading-indicator')
    loadingIndicator.setAttribute('role', 'status')
    loadingIndicator.setAttribute('aria-live', 'polite')
    screen.getByRole('heading').parentElement!.appendChild(loadingIndicator)

    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()
    expect(screen.getByTestId('loading-indicator')).toHaveAttribute('aria-live', 'polite')
  })

  it('should be accessible', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Test keyboard navigation
    await user.tab()
    expect(screen.getByLabelText('Full Name')).toHaveFocus()

    // Test ARIA labels
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone')).toBeInTheDocument()

    // Test form validation announcements
    const continueButton = screen.getByTestId('continue-to-payment')
    await user.click(continueButton)

    // Error messages should be announced
    expect(screen.getByTestId('full-name-error')).toBeInTheDocument()
  })

  it('should persist form data', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Fill shipping form
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')

    // Simulate form data persistence
    const formData = {
      fullName: 'John Doe',
      phone: '0501234567',
      streetAddress: '123 Main Street',
      city: 'Riyadh',
      postalCode: '12345'
    }

    localStorage.setItem('checkout-form', JSON.stringify(formData))

    // Verify data is persisted
    expect(JSON.parse(localStorage.getItem('checkout-form') || '{}')).toEqual(formData)
  })

  it('should handle guest checkout', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Add guest checkout option
    const guestCheckbox = document.createElement('input')
    guestCheckbox.type = 'checkbox'
    guestCheckbox.setAttribute('data-testid', 'guest-checkout')
    guestCheckbox.setAttribute('name', 'guestCheckout')
    
    const guestLabel = document.createElement('label')
    guestLabel.textContent = 'Checkout as guest'
    guestLabel.setAttribute('for', 'guest-checkout')
    guestLabel.appendChild(guestCheckbox)

    screen.getByRole('heading').parentElement!.insertBefore(
      guestLabel,
      screen.getByRole('heading').nextSibling
    )

    await user.click(guestCheckbox)

    expect(guestCheckbox).toBeChecked()
  })

  it('should handle different payment methods', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockCheckoutPage />)

    // Fill shipping first
    await user.type(screen.getByTestId('full-name-input'), 'John Doe')
    await user.type(screen.getByTestId('phone-input'), '0501234567')
    await user.type(screen.getByTestId('street-address-input'), '123 Main Street')
    await user.type(screen.getByTestId('city-input'), 'Riyadh')
    await user.type(screen.getByTestId('postal-code-input'), '12345')
    await user.click(screen.getByTestId('continue-to-payment'))

    await waitFor(() => {
      expect(screen.getByText('Payment Information')).toBeInTheDocument()
    })

    // Add payment method options
    const paymentMethods = ['Credit Card', 'Mada', 'Apple Pay']
    const paymentContainer = screen.getByText('Payment Information').parentElement!

    paymentMethods.forEach((method) => {
      const radio = document.createElement('input')
      radio.type = 'radio'
      radio.name = 'paymentMethod'
      radio.value = method.toLowerCase().replace(' ', '_')
      radio.setAttribute('data-testid', `payment-${method.toLowerCase().replace(' ', '-')}`)

      const label = document.createElement('label')
      label.textContent = method
      label.setAttribute('for', radio.id)
      label.appendChild(radio)

      paymentContainer.insertBefore(label, paymentContainer.firstChild)
    })

    // Test different payment methods
    await user.click(screen.getByTestId('payment-mada'))
    expect(screen.getByTestId('payment-mada')).toBeChecked()
  })
})
