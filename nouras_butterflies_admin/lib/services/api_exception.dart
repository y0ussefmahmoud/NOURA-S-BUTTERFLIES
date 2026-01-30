/// Custom API exceptions for better error handling
class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;
  
  const ApiException(this.message, {this.statusCode, this.errors});
  
  @override
  String toString() => 'ApiException: $message';
}

/// Network connection errors
class NetworkException extends ApiException {
  const NetworkException(String message) : super(message);
  
  @override
  String toString() => 'NetworkException: $message';
}

/// Authentication errors (401)
class UnauthorizedException extends ApiException {
  const UnauthorizedException(String message) : super(message, statusCode: 401);
  
  @override
  String toString() => 'UnauthorizedException: $message';
}

/// Resource not found errors (404)
class NotFoundException extends ApiException {
  const NotFoundException(String message) : super(message, statusCode: 404);
  
  @override
  String toString() => 'NotFoundException: $message';
}

/// Server errors (5xx)
class ServerException extends ApiException {
  const ServerException(String message) : super(message, statusCode: 500);
  
  @override
  String toString() => 'ServerException: $message';
}

/// Validation errors (422)
class ValidationException extends ApiException {
  const ValidationException(String message, [Map<String, dynamic>? errors]) 
      : super(message, statusCode: 422, errors: errors);
  
  @override
  String toString() => 'ValidationException: $message';
}

/// Timeout errors
class TimeoutException extends ApiException {
  const TimeoutException(String message) : super(message);
  
  @override
  String toString() => 'TimeoutException: $message';
}

/// API Error response model
class ApiError {
  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;
  final String? code;
  
  const ApiError({
    required this.message,
    this.statusCode,
    this.errors,
    this.code,
  });
  
  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(
      message: json['message'] as String? ?? 'Unknown error',
      statusCode: json['status_code'] as int?,
      errors: json['errors'] as Map<String, dynamic>?,
      code: json['code'] as String?,
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'message': message,
      'status_code': statusCode,
      'errors': errors,
      'code': code,
    };
  }
  
  /// Get user-friendly error message
  String get userMessage {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        if (errors != null && errors!.isNotEmpty) {
          final firstError = errors!.values.first;
          if (firstError is List && firstError.isNotEmpty) {
            return firstError.first as String;
          } else if (firstError is String) {
            return firstError;
          }
        }
        return 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return message.isNotEmpty ? message : 'An unexpected error occurred.';
    }
  }
  
  /// Check if error is recoverable (can be retried)
  bool get isRecoverable {
    switch (statusCode) {
      case 500:
      case 502:
      case 503:
      case 504:
        return true;
      default:
        return false;
    }
  }
  
  /// Check if error requires user action
  bool get requiresUserAction {
    switch (statusCode) {
      case 401:
      case 403:
      case 422:
        return true;
      default:
        return false;
    }
  }
}
