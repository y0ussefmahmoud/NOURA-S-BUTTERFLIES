import 'dart:io';
import 'dart:async';
import 'dart:math';
import 'package:flutter/foundation.dart';
import 'package:dio/dio.dart';

/// Unified error handling system for Noura's Butterflies Admin
/// Provides comprehensive error management with retry strategies and user-friendly messages

enum ErrorType {
  network,
  authentication,
  validation,
  server,
  storage,
  unknown,
}

enum ErrorSeverity {
  low,
  medium,
  high,
  critical,
}

class AppException implements Exception {
  final String message;
  final String? technicalMessage;
  final ErrorType type;
  final ErrorSeverity severity;
  final int? statusCode;
  final String? errorCode;
  final Map<String, dynamic>? context;
  final DateTime timestamp;

  const AppException({
    required this.message,
    this.technicalMessage,
    required this.type,
    required this.severity,
    this.statusCode,
    this.errorCode,
    this.context,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? const Duration().inMilliseconds != 0 
         ? DateTime.now() 
         : DateTime.now();

  @override
  String toString() {
    return 'AppException(message: $message, type: $type, severity: $severity)';
  }
}

class RetryStrategy {
  final int maxAttempts;
  final Duration initialDelay;
  final double backoffMultiplier;
  final Duration maxDelay;
  final bool shouldRetry;

  const RetryStrategy({
    this.maxAttempts = 3,
    this.initialDelay = const Duration(seconds: 1),
    this.backoffMultiplier = 2.0,
    this.maxDelay = const Duration(seconds: 30),
    this.shouldRetry = true,
  });

  Duration getDelay(int attempt) {
    final delay = initialDelay * pow(backoffMultiplier, attempt - 1);
    return delay > maxDelay ? maxDelay : Duration(milliseconds: delay.inMilliseconds);
  }
}

class ErrorRecoveryAction {
  final String label;
  final String action;
  final VoidCallback? onPressed;
  final bool isPrimary;

  const ErrorRecoveryAction({
    required this.label,
    required this.action,
    this.onPressed,
    this.isPrimary = false,
  });
}

class ErrorHandler {
  static ErrorHandler? _instance;
  static ErrorHandler get instance => _instance ??= ErrorHandler._();
  
  ErrorHandler._();

  /// Handle async operations with retry logic
  Future<T> handleAsync<T>(
    Future<T> Function() operation, {
    RetryStrategy? retryStrategy,
    String? operationName,
    Map<String, dynamic>? context,
  }) async {
    final strategy = retryStrategy ?? const RetryStrategy();
    AppException? lastException;

    for (int attempt = 1; attempt <= strategy.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (e) {
        lastException = _convertException(e, operationName, context);
        
        if (attempt == strategy.maxAttempts || !strategy.shouldRetry) {
          break;
        }

        if (lastException.type == ErrorType.validation) {
          // Don't retry validation errors
          break;
        }

        final delay = strategy.getDelay(attempt);
        await Future.delayed(delay);
      }
    }

    throw lastException ?? AppException(
      message: 'Unknown error occurred',
      type: ErrorType.unknown,
      severity: ErrorSeverity.medium,
    );
  }

  /// Convert various exception types to AppException
  AppException _convertException(
    dynamic exception,
    String? operationName,
    Map<String, dynamic>? context,
  ) {
    if (exception is AppException) {
      return exception;
    }

    if (exception is DioException) {
      return _handleDioException(exception, operationName, context);
    }

    if (exception is SocketException) {
      return AppException(
        message: 'No internet connection. Please check your network.',
        technicalMessage: exception.toString(),
        type: ErrorType.network,
        severity: ErrorSeverity.high,
        context: context,
      );
    }

    if (exception is TimeoutException) {
      return AppException(
        message: 'Request timed out. Please try again.',
        technicalMessage: exception.toString(),
        type: ErrorType.network,
        severity: ErrorSeverity.medium,
        context: context,
      );
    }

    if (exception is FormatException) {
      return AppException(
        message: 'Invalid data format received.',
        technicalMessage: exception.toString(),
        type: ErrorType.validation,
        severity: ErrorSeverity.medium,
        context: context,
      );
    }

    return AppException(
      message: 'An unexpected error occurred.',
      technicalMessage: exception.toString(),
      type: ErrorType.unknown,
      severity: ErrorSeverity.medium,
      context: context,
    );
  }

  AppException _handleDioException(
    DioException exception,
    String? operationName,
    Map<String, dynamic>? context,
  ) {
    switch (exception.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        return AppException(
          message: 'Connection timeout. Please check your internet connection.',
          technicalMessage: exception.toString(),
          type: ErrorType.network,
          severity: ErrorSeverity.high,
          context: context,
        );

      case DioExceptionType.badResponse:
        final statusCode = exception.response?.statusCode;
        final message = _getErrorMessage(statusCode);
        
        return AppException(
          message: message,
          technicalMessage: exception.toString(),
          type: _getErrorType(statusCode),
          severity: _getErrorSeverity(statusCode),
          statusCode: statusCode,
          context: context,
        );

      case DioExceptionType.cancel:
        return AppException(
          message: 'Request was cancelled.',
          technicalMessage: exception.toString(),
          type: ErrorType.network,
          severity: ErrorSeverity.low,
          context: context,
        );

      case DioExceptionType.connectionError:
        return AppException(
          message: 'No internet connection. Please check your network.',
          technicalMessage: exception.toString(),
          type: ErrorType.network,
          severity: ErrorSeverity.high,
          context: context,
        );

      case DioExceptionType.unknown:
        return AppException(
          message: 'Network error occurred. Please try again.',
          technicalMessage: exception.toString(),
          type: ErrorType.network,
          severity: ErrorSeverity.medium,
          context: context,
        );

      default:
        return AppException(
          message: 'Unknown network error.',
          technicalMessage: exception.toString(),
          type: ErrorType.unknown,
          severity: ErrorSeverity.medium,
          context: context,
        );
    }
  }

  String _getErrorMessage(int? statusCode) {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'Access denied. You don\'t have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Invalid data provided. Please check your input.';
      case 429:
        return 'Too many requests. Please wait and try again.';
      case 500:
        return 'Server error. Please try again later.';
      case 502:
        return 'Server temporarily unavailable. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return 'Server error occurred. Please try again.';
    }
  }

  ErrorType _getErrorType(int? statusCode) {
    if (statusCode == null) return ErrorType.unknown;
    
    if (statusCode >= 400 && statusCode < 500) {
      if (statusCode == 401 || statusCode == 403) {
        return ErrorType.authentication;
      }
      return ErrorType.validation;
    }
    
    if (statusCode >= 500) {
      return ErrorType.server;
    }
    
    return ErrorType.network;
  }

  ErrorSeverity _getErrorSeverity(int? statusCode) {
    if (statusCode == null) return ErrorSeverity.medium;
    
    switch (statusCode) {
      case 401:
      case 403:
        return ErrorSeverity.high;
      case 500:
      case 502:
      case 503:
        return ErrorSeverity.critical;
      case 429:
        return ErrorSeverity.medium;
      default:
        return ErrorSeverity.medium;
    }
  }

  /// Get user-friendly recovery actions for an error
  List<ErrorRecoveryAction> getRecoveryActions(AppException exception) {
    final actions = <ErrorRecoveryAction>[];

    switch (exception.type) {
      case ErrorType.network:
        actions.add(const ErrorRecoveryAction(
          label: 'Retry',
          action: 'retry',
          isPrimary: true,
        ));
        actions.add(const ErrorRecoveryAction(
          label: 'Check Connection',
          action: 'check_connection',
        ));
        break;

      case ErrorType.authentication:
        actions.add(const ErrorRecoveryAction(
          label: 'Login Again',
          action: 'relogin',
          isPrimary: true,
        ));
        break;

      case ErrorType.validation:
        actions.add(const ErrorRecoveryAction(
          label: 'Fix Input',
          action: 'fix_input',
          isPrimary: true,
        ));
        break;

      case ErrorType.server:
        actions.add(const ErrorRecoveryAction(
          label: 'Try Again',
          action: 'retry',
          isPrimary: true,
        ));
        actions.add(const ErrorRecoveryAction(
          label: 'Contact Support',
          action: 'contact_support',
        ));
        break;

      case ErrorType.storage:
        actions.add(const ErrorRecoveryAction(
          label: 'Clear Cache',
          action: 'clear_cache',
          isPrimary: true,
        ));
        break;

      case ErrorType.unknown:
        actions.add(const ErrorRecoveryAction(
          label: 'Try Again',
          action: 'retry',
          isPrimary: true,
        ));
        actions.add(const ErrorRecoveryAction(
          label: 'Report Issue',
          action: 'report_issue',
        ));
        break;
    }

    return actions;
  }

  /// Log error for debugging and analytics
  void logError(AppException exception, {String? screen, String? action}) {
    // This will be integrated with Firebase Crashlytics later
    print('Error logged: ${exception.toString()}');
    if (screen != null) print('Screen: $screen');
    if (action != null) print('Action: $action');
  }
}
