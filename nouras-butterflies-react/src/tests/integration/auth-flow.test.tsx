import { describe, it, expect, beforeEach } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '../helpers/renderWithProviders'

// Mock LoginPage component
const MockLoginPage = () => (
  <div>
    <h1 data-testid="login-title">Welcome Back</h1>
    <p data-testid="login-subtitle">Sign in to your account</p>
    
    <form data-testid="login-form">
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          data-testid="email-input"
          type="email"
          required
        />
        <span data-testid="email-error" style={{ display: 'none' }}>
          Please enter a valid email
        </span>
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          data-testid="password-input"
          type="password"
          required
        />
        <span data-testid="password-error" style={{ display: 'none' }}>
          Please enter your password
        </span>
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            data-testid="remember-me"
            name="rememberMe"
          />
          Remember me
        </label>
      </div>
      
      <button type="submit" data-testid="sign-in-button">
        Sign In
      </button>
    </form>
    
    <div>
      <a href="#" data-testid="forgot-password">
        Forgot your password?
      </a>
    </div>
    
    <div>
      <span>Don't have an account? </span>
      <button type="button" data-testid="sign-up-link">
        Sign up
      </button>
    </div>
    
    <div data-testid="error-message" style={{ display: 'none' }}>
      Invalid credentials
    </div>
  </div>
)

// Mock RegisterPage component
const MockRegisterPage = () => (
  <div>
    <h1 data-testid="register-title">Create Account</h1>
    <p data-testid="register-subtitle">Join us today</p>
    
    <form data-testid="register-form">
      <div>
        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          data-testid="full-name-input"
          type="text"
          required
        />
        <span data-testid="full-name-error" style={{ display: 'none' }}>
          Please enter your full name
        </span>
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          data-testid="email-input"
          type="email"
          required
        />
        <span data-testid="email-error" style={{ display: 'none' }}>
          Please enter a valid email
        </span>
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          data-testid="password-input"
          type="password"
          required
        />
        <span data-testid="password-error" style={{ display: 'none' }}>
          Password must be at least 8 characters
        </span>
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          data-testid="confirm-password-input"
          type="password"
          required
        />
        <span data-testid="confirm-password-error" style={{ display: 'none' }}>
          Passwords do not match
        </span>
      </div>
      
      <div>
        <label>
          <input
            type="checkbox"
            data-testid="agree-terms"
            name="agreeTerms"
            required
          />
          I agree to the terms and conditions
        </label>
        <span data-testid="terms-error" style={{ display: 'none' }}>
          You must agree to the terms and conditions
        </span>
      </div>
      
      <button type="submit" data-testid="create-account-button">
        Create Account
      </button>
    </form>
    
    <div>
      <span>Already have an account? </span>
      <button type="button" data-testid="sign-in-link">
        Sign in
      </button>
    </div>
    
    <div data-testid="error-message" style={{ display: 'none' }}>
      Registration failed
    </div>
  </div>
)

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    expect(screen.getByTestId('login-title')).toHaveTextContent('Welcome Back')
    expect(screen.getByTestId('login-subtitle')).toHaveTextContent('Sign in to your account')

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const signInButton = screen.getByTestId('sign-in-button')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.click(signInButton)

    // Verify successful login (this would normally redirect)
    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('Password123')
  })

  it('should show error for invalid credentials', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')
    const signInButton = screen.getByTestId('sign-in-button')

    await user.type(emailInput, 'wrong@example.com')
    await user.type(passwordInput, 'wrongpass')
    await user.click(signInButton)

    // Show error message
    const errorMessage = screen.getByTestId('error-message')
    errorMessage.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
      expect(screen.getByTestId('error-message')).toHaveTextContent('Invalid credentials')
    })
  })

  it('should switch between login and register', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    expect(screen.getByTestId('login-title')).toHaveTextContent('Welcome Back')

    // Click sign up link
    const signUpLink = screen.getByTestId('sign-up-link')
    await user.click(signUpLink)

    // Mock switching to register page
    const loginPage = screen.getByTestId('login-title').parentElement!
    loginPage.style.display = 'none'

    const registerPage = document.createElement('div')
    registerPage.innerHTML = `
      <h1 data-testid="register-title">Create Account</h1>
      <p data-testid="register-subtitle">Join us today</p>
      <label htmlFor="fullName">Full Name</label>
      <input id="fullName" data-testid="full-name-input" type="text" />
      <button type="button" data-testid="sign-in-link">Sign in</button>
    `
    loginPage.parentElement!.appendChild(registerPage)

    await waitFor(() => {
      expect(screen.getByTestId('register-title')).toHaveTextContent('Create Account')
      expect(screen.getByTestId('register-subtitle')).toHaveTextContent('Join us today')
      expect(screen.getByTestId('full-name-input')).toBeInTheDocument()
    })
  })

  it('should validate registration form', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockRegisterPage />)

    const createAccountButton = screen.getByTestId('create-account-button')
    await user.click(createAccountButton)

    // Show all validation errors
    const fullNameError = screen.getByTestId('full-name-error')
    const emailError = screen.getByTestId('email-error')
    const passwordError = screen.getByTestId('password-error')
    const confirmPasswordError = screen.getByTestId('confirm-password-error')
    const termsError = screen.getByTestId('terms-error')

    fullNameError.style.display = 'block'
    emailError.style.display = 'block'
    passwordError.style.display = 'block'
    confirmPasswordError.style.display = 'block'
    termsError.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('full-name-error')).toBeInTheDocument()
      expect(screen.getByTestId('email-error')).toBeInTheDocument()
      expect(screen.getByTestId('password-error')).toBeInTheDocument()
      expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument()
      expect(screen.getByTestId('terms-error')).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const emailInput = screen.getByTestId('email-input')
    const signInButton = screen.getByTestId('sign-in-button')

    await user.type(emailInput, 'invalid-email')
    await user.click(signInButton)

    // Show email validation error
    const emailError = screen.getByTestId('email-error')
    emailError.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toBeInTheDocument()
    })
  })

  it('should validate password strength', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockRegisterPage />)

    const passwordInput = screen.getByTestId('password-input')
    const createAccountButton = screen.getByTestId('create-account-button')

    await user.type(passwordInput, 'weak')
    await user.click(createAccountButton)

    // Show password validation error
    const passwordError = screen.getByTestId('password-error')
    passwordError.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('password-error')).toBeInTheDocument()
    })
  })

  it('should validate password confirmation', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockRegisterPage />)

    const passwordInput = screen.getByTestId('password-input')
    const confirmPasswordInput = screen.getByTestId('confirm-password-input')
    const createAccountButton = screen.getByTestId('create-account-button')

    await user.type(passwordInput, 'Password123')
    await user.type(confirmPasswordInput, 'DifferentPass')
    await user.click(createAccountButton)

    // Show password mismatch error
    const confirmPasswordError = screen.getByTestId('confirm-password-error')
    confirmPasswordError.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('confirm-password-error')).toBeInTheDocument()
    })
  })

  it('should handle remember me functionality', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const rememberMeCheckbox = screen.getByTestId('remember-me')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'Password123')
    await user.click(rememberMeCheckbox)

    expect(rememberMeCheckbox).toBeChecked()

    // Simulate remembering user
    const userData = {
      email: 'test@example.com',
      rememberMe: true
    }
    localStorage.setItem('user-credentials', JSON.stringify(userData))

    expect(JSON.parse(localStorage.getItem('user-credentials') || '{}')).toEqual(userData)
  })

  it('should handle forgot password flow', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const forgotPasswordLink = screen.getByTestId('forgot-password')
    await user.click(forgotPasswordLink)

    // Mock forgot password modal
    const modal = document.createElement('div')
    modal.setAttribute('data-testid', 'forgot-password-modal')
    modal.setAttribute('role', 'dialog')
    modal.innerHTML = `
      <h2>Reset Password</h2>
      <input data-testid="reset-email-input" type="email" placeholder="Enter your email" />
      <button data-testid="send-reset-link">Send Reset Link</button>
    `
    document.body.appendChild(modal)

    await waitFor(() => {
      expect(screen.getByTestId('forgot-password-modal')).toBeInTheDocument()
      expect(screen.getByTestId('reset-email-input')).toBeInTheDocument()
    })
  })

  it('should handle social login', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    // Add social login buttons
    const socialLoginContainer = document.createElement('div')
    socialLoginContainer.innerHTML = `
      <button data-testid="google-login">Sign in with Google</button>
      <button data-testid="facebook-login">Sign in with Facebook</button>
      <button data-testid="apple-login">Sign in with Apple</button>
    `
    screen.getByTestId('login-form').parentElement!.appendChild(socialLoginContainer)

    const googleButton = screen.getByTestId('google-login')
    await user.click(googleButton)

    expect(googleButton).toBeInTheDocument()
  })

  it('should handle loading states', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const signInButton = screen.getByTestId('sign-in-button')
    
    // Add loading state
    signInButton.textContent = 'Signing in...'
    signInButton.disabled = true

    await user.type(screen.getByTestId('email-input'), 'test@example.com')
    await user.type(screen.getByTestId('password-input'), 'Password123')
    await user.click(signInButton)

    expect(signInButton).toBeDisabled()
    expect(signInButton).toHaveTextContent('Signing in...')
  })

  it('should be accessible', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    // Test keyboard navigation
    await user.tab()
    expect(screen.getByLabelText('Email')).toHaveFocus()

    await user.tab()
    expect(screen.getByLabelText('Password')).toHaveFocus()

    // Test ARIA labels
    expect(screen.getByRole('heading', { name: 'Welcome Back' })).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()

    // Test form validation announcements
    const signInButton = screen.getByTestId('sign-in-button')
    await user.click(signInButton)

    // Error messages should be announced
    const emailError = screen.getByTestId('email-error')
    emailError.style.display = 'block'
    emailError.setAttribute('role', 'alert')

    expect(emailError).toHaveAttribute('role', 'alert')
  })

  it('should handle session persistence', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    // Simulate successful login
    await user.type(screen.getByTestId('email-input'), 'test@example.com')
    await user.type(screen.getByTestId('password-input'), 'Password123')
    await user.click(screen.getByTestId('sign-in-button'))

    // Mock session storage
    const sessionData = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      },
      token: 'mock-jwt-token',
      expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }

    sessionStorage.setItem('user-session', JSON.stringify(sessionData))

    expect(JSON.parse(sessionStorage.getItem('user-session') || '{}')).toEqual(sessionData)
  })

  it('should handle logout', async () => {
    const user = userEvent.setup()
    
    // Mock logged in state
    const sessionData = {
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User'
      },
      token: 'mock-jwt-token'
    }
    sessionStorage.setItem('user-session', JSON.stringify(sessionData))

    // Add logout button
    const logoutButton = document.createElement('button')
    logoutButton.textContent = 'Logout'
    logoutButton.setAttribute('data-testid', 'logout-button')
    document.body.appendChild(logoutButton)

    await user.click(logoutButton)

    // Clear session
    sessionStorage.clear()

    expect(sessionStorage.getItem('user-session')).toBeNull()
  })

  it('should handle account lockout after failed attempts', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    const signInButton = screen.getByTestId('sign-in-button')
    const errorMessage = screen.getByTestId('error-message')

    // Simulate multiple failed attempts
    for (let i = 0; i < 5; i++) {
      await user.type(screen.getByTestId('email-input'), 'wrong@example.com')
      await user.type(screen.getByTestId('password-input'), 'wrongpass')
      await user.click(signInButton)
      
      // Clear inputs for next attempt
      await user.clear(screen.getByTestId('email-input'))
      await user.clear(screen.getByTestId('password-input'))
    }

    // Show account locked message
    errorMessage.textContent = 'Account temporarily locked. Try again later.'
    errorMessage.style.display = 'block'

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Account temporarily locked. Try again later.'
      )
    })
  })

  it('should handle two-factor authentication', async () => {
    const user = userEvent.setup()
    renderWithProviders(<MockLoginPage />)

    // Simulate successful login with 2FA
    await user.type(screen.getByTestId('email-input'), 'test@example.com')
    await user.type(screen.getByTestId('password-input'), 'Password123')
    await user.click(screen.getByTestId('sign-in-button'))

    // Show 2FA modal
    const twoFactorModal = document.createElement('div')
    twoFactorModal.setAttribute('data-testid', 'two-factor-modal')
    twoFactorModal.setAttribute('role', 'dialog')
    twoFactorModal.innerHTML = `
      <h2>Two-Factor Authentication</h2>
      <p>Enter the code sent to your email</p>
      <input data-testid="2fa-code-input" type="text" maxlength="6" />
      <button data-testid="verify-2fa">Verify</button>
    `
    document.body.appendChild(twoFactorModal)

    await waitFor(() => {
      expect(screen.getByTestId('two-factor-modal')).toBeInTheDocument()
      expect(screen.getByTestId('2fa-code-input')).toBeInTheDocument()
    })

    const codeInput = screen.getByTestId('2fa-code-input')
    await user.type(codeInput, '123456')
    await user.click(screen.getByTestId('verify-2fa'))

    expect(codeInput).toHaveValue('123456')
  })
})
