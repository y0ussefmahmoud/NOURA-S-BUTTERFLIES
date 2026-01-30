import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIntersectionObserver, useMultipleIntersectionObserver } from '../useIntersectionObserver'

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
global.IntersectionObserver = mockIntersectionObserver

describe('useIntersectionObserver Hook', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockUnobserve: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: vi.fn()
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return ref and isVisible state', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    expect(result.current.ref).toBeDefined()
    expect(typeof result.current.ref.current).toBe('object')
    expect(typeof result.current.isVisible).toBe('boolean')
    expect(result.current.isVisible).toBe(false)
  })

  it('should set isVisible to true when element intersects', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    // Simulate element intersecting
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    }

    mockCallback([mockEntry])

    expect(result.current.isVisible).toBe(true)
  })

  it('should set isVisible to false when element stops intersecting', () => {
    const { result } = renderHook(() => 
      useIntersectionObserver({ triggerOnce: false })
    )

    // First intersect
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    }

    mockCallback([mockEntry])
    expect(result.current.isVisible).toBe(true)

    // Then stop intersecting
    const mockEntryNotIntersecting = {
      isIntersecting: false,
      target: mockEntry.target
    }

    mockCallback([mockEntryNotIntersecting])
    expect(result.current.isVisible).toBe(false)
  })

  it('should unobserve element when triggerOnce is true', () => {
    renderHook(() => useIntersectionObserver({ triggerOnce: true }))

    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    }

    mockCallback([mockEntry])

    expect(mockUnobserve).toHaveBeenCalledWith(mockEntry.target)
  })

  it('should not unobserve element when triggerOnce is false', () => {
    renderHook(() => useIntersectionObserver({ triggerOnce: false }))

    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry = {
      isIntersecting: true,
      target: document.createElement('div')
    }

    mockCallback([mockEntry])

    expect(mockUnobserve).not.toHaveBeenCalled()
  })

  it('should use custom threshold', () => {
    renderHook(() => useIntersectionObserver({ threshold: 0.5 }))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    )
  })

  it('should use custom rootMargin', () => {
    renderHook(() => useIntersectionObserver({ rootMargin: '10px' }))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ rootMargin: '10px' })
    )
  })

  it('should use custom root', () => {
    const rootElement = document.createElement('div')
    renderHook(() => useIntersectionObserver({ root: rootElement }))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ root: rootElement })
    )
  })

  it('should observe element when ref is set', () => {
    const { result } = renderHook(() => useIntersectionObserver())

    // Simulate setting ref
    const element = document.createElement('div')
    result.current.ref.current = element

    expect(mockObserve).toHaveBeenCalledWith(element)
  })

  it('should cleanup observer on unmount', () => {
    const { unmount } = renderHook(() => useIntersectionObserver())

    // Simulate setting ref
    const element = document.createElement('div')
    const { result } = renderHook(() => useIntersectionObserver())
    result.current.ref.current = element

    unmount()

    expect(mockUnobserve).toHaveBeenCalledWith(element)
  })

  it('should handle null element', () => {
    renderHook(() => useIntersectionObserver())

    // Should not observe when ref.current is null
    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('should handle array threshold', () => {
    renderHook(() => useIntersectionObserver({ threshold: [0, 0.5, 1] }))

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: [0, 0.5, 1] })
    )
  })
})

describe('useMultipleIntersectionObserver Hook', () => {
  let mockObserve: ReturnType<typeof vi.fn>
  let mockUnobserve: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockIntersectionObserver.mockImplementation((callback) => ({
      observe: mockObserve,
      unobserve: mockUnobserve,
      disconnect: vi.fn()
    }))
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return refs, visibleStates, and setRef', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(3))

    expect(result.current.refs).toHaveLength(3)
    expect(result.current.visibleStates).toHaveLength(3)
    expect(result.current.visibleStates).toEqual([false, false, false])
    expect(typeof result.current.setRef).toBe('function')
  })

  it('should initialize with correct number of refs', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(5))

    expect(result.current.refs).toHaveLength(5)
    expect(result.current.visibleStates).toHaveLength(5)
  })

  it('should update visible state for intersecting elements', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(2))

    // Simulate setting refs
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    result.current.setRef(0)(element1)
    result.current.setRef(1)(element2)

    // Simulate first element intersecting
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry1 = {
      isIntersecting: true,
      target: element1
    }

    mockCallback([mockEntry1])

    expect(result.current.visibleStates).toEqual([true, false])
  })

  it('should handle multiple elements intersecting', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(2))

    // Simulate setting refs
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    result.current.setRef(0)(element1)
    result.current.setRef(1)(element2)

    // Simulate both elements intersecting
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry1 = {
      isIntersecting: true,
      target: element1
    }
    const mockEntry2 = {
      isIntersecting: true,
      target: element2
    }

    mockCallback([mockEntry1, mockEntry2])

    expect(result.current.visibleStates).toEqual([true, true])
  })

  it('should handle elements stopping intersection', () => {
    const { result } = renderHook(() => 
      useMultipleIntersectionObserver(2, { triggerOnce: false })
    )

    // Simulate setting refs
    const element1 = document.createElement('div')
    result.current.setRef(0)(element1)

    // First intersect
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntryIntersecting = {
      isIntersecting: true,
      target: element1
    }

    mockCallback([mockEntryIntersecting])
    expect(result.current.visibleStates[0]).toBe(true)

    // Then stop intersecting
    const mockEntryNotIntersecting = {
      isIntersecting: false,
      target: element1
    }

    mockCallback([mockEntryNotIntersecting])
    expect(result.current.visibleStates[0]).toBe(false)
  })

  it('should unobserve elements when triggerOnce is true', () => {
    const { result } = renderHook(() => 
      useMultipleIntersectionObserver(2, { triggerOnce: true })
    )

    // Simulate setting refs
    const element1 = document.createElement('div')
    result.current.setRef(0)(element1)

    // Simulate intersecting
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry = {
      isIntersecting: true,
      target: element1
    }

    mockCallback([mockEntry])

    expect(mockUnobserve).toHaveBeenCalledWith(element1)
  })

  it('should observe all elements when refs are set', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(3))

    // Simulate setting refs
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    const element3 = document.createElement('div')

    result.current.setRef(0)(element1)
    result.current.setRef(1)(element2)
    result.current.setRef(2)(element3)

    expect(mockObserve).toHaveBeenCalledTimes(3)
    expect(mockObserve).toHaveBeenCalledWith(element1)
    expect(mockObserve).toHaveBeenCalledWith(element2)
    expect(mockObserve).toHaveBeenCalledWith(element3)
  })

  it('should cleanup all observers on unmount', () => {
    const { unmount } = renderHook(() => useMultipleIntersectionObserver(2))

    // Simulate setting refs
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')
    const { result } = renderHook(() => useMultipleIntersectionObserver(2))
    result.current.setRef(0)(element1)
    result.current.setRef(1)(element2)

    unmount()

    expect(mockUnobserve).toHaveBeenCalledTimes(2)
    expect(mockUnobserve).toHaveBeenCalledWith(element1)
    expect(mockUnobserve).toHaveBeenCalledWith(element2)
  })

  it('should handle empty refs array', () => {
    renderHook(() => useMultipleIntersectionObserver(0))

    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('should handle null elements in refs', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(2))

    // Set one ref to null
    result.current.setRef(0)(null)
    const element2 = document.createElement('div')
    result.current.setRef(1)(element2)

    // Should only observe the non-null element
    expect(mockObserve).toHaveBeenCalledTimes(1)
    expect(mockObserve).toHaveBeenCalledWith(element2)
  })

  it('should use custom options for all observers', () => {
    renderHook(() => 
      useMultipleIntersectionObserver(2, { 
        threshold: 0.5, 
        rootMargin: '10px' 
      })
    )

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ 
        threshold: 0.5, 
        rootMargin: '10px' 
      })
    )
  })

  it('should maintain correct index mapping', () => {
    const { result } = renderHook(() => useMultipleIntersectionObserver(3))

    // Set refs in different order
    const element3 = document.createElement('div')
    const element1 = document.createElement('div')
    const element2 = document.createElement('div')

    result.current.setRef(2)(element3)
    result.current.setRef(0)(element1)
    result.current.setRef(1)(element2)

    // Simulate element1 intersecting (index 0)
    const mockCallback = mockIntersectionObserver.mock.calls[0][0]
    const mockEntry1 = {
      isIntersecting: true,
      target: element1
    }

    mockCallback([mockEntry1])

    expect(result.current.visibleStates).toEqual([true, false, true])
  })
})
