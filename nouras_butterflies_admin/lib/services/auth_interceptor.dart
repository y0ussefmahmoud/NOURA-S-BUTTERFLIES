import 'package:dio/dio.dart';
import 'dart:async';
import 'storage_service.dart';
import 'api_service.dart';

class AuthInterceptor extends Interceptor {
  static bool _isRefreshing = false;
  static final List<Completer<void>> _refreshQueue = [];
  
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Check if token needs refresh before making request
    if (await StorageService.isTokenExpired()) {
      await _refreshToken();
    }
    
    // Add Bearer token if available
    final token = await StorageService.getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    
    // Set default headers
    options.headers['Content-Type'] = 'application/json';
    options.headers['Accept'] = 'application/json';
    
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Handle 401 Unauthorized responses
    if (err.response?.statusCode == 401) {
      try {
        // Attempt to refresh the token
        await _refreshToken();
        
        // Retry the original request with new token
        final newToken = await StorageService.getToken();
        if (newToken != null) {
          final newOptions = err.requestOptions;
          newOptions.headers['Authorization'] = 'Bearer $newToken';
          
          try {
            final response = await Dio().fetch(newOptions);
            handler.resolve(response);
            return;
          } catch (retryError) {
            // If retry fails, proceed to logout
          }
        }
      } catch (refreshError) {
        print('[AuthInterceptor] Token refresh failed: $refreshError');
      }
      
      // Clear stored token and user data
      await StorageService.deleteToken();
      await StorageService.deleteUserData();
      
      // Navigate to login screen - this would require a navigation service
      // For now, we'll just clear the auth state
      print('[AuthInterceptor] Authentication failed - redirecting to login');
    }
    
    handler.next(err);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    // Handle token refresh from response
    if (response.data is Map<String, dynamic>) {
      final responseData = response.data as Map<String, dynamic>;
      final newToken = responseData['token'] as String?;
      final refreshToken = responseData['refresh_token'] as String?;
      final expiresIn = responseData['expires_in'] as int?;
      
      if (newToken != null && newToken.isNotEmpty) {
        // Calculate expiry time if provided
        DateTime? expiry;
        if (expiresIn != null) {
          expiry = DateTime.now().add(Duration(seconds: expiresIn));
        }
        
        // Save new token with refresh token and expiry
        StorageService.saveToken(
          newToken,
          refreshToken: refreshToken,
          expiry: expiry,
        );
        
        print('[AuthInterceptor] Token refreshed successfully');
      }
    }
    
    handler.next(response);
  }

  /// Refresh the access token using the refresh token
  /// Implements queuing to prevent multiple simultaneous refresh attempts
  static Future<void> _refreshToken() async {
    // If already refreshing, wait for it to complete
    if (_isRefreshing) {
      final completer = Completer<void>();
      _refreshQueue.add(completer);
      await completer.future;
      return;
    }
    
    _isRefreshing = true;
    
    try {
      final refreshToken = await StorageService.getRefreshToken();
      if (refreshToken == null) {
        throw Exception('No refresh token available');
      }
      
      // Make refresh token request
      final dio = Dio();
      final response = await dio.post(
        '${ApiConstants.baseUrl}/api/auth/refresh',
        data: {'refresh_token': refreshToken},
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ),
      );
      
      if (response.statusCode == 200 && response.data is Map<String, dynamic>) {
        final responseData = response.data as Map<String, dynamic>;
        final newToken = responseData['token'] as String?;
        final newRefreshToken = responseData['refresh_token'] as String?;
        final expiresIn = responseData['expires_in'] as int?;
        
        if (newToken != null) {
          // Calculate expiry time
          DateTime? expiry;
          if (expiresIn != null) {
            expiry = DateTime.now().add(Duration(seconds: expiresIn));
          }
          
          // Update tokens atomically
          await StorageService.saveToken(
            newToken,
            refreshToken: newRefreshToken,
            expiry: expiry,
          );
          
          print('[AuthInterceptor] Token refreshed successfully');
        } else {
          throw Exception('No token in refresh response');
        }
      } else {
        throw Exception('Refresh token request failed');
      }
    } catch (e) {
      print('[AuthInterceptor] Token refresh error: $e');
      
      // Clear tokens on refresh failure
      await StorageService.deleteToken();
      await StorageService.deleteUserData();
      
      rethrow;
    } finally {
      _isRefreshing = false;
      
      // Complete all waiting requests
      for (final completer in _refreshQueue) {
        if (!completer.isCompleted) {
          completer.complete();
        }
      }
      _refreshQueue.clear();
    }
  }

  /// Check if token refresh is in progress
  static bool get isRefreshing => _isRefreshing;

  /// Get the number of requests waiting for token refresh
  static int get queueLength => _refreshQueue.length;

  /// Clear the refresh queue (for testing or emergency scenarios)
  static void clearRefreshQueue() {
    for (final completer in _refreshQueue) {
      if (!completer.isCompleted) {
        completer.completeError(Exception('Refresh queue cleared'));
      }
    }
    _refreshQueue.clear();
    _isRefreshing = false;
  }
}
