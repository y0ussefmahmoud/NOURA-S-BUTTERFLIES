import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'Password123')
    await page.click('button:has-text("Sign In")')
    
    await expect(page).toHaveURL('/account')
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
  })

  test('should register new user', async ({ page }) => {
    await page.goto('/register')
    
    await page.fill('[name="name"]', 'New User')
    await page.fill('[name="email"]', `test${Date.now()}@example.com`)
    await page.fill('[name="password"]', 'Password123')
    await page.click('button:has-text("Create Account")')
    
    await expect(page).toHaveURL('/account')
  })

  test('should show validation errors', async ({ page }) => {
    await page.goto('/login')
    
    await page.click('button:has-text("Sign In")')
    
    await expect(page.locator('text=Please enter a valid email')).toBeVisible()
  })

  test('should switch between login and register', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.locator('text=Welcome Back')).toBeVisible()
    
    await page.click('button:has-text("Sign up")')
    
    await expect(page.locator('text=Create Account')).toBeVisible()
    await expect(page.locator('[name="name"]')).toBeVisible()
  })

  test('should validate registration form', async ({ page }) => {
    await page.goto('/register')
    
    await page.click('button:has-text("Create Account")')
    
    await expect(page.locator('text=Name is required')).toBeVisible()
  })

  test('should handle password visibility toggle', async ({ page }) => {
    await page.goto('/login')
    
    const passwordInput = page.locator('[name="password"]')
    const toggleButton = page.locator('button[aria-label*="password"]')
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    await toggleButton.click()
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click to hide password again
    await toggleButton.click()
    expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should handle forgot password flow', async ({ page }) => {
    await page.goto('/login')
    
    await page.click('a:has-text("Forgot your password?")')
    
    // Should show password reset form
    await expect(page.locator('text=Reset Password')).toBeVisible()
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible()
    
    // Fill email and submit
    await page.fill('input[placeholder*="email"]', 'test@example.com')
    await page.click('button:has-text("Send Reset Link")')
    
    await expect(page.locator('text=Reset link sent')).toBeVisible()
  })

  test('should remember login with remember me', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'Password123')
    await page.check('[name="rememberMe"]')
    await page.click('button:has-text("Sign In")')
    
    await expect(page).toHaveURL('/account')
    
    // Check if session persists (mock check)
    const hasSession = await page.evaluate(() => {
      return localStorage.getItem('rememberMe') === 'true'
    })
    expect(hasSession).toBe(true)
  })

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'MockPassword123')
    await page.click('button:has-text("Sign In")')
    
    await expect(page).toHaveURL('/account')
    
    // Then logout
    await page.click('[data-testid="user-menu"]')
    await page.click('button:has-text("Logout")')
    
    await expect(page).toHaveURL('/login')
  })

  test('should handle social login', async ({ page }) => {
    await page.goto('/login')
    
    // Check for social login buttons
    const googleButton = page.locator('button:has-text("Sign in with Google")')
    const facebookButton = page.locator('button:has-text("Sign in with Facebook")')
    
    if (await googleButton.isVisible()) {
      await googleButton.click()
      
      // Should redirect to OAuth provider
      await expect(page).toHaveURL(/accounts\.google\.com/)
    }
    
    if (await facebookButton.isVisible()) {
      await facebookButton.click()
      
      // Should redirect to OAuth provider
      await expect(page).toHaveURL(/facebook\.com/)
    }
  })

  test('should handle account lockout after failed attempts', async ({ page }) => {
    await page.goto('/login')
    
    // Multiple failed login attempts
    for (let i = 0; i < 5; i++) {
      await page.fill('[name="email"]', `wrong${i}@example.com`)
      await page.fill('[name="password"]', 'wrongpassword')
      await page.click('button:has-text("Sign In")')
      
      // Wait for error message
      if (i < 4) {
        await page.waitForTimeout(1000)
      }
    }
    
    // Should show account locked message
    await expect(page.locator('text=Account temporarily locked')).toBeVisible()
  })

  test('should validate email format in real-time', async ({ page }) => {
    await page.goto('/register')
    
    const emailInput = page.locator('[name="email"]')
    
    // Test invalid email
    await emailInput.fill('invalid-email')
    await page.waitForTimeout(500)
    
    // Should show error
    expect(page.locator('text=Please enter a valid email')).toBeVisible()
    
    // Test valid email
    await emailInput.fill('valid@example.com')
    await page.waitForTimeout(500)
    
    // Should clear error
    expect(page.locator('text=Please enter a valid email')).not.toBeVisible()
  })

  test('should validate password strength', async ({ page }) => {
    await page.goto('/register')
    
    const passwordInput = page.locator('[name="password"]')
    
    // Test weak password
    await passwordInput.fill('weak')
    await page.waitForTimeout(500)
    
    // Should show strength indicator
    expect(page.locator('[data-testid="password-strength"]')).toBeVisible()
    expect(page.locator('text=Password strength: Weak')).toBeVisible()
    
    // Test strong password
    await passwordInput.fill('StrongP@ssw0rd123!')
    await page.waitForTimeout(500)
    
    // Should update strength indicator
    expect(page.locator('text=Password strength: Strong')).toBeVisible()
  })

  test('should handle two-factor authentication', async ({ page }) => {
    await page.goto('/login')
    
    // Mock successful login with 2FA
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'Password123')
    await page.click('button:has-text("Sign In")')
    
    // Should show 2FA screen
    await expect(page.locator('text=Two-Factor Authentication')).toBeVisible()
    await expect(page.locator('input[placeholder*="code"]')).toBeVisible()
    
    // Enter 2FA code
    await page.fill('input[placeholder*="code"]', '123456')
    await page.click('button:has-text("Verify")')
    
    await expect(page).toHaveURL('/account')
  })

  test('should be accessible', async ({ page }) => {
    await page.goto('/login')
    
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="email"]')).toHaveFocus()
    
    await page.keyboard.press('Tab')
    await expect(page.locator('[name="password"]')).toHaveFocus()
    
    // Test ARIA labels
    await expect(page.locator('[name="email"]')).toHaveAttribute('aria-label', 'Email Address')
    await expect(page.locator('[name="password"]')).toHaveAttribute('aria-label', 'Password')
    
    // Test form announcements
    await page.click('button:has-text("Sign In")')
    await expect(page.locator('[role="alert"]')).toBeVisible()
  })

  test('should handle loading states', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'Password123')
    
    // Click sign in
    await page.click('button:has-text("Sign In")')
    
    // Should show loading state
    await expect(page.locator('button:has-text("Signing in...")')).toBeVisible()
    await expect(page.locator('button[disabled]')).toBeVisible()
    
    // Should show loading indicator
    await expect(page.locator('[data-testid="loading-indicator"]')).toBeVisible()
    await expect(page.locator('[data-testid="loading-indicator"]')).toHaveAttribute('aria-live', 'polite')
  })
})
