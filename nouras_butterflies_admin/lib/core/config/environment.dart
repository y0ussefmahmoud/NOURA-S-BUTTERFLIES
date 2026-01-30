import '../constants/api_constants.dart';

enum Environment { development, staging, production }

class EnvironmentConfig {
  static Environment _current = Environment.development;
  
  /// Current environment
  static Environment get current => _current;
  
  /// Set current environment
  static void setEnvironment(Environment environment) {
    _current = environment;
  }
  
  /// Get base URL for current environment
  static String get baseUrl {
    switch (_current) {
      case Environment.development:
        return ApiConstants.devUrl;
      case Environment.staging:
        return ApiConstants.stagingUrl;
      case Environment.production:
        return ApiConstants.baseUrl;
    }
  }
  
  /// Check if running in development mode
  static bool get isDevelopment => _current == Environment.development;
  
  /// Check if running in staging mode
  static bool get isStaging => _current == Environment.staging;
  
  /// Check if running in production mode
  static bool get isProduction => _current == Environment.production;
  
  /// Get environment name as string
  static String get environmentName => _current.name;
  
  /// Check if debug mode is enabled
  static bool get isDebugMode => !const bool.fromEnvironment('dart.vm.product');
  
  /// Get app version (can be updated from pubspec.yaml)
  static const String appVersion = '1.0.0';
  
  /// Get build number
  static const String buildNumber = '1';
  
  /// Get API timeout for current environment
  static Duration get apiTimeout {
    switch (_current) {
      case Environment.development:
        return const Duration(seconds: 60); // Longer timeout for debugging
      case Environment.staging:
        return const Duration(seconds: 30);
      case Environment.production:
        return const Duration(seconds: 20); // Shorter timeout for production
    }
  }
  
  /// Get retry count for API calls
  static int get retryCount {
    switch (_current) {
      case Environment.development:
        return 1; // Fewer retries for faster debugging
      case Environment.staging:
        return 2;
      case Environment.production:
        return 3; // More retries for production stability
    }
  }
  
  /// Check if logging is enabled
  static bool get isLoggingEnabled {
    switch (_current) {
      case Environment.development:
        return true;
      case Environment.staging:
        return true;
      case Environment.production:
        return false; // Disable logging in production
    }
  }
  
  /// Get environment-specific configuration
  static Map<String, dynamic> get config {
    return {
      'environment': environmentName,
      'baseUrl': baseUrl,
      'isDebugMode': isDebugMode,
      'isLoggingEnabled': isLoggingEnabled,
      'apiTimeout': apiTimeout.inSeconds,
      'retryCount': retryCount,
      'appVersion': appVersion,
      'buildNumber': buildNumber,
    };
  }
  
  /// Initialize environment from environment variables
  static void initializeFromEnvironment() {
    const environmentString = String.fromEnvironment(
      'ENVIRONMENT',
      defaultValue: 'development',
    );
    
    switch (environmentString.toLowerCase()) {
      case 'production':
      case 'prod':
        _current = Environment.production;
        break;
      case 'staging':
      case 'stage':
        _current = Environment.staging;
        break;
      case 'development':
      case 'dev':
      default:
        _current = Environment.development;
        break;
    }
  }
  
  /// Print current environment configuration (for debugging)
  static void printEnvironmentConfig() {
    if (isDebugMode) {
      print('=== Environment Configuration ===');
      print('Environment: ${environmentName}');
      print('Base URL: ${baseUrl}');
      print('Debug Mode: ${isDebugMode}');
      print('Logging Enabled: ${isLoggingEnabled}');
      print('API Timeout: ${apiTimeout.inSeconds}s');
      print('Retry Count: ${retryCount}');
      print('App Version: ${appVersion}+${buildNumber}');
      print('================================');
    }
  }
}
