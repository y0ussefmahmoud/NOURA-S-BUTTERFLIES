import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { OptimizedImage } from '../OptimizedImage'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})
window.IntersectionObserver = mockIntersectionObserver

// Mock Image constructor
const mockImage = {
  src: '',
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
  complete: false,
  naturalWidth: 0,
  naturalHeight: 0,
}

Object.defineProperty(global, 'Image', {
  value: vi.fn(() => mockImage),
  writable: true,
})

describe('OptimizedImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockImage.src = ''
    mockImage.onload = null
    mockImage.onerror = null
    mockImage.complete = false
    mockImage.naturalWidth = 0
    mockImage.naturalHeight = 0
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render with alt text', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test image')
  })

  it('should render with placeholder initially', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('placeholder'))
  })

  it('should load actual image when in viewport', async () => {
    const mockCallback = vi.fn()
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    render(<OptimizedImage src="/test.jpg" alt="Test image" />)
    
    expect(mockIntersectionObserver).toHaveBeenCalled()
  })

  it('should handle image load success', () => {
    render(<OptimizedImage src="/test.jpg" alt="Test image" />)
    
    // Simulate successful image load
    mockImage.complete = true
    mockImage.naturalWidth = 800
    mockImage.naturalHeight = 600
    if (mockImage.onload) {
      mockImage.onload()
    }
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/test.jpg')
  })

  it('should handle image load error', () => {
    render(<OptimizedImage src="/invalid.jpg" alt="Test image" />)
    
    // Simulate image load error
    if (mockImage.onerror) {
      mockImage.onerror()
    }
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('error'))
  })

  it('should apply correct CSS classes', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image" 
        className="custom-image"
        priority
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveClass('custom-image')
  })

  it('should handle priority loading', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Test image" 
        priority
      />
    )
    
    // Priority images should load immediately without IntersectionObserver
    expect(mockIntersectionObserver).not.toHaveBeenCalled()
  })

  it('should handle different image formats', () => {
    const formats = ['webp', 'avif', 'jpg', 'png']
    
    formats.forEach((format) => {
      const { unmount } = render(
        <OptimizedImage 
          src={`/test.${format}`} 
          alt={`Test ${format} image`}
        />
      )
      
      const img = screen.getByRole('img')
      expect(img).toBeInTheDocument()
      
      unmount()
    })
  })

  it('should handle responsive images with sizes', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Responsive image"
        sizes="(max-width: 768px) 100vw, 50vw"
        srcSet="/test-small.jpg 300w, /test-medium.jpg 600w, /test-large.jpg 1200w"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw')
    expect(img).toHaveAttribute('srcSet', expect.stringContaining('300w'))
  })

  it('should handle lazy loading', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Lazy image"
        loading="lazy"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('should handle blur placeholder', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Blur image"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('base64'))
  })

  it('should handle empty placeholder', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Empty placeholder image"
        placeholder="empty"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', expect.stringContaining('empty'))
  })

  it('should handle image dimensions', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Sized image"
        width={800}
        height={600}
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('width', '800')
    expect(img).toHaveAttribute('height', '600')
  })

  it('should handle object fit', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Object fit image"
        objectFit="cover"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveStyle('object-fit: cover')
  })

  it('should handle quality setting', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Quality image"
        quality={90}
      />
    )
    
    // Quality should be passed to the image URL or processing
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
  })

  it('should handle onClick events', async () => {
    const handleClick = vi.fn()
    
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Clickable image"
        onClick={handleClick}
      />
    )
    
    const img = screen.getByRole('img')
    await fireEvent.click(img)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should handle onLoad callback', () => {
    const onLoad = vi.fn()
    
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Load callback image"
        onLoad={onLoad}
      />
    )
    
    // Simulate image load
    mockImage.complete = true
    if (mockImage.onload) {
      mockImage.onload()
    }
    
    expect(onLoad).toHaveBeenCalled()
  })

  it('should handle onError callback', () => {
    const onError = vi.fn()
    
    render(
      <OptimizedImage 
        src="/invalid.jpg" 
        alt="Error callback image"
        onError={onError}
      />
    )
    
    // Simulate image error
    if (mockImage.onerror) {
      mockImage.onerror()
    }
    
    expect(onError).toHaveBeenCalled()
  })

  it('should be accessible', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Accessible image"
        role="img"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Accessible image')
  })

  it('should handle decorative images', () => {
    render(
      <OptimizedImage 
        src="/decorative.jpg" 
        alt=""
        decorative
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', '')
    expect(img).toHaveAttribute('role', 'presentation')
  })

  it('should handle fetchPriority', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Priority image"
        fetchPriority="high"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('should handle decoding', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Decoding image"
        decoding="async"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('should handle crossOrigin', () => {
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Cross origin image"
        crossOrigin="anonymous"
      />
    )
    
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('crossorigin', 'anonymous')
  })

  it('should handle ref forwarding', () => {
    const ref = { current: null }
    
    render(
      <OptimizedImage 
        src="/test.jpg" 
        alt="Ref image"
        ref={ref}
      />
    )
    
    // Ref should be forwarded to the img element
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
  })

  it('should handle multiple images', () => {
    render(
      <div>
        <OptimizedImage src="/test1.jpg" alt="Test 1" />
        <OptimizedImage src="/test2.jpg" alt="Test 2" />
        <OptimizedImage src="/test3.jpg" alt="Test 3" />
      </div>
    )
    
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(3)
  })

  it('should handle image updates', () => {
    const { rerender } = render(
      <OptimizedImage src="/test1.jpg" alt="Test 1" />
    )
    
    let img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test 1')
    
    rerender(<OptimizedImage src="/test2.jpg" alt="Test 2" />)
    
    img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Test 2')
  })

  it('should handle unmounting', () => {
    const { unmount } = render(
      <OptimizedImage src="/test.jpg" alt="Test image" />
    )
    
    expect(screen.getByRole('img')).toBeInTheDocument()
    
    unmount()
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })
})
