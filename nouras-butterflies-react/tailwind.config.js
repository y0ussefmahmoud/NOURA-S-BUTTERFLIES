/** @type {import('tailwindcss').Config} */
import { theme } from './src/styles/theme.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'mobile-lg': '480px',
      'sm': '640px',
      'md': '768px',
      'tablet': '900px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Brand colors from theme
        'primary': theme.colors.primary,
        'gold': theme.colors.gold,
        'background-light': theme.colors.background.light,
        'background-dark': theme.colors.background.dark,
        'accent-pink': theme.colors.accent.pink,
        'soft-text': theme.colors.text.soft,
        'text-dark': theme.colors.text.dark,
        'text-light': theme.colors.text.light,
        'border-light': theme.colors.border.light,
        'border-dark': theme.colors.border.dark,
        'surface-light': theme.colors.surface.light,
        'surface-dark': theme.colors.surface.dark,
        // Admin colors
        'admin-primary': theme.colors.admin.primary,
        'admin-sidebar': theme.colors.admin.sidebar,
        'admin-gold': theme.colors.admin.gold,
        'admin-sage': theme.colors.admin.sage,
        'admin-coral': theme.colors.admin.coral,
      },
      fontFamily: {
        'display': theme.typography.fontFamily.display,
        'sans': theme.typography.fontFamily.body,
        'arabic': theme.typography.fontFamily.arabic,
      },
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      lineHeight: theme.typography.lineHeight,
      spacing: {
        ...theme.spacing,
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    require('tailwindcss-rtl'),
    function({ addUtilities, theme }) {
      addUtilities({
        // RTL utilities
        '.start-0': { 'inset-inline-start': '0' },
        '.end-0': { 'inset-inline-end': '0' },
        '.start-auto': { 'inset-inline-start': 'auto' },
        '.end-auto': { 'inset-inline-end': 'auto' },
        '.flex-start': { 'justify-content': 'flex-start' },
        '.flex-end': { 'justify-content': 'flex-end' },
        
        // Safe area utilities
        '.pt-safe-top': { 'padding-top': 'env(safe-area-inset-top)' },
        '.pb-safe-bottom': { 'padding-bottom': 'env(safe-area-inset-bottom)' },
        '.pl-safe-left': { 'padding-left': 'env(safe-area-inset-left)' },
        '.pr-safe-right': { 'padding-right': 'env(safe-area-inset-right)' },
        '.mt-safe-top': { 'margin-top': 'env(safe-area-inset-top)' },
        '.mb-safe-bottom': { 'margin-bottom': 'env(safe-area-inset-bottom)' },
        
        // Touch target utilities
        '.touch-target': { 
          'min-width': '44px', 
          'min-height': '44px',
          'display': 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        
        // RTL spacing utilities
        '.ms-auto': { 'margin-inline-start': 'auto' },
        '.me-auto': { 'margin-inline-end': 'auto' },
        '.ps-0': { 'padding-inline-start': '0' },
        '.ps-1': { 'padding-inline-start': '0.25rem' },
        '.ps-2': { 'padding-inline-start': '0.5rem' },
        '.ps-3': { 'padding-inline-start': '0.75rem' },
        '.ps-4': { 'padding-inline-start': '1rem' },
        '.ps-6': { 'padding-inline-start': '1.5rem' },
        '.pe-0': { 'padding-inline-end': '0' },
        '.pe-1': { 'padding-inline-end': '0.25rem' },
        '.pe-2': { 'padding-inline-end': '0.5rem' },
        '.pe-3': { 'padding-inline-end': '0.75rem' },
        '.pe-4': { 'padding-inline-end': '1rem' },
        '.pe-6': { 'padding-inline-end': '1.5rem' },
      });
    },
  ],
}
