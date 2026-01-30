import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../Button'

// Mock VisuallyHidden component
vi.mock('../VisuallyHidden', () => ({
  VisuallyHidden: ({ children }: { children: React.ReactNode }) => (
    <span style={{ display: 'none' }}>{children}</span>
  )
}))

// Mock cn utility
vi.mock('../../../utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ')
  }
}))

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Click me')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    const button = screen.getByRole('button', { name: 'Click' })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
  })

  it('should be disabled when loading', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByRole('button', { name: 'Loading Button - loading' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(button).toHaveAttribute('aria-busy', 'true')
  })

  it('should show loading spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByText('refresh')).toBeInTheDocument()
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('should render with left icon', () => {
    render(<Button leftIcon="add">Add Item</Button>)
    expect(screen.getByText('add')).toBeInTheDocument()
    expect(screen.getByText('Add Item')).toBeInTheDocument()
  })

  it('should render with right icon', () => {
    render(<Button rightIcon="arrow_forward">Continue</Button>)
    expect(screen.getByText('arrow_forward')).toBeInTheDocument()
    expect(screen.getByText('Continue')).toBeInTheDocument()
  })

  it('should render icon variant', () => {
    render(<Button variant="icon" aria-label="Settings">settings</Button>)
    const button = screen.getByRole('button', { name: 'Settings' })
    expect(button).toBeInTheDocument()
    expect(screen.getByText('settings')).toBeInTheDocument()
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('bg-primary')

    rerender(<Button variant="outline">Outline</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('border-2', 'border-primary')

    rerender(<Button variant="ghost">Ghost</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('hover:text-primary')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button')
    expect(button).toHaveClass('px-6', 'py-[10px]', 'text-sm')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button')
    expect(button).toHaveClass('px-10', 'py-4', 'text-lg')
  })

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('w-full')
  })

  it('should handle aria-pressed for toggle buttons', () => {
    render(<Button pressed>Toggle</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('should handle aria-expanded for expandable buttons', () => {
    render(<Button expanded>Expand</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('should handle aria-describedby', () => {
    render(<Button describedBy="description-id">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-describedby', 'description-id')
  })

  it('should generate appropriate aria-label for loading state', () => {
    render(<Button loading>Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Submit - loading')
  })

  it('should use custom aria-label when provided', () => {
    render(<Button aria-label="Custom Label">Button Text</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Custom Label')
  })

  it('should warn when icon button has no aria-label', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(<Button variant="icon">settings</Button>)
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Icon-only Button requires an aria-label for accessibility.'
    )
    
    consoleSpy.mockRestore()
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Button</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Button</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should not show icons when loading', () => {
    render(
      <Button loading leftIcon="add" rightIcon="arrow_forward">
        Loading
      </Button>
    )
    
    expect(screen.queryByText('add')).not.toBeInTheDocument()
    expect(screen.queryByText('arrow_forward')).not.toBeInTheDocument()
    expect(screen.getByText('refresh')).toBeInTheDocument()
  })

  it('should handle all variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'icon'] as const
    
    variants.forEach((variant) => {
      const { unmount } = render(
        <Button variant={variant} aria-label={`${variant} button`}>
          {variant === 'icon' ? 'icon' : `${variant} button`}
        </Button>
      )
      
      const button = screen.getByRole('button', { name: `${variant} button` })
      expect(button).toBeInTheDocument()
      
      unmount()
    })
  })

  it('should handle all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>Size {size}</Button>)
      
      const button = screen.getByRole('button', { name: `Size ${size}` })
      expect(button).toBeInTheDocument()
      
      unmount()
    })
  })

  it('should be accessible with keyboard navigation', () => {
    render(<Button>Button</Button>)
    const button = screen.getByRole('button')
    
    // Test focus
    button.focus()
    expect(button).toHaveFocus()
    
    // Test keyboard interaction
    fireEvent.keyDown(button, { key: 'Enter' })
    fireEvent.keyDown(button, { key: ' ' })
    
    // Should not throw errors
    expect(button).toBeInTheDocument()
  })

  it('should handle complex children', () => {
    render(
      <Button>
        <span>Complex</span>
        <strong>Button</strong>
      </Button>
    )
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByText('Complex')).toBeInTheDocument()
    expect(screen.getByText('Button')).toBeInTheDocument()
  })
})
