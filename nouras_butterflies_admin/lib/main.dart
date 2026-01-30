import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_crashlytics/firebase_crashlytics.dart';
import 'package:firebase_performance/firebase_performance.dart';
import 'app.dart';
import 'core/di/service_locator.dart';
import 'core/config/environment.dart';
import 'core/error/crash_reporter.dart';
import 'data/local/hive_service.dart';
import 'core/network/connectivity_service.dart';
import 'data/cache/cache_manager.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Firebase with performance monitoring
  await Firebase.initializeApp();
  
  // Initialize Firebase Performance
  await FirebasePerformance.instance.setPerformanceCollectionEnabled(true);
  
  // Initialize enhanced Crashlytics reporter
  await CrashReporter.instance.initialize();
  
  // Enable Crashlytics in production
  if (EnvironmentConfig.environment == Environment.production) {
    await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(true);
  } else {
    await FirebaseCrashlytics.instance.setCrashlyticsCollectionEnabled(false);
  }
  
  // Initialize core services in optimized order
  await _initializeCoreServices();
  
  // Initialize environment from environment variables
  EnvironmentConfig.initializeFromEnvironment();
  EnvironmentConfig.printEnvironmentConfig();
  
  // Setup dependency injection
  await setupServiceLocator();
  
  // Initialize remaining services after app is ready
  await _initializeSecondaryServices();
  
  // تثبيت اتجاه الشاشة (Portrait فقط للموبايل)
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Log app startup
  CrashReporter.instance.logInfo('App started successfully');
  
  runApp(const NourasButterfliesAdminApp());
}

/// Initialize core services needed for app startup
Future<void> _initializeCoreServices() async {
  try {
    // Initialize Hive first (critical for local storage)
    await HiveService.instance.initialize();
    
    // Initialize connectivity service
    await ConnectivityService.instance.initialize();
    
    // Initialize cache manager (no await needed as it's a getter)
    CacheManager.instance;
    
    print('Core services initialized successfully');
  } catch (e) {
    CrashReporter.instance.logError('Failed to initialize core services', 
      context: {'error': e.toString()});
    rethrow;
  }
}

/// Initialize secondary services that can load after app starts
Future<void> _initializeSecondaryServices() async {
  try {
    // Start auto-sync for offline operations
    await SyncManager.instance.startAutoSync();
    
    // Preload critical cache data
    await _preloadCriticalData();
    
    print('Secondary services initialized successfully');
  } catch (e) {
    CrashReporter.instance.logError('Failed to initialize secondary services', 
      context: {'error': e.toString()});
    // Don't rethrow - app should still work without these
  }
}

/// Preload critical data for better performance
Future<void> _preloadCriticalData() async {
  try {
    // Preload dashboard data if cache is valid
    final cacheManager = CacheManager.instance;
    if (cacheManager.isCacheValid('dashboard')) {
      // This will be a background operation
      cacheManager.getData('dashboard', () async {
        // Return empty future since we're just checking cache
        return Future.value();
      }, strategy: CacheStrategy.cacheOnly);
    }
    
    print('Critical data preloaded');
  } catch (e) {
    CrashReporter.instance.logError('Failed to preload critical data', 
      context: {'error': e.toString()});
  }
}
