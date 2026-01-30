import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce, useDebouncedCallback } from '../useDebounce'

describe('useDebounce Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'updated', delay: 500 })
    
    // Should still be initial value before delay
    expect(result.current).toBe('initial')

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should be updated after delay
    expect(result.current).toBe('updated')
  })

  it('should handle rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    // Rapidly change values
    rerender({ value: 'change1', delay: 500 })
    rerender({ value: 'change2', delay: 500 })
    rerender({ value: 'change3', delay: 500 })

    // Should still be initial
    expect(result.current).toBe('initial')

    // Fast-forward
    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should have the last value
    expect(result.current).toBe('change3')
  })

  it('should handle different delay times', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 }
      }
    )

    rerender({ value: 'updated', delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 0 }
      }
    )

    rerender({ value: 'updated', delay: 0 })

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })

  it('should handle different data types', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 0, delay: 100 }
      }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe(42)
  })

  it('should handle objects', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { 
          value: { name: 'John', age: 30 }, 
          delay: 100 
        }
      }
    )

    expect(result.current).toEqual({ name: 'John', age: 30 })

    const newValue = { name: 'Jane', age: 25 }
    rerender({ value: newValue, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toEqual(newValue)
  })

  it('should handle arrays', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { 
          value: [1, 2, 3], 
          delay: 100 
        }
      }
    )

    expect(result.current).toEqual([1, 2, 3])

    const newArray = [4, 5, 6]
    rerender({ value: newArray, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toEqual(newArray)
  })

  it('should handle null and undefined values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { 
          value: null as string | null, 
          delay: 100 
        }
      }
    )

    expect(result.current).toBeNull()

    rerender({ value: undefined, delay: 100 })

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBeUndefined()
  })

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    )

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    unmount()

    // Should cleanup timer
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })
})

describe('useDebouncedCallback Hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial callback immediately', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => 
      useDebouncedCallback(mockCallback, 500)
    )

    expect(typeof result.current).toBe('function')
  })

  it('should debounce callback changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback1, delay: 500 }
      }
    )

    // Call the debounced callback
    result.current()

    // Should not call original callback yet
    expect(mockCallback1).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should call original callback after delay
    expect(mockCallback1).toHaveBeenCalledTimes(1)

    // Change callback
    rerender({ callback: mockCallback2, delay: 500 })

    result.current()

    expect(mockCallback2).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(mockCallback2).toHaveBeenCalledTimes(1)
  })

  it('should pass arguments correctly', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => 
      useDebouncedCallback(mockCallback, 100)
    )

    result.current('arg1', 'arg2', 123)

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2', 123)
  })

  it('should handle rapid callback changes', () => {
    const mockCallback1 = vi.fn()
    const mockCallback2 = vi.fn()
    const mockCallback3 = vi.fn()
    
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback1, delay: 500 }
      }
    )

    // Rapidly change callbacks
    rerender({ callback: mockCallback2, delay: 500 })
    rerender({ callback: mockCallback3, delay: 500 })

    result.current()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should only call the last callback
    expect(mockCallback1).not.toHaveBeenCalled()
    expect(mockCallback2).not.toHaveBeenCalled()
    expect(mockCallback3).toHaveBeenCalledTimes(1)
  })

  it('should handle zero delay', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => 
      useDebouncedCallback(mockCallback, 0)
    )

    result.current()

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(mockCallback).toHaveBeenCalledTimes(1)
  })

  it('should cleanup on unmount', () => {
    const mockCallback = vi.fn()
    const { unmount } = renderHook(() => 
      useDebouncedCallback(mockCallback, 500)
    )

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should maintain callback reference during delay', () => {
    const mockCallback = vi.fn()
    const { result } = renderHook(() => 
      useDebouncedCallback(mockCallback, 500)
    )

    const initialCallback = result.current

    // Call multiple times before delay
    result.current('call1')
    result.current('call2')
    result.current('call3')

    // Should be the same function reference
    expect(result.current).toBe(initialCallback)

    act(() => {
      vi.advanceTimersByTime(500)
    })

    // Should only call once due to debouncing
    expect(mockCallback).toHaveBeenCalledTimes(1)
    expect(mockCallback).toHaveBeenCalledWith('call3')
  })
})
