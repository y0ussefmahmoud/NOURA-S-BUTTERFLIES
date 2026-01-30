# nouras_butterflies_admin

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Lab: Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Cookbook: Useful Flutter samples](https://docs.flutter.dev/cookbook)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## API Documentation

This Flutter admin application connects to a RESTful API for managing products, orders, customers, and dashboard analytics. The API provides comprehensive endpoints for all administrative operations.

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh authentication token

#### Products Management
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search` - Search products
- `GET /api/products/filter` - Filter products
- `GET /api/products/categories` - Get product categories

#### Orders Management
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `PATCH /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Delete order
- `GET /api/orders/status` - Get orders by status

#### Customers Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `GET /api/customers/search` - Search customers

#### Dashboard Analytics
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/sales-data` - Get sales data for charts
- `GET /api/admin/top-products` - Get top performing products

### Base URLs

- **Development**: `http://localhost:8000`
- **Staging**: `https://staging-api.nourasbutterflies.com`
- **Production**: `https://api.nourasbutterflies.com`

### Authentication

All API requests (except login) require authentication using Bearer tokens in the Authorization header:
```
Authorization: Bearer {token}
```

### Full Documentation

For complete API documentation including request/response formats, error handling, rate limiting, and examples, please refer to the [API_DOCUMENTATION.md](API_DOCUMENTATION.md) file.

### Environment Configuration

The app supports multiple environments that can be configured in `lib/core/config/environment.dart`:
- Development: Uses mock data and local API
- Staging: Uses staging API with real data
- Production: Uses production API with optimized settings

### Error Handling

The app includes comprehensive error handling for:
- Network connectivity issues
- Authentication failures
- API validation errors
- Server errors

All errors are properly logged and user-friendly messages are displayed.
