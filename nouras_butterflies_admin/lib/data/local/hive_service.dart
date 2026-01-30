import 'dart:io';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:path_provider/path_provider.dart';
import '../../data/models/admin_product.dart';
import '../../data/models/order.dart';
import '../../data/models/customer.dart';
import '../../data/models/dashboard_data.dart';
import '../network/connectivity_service.dart';
import 'adapters/product_adapter.dart';
import 'adapters/order_adapter.dart';
import 'adapters/customer_adapter.dart';
import 'adapters/dashboard_adapter.dart';

/// Local storage service using Hive for offline support and caching
class HiveService {
  static HiveService? _instance;
  static HiveService get instance => _instance ??= HiveService._();
  
  HiveService._();

  static const String _productsBoxName = 'products';
  static const String _ordersBoxName = 'orders';
  static const String _customersBoxName = 'customers';
  static const String _dashboardBoxName = 'dashboard';
  static const String _cacheBoxName = 'cache_metadata';
  static const String _offlineQueueBoxName = 'offline_queue';

  late Box<AdminProduct> _productsBox;
  late Box<Order> _ordersBox;
  late Box<Customer> _customersBox;
  late Box<AdminDashboardData> _dashboardBox;
  late Box<Map> _cacheBox;
  late Box<Map> _offlineQueueBox;

  bool _isInitialized = false;

  /// Initialize Hive and register adapters
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // Initialize Hive
      await Hive.initFlutter();
      
      // Get application documents directory
      final appDocumentDir = await getApplicationDocumentsDirectory();
      Hive.init(appDocumentDir.path);

      // Register adapters
      if (!Hive.isAdapterRegistered(AdminProductAdapter().typeId)) {
        Hive.registerAdapter(AdminProductAdapter());
      }
      if (!Hive.isAdapterRegistered(OrderAdapter().typeId)) {
        Hive.registerAdapter(OrderAdapter());
      }
      if (!Hive.isAdapterRegistered(CustomerAdapter().typeId)) {
        Hive.registerAdapter(CustomerAdapter());
      }
      if (!Hive.isAdapterRegistered(AdminDashboardDataAdapter().typeId)) {
        Hive.registerAdapter(AdminDashboardDataAdapter());
      }

      // Open boxes
      _productsBox = await Hive.openBox<AdminProduct>(_productsBoxName);
      _ordersBox = await Hive.openBox<Order>(_ordersBoxName);
      _customersBox = await Hive.openBox<Customer>(_customersBoxName);
      _dashboardBox = await Hive.openBox<AdminDashboardData>(_dashboardBoxName);
      _cacheBox = await Hive.openBox<Map>(_cacheBoxName);
      _offlineQueueBox = await Hive.openBox<Map>(_offlineQueueBoxName);

      _isInitialized = true;
      print('HiveService initialized successfully');
    } catch (e) {
      print('Failed to initialize HiveService: $e');
      rethrow;
    }
  }

  /// Check if service is initialized
  bool get isInitialized => _isInitialized;

  // ==================== PRODUCTS ====================

  /// Save products to local storage
  Future<void> saveProducts(List<AdminProduct> products) async {
    if (!_isInitialized) await initialize();

    try {
      await _productsBox.clear();
      for (final product in products) {
        await _productsBox.put(product.id, product);
      }
      
      // Update cache metadata
      await _updateCacheMetadata(_productsBoxName, DateTime.now());
      print('Saved ${products.length} products to local storage');
    } catch (e) {
      print('Failed to save products: $e');
      rethrow;
    }
  }

  /// Get all products from local storage
  List<AdminProduct> getProducts() {
    if (!_isInitialized) return [];

    try {
      return _productsBox.values.toList();
    } catch (e) {
      print('Failed to get products: $e');
      return [];
    }
  }

  /// Get a specific product by ID
  AdminProduct? getProductById(String id) {
    if (!_isInitialized) return null;

    try {
      return _productsBox.get(id);
    } catch (e) {
      print('Failed to get product $id: $e');
      return null;
    }
  }

  /// Save or update a single product
  Future<void> saveProduct(AdminProduct product) async {
    if (!_isInitialized) await initialize();

    try {
      await _productsBox.put(product.id, product);
      await _updateCacheMetadata(_productsBoxName, DateTime.now());
    } catch (e) {
      print('Failed to save product: $e');
      rethrow;
    }
  }

  /// Delete a product
  Future<void> deleteProduct(String id) async {
    if (!_isInitialized) await initialize();

    try {
      await _productsBox.delete(id);
      await _updateCacheMetadata(_productsBoxName, DateTime.now());
    } catch (e) {
      print('Failed to delete product: $e');
      rethrow;
    }
  }

  /// Search products locally
  List<AdminProduct> searchProducts(String query) {
    if (!_isInitialized) return [];

    try {
      final allProducts = _productsBox.values.toList();
      if (query.isEmpty) return allProducts;

      final lowerQuery = query.toLowerCase();
      return allProducts.where((product) =>
        product.name.toLowerCase().contains(lowerQuery) ||
        product.nameAr.toLowerCase().contains(lowerQuery) ||
        product.sku.toLowerCase().contains(lowerQuery) ||
        product.category.toLowerCase().contains(lowerQuery)
      ).toList();
    } catch (e) {
      print('Failed to search products: $e');
      return [];
    }
  }

  // ==================== ORDERS ====================

  /// Save orders to local storage
  Future<void> saveOrders(List<Order> orders) async {
    if (!_isInitialized) await initialize();

    try {
      await _ordersBox.clear();
      for (final order in orders) {
        await _ordersBox.put(order.id, order);
      }
      
      await _updateCacheMetadata(_ordersBoxName, DateTime.now());
      print('Saved ${orders.length} orders to local storage');
    } catch (e) {
      print('Failed to save orders: $e');
      rethrow;
    }
  }

  /// Get all orders from local storage
  List<Order> getOrders() {
    if (!_isInitialized) return [];

    try {
      return _ordersBox.values.toList();
    } catch (e) {
      print('Failed to get orders: $e');
      return [];
    }
  }

  /// Save or update a single order
  Future<void> saveOrder(Order order) async {
    if (!_isInitialized) await initialize();

    try {
      await _ordersBox.put(order.id, order);
      await _updateCacheMetadata(_ordersBoxName, DateTime.now());
    } catch (e) {
      print('Failed to save order: $e');
      rethrow;
    }
  }

  // ==================== CUSTOMERS ====================

  /// Save customers to local storage
  Future<void> saveCustomers(List<Customer> customers) async {
    if (!_isInitialized) await initialize();

    try {
      await _customersBox.clear();
      for (final customer in customers) {
        await _customersBox.put(customer.id, customer);
      }
      
      await _updateCacheMetadata(_customersBoxName, DateTime.now());
      print('Saved ${customers.length} customers to local storage');
    } catch (e) {
      print('Failed to save customers: $e');
      rethrow;
    }
  }

  /// Get all customers from local storage
  List<Customer> getCustomers() {
    if (!_isInitialized) return [];

    try {
      return _customersBox.values.toList();
    } catch (e) {
      print('Failed to get customers: $e');
      return [];
    }
  }

  /// Search customers locally
  List<Customer> searchCustomers(String query) {
    if (!_isInitialized) return [];

    try {
      final allCustomers = _customersBox.values.toList();
      if (query.isEmpty) return allCustomers;

      final lowerQuery = query.toLowerCase();
      return allCustomers.where((customer) =>
        customer.name.toLowerCase().contains(lowerQuery) ||
        customer.email.toLowerCase().contains(lowerQuery) ||
        customer.phone.toLowerCase().contains(lowerQuery)
      ).toList();
    } catch (e) {
      print('Failed to search customers: $e');
      return [];
    }
  }

  // ==================== DASHBOARD ====================

  /// Save dashboard data to local storage
  Future<void> saveDashboardData(AdminDashboardData dashboardData) async {
    if (!_isInitialized) await initialize();

    try {
      await _dashboardBox.put('current', dashboardData);
      await _updateCacheMetadata(_dashboardBoxName, DateTime.now());
    } catch (e) {
      print('Failed to save dashboard data: $e');
      rethrow;
    }
  }

  /// Get dashboard data from local storage
  AdminDashboardData? getDashboardData() {
    if (!_isInitialized) return null;

    try {
      return _dashboardBox.get('current');
    } catch (e) {
      print('Failed to get dashboard data: $e');
      return null;
    }
  }

  // ==================== CACHE MANAGEMENT ====================

  /// Update cache metadata for a box
  Future<void> _updateCacheMetadata(String boxName, DateTime timestamp) async {
    try {
      await _cacheBox.put(boxName, {
        'lastUpdated': timestamp.toIso8601String(),
        'boxName': boxName,
      });
    } catch (e) {
      print('Failed to update cache metadata for $boxName: $e');
    }
  }

  /// Get cache metadata for a box
  Map<String, dynamic>? getCacheMetadata(String boxName) {
    if (!_isInitialized) return null;

    try {
      final metadata = _cacheBox.get(boxName);
      if (metadata != null) {
        return Map<String, dynamic>.from(metadata);
      }
      return null;
    } catch (e) {
      print('Failed to get cache metadata for $boxName: $e');
      return null;
    }
  }

  /// Check if cache is valid (not expired)
  bool isCacheValid(String boxName, {Duration maxAge = const Duration(hours: 1)}) {
    final metadata = getCacheMetadata(boxName);
    if (metadata == null) return false;

    final lastUpdated = DateTime.parse(metadata['lastUpdated']);
    final now = DateTime.now();
    return now.difference(lastUpdated) <= maxAge;
  }

  /// Clear all cached data
  Future<void> clearAllCache() async {
    if (!_isInitialized) await initialize();

    try {
      await Future.wait([
        _productsBox.clear(),
        _ordersBox.clear(),
        _customersBox.clear(),
        _dashboardBox.clear(),
        _cacheBox.clear(),
      ]);
      print('Cleared all cached data');
    } catch (e) {
      print('Failed to clear cache: $e');
      rethrow;
    }
  }

  /// Clear specific box cache
  Future<void> clearBoxCache(String boxName) async {
    if (!_isInitialized) await initialize();

    try {
      switch (boxName) {
        case _productsBoxName:
          await _productsBox.clear();
          break;
        case _ordersBoxName:
          await _ordersBox.clear();
          break;
        case _customersBoxName:
          await _customersBox.clear();
          break;
        case _dashboardBoxName:
          await _dashboardBox.clear();
          break;
      }
      
      await _cacheBox.delete(boxName);
      print('Cleared cache for $boxName');
    } catch (e) {
      print('Failed to clear cache for $boxName: $e');
      rethrow;
    }
  }

  // ==================== OFFLINE QUEUE ====================

  /// Add operation to offline queue
  Future<void> addToOfflineQueue(Map<String, dynamic> operation) async {
    if (!_isInitialized) await initialize();

    try {
      final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
      await _offlineQueueBox.put(timestamp, {
        ...operation,
        'timestamp': timestamp,
        'status': 'pending',
      });
      print('Added operation to offline queue: $operation');
    } catch (e) {
      print('Failed to add to offline queue: $e');
      rethrow;
    }
  }

  /// Get all pending operations from offline queue
  List<Map<String, dynamic>> getPendingOperations() {
    if (!_isInitialized) return [];

    try {
      return _offlineQueueBox.values
          .where((op) => op['status'] == 'pending')
          .toList();
    } catch (e) {
      print('Failed to get pending operations: $e');
      return [];
    }
  }

  /// Mark operation as completed
  Future<void> markOperationCompleted(String timestamp) async {
    if (!_isInitialized) await initialize();

    try {
      final operation = _offlineQueueBox.get(timestamp);
      if (operation != null) {
        operation['status'] = 'completed';
        await _offlineQueueBox.put(timestamp, operation);
      }
    } catch (e) {
      print('Failed to mark operation as completed: $e');
      rethrow;
    }
  }

  /// Update draft metadata for auto-save functionality
  Future<void> updateDraftMetadata(String key, Map<String, dynamic> metadata) async {
    if (!_isInitialized) await initialize();

    try {
      await _cacheMetadataBox.put(key, metadata);
    } catch (e) {
      print('Failed to update draft metadata: $e');
      rethrow;
    }
  }

  /// Get draft metadata
  Map<String, dynamic>? getDraftMetadata(String key) {
    if (!_isInitialized) return null;

    try {
      return _cacheMetadataBox.get(key);
    } catch (e) {
      print('Failed to get draft metadata: $e');
      return null;
    }
  }

  /// Clear completed operations from queue
  Future<void> clearCompletedOperations() async {
    if (!_isInitialized) await initialize();

    try {
      final keysToDelete = <String>[];
      for (final key in _offlineQueueBox.keys) {
        final operation = _offlineQueueBox.get(key);
        if (operation?['status'] == 'completed') {
          keysToDelete.add(key);
        }
      }
      
      for (final key in keysToDelete) {
        await _offlineQueueBox.delete(key);
      }
      
      print('Cleared ${keysToDelete.length} completed operations');
    } catch (e) {
      print('Failed to clear completed operations: $e');
    }
  }

  // ==================== STATISTICS ====================

  /// Get storage statistics
  Map<String, dynamic> getStorageStats() {
    if (!_isInitialized) return {};

    try {
      return {
        'products': _productsBox.length,
        'orders': _ordersBox.length,
        'customers': _customersBox.length,
        'dashboard': _dashboardBox.length,
        'pendingOperations': getPendingOperations().length,
        'cacheMetadata': _cacheBox.length,
      };
    } catch (e) {
      print('Failed to get storage stats: $e');
      return {};
    }
  }

  /// Close all boxes
  Future<void> close() async {
    if (!_isInitialized) return;

    try {
      await Future.wait([
        _productsBox.close(),
        _ordersBox.close(),
        _customersBox.close(),
        _dashboardBox.close(),
        _cacheBox.close(),
        _offlineQueueBox.close(),
      ]);
      _isInitialized = false;
      print('HiveService closed successfully');
    } catch (e) {
      print('Failed to close HiveService: $e');
    }
  }
}
