# Noura's Butterflies Design System

A comprehensive design system for Noura's Butterflies e-commerce platform, featuring a feminine, soft, and elegant aesthetic with full RTL/LTR support and dark mode capabilities.

## Overview

Noura's Butterflies design system embodies elegance and femininity with soft pink primary colors, gold accents, and cream backgrounds. The system is built with accessibility, mobile-first design, and bilingual support (RTL/LTR) at its core.

### Design Philosophy

- **Feminine**: Soft pink palette with elegant typography
- **Premium**: Gold accents and refined shadows
- **Accessible**: WCAG AA compliant color contrasts
- **Responsive**: Mobile-first approach
- **Bilingual**: Full RTL/LTR support
- **Consistent**: Unified spacing and typography scale

### Core Principles

1. **Mobile-First**: Design for small screens first, then scale up
2. **Accessibility**: Ensure WCAG AA compliance for all interactive elements
3. **Performance**: Optimize for fast loading and smooth interactions
4. **Consistency**: Use design tokens for all styling decisions
5. **Flexibility**: Support both light and dark themes
6. **Internationalization**: Built-in RTL/LTR support

## Color Palette

### Primary Colors

| Color Name | Hex Value | Usage                              | Accessibility        |
| ---------- | --------- | ---------------------------------- | -------------------- |
| Primary    | `#ffb8c4` | Main brand color, CTAs, highlights | ✅ WCAG AA compliant |
| Gold       | `#D4AF37` | Premium accents, special offers    | ✅ WCAG AA compliant |

### Background Colors

| Color Name       | Hex Value | Usage                        | Dark Mode   |
| ---------------- | --------- | ---------------------------- | ----------- |
| Background Light | `#faebe0` | Main page background         | → `#211b18` |
| Background Dark  | `#211b18` | Dark mode background         | ← `#faebe0` |
| Surface Light    | `#ffffff` | Cards, modals, content areas | → `#2d2521` |
| Surface Dark     | `#2d2521` | Dark mode surfaces           | ← `#ffffff` |

### Accent Colors

| Color Name  | Hex Value | Usage                           |
| ----------- | --------- | ------------------------------- |
| Accent Pink | `#f4e6e8` | Subtle highlights, hover states |

### Text Colors

| Color Name | Hex Value | Usage                    | Dark Mode   |
| ---------- | --------- | ------------------------ | ----------- |
| Text Soft  | `#5D4037` | Secondary text, captions | → `#faebe0` |
| Text Dark  | `#1d0c0f` | Primary text, headings   | → `#faebe0` |
| Text Light | `#faebe0` | Text on dark backgrounds | ← `#5D4037` |

### Border Colors

| Color Name   | Hex Value | Usage              | Dark Mode   |
| ------------ | --------- | ------------------ | ----------- |
| Border Light | `#eacdd2` | Light mode borders | → `#3d322c` |
| Border Dark  | `#3d322c` | Dark mode borders  | ← `#eacdd2` |

### Color Usage Guidelines

- **Primary**: Use for main CTAs, important highlights, and brand elements
- **Gold**: Reserve for premium features, special offers, and luxury indicators
- **Background**: Use appropriate background colors based on theme
- **Text**: Ensure sufficient contrast for readability
- **Borders**: Use subtle borders to define content areas

## Typography

### Font Families

| Name    | Font Stack                                 | Usage                  |
| ------- | ------------------------------------------ | ---------------------- |
| Display | `Noto Serif, serif`                        | Headings, elegant text |
| Body    | `Plus Jakarta Sans, Noto Sans, sans-serif` | Body text, UI elements |

### Type Scale

| Size | Value | Usage            | Line Height |
| ---- | ----- | ---------------- | ----------- |
| xs   | 10px  | Labels, captions | 1.5         |
| sm   | 12px  | Small text, meta | 1.5         |
| base | 16px  | Body text        | 1.5         |
| lg   | 18px  | Large body       | 1.5         |
| xl   | 20px  | Small headings   | 1.5         |
| 2xl  | 24px  | Section headings | 1.5         |
| 3xl  | 30px  | Page headings    | 1.1         |
| 4xl  | 36px  | Feature headings | 1.1         |
| 5xl  | 48px  | Hero headings    | 1.1         |
| 6xl  | 60px  | Display headings | 1.1         |
| 7xl  | 72px  | Large display    | 1.1         |

### Font Weights

| Weight   | Value | Usage               |
| -------- | ----- | ------------------- |
| Normal   | 400   | Body text           |
| Medium   | 500   | Emphasis, subtitles |
| Semibold | 600   | Headings, CTAs      |
| Bold     | 700   | Strong emphasis     |

### Line Heights

| Name    | Value | Usage                    |
| ------- | ----- | ------------------------ |
| Tight   | 1.1   | Large headings           |
| Normal  | 1.5   | Body text, most content  |
| Relaxed | 1.7   | Extended reading content |

### Typography Guidelines

- Use **Display** font for headings (h1-h4)
- Use **Body** font for paragraphs, labels, and UI elements
- Maintain consistent hierarchy with the type scale
- Ensure line height provides good readability
- Use font weights to create visual hierarchy

## Spacing System

The spacing system uses a 4px base unit for consistency across all layouts.

### Spacing Scale

| Token | Value | Common Usage         |
| ----- | ----- | -------------------- |
| 0     | 0px   | No spacing           |
| 1     | 4px   | Micro spacing        |
| 2     | 8px   | Small gaps           |
| 3     | 12px  | Medium gaps          |
| 4     | 16px  | Standard spacing     |
| 5     | 20px  | Large spacing        |
| 6     | 24px  | Section spacing      |
| 8     | 32px  | Component separation |
| 10    | 40px  | Large sections       |
| 12    | 48px  | Page sections        |
| 16    | 64px  | Major sections       |
| 20    | 80px  | Full page spacing    |

### Layout Guidelines

| Property            | Value         | Usage                 |
| ------------------- | ------------- | --------------------- |
| Container Max Width | 1280px        | Maximum content width |
| Page Padding        | 1.5rem (24px) | Page margins          |
| Gap Scale           | 1-20          | Component spacing     |

### Spacing Best Practices

- Use the spacing scale consistently
- Prefer even numbers for vertical rhythm
- Use larger spacing for major sections
- Maintain consistent spacing between similar elements

## Border Radius

| Token   | Value         | Usage                      |
| ------- | ------------- | -------------------------- |
| DEFAULT | 0.5rem (8px)  | Buttons, inputs, cards     |
| lg      | 1rem (16px)   | Large cards, modals        |
| xl      | 1.5rem (24px) | Special containers         |
| 2xl     | 2rem (32px)   | Hero sections              |
| 3xl     | 3rem (48px)   | Featured elements          |
| full    | 9999px        | Circular elements, avatars |

### Border Radius Guidelines

- Use **DEFAULT** for most UI elements
- Use **lg** for cards and modals
- Use **xl** and larger for special design elements
- Use **full** for circular elements

## Shadows

### Shadow Tokens

| Name          | Value                                        | Usage                  |
| ------------- | -------------------------------------------- | ---------------------- |
| butterflyGlow | `0 10px 40px -10px rgba(255, 184, 196, 0.3)` | Primary elements, CTAs |
| softCard      | `0 10px 30px rgba(0, 0, 0, 0.03)`            | Content cards          |
| sm            | `0 1px 2px 0 rgba(0, 0, 0, 0.05)`            | Subtle elevation       |
| md            | `0 4px 6px -1px rgba(0, 0, 0, 0.1)`          | Standard elevation     |
| lg            | `0 10px 15px -3px rgba(0, 0, 0, 0.1)`        | High elevation         |

### Shadow Guidelines

- Use **butterflyGlow** for primary CTAs and important elements
- Use **softCard** for content cards and panels
- Use **sm** for subtle elevation needs
- Use **md** for standard UI elevation
- Use **lg** for dropdowns, modals, and floating elements

## Transitions & Animations

### Duration Values

| Name   | Value | Usage                |
| ------ | ----- | -------------------- |
| fast   | 150ms | Quick interactions   |
| normal | 300ms | Standard transitions |
| slow   | 500ms | Complex animations   |

### Easing Functions

| Name    | Value                          | Usage                |
| ------- | ------------------------------ | -------------------- |
| default | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard transitions |
| smooth  | `cubic-bezier(0.4, 0, 0.6, 1)` | Gentle animations    |

### Animation Guidelines

- Keep animations subtle and purposeful
- Use **fast** duration for hover states
- Use **normal** duration for most transitions
- Use **slow** duration for complex state changes
- Prefer **smooth** easing for natural movement
- Avoid heavy animations that may cause motion sickness

## RTL/LTR Support

The design system includes comprehensive RTL/LTR support using CSS custom properties.

### CSS Custom Properties

```css
:root {
  --direction: ltr;
  --text-align-start: left;
  --text-align-end: right;
  --border-start: border-left;
  --border-end: border-right;
}

[dir='rtl'] {
  --direction: rtl;
  --text-align-start: right;
  --text-align-end: left;
  --border-start: border-right;
  --border-end: border-left;
}
```

### RTL Utilities

- `.text-start` - Aligns text to the start (left in LTR, right in RTL)
- `.text-end` - Aligns text to the end (right in LTR, left in RTL)
- `.float-start` - Floats to the start
- `.float-end` - Floats to the end

### RTL Best Practices

- Use semantic class names (start/end instead of left/right)
- Test all layouts in both directions
- Ensure icons and images work correctly in RTL
- Use logical properties when possible
- Consider text direction for mixed content

## Usage Examples

### Importing Theme Values

```typescript
import { colors, typography, spacing } from '../styles/theme';

// Use in components
const primaryColor = colors.primary;
const headingFont = typography.fontFamily.display;
const standardSpacing = spacing[4];
```

### Tailwind Class Examples

```jsx
// Buttons
<button className="bg-primary text-white font-semibold px-6 py-3 rounded-lg butterfly-glow transition-colors-smooth">
  Shop Now
</button>

// Cards
<div className="bg-surface-light border border-border-light rounded-xl soft-card-shadow p-6">
  <h3 className="font-display text-2xl font-semibold text-text-dark mb-4">
    Product Title
  </h3>
  <p className="text-soft-text">
    Product description goes here...
  </p>
</div>

// RTL-safe layout
<div className="flex items-start gap-4">
  <div className="text-start">
    <h2 className="font-display text-3xl">Heading</h2>
  </div>
  <div className="text-end">
    <span className="text-soft-text">Metadata</span>
  </div>
</div>
```

### TypeScript Usage

```typescript
import type { BrandColors, Typography } from '../styles/theme';

interface ComponentProps {
  color: keyof BrandColors;
  fontSize: keyof Typography['fontSize'];
}

const MyComponent: React.FC<ComponentProps> = ({ color, fontSize }) => {
  return (
    <div className={`text-${color} text-${fontSize}`}>
      Styled content
    </div>
  );
};
```

### Utility Functions

```typescript
import {
  getColorWithOpacity,
  isRTL,
  getDirectionalValue,
  setTheme,
  toggleDirection,
} from '../styles/utils';

// Get color with opacity
const fadedPrimary = getColorWithOpacity('primary', 0.5);

// Check current direction
if (isRTL()) {
  // Apply RTL-specific logic
}

// Get directional value
const margin = getDirectionalValue('ml-4', 'mr-4');

// Theme switching
setTheme('dark');
toggleDirection();
```

## Accessibility Guidelines

### Color Contrast

- All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- Interactive elements have sufficient contrast in both light and dark modes
- Avoid using color as the only way to convey information

### Focus States

- All interactive elements have visible focus states
- Focus indicators are at least 2px thick
- Focus colors meet contrast requirements

### Touch Targets

- Minimum touch target size: 44px × 44px
- Adequate spacing between touch targets
- Consider thumb reach for mobile devices

### Screen Reader Support

- Use semantic HTML elements
- Provide alt text for images
- Use ARIA labels when necessary
- Ensure logical reading order

### Keyboard Navigation

- All functionality available via keyboard
- Logical tab order
- Skip links for navigation
- Focus management in modals and dynamic content

## Best Practices

### Design Tokens

- Always use theme tokens instead of hardcoded values
- Import from `theme.ts` for programmatic access
- Use Tailwind utilities with custom theme values
- Maintain consistency across all components

### Component Development

- Build components with theme awareness
- Support both light and dark modes
- Test in RTL and LTR directions
- Use semantic HTML elements
- Include proper accessibility attributes

### Performance

- Optimize images and assets
- Use CSS transitions instead of JavaScript animations
- Minimize layout shifts
- Test on various devices and connections

### Testing

- Test all components in both themes
- Verify RTL/LTR functionality
- Check responsive behavior
- Validate accessibility with screen readers
- Test with keyboard navigation

### Maintenance

- Keep documentation updated
- Document any deviations from the system
- Regular accessibility audits
- Performance monitoring
- User feedback integration

## File Structure

```
src/styles/
├── theme.ts          # Design tokens and TypeScript interfaces
├── utils.ts          # Utility functions and helpers
└── README.md         # This documentation
```

## Integration Notes

### Theme Integration

- All components should reference `theme.ts` for design tokens
- Use Tailwind utility classes with custom theme values
- Import utility functions for programmatic theme access

### Development Workflow

1. Start with mobile-first design
2. Apply theme tokens consistently
3. Test in both light and dark modes
4. Verify RTL/LTR functionality
5. Check accessibility compliance
6. Test responsive behavior

### Common Patterns

- Buttons: `bg-primary text-white rounded-lg butterfly-glow`
- Cards: `bg-surface-light border border-border-light rounded-xl soft-card-shadow`
- Text: `text-text-dark` or `text-text-light` (dark mode)
- Spacing: Use spacing scale tokens
- Transitions: `transition-colors-smooth` for color changes

This design system provides a solid foundation for building consistent, accessible, and beautiful user interfaces for Noura's Butterflies e-commerce platform.
