import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Modal } from '../Modal'

// Mock dependencies
vi.mock('../../../utils/cn', () => ({
  cn: (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ')
  }
}))

vi.mock('../../../hooks/useFocusTrap', () => ({
  useFocusTrap: () => ({
    containerRef: { current: null },
    activate: vi.fn(),
    deactivate: vi.fn()
  })
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

// Mock createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (children: React.ReactNode) => children
  }
})

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = ''
  })

  afterEach(() => {
    // Clean up body styles
    document.body.style.overflow = ''
  })

  it('should not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    )
    
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('should render when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    )
    
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('should render with title', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    )
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', expect.stringContaining('modal-title-'))
  })

  it('should render with description', () => {
    render(
      <Modal open={true} onClose={vi.fn()} description="Modal description">
        <div>Content</div>
      </Modal>
    )
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-describedby', expect.stringContaining('modal-description-'))
  })

  it('should close on overlay click when enabled', async () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} closeOnOverlayClick={true}>
        <div>Content</div>
      </Modal>
    )
    
    const overlay = screen.getByTestId('modal-overlay')
    await userEvent.click(overlay)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not close on overlay click when disabled', async () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} closeOnOverlayClick={false}>
        <div>Content</div>
      </Modal>
    )
    
    const overlay = screen.getByTestId('modal-overlay')
    await userEvent.click(overlay)
    
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should close on escape key when enabled', async () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} closeOnEscape={true}>
        <div>Content</div>
      </Modal>
    )
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should show close button when enabled', () => {
    render(
      <Modal open={true} onClose={vi.fn()} showCloseButton={true}>
        <div>Content</div>
      </Modal>
    )
    
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('should not show close button when disabled', () => {
    render(
      <Modal open={true} onClose={vi.fn()} showCloseButton={false}>
        <div>Content</div>
      </Modal>
    )
    
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('should close when close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal open={true} onClose={onClose} showCloseButton={true}>
        <div>Content</div>
      </Modal>
    )
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    await userEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should prevent body scroll when open', () => {
    render(
      <Modal open={true} onClose={vi.fn()} preventScroll={true}>
        <div>Content</div>
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('should restore body scroll when closed', () => {
    const { rerender } = render(
      <Modal open={true} onClose={vi.fn()} preventScroll={true}>
        <div>Content</div>
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('hidden')
    
    rerender(
      <Modal open={false} onClose={vi.fn()} preventScroll={true}>
        <div>Content</div>
      </Modal>
    )
    
    expect(document.body.style.overflow).toBe('')
  })

  it('should apply size classes', () => {
    const { rerender } = render(
      <Modal open={true} onClose={vi.fn()} size="sm">
        <div>Content</div>
      </Modal>
    )
    
    let modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('max-w-md')

    rerender(
      <Modal open={true} onClose={vi.fn()} size="lg">
        <div>Content</div>
      </Modal>
    )
    
    modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('max-w-2xl')
  })

  it('should have proper ARIA attributes', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal" description="Test Description">
        <div>Content</div>
      </Modal>
    )
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAttribute('role', 'dialog')
  })

  it('should announce modal opening to screen readers', () => {
    const { announce } = require('../../hooks/useAnnouncer')
    
    render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    )
    
    expect(announce).toHaveBeenCalledWith('Modal opened: Test Modal', 'polite')
  })

  it('should announce modal closing to screen readers', () => {
    const { announce } = require('../../hooks/useAnnouncer')
    
    const { rerender } = render(
      <Modal open={true} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    )
    
    rerender(
      <Modal open={false} onClose={vi.fn()} title="Test Modal">
        <div>Content</div>
      </Modal>
    )
    
    expect(announce).toHaveBeenCalledWith('Modal closed', 'polite')
  })

  it('should forward ref correctly', () => {
    const ref = { current: null }
    render(
      <Modal open={true} onClose={vi.fn()} ref={ref}>
        <div>Content</div>
      </Modal>
    )
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should apply custom className', () => {
    render(
      <Modal open={true} onClose={vi.fn()} className="custom-modal">
        <div>Content</div>
      </Modal>
    )
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('custom-modal')
  })

  it('should apply custom overlay className', () => {
    render(
      <Modal open={true} onClose={vi.fn()} overlayClassName="custom-overlay">
        <div>Content</div>
      </Modal>
    )
    
    const overlay = screen.getByTestId('modal-overlay')
    expect(overlay).toHaveClass('custom-overlay')
  })

  it('should trap focus within modal', () => {
    const { activate } = require('../../hooks/useFocusTrap')
    
    render(
      <Modal open={true} onClose={vi.fn()}>
        <div>Content</div>
      </Modal>
    )
    
    expect(activate).toHaveBeenCalled()
  })

  it('should handle keyboard navigation', async () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <button>Button 1</button>
        <button>Button 2</button>
      </Modal>
    )
    
    const button1 = screen.getByText('Button 1')
    const button2 = screen.getByText('Button 2')
    
    // Tab navigation should work within modal
    await userEvent.tab()
    expect(button1).toHaveFocus()
    
    await userEvent.tab()
    expect(button2).toHaveFocus()
  })

  it('should be accessible', async () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Accessible Modal">
        <div>Modal Content</div>
      </Modal>
    )
    
    const modal = screen.getByRole('dialog')
    
    // Check ARIA attributes
    expect(modal).toHaveAttribute('aria-modal', 'true')
    expect(modal).toHaveAttribute('role', 'dialog')
    expect(modal).toHaveAttribute('aria-labelledby', expect.stringContaining('modal-title-'))
    
    // Check focus management
    await waitFor(() => {
      expect(modal).toHaveFocus()
    })
  })

  it('should handle Modal.Header component', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <Modal.Header title="Header Title" />
      </Modal>
    )
    
    expect(screen.getByText('Header Title')).toBeInTheDocument()
  })

  it('should handle Modal.Body component', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <Modal.Body>Body Content</Modal.Body>
      </Modal>
    )
    
    expect(screen.getByText('Body Content')).toBeInTheDocument()
  })

  it('should handle Modal.Footer component', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <Modal.Footer>Footer Content</Modal.Footer>
      </Modal>
    )
    
    expect(screen.getByText('Footer Content')).toBeInTheDocument()
  })

  it('should handle complete modal structure', () => {
    render(
      <Modal open={true} onClose={vi.fn()} title="Complete Modal">
        <Modal.Header title="Modal Header" />
        <Modal.Body>Modal body content</Modal.Body>
        <Modal.Footer>
          <button>Cancel</button>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    )
    
    expect(screen.getByText('Modal Header')).toBeInTheDocument()
    expect(screen.getByText('Modal body content')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
    expect(screen.getByText('Save')).toBeInTheDocument()
  })

  it('should handle long content with scrolling', () => {
    const longContent = Array.from({ length: 100 }, (_, i) => `Line ${i}`).join('\n')
    
    render(
      <Modal open={true} onClose={vi.fn()}>
        <Modal.Body>{longContent}</Modal.Body>
      </Modal>
    )
    
    expect(screen.getByText(/Line 0/)).toBeInTheDocument()
    expect(screen.getByText(/Line 99/)).toBeInTheDocument()
  })
})
