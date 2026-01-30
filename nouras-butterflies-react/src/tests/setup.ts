import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, vi, beforeAll, afterAll } from 'vitest'
import { server } from './mocks/server'

// Setup MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
  server.resetHandlers()
})
afterAll(() => server.close())

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return [] }
  unobserve() {}
}

// Mock navigator.vibrate
Object.defineProperty(navigator, 'vibrate', {
  writable: true,
  value: vi.fn()
})
