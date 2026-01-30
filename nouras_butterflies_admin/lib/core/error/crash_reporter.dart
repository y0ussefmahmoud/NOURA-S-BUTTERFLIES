import 'dart:async';
import 'dart:io';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_performance/firebase_performance.dart';
import 'package:flutter/foundation.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:package_info_plus/package_info_plus.dart';

/// Enhanced crash reporter with context and breadcrumbs
class CrashReporter {
  static final CrashReporter _instance = CrashReporter._internal();
  factory CrashReporter() => _instance;
  CrashReporter._internal();

  final List<Breadcrumb> _breadcrumbs = [];
  final Map<String, dynamic> _globalContext = {};
  Timer? _breadcrumbCleanupTimer;

  /// Initialize crash reporter
  Future<void> initialize() async {
    try {
      // Set up global error handlers
      FlutterError.onError = _handleFlutterError;
      PlatformDispatcher.instance.onError = _handlePlatformError;

      // Add device information to global context
      await _addDeviceInfo();
      await _addAppInfo();

      // Start breadcrumb cleanup timer (keep only last 100)
      _breadcrumbCleanupTimer = Timer.periodic(
        const Duration(minutes: 30),
        (_) => _cleanupBreadcrumbs(),
      );

      // Log initialization
      logInfo('CrashReporter initialized');
    } catch (e) {
      debugPrint('Failed to initialize CrashReporter: $e');
    }
  }

  /// Handle Flutter errors
  void _handleFlutterError(FlutterErrorDetails details) {
    // Don't report in debug mode
    if (kDebugMode) return;

    final exception = details.exception;
    final stack = details.stack ?? StackTrace.current;

    // Add context to the error report
    _addContextToError(exception, stack);

    // Report to Crashlytics
    FirebaseCrashlytics.instance.recordError(
      exception,
      stack,
      fatal: true,
      information: [
        DiagnosticsProperty('breadcrumbs', _breadcrumbs),
        DiagnosticsProperty('context', _globalContext),
        DiagnosticsProperty('library', details.library),
        DiagnosticsProperty('context', details.context),
      ],
    );
  }

  /// Handle platform errors
  bool _handlePlatformError(Object error, StackTrace stack) {
    // Don't report in debug mode
    if (kDebugMode) return false;

    // Add context to the error report
    _addContextToError(error, stack);

    // Report to Crashlytics
    FirebaseCrashlytics.instance.recordError(
      error,
      stack,
      fatal: true,
      information: [
        DiagnosticsProperty('breadcrumbs', _breadcrumbs),
        DiagnosticsProperty('context', _globalContext),
      ],
    );

    return true;
  }

  /// Add context to error report
  void _addContextToError(Object error, StackTrace stack) {
    FirebaseCrashlytics.instance.setCustomKey('error_type', error.runtimeType.toString());
    FirebaseCrashlytics.instance.setCustomKey('error_message', error.toString());
    FirebaseCrashlytics.instance.setCustomKey('breadcrumb_count', _breadcrumbs.length.toString());
    
    // Add global context
    for (final entry in _globalContext.entries) {
      FirebaseCrashlytics.instance.setCustomKey(entry.key, entry.value.toString());
    }

    // Add recent breadcrumbs
    final recentBreadcrumbs = _breadcrumbs.take(10).toList();
    for (int i = 0; i < recentBreadcrumbs.length; i++) {
      final breadcrumb = recentBreadcrumbs[i];
      FirebaseCrashlytics.instance.setCustomKey(
        'breadcrumb_${i + 1}',
        '${breadcrumb.level.name}: ${breadcrumb.message}',
      );
    }
  }

  /// Log error with context
  void logError(
    dynamic error, {
    StackTrace? stackTrace,
    String? screen,
    String? action,
    Map<String, dynamic>? context,
  }) {
    if (kDebugMode) {
      debugPrint('ERROR: $error');
      return;
    }

    try {
      FirebaseCrashlytics.instance.recordError(
        error,
        stackTrace ?? StackTrace.current,
        information: [
          DiagnosticsProperty('screen', screen),
          DiagnosticsProperty('action', action),
          DiagnosticsProperty('context', context),
          DiagnosticsProperty('breadcrumbs', _breadcrumbs),
        ],
      );
    } catch (e) {
      debugPrint('Failed to log error: $e');
    }
  }

  /// Log warning
  void logWarning(
    String message, {
    String? screen,
    String? action,
    Map<String, dynamic>? context,
  }) {
    _addBreadcrumb(BreadcrumbLevel.warning, message, screen: screen, action: action);
    
    if (!kDebugMode) {
      FirebaseCrashlytics.instance.log('WARNING: $message');
    }
  }

  /// Log info
  void logInfo(
    String message, {
    String? screen,
    String? action,
    Map<String, dynamic>? context,
  }) {
    _addBreadcrumb(BreadcrumbLevel.info, message, screen: screen, action: action);
    
    if (!kDebugMode) {
      FirebaseCrashlytics.instance.log('INFO: $message');
    }
  }

  /// Add breadcrumb for tracking user journey
  void _addBreadcrumb(
    BreadcrumbLevel level,
    String message, {
    String? screen,
    String? action,
    Map<String, dynamic>? context,
  }) {
    final breadcrumb = Breadcrumb(
      level: level,
      message: message,
      timestamp: DateTime.now(),
      screen: screen,
      action: action,
      context: context,
    );

    _breadcrumbs.insert(0, breadcrumb);
    
    // Keep only last 100 breadcrumbs
    if (_breadcrumbs.length > 100) {
      _breadcrumbs.removeLast();
    }
  }

  /// Set user identifier
  void setUser(String userId, {String? email, String? name}) {
    FirebaseCrashlytics.instance.setUserIdentifier(userId);
    
    if (email != null) {
      FirebaseCrashlytics.instance.setCustomKey('user_email', email);
    }
    
    if (name != null) {
      FirebaseCrashlytics.instance.setCustomKey('user_name', name);
    }

    _globalContext['user_id'] = userId;
    _globalContext['user_email'] = email;
    _globalContext['user_name'] = name;
  }

  /// Clear user information
  void clearUser() {
    FirebaseCrashlytics.instance.setUserIdentifier('');
    FirebaseCrashlytics.instance.setCustomKey('user_email', '');
    FirebaseCrashlytics.instance.setCustomKey('user_name', '');
    
    _globalContext.remove('user_id');
    _globalContext.remove('user_email');
    _globalContext.remove('user_name');
  }

  /// Set global context
  void setContext(String key, dynamic value) {
    _globalContext[key] = value;
    
    if (!kDebugMode) {
      FirebaseCrashlytics.instance.setCustomKey(key, value.toString());
    }
  }

  /// Add device information to context
  Future<void> _addDeviceInfo() async {
    try {
      final deviceInfo = DeviceInfoPlugin();
      
      if (Platform.isIOS) {
        final iosInfo = await deviceInfo.iosInfo;
        setContext('device_model', '${iosInfo.model} (${iosInfo.systemVersion})');
        setContext('device_name', iosInfo.name);
        setContext('device_system', 'iOS ${iosInfo.systemVersion}');
      } else if (Platform.isAndroid) {
        final androidInfo = await deviceInfo.androidInfo;
        setContext('device_model', '${androidInfo.model} (${androidInfo.version.release})');
        setContext('device_manufacturer', androidInfo.manufacturer);
        setContext('device_system', 'Android ${androidInfo.version.release}');
        setContext('device_sdk', androidInfo.version.sdkInt.toString());
      }
    } catch (e) {
      debugPrint('Failed to get device info: $e');
    }
  }

  /// Add app information to context
  Future<void> _addAppInfo() async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      setContext('app_version', '${packageInfo.version}+${packageInfo.buildNumber}');
      setContext('app_package', packageInfo.packageName);
      setContext('app_build_number', packageInfo.buildNumber);
    } catch (e) {
      debugPrint('Failed to get app info: $e');
    }
  }

  /// Cleanup old breadcrumbs
  void _cleanupBreadcrumbs() {
    if (_breadcrumbs.length > 100) {
      _breadcrumbs.removeRange(100, _breadcrumbs.length);
    }
  }

  /// Get current breadcrumbs
  List<Breadcrumb> get breadcrumbs => List.unmodifiable(_breadcrumbs);

  /// Get current context
  Map<String, dynamic> get context => Map.unmodifiable(_globalContext);

  /// Dispose resources
  void dispose() {
    _breadcrumbCleanupTimer?.cancel();
  }
}

/// Breadcrumb for tracking user journey
class Breadcrumb {
  final BreadcrumbLevel level;
  final String message;
  final DateTime timestamp;
  final String? screen;
  final String? action;
  final Map<String, dynamic>? context;

  const Breadcrumb({
    required this.level,
    required this.message,
    required this.timestamp,
    this.screen,
    this.action,
    this.context,
  });

  Map<String, dynamic> toJson() {
    return {
      'level': level.name,
      'message': message,
      'timestamp': timestamp.toIso8601String(),
      'screen': screen,
      'action': action,
      'context': context,
    };
  }

  @override
  String toString() {
    return 'Breadcrumb(level: $level, message: $message, timestamp: $timestamp)';
  }
}

/// Breadcrumb levels
enum BreadcrumbLevel {
  debug,
  info,
  warning,
  error,
  fatal,
}

/// Performance monitor for tracking app performance
class PerformanceMonitor {
  static final PerformanceMonitor _instance = PerformanceMonitor._internal();
  factory PerformanceMonitor() => _instance;
  PerformanceMonitor._internal();

  final Map<String, Trace> _activeTraces = {};
  final Map<String, Metric> _metrics = {};
  final Map<String, DateTime> _startTimes = {};

  /// Start a performance trace
  Trace startTrace(String name) {
    final trace = FirebasePerformance.instance.newTrace(name);
    trace.start();
    _activeTraces[name] = trace;
    _startTimes[name] = DateTime.now();
    return trace;
  }

  /// Stop a performance trace
  Future<void> stopTrace(String name) async {
    final trace = _activeTraces[name];
    if (trace != null) {
      await trace.stop();
      _activeTraces.remove(name);
      _startTimes.remove(name);
    }
  }

  /// Run operation within a trace
  Future<T> traceOperation<T>(
    String name,
    Future<T> Function() operation, {
    Map<String, String>? attributes,
  }) async {
    final trace = startTrace(name);
    
    try {
      // Add attributes if provided
      if (attributes != null) {
        for (final entry in attributes.entries) {
          trace.setMetric(entry.key, double.tryParse(entry.value) ?? 0);
        }
      }

      final result = await operation();
      await trace.stop();
      return result;
    } catch (e) {
      trace.putAttribute('error', e.toString());
      await trace.stop();
      rethrow;
    }
  }

  /// Record a metric
  void recordMetric(String name, double value) {
    _metrics[name] = FirebasePerformance.instance.newMetric(name, value);
  }

  /// Increment a counter metric
  void incrementCounter(String name, {double increment = 1.0}) {
    final currentValue = _metrics[name]?.value ?? 0;
    recordMetric(name, currentValue + increment);
  }

  /// Get active traces
  Map<String, Trace> get activeTraces => Map.unmodifiable(_activeTraces);

  /// Get all metrics
  Map<String, Metric> get metrics => Map.unmodifiable(_metrics);

  /// Get trace duration
  Duration? getTraceDuration(String name) {
    final startTime = _startTimes[name];
    if (startTime != null) {
      return DateTime.now().difference(startTime);
    }
    return null;
  }

  /// Screen performance tracker
  ScreenPerformanceTracker trackScreen(String screenName) {
    return ScreenPerformanceTracker(screenName);
  }
}

/// Screen performance tracker
class ScreenPerformanceTracker {
  final String screenName;
  final PerformanceMonitor _monitor = PerformanceMonitor();
  Trace? _trace;
  DateTime? _startTime;

  ScreenPerformanceTracker(this.screenName);

  /// Start tracking screen performance
  void start() {
    _startTime = DateTime.now();
    _trace = _monitor.startTrace('screen_$screenName');
    _trace?.putAttribute('screen_name', screenName);
  }

  /// Stop tracking screen performance
  Future<void> stop() async {
    if (_trace != null) {
      if (_startTime != null) {
        final duration = DateTime.now().difference(_startTime!);
        _trace!.setMetric('screen_duration_ms', duration.inMilliseconds.toDouble());
      }
      await _trace!.stop();
      _trace = null;
      _startTime = null;
    }
  }

  /// Track user interaction
  void trackInteraction(String action) {
    _trace?.putAttribute('last_action', action);
    _monitor.incrementCounter('screen_interactions', attributes: {
      'screen': screenName,
      'action': action,
    });
  }

  /// Track custom event
  void trackEvent(String event, {Map<String, String>? attributes}) {
    _monitor.incrementCounter('screen_events', attributes: {
      'screen': screenName,
      'event': event,
      ...?attributes,
    });
  }
}

/// Network performance monitor
class NetworkPerformanceMonitor {
  static final NetworkPerformanceMonitor _instance = NetworkPerformanceMonitor._internal();
  factory NetworkPerformanceMonitor() => _instance;
  NetworkPerformanceMonitor._internal();

  final PerformanceMonitor _monitor = PerformanceMonitor();

  /// Track network request
  Future<T> trackRequest<T>(
    String url,
    String method,
    Future<T> Function() request, {
    Map<String, String>? headers,
    Map<String, dynamic>? body,
  }) async {
    final traceName = 'network_${method.toLowerCase()}_${_hashUrl(url)}';
    
    return await _monitor.traceOperation(traceName, () async {
      final trace = _monitor.startTrace(traceName);
      
      try {
        trace.putAttribute('url', url);
        trace.putAttribute('method', method);
        
        if (headers != null) {
          trace.putAttribute('headers_count', headers.length.toString());
        }
        
        if (body != null) {
          trace.putAttribute('body_size', body.toString().length.toString());
        }

        final startTime = DateTime.now();
        final result = await request();
        final duration = DateTime.now().difference(startTime);
        
        trace.setMetric('request_duration_ms', duration.inMilliseconds.toDouble());
        trace.putAttribute('status', 'success');
        
        await trace.stop();
        return result;
      } catch (e) {
        trace.putAttribute('status', 'error');
        trace.putAttribute('error_type', e.runtimeType.toString());
        await trace.stop();
        rethrow;
      }
    });
  }

  /// Hash URL for trace naming
  String _hashUrl(String url) {
    return url.hashCode.abs().toString();
  }
}

/// Memory monitor for tracking memory usage
class MemoryMonitor {
  static final MemoryMonitor _instance = MemoryMonitor._internal();
  factory MemoryMonitor() => _instance;
  MemoryMonitor._internal();

  final PerformanceMonitor _monitor = PerformanceMonitor();
  Timer? _monitoringTimer;

  /// Start memory monitoring
  void startMonitoring({Duration interval = const Duration(minutes: 1)}) {
    _monitoringTimer?.cancel();
    _monitoringTimer = Timer.periodic(interval, (_) => _recordMemoryUsage());
  }

  /// Stop memory monitoring
  void stopMonitoring() {
    _monitoringTimer?.cancel();
  }

  /// Record current memory usage
  void _recordMemoryUsage() {
    // This is a simplified version - in a real app you might want to use
    // platform-specific APIs to get more accurate memory information
    _monitor.recordMetric('memory_check_timestamp', DateTime.now().millisecondsSinceEpoch.toDouble());
  }

  /// Record memory pressure event
  void recordMemoryPressure(String level) {
    _monitor.incrementCounter('memory_pressure_events', attributes: {
      'level': level,
    });
  }
}
