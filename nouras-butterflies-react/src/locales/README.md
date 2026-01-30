# Translation System Documentation

## Overview

This project uses `react-i18next` for internationalization (i18n) to support multiple languages (English and Arabic). The translation system is configured to automatically detect and switch between languages based on user preferences.

## Structure

### Translation Files

Translation files are organized by namespaces in the `src/locales/` directory:

```
src/locales/
├── en/
│   ├── common.json       # Common UI elements
│   ├── navigation.json   # Navigation menu items
│   ├── home.json         # Home page content
│   ├── product.json      # Product-related text
│   ├── cart.json         # Shopping cart content
│   ├── account.json      # User account pages
│   ├── content.json      # Static content pages
│   ├── admin.json        # Admin panel text
│   └── forms.json        # Form labels and messages
├── ar/
│   ├── common.json       # Arabic translations
│   ├── navigation.json   # Arabic navigation
│   ├── home.json         # Arabic home content
│   └── ...               # Other Arabic files
└── index.ts              # Resources export
```

### Namespaces

Each namespace serves a specific purpose:

- **common**: Shared UI elements (buttons, labels, messages)
- **navigation**: Menu items, navigation links
- **home**: Homepage sections (hero, newsletter, features)
- **product**: Product pages, filters, categories
- **cart**: Shopping cart, checkout process
- **account**: User profile, authentication, orders
- **content**: About, FAQ, contact, policy pages
- **admin**: Admin dashboard, management tools
- **forms**: Form validation messages, field labels

## Usage

### Basic Translation

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('namespace');

  return <h1>{t('key.path')}</h1>;
};
```

### Example

```typescript
import { useTranslation } from 'react-i18next';

const ProductCard = () => {
  const { t } = useTranslation('product');

  return (
    <div>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      <button>{t('addToCart')}</button>
    </div>
  );
};
```

### Language Detection

The system automatically:

1. Checks localStorage for saved language preference
2. Falls back to browser language detection
3. Defaults to English if no preference found

## Adding New Translations

### Step 1: Add Translation Keys

Add new keys to both English and Arabic files:

**src/locales/en/common.json**

```json
{
  "buttons": {
    "save": "Save Changes",
    "cancel": "Cancel"
  }
}
```

**src/locales/ar/common.json**

```json
{
  "buttons": {
    "save": "حفظ التغييرات",
    "cancel": "إلغاء"
  }
}
```

### Step 2: Use in Components

```typescript
const { t } = useTranslation('common');
<button>{t('buttons.save')}</button>
```

## Formatting Utilities

### Currency Formatting

```typescript
import { formatCurrency } from '../../utils/translation';

const price = 29.99;
const usdPrice = formatCurrency(price, 'en', 'USD'); // $29.99
const sarPrice = formatCurrency(price, 'ar', 'SAR'); // ر.س.٢٩٫٩٩
```

### Date Formatting

```typescript
import { formatDate } from '../../utils/translation';

const date = new Date();
const enDate = formatDate(date, 'en'); // "January 16, 2026"
const arDate = formatDate(date, 'ar'); // "١٦ يناير ٢٠٢٦"
```

### Number Formatting

```typescript
import { formatNumber } from '../../utils/translation';

const number = 1234.56;
const enNumber = formatNumber(number, 'en'); // "1,234.56"
const arNumber = formatNumber(number, 'ar'); // "١٬٢٣٤٫٥٦"
```

## Language Context

Use the `useLanguage` hook for language-related functionality:

```typescript
import { useLanguage } from '../../hooks/useLanguage';

const LanguageSwitcher = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <button onClick={toggleLanguage}>
      {language === 'en' ? 'العربية' : 'English'}
    </button>
  );
};
```

## RTL Support

The application supports Right-to-Left (RTL) layout for Arabic:

### CSS Classes

Use RTL-safe utility classes:

- `text-start` instead of `text-left`
- `text-end` instead of `text-right`
- `ms-4` instead of `ml-4` (margin-inline-start)
- `pe-4` instead of `mr-4` (padding-inline-end)

### Direction Handling

```typescript
const { isRTL } = useLanguage();

// Conditional rendering based on direction
const chevronIcon = isRTL ? 'chevron_left' : 'chevron_right';
```

## Best Practices

### Key Naming

1. **Use descriptive names**: `product.addToCart` instead of `product.atc`
2. **Group related keys**: `validation.email.required`, `validation.email.invalid`
3. **Use consistent structure**: `section.subsection.item`
4. **Avoid spaces**: Use camelCase or underscores

### Translation Guidelines

1. **Keep translations concise** but meaningful
2. **Consider text expansion** in Arabic (up to 30% longer)
3. **Use gender-neutral language** when possible
4. **Test both languages** during development

### Performance

1. **Load namespaces lazily** when possible
2. **Use appropriate namespaces** to avoid loading unused translations
3. **Cache translations** in production builds

## Troubleshooting

### Common Issues

1. **Missing translations**: Check if keys exist in both language files
2. **RTL layout issues**: Verify use of RTL-safe CSS classes
3. **Language not persisting**: Ensure localStorage is accessible
4. **Formatting not working**: Check locale codes in formatting utilities

### Debug Mode

Enable i18next debug mode in development:

```typescript
// src/config/i18n.config.ts
i18n.init({
  // ... other options
  debug: process.env.NODE_ENV === 'development',
});
```

## Contributing

When adding new features:

1. Add translation keys to both English and Arabic files
2. Test the feature in both languages
3. Verify RTL layout works correctly
4. Update this documentation if adding new namespaces

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Core Documentation](https://www.i18next.com/)
- [Tailwind CSS RTL Plugin](https://github.com/20lives/tailwindcss-rtl)
- [MDN: Logical Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Logical_Properties)
