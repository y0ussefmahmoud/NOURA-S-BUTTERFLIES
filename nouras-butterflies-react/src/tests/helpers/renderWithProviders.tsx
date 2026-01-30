import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options })
