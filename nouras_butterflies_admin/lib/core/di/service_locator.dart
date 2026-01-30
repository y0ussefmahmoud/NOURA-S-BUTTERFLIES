import 'package:get_it/get_it.dart';
import '../../services/storage_service.dart';
import '../../services/api_service.dart';
import '../../core/config/environment.dart';
import '../../data/repositories/admin_product_repository.dart';
import '../../data/repositories/order_repository.dart';
import '../../data/repositories/customer_repository.dart';

final getIt = GetIt.instance;

/// Setup service locator with all dependencies
Future<void> setupServiceLocator() async {
  // Initialize Storage Service first (synchronous)
  getIt.registerLazySingleton(() => StorageService);
  
  // Initialize Environment Configuration
  getIt.registerLazySingleton(() => EnvironmentConfig);
  
  // Initialize API Service
  getIt.registerLazySingleton<ApiService>(() {
    final apiService = ApiService();
    // Update base URL based on current environment
    apiService.updateBaseUrl(EnvironmentConfig.baseUrl);
    return apiService;
  });
  
  // Register Repositories
  _registerRepositories();
  
  // Register BLoCs and other services can be added here
  _registerBlocs();
}

/// Register all repositories
void _registerRepositories() {
  // Product Repository
  getIt.registerLazySingleton<AdminProductRepository>(
    () => AdminProductRepositoryImpl(
      apiService: getIt<ApiService>(),
      useMockData: EnvironmentConfig.isDevelopment, // Use mock data in development
    ),
  );
  
  // Order Repository
  getIt.registerLazySingleton<OrderRepository>(
    () => OrderRepositoryImpl(
      apiService: getIt<ApiService>(),
      useMockData: EnvironmentConfig.isDevelopment, // Use mock data in development
    ),
  );
  
  // Customer Repository
  getIt.registerLazySingleton<CustomerRepository>(
    () => CustomerRepositoryImpl(
      apiService: getIt<ApiService>(),
      useMockData: EnvironmentConfig.isDevelopment, // Use mock data in development
    ),
  );
}

/// Register all BLoCs (to be implemented when BLoCs are created)
void _registerBlocs() {
  // Product BLoCs
  // getIt.registerFactory(() => ProductBloc(getIt<AdminProductRepository>()));
  // getIt.registerFactory(() => ProductDetailBloc(getIt<AdminProductRepository>()));
  
  // Order BLoCs
  // getIt.registerFactory(() => OrderBloc(getIt<OrderRepository>()));
  // getIt.registerFactory(() => OrderDetailBloc(getIt<OrderRepository>()));
  
  // Customer BLoCs
  // getIt.registerFactory(() => CustomerBloc(getIt<CustomerRepository>()));
  // getIt.registerFactory(() => CustomerDetailBloc(getIt<CustomerRepository>()));
  
  // Dashboard BLoC
  // getIt.registerFactory(() => DashboardBloc(
  //   productRepository: getIt<AdminProductRepository>(),
  //   orderRepository: getIt<OrderRepository>(),
  //   customerRepository: getIt<CustomerRepository>(),
  // ));
  
  // Auth BLoC
  // getIt.registerFactory(() => AuthBloc(getIt<ApiService>(), getIt<StorageService>()));
}

/// Initialize all services that require async initialization
Future<void> initializeServices() async {
  // Initialize Storage Service
  await StorageService.init();
  
  // Initialize Environment
  EnvironmentConfig.initializeFromEnvironment();
  
  // Print environment configuration in debug mode
  EnvironmentConfig.printEnvironmentConfig();
}

/// Reset service locator (useful for testing)
void resetServiceLocator() {
  getIt.reset();
}

/// Check if service locator is ready
bool get isServiceLocatorReady => getIt.isReady<StorageService>();

/// Get service by type (convenience method)
T getService<T extends Object>() {
  return getIt<T>();
}

/// Extension for easy access to common services
extension ServiceLocatorExtensions on GetIt {
  StorageService get storage => get<StorageService>();
  ApiService get api => get<ApiService>();
  AdminProductRepository get productRepository => get<AdminProductRepository>();
  OrderRepository get orderRepository => get<OrderRepository>();
  CustomerRepository get customerRepository => get<CustomerRepository>();
}

/// Dependency injection configuration for different environments
class DIConfig {
  /// Setup for development environment
  static void setupDevelopment() {
    EnvironmentConfig.setEnvironment(Environment.development);
  }
  
  /// Setup for staging environment
  static void setupStaging() {
    EnvironmentConfig.setEnvironment(Environment.staging);
  }
  
  /// Setup for production environment
  static void setupProduction() {
    EnvironmentConfig.setEnvironment(Environment.production);
  }
  
  /// Setup based on environment variable
  static void setupFromEnvironment() {
    EnvironmentConfig.initializeFromEnvironment();
  }
}

/// Service locator utilities for testing
class TestServiceLocator {
  /// Setup service locator for testing
  static Future<void> setupForTesting() async {
    // Reset any existing setup
    if (GetIt.instance.isReady<StorageService>()) {
      GetIt.instance.reset();
    }
    
    // Mock services for testing
    getIt.registerLazySingleton(() => StorageService);
    getIt.registerLazySingleton<ApiService>(() => MockApiService());
    
    // Mock repositories
    getIt.registerLazySingleton<AdminProductRepository>(
      () => AdminProductRepositoryImpl(
        apiService: getIt<ApiService>(),
        useMockData: true,
      ),
    );
    
    getIt.registerLazySingleton<OrderRepository>(
      () => OrderRepositoryImpl(
        apiService: getIt<ApiService>(),
        useMockData: true,
      ),
    );
    
    getIt.registerLazySingleton<CustomerRepository>(
      () => CustomerRepositoryImpl(
        apiService: getIt<ApiService>(),
        useMockData: true,
      ),
    );
    
    // Initialize services
    await StorageService.init();
  }
}

/// Mock API Service for testing
class MockApiService extends ApiService {
  // Mock implementation for testing
  // This would be implemented with mock data
}
