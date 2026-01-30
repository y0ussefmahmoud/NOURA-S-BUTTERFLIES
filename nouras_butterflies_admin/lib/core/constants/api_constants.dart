/// ثوابت الـ API
class ApiConstants {
  ApiConstants._();

  // ========== Base URLs ==========
  
  /// Base URL للـ Production
  static const String baseUrl = 'https://api.nourasbutterflies.com';
  
  /// Base URL للـ Staging
  static const String stagingUrl = 'https://staging-api.nourasbutterflies.com';
  
  /// Base URL للـ Development
  static const String devUrl = 'http://localhost:8000';

  // ========== API Endpoints ==========
  
  // Auth
  static const String login = '/api/auth/login';
  static const String logout = '/api/auth/logout';
  static const String refreshToken = '/api/auth/refresh';
  
  // Products
  static const String products = '/api/products';
  static const String productById = '/api/products/{id}';
  
  // Orders
  static const String orders = '/api/orders';
  static const String orderById = '/api/orders/{id}';
  
  // Customers
  static const String customers = '/api/customers';
  static const String customerById = '/api/customers/{id}';
  
  // Dashboard Stats
  static const String dashboardStats = '/api/admin/stats';
  static const String salesData = '/api/admin/sales-data';
  static const String topProducts = '/api/admin/top-products';

  // ========== Timeouts ==========
  
  static const Duration connectTimeout = Duration(seconds: 30);
  static const Duration receiveTimeout = Duration(seconds: 30);
  static const Duration sendTimeout = Duration(seconds: 30);

  // ========== Headers ==========
  
  static const String authHeader = 'Authorization';
  static const String contentType = 'Content-Type';
  static const String accept = 'Accept';
  static const String applicationJson = 'application/json';
}
