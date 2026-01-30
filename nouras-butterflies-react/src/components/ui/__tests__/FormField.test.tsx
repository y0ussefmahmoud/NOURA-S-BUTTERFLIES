import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormField } from '../FormField'

// Mock dependencies
vi.mock('../../../utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ')
  }
}))

vi.mock('../VisuallyHidden', () => ({
  VisuallyHidden: ({ children }: { children: React.ReactNode }) => (
    <span style={{ display: 'none' }}>{children}</span>
  )
}))

describe('FormField Component', () => {
  it('should render with label and input', () => {
    render(
      <FormField label="Email">
        <input type="email" data-testid="email-input" />
      </FormField>
    )
    
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toBeInTheDocument()
  })

  it('should associate label with input', () => {
    render(
      <FormField label="Username">
        <input type="text" data-testid="username-input" />
      </FormField>
    )
    
    const label = screen.getByText('Username')
    const input = screen.getByTestId('username-input')
    
    expect(label).toHaveAttribute('for', expect.stringContaining('field-'))
    expect(input.id).toBe(label.getAttribute('for'))
  })

  it('should show error message', () => {
    render(
      <FormField label="Email" error="Invalid email format">
        <input type="email" data-testid="email-input" />
      </FormField>
    )
    
    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    expect(screen.getByTestId('email-input')).toHaveAttribute('aria-invalid', 'true')
  })

  it('should show helper text', () => {
    render(
      <FormField label="Password" helperText="Must be at least 8 characters">
        <input type="password" data-testid="password-input" />
      </FormField>
    )
    
    expect(screen.getByText('Must be at least 8 characters')).toBeInTheDocument()
  })

  it('should show required indicator', () => {
    render(
      <FormField label="Name" required>
        <input type="text" data-testid="name-input" />
      </FormField>
    )
    
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('should show optional indicator', () => {
    render(
      <FormField label="Phone" optional>
        <input type="tel" data-testid="phone-input" />
      </FormField>
    )
    
    expect(screen.getByText('(optional)')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(
      <FormField label="Custom" className="custom-field">
        <input type="text" data-testid="custom-input" />
      </FormField>
    )
    
    const fieldContainer = screen.getByText('Custom').closest('div')
    expect(fieldContainer).toHaveClass('custom-field')
  })

  it('should handle label click to focus input', async () => {
    const user = userEvent.setup()
    render(
      <FormField label="Clickable Label">
        <input type="text" data-testid="clickable-input" />
      </FormField>
    )
    
    const label = screen.getByText('Clickable Label')
    const input = screen.getByTestId('clickable-input')
    
    await user.click(label)
    expect(input).toHaveFocus()
  })

  it('should generate unique IDs', () => {
    render(
      <>
        <FormField label="Field 1">
          <input type="text" data-testid="field-1" />
        </FormField>
        <FormField label="Field 2">
          <input type="text" data-testid="field-2" />
        </FormField>
      </>
    )
    
    const input1 = screen.getByTestId('field-1')
    const input2 = screen.getByTestId('field-2')
    
    expect(input1.id).not.toBe(input2.id)
    expect(input1.id).toMatch(/^field-[a-z0-9]+$/)
    expect(input2.id).toMatch(/^field-[a-z0-9]+$/)
  })

  it('should use provided ID', () => {
    render(
      <FormField label="Custom ID" id="custom-field-id">
        <input type="text" data-testid="custom-id-input" />
      </FormField>
    )
    
    const label = screen.getByText('Custom ID')
    const input = screen.getByTestId('custom-id-input')
    
    expect(label).toHaveAttribute('for', 'custom-field-id')
    expect(input.id).toBe('custom-field-id')
  })

  it('should handle description text', () => {
    render(
      <FormField label="Description" description="Field description">
        <input type="text" data-testid="description-input" />
      </FormField>
    )
    
    expect(screen.getByText('Field description')).toBeInTheDocument()
  })

  it('should associate description with input', () => {
    render(
      <FormField label="Description" description="Field description">
        <input type="text" data-testid="description-input" />
      </FormField>
    )
    
    const input = screen.getByTestId('description-input')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-description'))
  })

  it('should associate error with input', () => {
    render(
      <FormField label="Error Field" error="Error message">
        <input type="text" data-testid="error-input" />
      </FormField>
    )
    
    const input = screen.getByTestId('error-input')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-error'))
  })

  it('should associate helper text with input', () => {
    render(
      <FormField label="Helper Field" helperText="Helper message">
        <input type="text" data-testid="helper-input" />
      </FormField>
    )
    
    const input = screen.getByTestId('helper-input')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('-helper'))
  })

  it('should handle multiple descriptive elements', () => {
    render(
      <FormField 
        label="Complex Field" 
        description="Field description"
        helperText="Helper message"
        error="Error message"
      >
        <input type="text" data-testid="complex-input" />
      </FormField>
    )
    
    const input = screen.getByTestId('complex-input')
    const describedBy = input.getAttribute('aria-describedby')
    
    expect(describedBy).toContain('-description')
    expect(describedBy).toContain('-helper')
    expect(describedBy).toContain('-error')
  })

  it('should render with left icon', () => {
    render(
      <FormField label="Icon Field" leftIcon="person">
        <input type="text" data-testid="icon-input" />
      </FormField>
    )
    
    expect(screen.getByText('person')).toBeInTheDocument()
  })

  it('should render with right icon', () => {
    render(
      <FormField label="Icon Field" rightIcon="visibility">
        <input type="text" data-testid="icon-input" />
      </FormField>
    )
    
    expect(screen.getByText('visibility')).toBeInTheDocument()
  })

  it('should render with both left and right icons', () => {
    render(
      <FormField label="Dual Icons" leftIcon="search" rightIcon="clear">
        <input type="text" data-testid="dual-icons-input" />
      </FormField>
    )
    
    expect(screen.getByText('search')).toBeInTheDocument()
    expect(screen.getByText('clear')).toBeInTheDocument()
  })

  it('should handle disabled state', () => {
    render(
      <FormField label="Disabled Field" disabled>
        <input type="text" data-testid="disabled-input" disabled />
      </FormField>
    )
    
    const input = screen.getByTestId('disabled-input')
    expect(input).toBeDisabled()
  })

  it('should handle readonly state', () => {
    render(
      <FormField label="Readonly Field">
        <input type="text" data-testid="readonly-input" readOnly />
      </FormField>
    )
    
    const input = screen.getByTestId('readonly-input')
    expect(input).toHaveAttribute('readonly')
  })

  it('should handle different input types', () => {
    const types = ['text', 'email', 'password', 'number', 'tel', 'url']
    
    types.forEach((type) => {
      const { unmount } = render(
        <FormField label={`${type} Field`}>
          <input type={type} data-testid={`${type}-input`} />
        </FormField>
      )
      
      expect(screen.getByTestId(`${type}-input`)).toBeInTheDocument()
      expect(screen.getByText(`${type} Field`)).toBeInTheDocument()
      
      unmount()
    })
  })

  it('should be accessible', () => {
    render(
      <FormField label="Accessible Field" required error="This field is required">
        <input type="text" data-testid="accessible-input" />
      </FormField>
    )
    
    const label = screen.getByText('Accessible Field')
    const input = screen.getByTestId('accessible-input')
    const error = screen.getByText('This field is required')
    
    // Check label association
    expect(label).toHaveAttribute('for', input.id)
    
    // Check required indicator
    expect(screen.getByText('*')).toBeInTheDocument()
    
    // Check error state
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining(error.id))
  })

  it('should handle complex children', () => {
    render(
      <FormField label="Complex Field">
        <div>
          <input type="text" data-testid="complex-input" />
          <button type="button">Submit</button>
        </div>
      </FormField>
    )
    
    expect(screen.getByTestId('complex-input')).toBeInTheDocument()
    expect(screen.getByText('Submit')).toBeInTheDocument()
  })

  it('should handle label as React node', () => {
    render(
      <FormField label={<span>Custom Label</span>}>
        <input type="text" data-testid="custom-label-input" />
      </FormField>
    )
    
    expect(screen.getByText('Custom Label')).toBeInTheDocument()
  })

  it('should handle long labels', () => {
    const longLabel = 'This is a very long label that might wrap to multiple lines'
    render(
      <FormField label={longLabel}>
        <input type="text" data-testid="long-label-input" />
      </FormField>
    )
    
    expect(screen.getByText(longLabel)).toBeInTheDocument()
  })

  it('should handle empty children', () => {
    render(
      <FormField label="Empty Field">
        {null}
      </FormField>
    )
    
    expect(screen.getByText('Empty Field')).toBeInTheDocument()
  })

  it('should handle field click events', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    
    render(
      <FormField label="Clickable Field" onClick={handleClick}>
        <input type="text" data-testid="clickable-field-input" />
      </FormField>
    )
    
    const fieldContainer = screen.getByText('Clickable Field').closest('div')
    await user.click(fieldContainer!)
    
    expect(handleClick).toHaveBeenCalled()
  })
})
