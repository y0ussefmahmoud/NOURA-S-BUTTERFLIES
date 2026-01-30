import 'package:dio/dio.dart';

/// Rate limiting interceptor for Flutter admin app
/// Implements per-path rate limiting with sliding window algorithm
class RateLimitInterceptor extends Interceptor {
  final Map<String, List<DateTime>> _requests = {};
  final Map<String, int> _limits;
  final Duration windowDuration;

  RateLimitInterceptor({
    Map<String, int>? limits,
    this.windowDuration = const Duration(minutes: 1),
  }) : _limits = limits ?? _getDefaultLimits();

  static Map<String, int> _getDefaultLimits() {
    return {
      '/api/auth/login': 5,      // 5 login attempts per minute
      '/api/auth/register': 3,   // 3 registration attempts per minute
      '/api/auth/refresh': 10,   // 10 token refreshes per minute
      '/api/products': 100,     // 100 product requests per minute
      '/api/orders': 50,        // 50 order requests per minute
      '/api/customers': 50,      // 50 customer requests per minute
      '/api/dashboard': 30,      // 30 dashboard requests per minute
      '/default': 60,           // 60 requests per minute for other endpoints
    };
  }

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final path = _normalizePath(options.path);
    final limit = _limits[path] ?? _limits['/default'] ?? 60;

    if (!_canRequest(path, limit)) {
      handler.reject(
        DioException(
          requestOptions: options,
          type: DioExceptionType.unknown,
          error: 'Rate limit exceeded for $path. Please try again later.',
        ),
      );
      return;
    }

    _recordRequest(path);
    handler.next(options);
  }

  String _normalizePath(String path) {
    // Remove query parameters and normalize path
    final uri = Uri.tryParse(path);
    if (uri != null) {
      return uri.path;
    }
    return path;
  }

  bool _canRequest(String path, int limit) {
    final now = DateTime.now();
    final requests = _requests[path] ?? [];
    
    // Remove expired requests outside the window
    requests.removeWhere((timestamp) => 
        now.difference(timestamp) > windowDuration);
    
    return requests.length < limit;
  }

  void _recordRequest(String path) {
    final now = DateTime.now();
    if (!_requests.containsKey(path)) {
      _requests[path] = [];
    }
    _requests[path]!.add(now);
    
    // Cleanup old entries periodically
    _cleanup();
  }

  void _cleanup() {
    final now = DateTime.now();
    _requests.forEach((path, requests) {
      requests.removeWhere((timestamp) => 
          now.difference(timestamp) > windowDuration * 2); // Keep slightly longer for stats
    });
  }

  /// Get rate limit statistics
  Map<String, Map<String, dynamic>> getStats() {
    final now = DateTime.now();
    final stats = <String, Map<String, dynamic>>{};
    
    _requests.forEach((path, requests) {
      final recentRequests = requests.where((timestamp) => 
          now.difference(timestamp) <= windowDuration).toList();
      
      stats[path] = {
        'current': recentRequests.length,
        'limit': _limits[path] ?? _limits['/default'] ?? 60,
        'window': windowDuration.inSeconds,
        'remaining': ((_limits[path] ?? _limits['/default'] ?? 60) - recentRequests.length).clamp(0, double.infinity).toInt(),
      };
    });
    
    return stats;
  }

  /// Reset rate limits for a specific path
  void resetPath(String path) {
    _requests.remove(path);
  }

  /// Reset all rate limits
  void resetAll() {
    _requests.clear();
  }

  /// Check if a path is currently rate limited
  bool isRateLimited(String path) {
    final limit = _limits[path] ?? _limits['/default'] ?? 60;
    return !_canRequest(path, limit);
  }

  /// Get remaining requests for a path
  int getRemainingRequests(String path) {
    final limit = _limits[path] ?? _limits['/default'] ?? 60;
    final now = DateTime.now();
    final requests = _requests[path] ?? [];
    
    // Remove expired requests
    requests.removeWhere((timestamp) => 
        now.difference(timestamp) > windowDuration);
    
    return (limit - requests.length).clamp(0, limit);
  }

  /// Get time until next request is allowed
  Duration? getTimeUntilNextRequest(String path) {
    final limit = _limits[path] ?? _limits['/default'] ?? 60;
    final now = DateTime.now();
    final requests = _requests[path] ?? [];
    
    // Remove expired requests
    requests.removeWhere((timestamp) => 
        now.difference(timestamp) > windowDuration);
    
    if (requests.length < limit) {
      return null; // Request allowed now
    }
    
    // Find the oldest request within the window
    final oldestRequest = requests.first;
    final nextAllowedTime = oldestRequest.add(windowDuration);
    
    return nextAllowedTime.difference(now);
  }
}
