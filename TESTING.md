# Testing Documentation

## Overview

This document provides comprehensive information about the testing infrastructure implemented for Noura's Butterflies project, covering React web application and Flutter admin panel testing strategies.

## Table of Contents

1. [Testing Stack](#testing-stack)
2. [Test Organization](#test-organization)
3. [Running Tests](#running-tests)
4. [Test Types](#test-types)
5. [Mocking and Fixtures](#mocking-and-fixtures)
6. [Coverage Reporting](#coverage-reporting)
7. [CI/CD Integration](#cicd-integration)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Testing Stack

### React Application (nouras-butterflies-react)

#### Unit Testing
- **Framework**: Vitest
- **Assertions**: @testing-library/jest-dom
- **Mocking**: Vitest built-in mocking + MSW for API mocking

#### Component Testing
- **Library**: React Testing Library
- **User Simulation**: @testing-library/user-event
- **Accessibility**: Built-in accessibility testing

#### Integration Testing
- **Framework**: Vitest + React Testing Library
- **Test Helpers**: Custom renderWithProviders wrapper
- **API Mocking**: Mock Service Worker (MSW)

#### End-to-End Testing
- **Framework**: Playwright
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Reporting**: HTML, JSON, JUnit

### Flutter Admin Panel (nouras_butterflies_admin)

#### Unit Testing
- **Framework**: Flutter Test
- **Assertions**: Built-in Flutter test assertions

#### Widget Testing
- **Framework**: Flutter Test Widget
- **Testing**: Material widget testing utilities

#### BLoC Testing
- **Framework**: bloc_test
- **Mocking**: mocktail for repository mocking

## Test Organization

### React Application Structure

```
nouras-butterflies-react/
├── src/
│   ├── tests/
│   │   ├── setup.ts              # Global test setup
│   │   ├── mocks/
│   │   │   ├── handlers.ts       # MSW API handlers
│   │   │   └── server.ts         # MSW server setup
│   │   └── helpers/
│   │       └── renderWithProviders.tsx
│   ├── utils/
│   │   └── __tests__/
│   │       ├── cart.test.ts
│   │       ├── validation.test.ts
│   │       ├── sanitization.test.ts
│   │       └── secureStorage.test.ts
│   ├── components/
│   │   └── ui/
│   │       └── __tests__/
│   │           ├── Button.test.tsx
│   │           ├── Input.test.tsx
│   │           ├── Modal.test.tsx
│   │           ├── FormField.test.tsx
│   │           └── OptimizedImage.test.tsx
│   └── hooks/
│       └── __tests__/
│           ├── useCart.test.ts
│           ├── useDebounce.test.ts
│           └── useIntersectionObserver.test.ts
├── e2e/
│   ├── complete-purchase.spec.ts
│   └── authentication.spec.ts
├── vitest.config.ts
├── playwright.config.ts
└── lighthouserc.json
```

### Flutter Admin Structure

```
nouras_butterflies_admin/
├── test/
│   ├── widget_test.dart
│   ├── widgets/
│   │   └── admin_widgets_test.dart
│   └── bloc/
│       └── bloc_test.dart
├── test/
├── pubspec.yaml
└── analysis_options.yaml
```

## Running Tests

### React Application

#### Unit and Integration Tests
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

#### Component Tests
```bash
# Component tests are included in unit tests
npm run test -- --testNamePattern="Component"
```

#### Integration Tests
```bash
# Run integration tests specifically
npm run test:integration
```

#### End-to-End Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in debug mode
npm run test:e2e:debug
```

### Flutter Admin

#### All Tests
```bash
# Run all tests
flutter test

# Run tests with coverage
flutter test --coverage
```

#### Specific Test Types
```bash
# Run widget tests
flutter test test/widgets/

# Run BLoC tests
flutter test test/bloc/

# Run specific test file
flutter test test/widgets/admin_widgets_test.dart
```

#### Code Analysis
```bash
# Analyze code for issues
flutter analyze
```

## Test Types

### Unit Tests

#### Purpose
- Test individual functions and methods in isolation
- Validate business logic and utility functions
- Fast feedback on code changes

#### Examples
- Cart utility functions (calculateSubtotal, calculateShipping, etc.)
- Validation functions (validateEmail, validatePassword, etc.)
- Security utilities (sanitizeInput, CSRF token generation, etc.)

#### Best Practices
- Test edge cases and error conditions
- Use descriptive test names
- Keep tests focused and independent
- Mock external dependencies

### Component Tests

#### Purpose
- Test React components in isolation
- Validate component behavior and rendering
- Test user interactions and state changes

#### Examples
- Button component with different variants and states
- Input component with validation and error handling
- Modal component with open/close functionality

#### Best Practices
- Test component behavior, not implementation details
- Use semantic queries when possible
- Test accessibility features
- Mock child components when necessary

### Integration Tests

#### Purpose
- Test multiple components working together
- Validate critical user flows
- Test API integration and data flow

#### Examples
- Complete purchase flow from product to confirmation
- Authentication flow from login to dashboard
- Cart operations with API integration

#### Best Practices
- Use realistic test data
- Test both happy path and error scenarios
- Mock external APIs using MSW
- Test loading and error states

### End-to-End Tests

#### Purpose
- Test complete user journeys in real browsers
- Validate application behavior across different devices
- Test performance and accessibility

#### Examples
- Complete purchase journey on mobile and desktop
- Multi-step checkout process
- User registration and login flow

#### Best Practices
- Use page object pattern for maintainability
- Test across multiple browsers and devices
- Include performance testing
- Test accessibility with real screen readers

### Flutter Widget Tests

#### Purpose
- Test Flutter widgets in isolation
- Validate widget rendering and interactions
- Test widget state and behavior

#### Examples
- Dashboard stats card rendering
- Product form validation
- Order list item display

#### Best Practices
- Use MaterialApp wrapper when needed
- Test widget properties and callbacks
- Use semantic labels for accessibility
- Test different screen sizes

### BLoC Tests

#### Purpose
- Test BLoC state management logic
- Validate event handling and state transitions
- Test business logic separation

#### Examples
- Dashboard BLoC loading and error states
- Authentication BLoC login/logout flow
- Product BLoC CRUD operations

#### Best Practices
- Use bloc_test for comprehensive testing
- Mock repository dependencies
- Test all state transitions
- Include edge cases and error handling

## Mocking and Fixtures

### Mock Service Worker (MSW)

#### Setup
```typescript
// src/tests/setup.ts
import { server } from './mocks/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

#### API Handlers
```typescript
// src/tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/products', () => {
    return HttpResponse.json({ products: mockProducts })
  }),
  http.post('/api/auth/login', ({ request }) => {
    // Mock login logic
  }),
]
```

### Flutter Mocking

#### Repository Mocking
```dart
class MockProductRepository extends Mock implements ProductRepository {}

void main() {
  test('should load products', () async {
    final mockRepository = MockProductRepository();
    when(() => mockRepository.getProducts())
        .thenAnswer((_) async => mockProducts);
    
    final bloc = ProductsBloc(repository: mockRepository);
    bloc.add(LoadProducts());
    
    expect(bloc.state, isA<ProductsLoaded>());
  });
}
```

## Coverage Reporting

### React Application

#### Configuration
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    }
  }
})
```

#### Viewing Reports
```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html

# Upload to Codecov (automated in CI)
```

### Flutter Admin

#### Configuration
```yaml
# pubspec.yaml
dev_dependencies:
  test_coverage: ^0.2.0
```

#### Generating Reports
```bash
# Generate coverage report
flutter test --coverage

# Convert to lcov format
genhtml coverage/lcov.info -o coverage/html
```

## CI/CD Integration

### GitHub Actions Workflow

The CI/CD pipeline includes:

1. **Parallel Test Execution**
   - React unit and integration tests
   - React E2E tests
   - Flutter unit and widget tests
   - Security scans

2. **Quality Gates**
   - Code coverage thresholds (70% minimum)
   - Linting and type checking
   - Security vulnerability scanning
   - Performance testing

3. **Deployment**
   - Automated deployment on successful tests
   - Staging and production environments
   - Rollback capabilities

### Environment Variables

```bash
# .coverage.env
VITE_COVERAGE_THRESHOLD=70
CODECOV_TOKEN=${CODECOV_TOKEN}
LHCI_GITHUB_APP_TOKEN=${LHCI_GITHUB_APP_TOKEN}
```

## Best Practices

### Test Organization

1. **Naming Conventions**
   - Use descriptive test names that describe the behavior
   - Group related tests using `describe` blocks
   - Use `it` or `test` for individual test cases

2. **Test Structure**
   ```typescript
   describe('Component/Function Name', () => {
     describe('when condition', () => {
       it('should do something', () => {
         // Arrange
         // Act
         // Assert
       })
     })
   })
   ```

3. **Test Data**
   - Use realistic test data
   - Create reusable fixtures
   - Avoid magic numbers and strings

### Mocking Strategy

1. **When to Mock**
   - External API calls
   - Browser APIs (localStorage, fetch, etc.)
   - Time-dependent functions (setTimeout, setInterval)
   - Complex dependencies

2. **Mocking Guidelines**
   - Keep mocks simple and focused
   - Use consistent mock data
   - Reset mocks between tests
   - Avoid over-mocking

### Performance Testing

1. **React Performance**
   - Use React Testing Library's performance APIs
   - Test component render times
   - Monitor memory usage

2. **Flutter Performance**
   - Test widget build times
   - Monitor frame rates
   - Test scrolling performance

### Accessibility Testing

1. **React Accessibility**
   - Test semantic HTML structure
   - Validate ARIA attributes
   - Test keyboard navigation
   - Use screen reader simulations

2. **Flutter Accessibility**
   - Test semantic labels
   - Validate focus management
   - Test contrast ratios
   - Use accessibility scanner

## Troubleshooting

### Common Issues

#### React Tests

1. **Module Resolution Errors**
   ```bash
   # Clear cache
   npm run test -- --clearCache
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **MSW Issues**
   ```typescript
   // Ensure MSW is set up correctly
   import { server } from './mocks/server'
   
   beforeAll(() => server.listen())
   afterEach(() => server.resetHandlers())
   ```

3. **Playwright Browser Issues**
   ```bash
   # Reinstall browsers
   npx playwright install
   
   # Clear cache
   npx playwright install --force
   ```

#### Flutter Tests

1. **Widget Test Issues**
   ```dart
   // Ensure MaterialApp wrapper
   await tester.pumpWidget(
     MaterialApp(
       home: YourWidget(),
     ),
   );
   ```

2. **BLoC Test Issues**
   ```dart
   // Use bloc_test for comprehensive testing
   blocTest<YourBloc, YourState>(
     'should emit correct state',
     build: () => YourBloc(),
     act: (bloc) => bloc.add(YourEvent()),
     expect: () => [YourState()],
   );
   ```

### Debugging Tips

1. **React Tests**
   - Use `console.log` for debugging
   - Use `screen.debug()` to inspect DOM
   - Use `waitFor` for async operations

2. **Flutter Tests**
   - Use `print()` for debugging
   - Use `tester.pumpAndSettle()` for async operations
   - Use `tester.binding.debugDumpApp()` for widget tree

### Performance Optimization

1. **Test Performance**
   - Run tests in parallel when possible
   - Use test caching
   - Optimize test data generation

2. **CI/CD Optimization**
   - Use caching for dependencies
   - Run tests in parallel
   - Optimize Docker images

## Additional Resources

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [Flutter Testing Documentation](https://docs.flutter.dev/cookbook/testing)
- [bloc_test Documentation](https://pub.dev/packages/bloc_test)

### Tools and Utilities
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Codecov](https://codecov.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Trivy Security Scanner](https://github.com/aquasecurity/trivy)

### Community
- [Vit Discord](https://vitest.dev/)
- [React Testing Library Discord](https://testing-library.com/)
- [Flutter Community](https://flutter.dev/community)
- [Playwright Community](https://playwright.dev/community)

---

## Conclusion

This comprehensive testing infrastructure ensures high-quality code delivery through automated testing at multiple levels. The combination of unit, integration, and end-to-end tests provides confidence in application functionality, while the CI/CD pipeline ensures consistent quality across all environments.

Regular maintenance and updates to the testing infrastructure will help keep the testing process efficient and effective as the application evolves.
