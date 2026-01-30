# Noura's Butterflies Admin - API Documentation

## Overview

This document describes the RESTful API endpoints for the Noura's Butterflies Admin Flutter application. The API follows REST conventions and uses JSON for data exchange.

## Base URLs

- **Development**: `http://localhost:8000`
- **Staging**: `https://staging-api.nourasbutterflies.com`
- **Production**: `https://api.nourasbutterflies.com`

## Authentication

All API requests (except login) require authentication using Bearer tokens.

### Headers
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

---

## Authentication Endpoints

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Logout
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

## Products Endpoints

### Get All Products
```http
GET /api/products
```

**Response:**
```json
[
  {
    "id": "1",
    "name": "Diamond Butterfly Necklace",
    "nameAr": "قلادة فراشة ماسية",
    "slug": "diamond-butterfly-necklace",
    "description": "Elegant diamond butterfly necklace",
    "descriptionAr": "قلادة فراشة ماسية أنيقة",
    "price": 299.99,
    "category": "Necklaces",
    "images": ["image1.jpg", "image2.jpg"],
    "rating": 4.5,
    "reviewCount": 25,
    "sku": "DBN-001",
    "inventory": {
      "quantity": 50,
      "reserved": 5,
      "available": 45,
      "lowStockThreshold": 10
    },
    "cost": 150.00,
    "supplier": {
      "id": "1",
      "name": "Diamond Supplier Co.",
      "contactEmail": "contact@diamondsupplier.com"
    },
    "createdBy": "admin",
    "lastModified": "2024-01-15T10:30:00Z",
    "seo": {
      "title": "Diamond Butterfly Necklace",
      "description": "Elegant diamond butterfly necklace",
      "keywords": ["diamond", "butterfly", "necklace"]
    }
  }
]
```

### Get Product by ID
```http
GET /api/products/{id}
```

**Response:** Single product object (same structure as above)

### Search Products
```http
GET /api/products/search?q={query}
```

**Query Parameters:**
- `q` (string): Search query

**Response:** Array of matching products

### Filter Products
```http
GET /api/products/filter
```

**Query Parameters:**
- `category` (string, optional): Filter by category
- `min_price` (number, optional): Minimum price filter
- `max_price` (number, optional): Maximum price filter
- `in_stock` (boolean, optional): Filter by stock availability

**Response:** Array of filtered products

### Create Product
```http
POST /api/products
```

**Request Body:** Product object (same structure as above, without `id` and `lastModified`)

**Response:** Created product object with generated ID

### Update Product
```http
PUT /api/products/{id}
```

**Request Body:** Complete product object with updated fields

**Response:** Updated product object

### Delete Product
```http
DELETE /api/products/{id}
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

### Get Categories
```http
GET /api/products/categories
```

**Response:**
```json
["Necklaces", "Bracelets", "Earrings", "Rings", "Sets"]
```

---

## Orders Endpoints

### Get All Orders
```http
GET /api/orders
```

**Response:**
```json
[
  {
    "id": "ORD-001",
    "customerId": "CUST-001",
    "customerName": "Sarah Johnson",
    "customerEmail": "sarah@example.com",
    "customerPhone": "+1234567890",
    "items": [
      {
        "id": "ITEM-001",
        "productId": "1",
        "productName": "Diamond Butterfly Necklace",
        "productImage": "image1.jpg",
        "quantity": 1,
        "unitPrice": 299.99,
        "totalPrice": 299.99
      }
    ],
    "shippingAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "USA",
      "isDefault": true
    },
    "status": "pending",
    "paymentStatus": "completed",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "shippedAt": null,
    "deliveredAt": null,
    "trackingNumber": null,
    "subtotal": 299.99,
    "tax": 24.00,
    "shipping": 10.00,
    "total": 333.99,
    "notes": null
  }
]
```

### Get Order by ID
```http
GET /api/orders/{id}
```

**Response:** Single order object

### Get Orders by Status
```http
GET /api/orders/status?status={status}
```

**Query Parameters:**
- `status` (string): Order status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`)

**Response:** Array of orders with specified status

### Update Order Status
```http
PATCH /api/orders/{id}/status
```

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Response:** Updated order object

### Delete Order
```http
DELETE /api/orders/{id}
```

**Response:**
```json
{
  "message": "Order deleted successfully"
}
```

---

## Customers Endpoints

### Get All Customers
```http
GET /api/customers
```

**Response:**
```json
[
  {
    "id": "CUST-001",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah@example.com",
    "phone": "+1234567890",
    "avatar": "avatar.jpg",
    "tier": "gold",
    "preferences": {
      "newsletter": true,
      "sms": false,
      "promotions": true,
      "newProducts": true
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "lastOrderDate": "2024-01-15T10:30:00Z",
    "totalOrders": 5,
    "totalSpent": 1499.95,
    "loyaltyPoints": 750,
    "tags": ["vip", "repeat"],
    "adminNotes": "Premium customer, always orders latest collections"
  }
]
```

### Get Customer by ID
```http
GET /api/customers/{id}
```

**Response:** Single customer object

### Search Customers
```http
GET /api/customers/search?q={query}
```

**Query Parameters:**
- `q` (string): Search query (searches name, email)

**Response:** Array of matching customers

---

## Dashboard Endpoints

### Get Dashboard Stats
```http
GET /api/admin/stats
```

**Response:**
```json
{
  "salesMetrics": {
    "revenue": {
      "current": 125000.00,
      "growth": 15.5
    },
    "orders": {
      "current": 450,
      "growth": 8.2
    },
    "customers": {
      "current": 320,
      "growth": 12.1
    },
    "averageOrderValue": {
      "current": 278.00,
      "growth": -2.3
    }
  },
  "revenueChartData": [
    {
      "label": "Jan",
      "value": 15000.00
    },
    {
      "label": "Feb",
      "value": 18000.00
    }
  ],
  "topProducts": [
    {
      "id": "1",
      "name": "Diamond Butterfly Necklace",
      "unitsSold": 125,
      "revenue": 37498.75,
      "growth": 25.3
    }
  ]
}
```

### Get Sales Data
```http
GET /api/admin/sales-data?period={period}
```

**Query Parameters:**
- `period` (string): Time period (`daily`, `weekly`, `monthly`, `yearly`)

**Response:** Array of chart data points

### Get Top Products
```http
GET /api/admin/top-products
```

**Response:** Array of top products with sales metrics

---

## Error Responses

All endpoints may return error responses in the following format:

### Validation Error (422)
```json
{
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "price": ["The price must be greater than 0."]
  }
}
```

### Not Found (404)
```json
{
  "message": "Resource not found"
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthorized access"
}
```

### Server Error (500)
```json
{
  "message": "Internal server error"
}
```

### Network Error
```json
{
  "message": "Network connection failed"
}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:
- **Development**: No rate limiting
- **Staging**: 1000 requests per hour
- **Production**: 5000 requests per hour

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4999
X-RateLimit-Reset: 1640995200
```

---

## Pagination

List endpoints support pagination using these query parameters:
- `page` (number, default: 1): Page number
- `limit` (number, default: 20): Items per page (max: 100)

**Response with pagination:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Webhooks

The API supports webhooks for real-time notifications:

### Order Status Update
```http
POST {webhook_url}
```

**Payload:**
```json
{
  "event": "order.status.updated",
  "data": {
    "orderId": "ORD-001",
    "oldStatus": "processing",
    "newStatus": "shipped",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### New Order Created
```http
POST {webhook_url}
```

**Payload:**
```json
{
  "event": "order.created",
  "data": {
    "orderId": "ORD-002",
    "customerId": "CUST-002",
    "total": 299.99,
    "timestamp": "2024-01-15T11:00:00Z"
  }
}
```

---

## Testing

### Postman Collection
A Postman collection is available with all pre-configured requests:
- Import the `Nouras_Butterflies_Admin_API.postman_collection.json` file
- Set environment variables for `baseUrl` and `token`

### Example cURL Commands

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

**Get Products:**
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

---

## SDK Integration

### Flutter Integration
The Flutter app uses the `ApiService` class which handles:
- Automatic token management
- Request/response interceptors
- Error handling and retry logic
- Environment switching

### Example Usage
```dart
final apiService = ApiService();

// Get products
final products = await apiService.getProducts();

// Create product
final newProduct = await apiService.createProduct(product);

// Handle errors
try {
  final orders = await apiService.getOrders();
} on NetworkException {
  // Handle network error
} on UnauthorizedException {
  // Redirect to login
}
```

---

## Support

For API support and questions:
- **Email**: api-support@nourasbutterflies.com
- **Documentation**: https://docs.nourasbutterflies.com/api
- **Status Page**: https://status.nourasbutterflies.com

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- Products CRUD operations
- Orders management
- Customers management
- Dashboard analytics

### v1.1.0 (Planned)
- Advanced filtering and sorting
- Bulk operations
- Export functionality
- Enhanced analytics
- Webhook support
