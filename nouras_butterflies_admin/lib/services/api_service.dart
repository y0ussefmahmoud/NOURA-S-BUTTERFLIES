import 'package:dio/dio.dart';
import '../core/constants/api_constants.dart';
import '../data/models/admin_product.dart';
import '../data/models/order.dart';
import '../data/models/customer.dart';
import '../data/models/admin_dashboard_data.dart';
import '../data/models/chart_data_point.dart';
import 'auth_interceptor.dart';
import 'retry_interceptor.dart';
import 'rate_limit_interceptor.dart';
import 'api_exception.dart';

class ApiService {
  late final Dio _dio;
  
  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: ApiConstants.connectTimeout,
      receiveTimeout: ApiConstants.receiveTimeout,
      sendTimeout: ApiConstants.sendTimeout,
      headers: {
        ApiConstants.contentType: ApiConstants.applicationJson,
        ApiConstants.accept: ApiConstants.applicationJson,
      },
    ));
    
    // Add interceptors
    _dio.interceptors.add(RateLimitInterceptor());
    _dio.interceptors.add(AuthInterceptor());
    _dio.interceptors.add(RetryInterceptor());
    
    // Add logging for development
    if (!const bool.fromEnvironment('dart.vm.product')) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        responseHeader: true,
      ));
    }
  }

  // Update base URL dynamically
  void updateBaseUrl(String newBaseUrl) {
    _dio.options.baseUrl = newBaseUrl;
  }

  // ========== Products Endpoints ==========
  
  Future<List<AdminProduct>> getProducts() async {
    try {
      final response = await _dio.get(ApiConstants.products);
      return (response.data as List)
          .map((json) => AdminProduct.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<AdminProduct> getProductById(String id) async {
    try {
      final response = await _dio.get(ApiConstants.productById.replaceAll('{id}', id));
      return AdminProduct.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<AdminProduct>> searchProducts(String query) async {
    try {
      final response = await _dio.get('${ApiConstants.products}/search', queryParameters: {'q': query});
      return (response.data as List)
          .map((json) => AdminProduct.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<AdminProduct>> filterProducts({
    String? category,
    double? minPrice,
    double? maxPrice,
    bool? inStock,
  }) async {
    try {
      final queryParams = <String, dynamic>{};
      if (category != null) queryParams['category'] = category;
      if (minPrice != null) queryParams['min_price'] = minPrice;
      if (maxPrice != null) queryParams['max_price'] = maxPrice;
      if (inStock != null) queryParams['in_stock'] = inStock;

      final response = await _dio.get('${ApiConstants.products}/filter', queryParameters: queryParams);
      return (response.data as List)
          .map((json) => AdminProduct.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<AdminProduct> createProduct(AdminProduct product) async {
    try {
      final response = await _dio.post(ApiConstants.products, data: product.toJson());
      return AdminProduct.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<AdminProduct> updateProduct(String id, AdminProduct product) async {
    try {
      final response = await _dio.put(
        ApiConstants.productById.replaceAll('{id}', id),
        data: product.toJson(),
      );
      return AdminProduct.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await _dio.delete(ApiConstants.productById.replaceAll('{id}', id));
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<String>> getCategories() async {
    try {
      final response = await _dio.get('${ApiConstants.products}/categories');
      return List<String>.from(response.data as List);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ========== Orders Endpoints ==========
  
  Future<List<Order>> getOrders() async {
    try {
      final response = await _dio.get(ApiConstants.orders);
      return (response.data as List)
          .map((json) => Order.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Order> getOrderById(String id) async {
    try {
      final response = await _dio.get(ApiConstants.orderById.replaceAll('{id}', id));
      return Order.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<Order>> getOrdersByStatus(OrderStatus status) async {
    try {
      final response = await _dio.get('${ApiConstants.orders}/status', queryParameters: {
        'status': status.name,
      });
      return (response.data as List)
          .map((json) => Order.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Order> updateOrderStatus(String id, OrderStatus status) async {
    try {
      final response = await _dio.patch(
        '${ApiConstants.orderById.replaceAll('{id}', id)}/status',
        data: {'status': status.name},
      );
      return Order.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<void> deleteOrder(String id) async {
    try {
      await _dio.delete(ApiConstants.orderById.replaceAll('{id}', id));
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ========== Customers Endpoints ==========
  
  Future<List<Customer>> getCustomers() async {
    try {
      final response = await _dio.get(ApiConstants.customers);
      return (response.data as List)
          .map((json) => Customer.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Customer> getCustomerById(String id) async {
    try {
      final response = await _dio.get(ApiConstants.customerById.replaceAll('{id}', id));
      return Customer.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<Customer>> searchCustomers(String query) async {
    try {
      final response = await _dio.get('${ApiConstants.customers}/search', queryParameters: {'q': query});
      return (response.data as List)
          .map((json) => Customer.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ========== Dashboard Endpoints ==========
  
  Future<AdminDashboardData> getDashboardStats() async {
    try {
      final response = await _dio.get(ApiConstants.dashboardStats);
      return AdminDashboardData.fromJson(response.data as Map<String, dynamic>);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<ChartDataPoint>> getSalesData(String period) async {
    try {
      final response = await _dio.get(ApiConstants.salesData, queryParameters: {
        'period': period,
      });
      return (response.data as List)
          .map((json) => ChartDataPoint.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<List<TopProduct>> getTopProducts() async {
    try {
      final response = await _dio.get(ApiConstants.topProducts);
      return (response.data as List)
          .map((json) => TopProduct.fromJson(json as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ========== Auth Endpoints ==========
  
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await _dio.post(ApiConstants.login, data: {
        'email': email,
        'password': password,
      });
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<void> logout() async {
    try {
      await _dio.post(ApiConstants.logout);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Map<String, dynamic>> refreshToken() async {
    try {
      final response = await _dio.post(ApiConstants.refreshToken);
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  // ========== Error Handling ==========
  
  ApiException _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return TimeoutException(error.message ?? 'Request timeout');
      
      case DioExceptionType.connectionError:
        return NetworkException('No internet connection');
      
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final message = error.response?.data?['message'] ?? 'Unknown error';
        
        switch (statusCode) {
          case 400:
            return ValidationException(message, error.response?.data?['errors']);
          case 401:
            return UnauthorizedException(message);
          case 403:
            return ApiException('Forbidden: $message');
          case 404:
            return NotFoundException(message);
          case 422:
            return ValidationException(message, error.response?.data?['errors']);
          case 500:
          case 502:
          case 503:
          case 504:
            return ServerException('Server error: $message');
          default:
            return ApiException('HTTP $statusCode: $message');
        }
      
      case DioExceptionType.cancel:
        return ApiException('Request cancelled');
      
      case DioExceptionType.unknown:
        return NetworkException('Network error: ${error.message}');
      
      default:
        return ApiException('Unknown error: ${error.message}');
    }
  }
}
