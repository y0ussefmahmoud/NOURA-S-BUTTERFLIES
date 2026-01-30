# NOURA'S BUTTERFLIES UI Component Library

A comprehensive, accessible, and beautifully designed component library built for the NOURA'S BUTTERFLIES e-commerce platform. This library follows atomic design principles and provides a consistent design system with feminine aesthetics, soft pink accents, and elegant typography.

## 🌟 Accessibility Features

This component library is built with WCAG 2.1 AA compliance as a primary goal. All components include comprehensive accessibility support:

### WCAG 2.1 AA Compliance

- **Color Contrast**: All text meets 4.5:1 contrast ratio minimum
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Screen Reader Support**: Comprehensive ARIA labels and live regions
- **Focus Management**: Clear focus indicators and focus trapping in modals
- **Semantic HTML**: Proper use of semantic elements and landmarks

### Accessibility Hooks

- `useFocusTrap` - Manages focus within modal components
- `useAnnouncer` - Provides screen reader announcements
- `useKeyboardNavigation` - Handles keyboard navigation patterns
- `useAriaAnnounce` - Advanced ARIA live region management

### Accessibility Utilities

- `announceToScreenReader()` - Direct screen reader announcements
- `getAriaLabel()` - Dynamic ARIA label generation
- `trapFocus()` - Focus management utilities
- `setupKeyboardNavigation()` - Keyboard navigation patterns

## Design System

### Colors (WCAG Compliant)

- **Primary**: `#ffb8c4` (Soft Pink) - 4.8:1 contrast with dark text ✅
- **Gold**: `#D4AF37` (Gold Accents) - 3.1:1 contrast (large text) ✅
- **Surface Light**: Light backgrounds
- **Surface Dark**: Dark mode backgrounds
- **Text Dark/Light**: Adaptive text colors (8.2:1 and 6.1:1 contrast) ✅
- **Border Light/Dark**: Adaptive border colors

### Typography

- **Headings**: Noto Serif
- **Body Text**: Plus Jakarta Sans
- **Font Weights**: 300-700
- **Sizes**: Responsive scaling

### Design Patterns

- **Border Radius**: 0.5rem-1.5rem (rounded corners)
- **Shadows**: `butterfly-glow`, `soft-card`
- **Transitions**: Smooth animations (200ms) with reduced motion support
- **Spacing**: Consistent padding/margin system

## Components

### Button

Flexible button component with multiple variants and full accessibility support.

**Variants:**

- `primary` - Main action button with butterfly glow
- `secondary` - Secondary action button
- `outline` - Outlined button style
- `ghost` - Minimal button style
- `icon` - Icon-only button

**Sizes:** `sm`, `md`, `lg`

**Accessibility Features:**

- ARIA labels for icon-only buttons
- Loading state announcements
- Focus management
- Keyboard support
- `aria-pressed` for toggle buttons
- `aria-expanded` for expandable buttons

```tsx
<Button variant="primary" size="md" leftIcon="shopping_cart">
  Add to Cart
</Button>

// Icon button with proper ARIA label
<Button
  variant="icon"
  aria-label="Add to wishlist"
  pressed={isInWishlist}
>
  favorite
</Button>
```

### Input

Versatile input component with comprehensive accessibility features.

**Variants:**

- `default` - Standard input with border
- `search` - Search input with rounded style
- `rounded` - Fully rounded input

**Sizes:** `sm`, `md`, `lg`

**Accessibility Features:**

- ARIA labels and descriptions
- Error announcements via live regions
- Character count announcements
- Password toggle announcements
- Focus management
- Keyboard navigation

```tsx
<Input
  type="email"
  label="Email Address"
  error="Invalid email format"
  leftIcon="mail"
  aria-describedby="email-help"
/>
```

### Modal

Accessible modal component with focus management and screen reader support.

**Features:**

- Focus trapping with `useFocusTrap`
- ARIA attributes (`aria-modal`, `aria-labelledby`, `aria-describedby`)
- Escape key handling
- Screen reader announcements
- Semantic HTML structure

**Accessibility Features:**

- Automatic focus management
- Live region announcements
- Proper ARIA attributes
- Keyboard navigation
- Focus restoration on close

```tsx
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Product Details"
  description="View detailed product information"
>
  <Modal.Header>Product Details</Modal.Header>
  <Modal.Body>Product content here</Modal.Body>
  <Modal.Footer>
    <Button onClick={handleClose}>Close</Button>
  </Modal.Footer>
</Modal>
```

### Accessibility Utility Components

#### VisuallyHidden

Hides content visually while keeping it accessible to screen readers.

```tsx
<VisuallyHidden>Loading content, please wait...</VisuallyHidden>
```

#### SkeletonLoader

Accessible loading placeholders with ARIA attributes.

```tsx
<SkeletonLoader variant="card" aria-label="Loading product information" aria-busy />
```

#### LiveRegion

Reusable ARIA live region for announcements.

```tsx
<LiveRegion type="polite" atomic>
  {announcement}
</LiveRegion>
```

## 🎯 WCAG 2.1 AA Requirements Implementation

### 1. Perceivable

- **Color Contrast**: All text meets 4.5:1 minimum contrast
- **Text Alternatives**: Images have proper alt text
- **Adaptable Content**: Semantic HTML structure
- **Distinguishable**: Focus indicators are clear

### 2. Operable

- **Keyboard Accessible**: All functionality available via keyboard
- **No Keyboard Traps**: Focus management prevents traps
- **Timing Adjustable**: Animations respect `prefers-reduced-motion`
- **Seizure Prevention**: No flashing content

### 3. Understandable

- **Readable**: Clear language and structure
- **Predictable**: Consistent navigation and interactions
- **Input Assistance**: Error messages and help text
- **Language Identification**: Proper lang attributes

### 4. Robust

- **Compatible**: Works with assistive technologies
- **Future-proof**: Semantic HTML and ARIA attributes

## ⌨️ Keyboard Shortcuts

Global keyboard shortcuts for enhanced accessibility:

| Shortcut | Action             | Platform      |
| -------- | ------------------ | ------------- |
| `/`      | Open search        | All           |
| `Ctrl+K` | Open search        | Windows/Linux |
| `Cmd+K`  | Open search        | macOS         |
| `Alt+H`  | Go to homepage     | All           |
| `Alt+C`  | Open cart          | All           |
| `Alt+W`  | Open wishlist      | All           |
| `Alt+D`  | Toggle dark mode   | All           |
| `?`      | Show keyboard help | All           |
| `Escape` | Close modal/cancel | All           |

## 🧪 Testing Accessibility

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y

# Check color contrast
npm run test:contrast

# Lint for accessibility issues
npm run lint:a11y
```

### Manual Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible and clear
- [ ] Screen reader announcements work correctly
- [ ] Color contrast meets WCAG standards
- [ ] Forms have proper labels and error messages
- [ ] Modals trap focus correctly
- [ ] Skip links work for keyboard navigation

### Screen Reader Testing

Test with:

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS)
- TalkBack (Android)

### Browser Testing

Test accessibility features across:

- Chrome
- Firefox
- Safari
- Edge

## 📞 Getting Help with Accessibility

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Color Contrast Analyzer](https://webaim.org/resources/contrastchecker/)

### Support

For accessibility questions or issues:

1. Check this documentation
2. Review the component examples
3. Test with screen readers
4. File an issue with accessibility label

## 🔄 Contributing to Accessibility

When contributing components:

1. Follow WCAG 2.1 AA guidelines
2. Test with keyboard and screen readers
3. Include ARIA attributes where needed
4. Add accessibility documentation
5. Update this README with new features

---

_This component library is committed to providing an inclusive and accessible experience for all users._
<Badge variant="new" size="sm">
New Arrival
</Badge>

````

### Rating
Star rating component with display and input modes.

**Features:**
- Interactive and readonly modes
- Half-star precision
- Review count display
- Keyboard navigation
- Custom colors
- Accessibility support

```tsx
<Rating
  value={4.5}
  max={5}
  precision={0.5}
  readonly
  reviewCount={128}
/>
````

### Icon

Material Symbols icon wrapper with enhanced features.

**Features:**

- Size presets and custom sizes
- Fill variants
- Weight and grade control
- Click handlers
- TypeScript autocomplete
- Animation support

```tsx
<Icon name="favorite" size="lg" fill color="text-red-500" />
```

### Modal

Flexible modal dialog system with sub-components.

**Sizes:** `sm`, `md`, `lg`, `xl`, `full`

**Features:**

- Portal rendering
- Focus trap
- Escape key handling
- Click outside to close
- Body scroll lock
- Smooth animations
- Accessibility support

**Sub-components:**

- `Modal.Header` - Header with close button
- `Modal.Body` - Scrollable content area
- `Modal.Footer` - Action buttons area

```tsx
<Modal open={isOpen} onClose={() => setIsOpen(false)} size="md">
  <Modal.Header>Product Details</Modal.Header>
  <Modal.Body>Product information goes here</Modal.Body>
  <Modal.Footer>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Close
    </Button>
    <Button>Add to Cart</Button>
  </Modal.Footer>
</Modal>
```

## Accessibility

All components are built with WCAG 2.1 AA compliance in mind:

- **Semantic HTML** - Proper element usage
- **ARIA Attributes** - Screen reader support
- **Keyboard Navigation** - Full keyboard access
- **Focus Management** - Visible focus indicators
- **Color Contrast** - Accessible color combinations
- **Screen Reader** - Comprehensive labels and descriptions

## Theme Support

Components support both light and dark themes through Tailwind CSS classes:

- Automatic theme detection
- Consistent dark mode styling
- RTL/LTR layout support
- Logical properties for internationalization

## Usage

Import components from the central index:

```tsx
import { Button, Input, Card, Modal } from '@/components/ui';
```

All components accept `className` prop for custom styling and use the `cn()` utility for class merging.

## Responsive Design

Components follow mobile-first responsive design:

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

## Performance

- **Tree-shaking** - Only import what you need
- **Optimized** - Minimal re-renders
- **Lightweight** - No unnecessary dependencies
- **SSR Ready** - Server-side rendering compatible

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

When adding new components:

1. Follow the established patterns
2. Include TypeScript types
3. Add comprehensive JSDoc
4. Implement accessibility features
5. Test in both themes
6. Update this documentation

## Future Enhancements

- Storybook integration
- Component testing suite
- Animation library integration
- Advanced form components
- Data visualization components
