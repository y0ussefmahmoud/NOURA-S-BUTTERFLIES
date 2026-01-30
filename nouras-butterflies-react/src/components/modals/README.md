# Modal System Documentation

This directory contains a comprehensive modal system for Noura's Butterflies, featuring various interactive components with consistent design patterns and accessibility features.

## Overview

The modal system includes:

- **SearchModal**: Full-screen search with product results
- **FirstOrderPopup**: Welcome popup for first-time visitors
- **OffersDrawer**: Side drawer with current offers and promotions
- **NewsletterPopup**: Email capture popup
- **ReviewFormModal**: General review submission form
- **ProductReviewModal**: Product-specific review form
- **FeedbackFormModal**: Multi-step feedback form

## Architecture

### Context Management

All modals are managed through a centralized `ModalsContext` that:

- Prevents multiple modals from opening simultaneously
- Provides consistent state management across the application
- Offers easy-to-use hooks for modal control

### Shared Components

- **Drawer**: Reusable side drawer component with swipe gestures
- **ButterflyRating**: Interactive rating component with butterfly icons
- **ImageUpload**: Drag-and-drop file upload with preview

## Usage Examples

### Basic Modal Usage

```tsx
import { useModals } from '@/contexts/ModalsContext';

function MyComponent() {
  const { openSearch, closeSearch } = useModals();

  return <button onClick={openSearch}>Open Search</button>;
}
```

### Product Review Modal

```tsx
import { ProductReviewModal } from '@/components/modals';

function ProductPage() {
  const [isOpen, setIsOpen] = useState(false);
  const product = {
    /* product data */
  };

  return <ProductReviewModal open={isOpen} onClose={() => setIsOpen(false)} product={product} />;
}
```

### Custom Rating Component

```tsx
import { ButterflyRating } from '@/components/ui/ButterflyRating';

function ReviewForm() {
  const [rating, setRating] = useState(4);

  return <ButterflyRating value={rating} onChange={setRating} variant="labeled" size="lg" />;
}
```

## Component Props

### SearchModal

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed

### FirstOrderPopup

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed

### OffersDrawer

- `open: boolean` - Controls drawer visibility
- `onClose: () => void` - Callback when drawer is closed

### NewsletterPopup

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed

### ReviewFormModal

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `productName?: string` - Product name for context
- `productId?: string` - Product ID for submission

### ProductReviewModal

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed
- `product?: Product` - Full product object

### FeedbackFormModal

- `open: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal is closed

## Shared Components

### Drawer

```tsx
<Drawer open={isOpen} onClose={handleClose} position="right" width="480px">
  <Drawer.Header>Title</Drawer.Header>
  <Drawer.Body>Content</Drawer.Body>
  <Drawer.Footer>Actions</Drawer.Footer>
</Drawer>
```

### ButterflyRating

```tsx
<ButterflyRating
  value={rating}
  onChange={setRating}
  max={5}
  variant="default" // 'default' | 'labeled' | 'compact'
  size="md" // 'sm' | 'md' | 'lg'
  readonly={false}
/>
```

### ImageUpload

```tsx
<ImageUpload
  onChange={handleFiles}
  multiple={true}
  maxFiles={3}
  preview={true}
  accept="image/jpeg,image/png"
/>
```

## Hooks

### useModals

Returns modal state and action functions:

```tsx
const {
  searchOpen,
  firstOrderPopupOpen,
  offersDrawerOpen,
  newsletterPopupOpen,
  reviewFormModalOpen,
  productReviewModalOpen,
  feedbackFormModalOpen,
  openSearch,
  closeSearch,
  openFirstOrderPopup,
  closeFirstOrderPopup,
  // ... other modal actions
} = useModals();
```

### useModalState

Manages individual modal state:

```tsx
const { isOpen, open, close, toggle, wasShown, markAsShown } = useModalState({
  delay: 3000,
  sessionStorageKey: 'my-modal',
  autoShow: true,
});
```

### useScrollPosition

Tracks scroll position for triggering modals:

```tsx
const { scrollPercentage, scrollY, isScrolledPast } = useScrollPosition();

// Show modal at 50% scroll
useEffect(() => {
  if (isScrolledPast(50)) {
    openModal();
  }
}, [isScrolledPast]);
```

## Styling

### CSS Classes

- `.frosted-glass` - Backdrop blur effect
- `.butterfly-glow` - Golden glow effect
- `.butterfly-float` - Floating animation
- `.modal-scrollbar` - Custom scrollbar styling

### Themes

All modals support:

- Light/dark mode
- High contrast mode
- Reduced motion preferences
- Mobile-responsive design

## Form Handling

### Validation

Uses the `useFormValidation` hook with built-in rules:

- Required field validation
- Length constraints
- Email format validation
- Custom validation functions

### Submission

Mock API functions are provided in `@/utils/formSubmission`:

- `submitReview()` - Submit product reviews
- `subscribeNewsletter()` - Newsletter subscription
- `submitFeedback()` - Feedback submission

## Accessibility

### Features

- Focus trap within modals
- Keyboard navigation (Tab, Shift+Tab, Escape)
- ARIA labels and descriptions
- Screen reader announcements
- High contrast support
- Reduced motion support

### Best Practices

- All interactive elements are keyboard accessible
- Proper heading hierarchy
- Semantic HTML structure
- Focus management on open/close
- Error announcements for screen readers

## Mobile Considerations

### Touch Interactions

- Swipe-to-close for drawers
- Touch-friendly button sizes (min 44px)
- Proper touch target spacing
- Prevented body scroll when modal open

### Responsive Behavior

- Full-screen modals on mobile
- Stacked layouts for popup forms
- Simplified navigation
- Optimized button placement

## Performance

### Optimizations

- Lazy loading with React.lazy
- Debounced search input
- Optimized image handling
- Minimal re-renders with React.memo
- Efficient state management

### Bundle Size

Modal components are code-split and loaded on-demand to minimize initial bundle size.

## Integration

### App Setup

The modal system is integrated in `App.tsx`:

```tsx
<ModalsProvider>
  <Router>
    <Layout>
      <Routes>{/* Your routes */}</Routes>
      <GlobalModals />
    </Layout>
  </Router>
</ModalsProvider>
```

### Header Integration

Search and notification buttons are integrated in the Header component with proper modal triggers.

### Product Integration

Product cards include "Write Review" buttons that trigger the appropriate review modal.

## Testing

### Manual Testing Checklist

- [ ] All modals open/close correctly
- [ ] Multiple modals don't conflict
- [ ] Form validation works
- [ ] Mobile gestures function
- [ ] Keyboard navigation works
- [ ] Focus management correct
- [ ] Accessibility features work
- [ ] Responsive design works
- [ ] Dark mode works
- [ ] Performance is acceptable

### Automated Testing

Consider adding tests for:

- Modal state management
- Form validation
- Accessibility features
- User interactions
- Error handling

## Troubleshooting

### Common Issues

**Modal not opening**

- Check ModalsProvider is wrapping the app
- Verify useModals hook is called within provider
- Check console for context errors

**Form validation not working**

- Ensure useFormValidation is properly configured
- Check validation rules match form fields
- Verify error state handling

**Mobile issues**

- Check touch event handling
- Verify responsive breakpoints
- Test swipe gestures

**Performance issues**

- Check for unnecessary re-renders
- Verify lazy loading is working
- Monitor bundle size

## Future Enhancements

### Planned Features

- Animation library integration
- Advanced form validation
- Modal history/back navigation
- Analytics integration
- A/B testing framework
- Advanced accessibility features

### Contributing

When adding new modals:

1. Follow the established patterns
2. Use shared components when possible
3. Implement proper accessibility
4. Add comprehensive documentation
5. Include mobile considerations
6. Add appropriate tests
