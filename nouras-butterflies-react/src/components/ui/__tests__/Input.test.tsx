import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../Input'

// Mock dependencies
vi.mock('../../../utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ')
  }
}))

vi.mock('../../../utils/sanitization', () => ({
  sanitizeInput: (input: string) => input.trim()
}))

vi.mock('../../../hooks/useAnnouncer', () => ({
  useAnnouncer: () => ({
    announce: vi.fn()
  })
}))

vi.mock('../VisuallyHidden', () => ({
  VisuallyHidden: ({ children }: { children: React.ReactNode }) => (
    <span style={{ display: 'none' }}>{children}</span>
  )
}))

describe('Input Component', () => {
  it('should render with label', () => {
    render(<Input label="Email" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })

  it('should render without label', () => {
    render(<Input aria-label="Search" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('should handle user input', async () => {
    const user = userEvent.setup()
    render(<Input label="Name" />)
    
    const input = screen.getByLabelText('Name')
    await user.type(input, 'John Doe')
    
    expect(input).toHaveValue('John Doe')
  })

  it('should show error state', () => {
    render(<Input label="Email" error="Invalid email" />)
    
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('should show success state', () => {
    render(<Input label="Username" success />)
    
    const input = screen.getByLabelText('Username')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-status'))
  })

  it('should be disabled', () => {
    render(<Input label="Disabled" disabled />)
    
    const input = screen.getByLabelText('Disabled')
    expect(input).toBeDisabled()
  })

  it('should show password toggle for password type', () => {
    render(<Input label="Password" type="password" />)
    
    const toggleButton = screen.getByRole('button', { name: /show/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    render(<Input label="Password" type="password" />)
    
    const input = screen.getByLabelText('Password') as HTMLInputElement
    const toggleButton = screen.getByRole('button', { name: /show/i })
    
    expect(input.type).toBe('password')
    
    await user.click(toggleButton)
    expect(input.type).toBe('text')
  })

  it('should show left icon', () => {
    render(<Input label="Search" leftIcon="search" />)
    expect(screen.getByText('search')).toBeInTheDocument()
  })

  it('should show right icon', () => {
    render(<Input label="Email" rightIcon="email" />)
    expect(screen.getByText('email')).toBeInTheDocument()
  })

  it('should show helper text', () => {
    render(<Input label="Username" helperText="Must be at least 3 characters" />)
    expect(screen.getByText('Must be at least 3 characters')).toBeInTheDocument()
  })

  it('should enforce maxLength', async () => {
    const user = userEvent.setup()
    render(<Input label="Code" maxLength={5} />)
    
    const input = screen.getByLabelText('Code')
    await user.type(input, '123456789')
    
    expect(input).toHaveValue('12345')
  })

  it('should show character count', async () => {
    const user = userEvent.setup()
    render(<Input label="Bio" maxLength={100} />)
    
    const input = screen.getByLabelText('Bio')
    await user.type(input, 'Hello')
    
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Input label="Default" variant="default" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('border', 'rounded-xl')

    rerender(<Input label="Search" variant="search" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('rounded-full')

    rerender(<Input label="Rounded" variant="rounded" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('rounded-full')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Input label="Small" size="sm" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('px-4', 'py-2', 'text-sm')

    rerender(<Input label="Large" size="lg" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('px-8', 'py-5', 'text-lg')
  })

  it('should handle focus events', async () => {
    const user = userEvent.setup()
    render(<Input label="Focus Test" />)
    
    const input = screen.getByLabelText('Focus Test')
    await user.click(input)
    
    expect(input).toHaveFocus()
  })

  it('should sanitize input when enabled', async () => {
    const user = userEvent.setup()
    render(<Input label="Sanitized" sanitize />)
    
    const input = screen.getByLabelText('Sanitized')
    await user.type(input, '  test  ')
    
    expect(input).toHaveValue('test')
  })

  it('should handle different input types', () => {
    const types = ['text', 'email', 'number', 'tel', 'url'] as const
    
    types.forEach((type) => {
      const { unmount } = render(<Input label={type} type={type} />)
      expect(screen.getByRole(type === 'number' ? 'spinbutton' : 'textbox')).toBeInTheDocument()
      unmount()
    })
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(<Input label="Ref Test" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('should apply custom className', () => {
    render(<Input label="Custom" className="custom-class" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('should handle aria-describedby', () => {
    render(<Input label="Described" aria-describedby="description-id" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-describedby', 'description-id')
  })

  it('should generate unique IDs when not provided', () => {
    render(<Input label="Auto ID" />)
    const input = screen.getByRole('textbox')
    expect(input.id).toMatch(/^input-[a-z0-9]+$/)
  })

  it('should use provided ID', () => {
    render(<Input label="Custom ID" id="custom-input-id" />)
    const input = screen.getByRole('textbox')
    expect(input.id).toBe('custom-input-id')
  })

  it('should announce errors to screen readers', () => {
    const { announce } = require('../../hooks/useAnnouncer')
    render(<Input label="Test" error="Something went wrong" />)
    
    expect(announce).toHaveBeenCalledWith(
      'Test error: Something went wrong',
      'assertive'
    )
  })

  it('should announce character count changes', async () => {
    const user = userEvent.setup()
    const { announce } = require('../../hooks/useAnnouncer')
    render(<Input label="Count" maxLength={10} />)
    
    const input = screen.getByLabelText('Count')
    await user.type(input, 'hello')
    
    expect(announce).toHaveBeenCalledWith(
      '5 of 10 characters used, 5 remaining',
      'polite'
    )
  })

  it('should handle onChange events', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input label="Change" onChange={handleChange} />)
    
    const input = screen.getByLabelText('Change')
    await user.type(input, 'test')
    
    expect(handleChange).toHaveBeenCalled()
  })

  it('should handle onBlur events', async () => {
    const user = userEvent.setup()
    const handleBlur = vi.fn()
    render(<Input label="Blur" onBlur={handleBlur} />)
    
    const input = screen.getByLabelText('Blur')
    await user.click(input)
    await user.tab() // Move focus away
    
    expect(handleBlur).toHaveBeenCalled()
  })

  it('should handle onFocus events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    render(<Input label="Focus" onFocus={handleFocus} />)
    
    const input = screen.getByLabelText('Focus')
    await user.click(input)
    
    expect(handleFocus).toHaveBeenCalled()
  })

  it('should be accessible with keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Input label="Keyboard" />)
    
    const input = screen.getByLabelText('Keyboard')
    
    // Tab to focus
    await user.tab()
    expect(input).toHaveFocus()
    
    // Type with keyboard
    await user.keyboard('Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('should handle placeholder text', () => {
    render(<Input label="Placeholder" placeholder="Enter your name" />)
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('should handle required attribute', () => {
    render(<Input label="Required" required />)
    const input = screen.getByLabelText('Required')
    expect(input).toBeRequired()
  })

  it('should handle readonly attribute', () => {
    render(<Input label="Readonly" readOnly />)
    const input = screen.getByLabelText('Readonly')
    expect(input).toHaveAttribute('readonly')
  })

  it('should handle autocomplete attribute', () => {
    render(<Input label="Autocomplete" autoComplete="email" />)
    const input = screen.getByLabelText('Autocomplete')
    expect(input).toHaveAttribute('autocomplete', 'email')
  })
})
