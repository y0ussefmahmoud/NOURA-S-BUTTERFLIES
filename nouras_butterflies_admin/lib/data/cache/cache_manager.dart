import 'dart:async';
import 'package:flutter/foundation.dart';
import '../local/hive_service.dart';
import '../network/connectivity_service.dart';
import '../models/admin_product.dart';
import '../models/order.dart';
import '../models/customer.dart';
import '../models/admin_dashboard_data.dart';

/// Cache strategy for data fetching
enum CacheStrategy {
  networkFirst,
  cacheFirst,
  networkOnly,
  cacheOnly,
}

/// Cache policy with TTL
class CachePolicy {
  final Duration ttl;
  final bool forceRefresh;
  final bool allowStale;
  final int maxRetries;

  const CachePolicy({
    this.ttl = const Duration(hours: 1),
    this.forceRefresh = false,
    this.allowStale = false,
    this.maxRetries = 3,
  });

  CachePolicy copyWith({
    Duration? ttl,
    bool? forceRefresh,
    bool? allowStale,
    int? maxRetries,
  }) {
    return CachePolicy(
      ttl: ttl ?? this.ttl,
      forceRefresh: forceRefresh ?? this.forceRefresh,
      allowStale: allowStale ?? this.allowStale,
      maxRetries: maxRetries ?? this.maxRetries,
    );
  }
}

/// Cache result with metadata
class CacheResult<T> {
  final T? data;
  final bool fromCache;
  final DateTime? cachedAt;
  final bool isExpired;
  final String? error;

  const CacheResult({
    this.data,
    required this.fromCache,
    this.cachedAt,
    required this.isExpired,
    this.error,
  });

  bool get hasData => data != null;
  bool get hasError => error != null;
}

/// Cache manager for handling data caching strategies
class CacheManager {
  static CacheManager? _instance;
  static CacheManager get instance => _instance ??= CacheManager._();
  
  CacheManager._();

  final HiveService _hiveService = HiveService.instance;
  final ConnectivityService _connectivityService = ConnectivityService.instance;
  
  // Cache policies for different data types
  final Map<String, CachePolicy> _cachePolicies = {
    'products': const CachePolicy(ttl: Duration(minutes: 30)),
    'orders': const CachePolicy(ttl: Duration(minutes: 15)),
    'customers': const CachePolicy(ttl: Duration(hours: 2)),
    'dashboard': const CachePolicy(ttl: Duration(minutes: 5)),
    'categories': const CachePolicy(ttl: Duration(hours: 24)),
  };

  /// Get data with caching strategy
  Future<CacheResult<T>> getData<T>(
    String dataType,
    Future<T> Function() fetchFromNetwork, {
    CacheStrategy strategy = CacheStrategy.cacheFirst,
    CachePolicy? customPolicy,
    String? cacheKey,
  }) async {
    final policy = customPolicy ?? _cachePolicies[dataType] ?? const CachePolicy();
    final key = cacheKey ?? dataType;

    try {
      switch (strategy) {
        case CacheStrategy.networkFirst:
          return await _networkFirst<T>(key, fetchFromNetwork, policy);
        
        case CacheStrategy.cacheFirst:
          return await _cacheFirst<T>(key, fetchFromNetwork, policy);
        
        case CacheStrategy.networkOnly:
          return await _networkOnly<T>(fetchFromNetwork);
        
        case CacheStrategy.cacheOnly:
          return await _cacheOnly<T>(key, policy);
      }
    } catch (e) {
      return CacheResult<T>(
        fromCache: false,
        isExpired: false,
        error: e.toString(),
      );
    }
  }

  /// Network-first strategy: Try network, fallback to cache on failure
  Future<CacheResult<T>> _networkFirst<T>(
    String key,
    Future<T> Function() fetchFromNetwork,
    CachePolicy policy,
  ) async {
    if (_connectivityService.isConnected) {
      try {
        final data = await fetchFromNetwork();
        await _saveToCache(key, data);
        return CacheResult<T>(
          data: data,
          fromCache: false,
          isExpired: false,
        );
      } catch (e) {
        debugPrint('Network request failed, falling back to cache: $e');
        return await _getFromCache<T>(key, policy);
      }
    } else {
      return await _getFromCache<T>(key, policy);
    }
  }

  /// Cache-first strategy: Try cache first, then network if expired or no data
  Future<CacheResult<T>> _cacheFirst<T>(
    String key,
    Future<T> Function() fetchFromNetwork,
    CachePolicy policy,
  ) async {
    final cachedResult = await _getFromCache<T>(key, policy);
    
    if (cachedResult.hasData && !cachedResult.isExpired) {
      return cachedResult;
    }

    if (_connectivityService.isConnected) {
      try {
        final data = await fetchFromNetwork();
        await _saveToCache(key, data);
        return CacheResult<T>(
          data: data,
          fromCache: false,
          isExpired: false,
        );
      } catch (e) {
        debugPrint('Network request failed, using cache: $e');
        if (cachedResult.hasData && policy.allowStale) {
          return cachedResult;
        }
        rethrow;
      }
    } else if (cachedResult.hasData && policy.allowStale) {
      return cachedResult;
    }

    throw Exception('No network connection and no valid cache available');
  }

  /// Network-only strategy: Only fetch from network
  Future<CacheResult<T>> _networkOnly<T>(Future<T> Function() fetchFromNetwork) async {
    if (!_connectivityService.isConnected) {
      throw Exception('No network connection');
    }

    final data = await fetchFromNetwork();
    return CacheResult<T>(
      data: data,
      fromCache: false,
      isExpired: false,
    );
  }

  /// Cache-only strategy: Only get from cache
  Future<CacheResult<T>> _cacheOnly<T>(String key, CachePolicy policy) async {
    return await _getFromCache<T>(key, policy);
  }

  /// Get data from cache
  Future<CacheResult<T>> _getFromCache<T>(String key, CachePolicy policy) async {
    try {
      final metadata = _hiveService.getCacheMetadata(key);
      if (metadata == null) {
        return const CacheResult<T>(
          fromCache: true,
          isExpired: false,
        );
      }

      final cachedAt = DateTime.parse(metadata['lastUpdated']);
      final now = DateTime.now();
      final isExpired = now.difference(cachedAt) > policy.ttl;

      T? data;
      switch (key) {
        case 'products':
          if (T.toString().contains('List')) {
            data = _hiveService.getProducts() as T?;
          } else {
            // Single product - need ID
            return const CacheResult<T>(
              fromCache: true,
              isExpired: false,
              error: 'Single product cache requires ID',
            );
          }
          break;
        case 'orders':
          if (T.toString().contains('List')) {
            data = _hiveService.getOrders() as T?;
          }
          break;
        case 'customers':
          if (T.toString().contains('List')) {
            data = _hiveService.getCustomers() as T?;
          }
          break;
        case 'dashboard':
          data = _hiveService.getDashboardData() as T?;
          break;
        default:
          return const CacheResult<T>(
            fromCache: true,
            isExpired: false,
            error: 'Unknown cache key: $key',
          );
      }

      return CacheResult<T>(
        data: data,
        fromCache: true,
        cachedAt: cachedAt,
        isExpired: isExpired,
      );
    } catch (e) {
      return CacheResult<T>(
        fromCache: true,
        isExpired: false,
        error: e.toString(),
      );
    }
  }

  /// Save data to cache
  Future<void> _saveToCache<T>(String key, T data) async {
    try {
      switch (key) {
        case 'products':
          if (data is List) {
            final products = data.cast<dynamic>();
            if (products.isNotEmpty && products.first is AdminProduct) {
              await _hiveService.saveProducts(products.cast<AdminProduct>());
            }
          }
          break;
        case 'orders':
          if (data is List) {
            final orders = data.cast<dynamic>();
            if (orders.isNotEmpty && orders.first is Order) {
              await _hiveService.saveOrders(orders.cast<Order>());
            }
          }
          break;
        case 'customers':
          if (data is List) {
            final customers = data.cast<dynamic>();
            if (customers.isNotEmpty && customers.first is Customer) {
              await _hiveService.saveCustomers(customers.cast<Customer>());
            }
          }
          break;
        case 'dashboard':
          if (data is AdminDashboardData) {
            await _hiveService.saveDashboardData(data);
          }
          break;
      }
    } catch (e) {
      debugPrint('Failed to save to cache: $e');
    }
  }

  /// Invalidate cache for specific data type
  Future<void> invalidateCache(String dataType) async {
    await _hiveService.clearBoxCache(dataType);
  }

  /// Invalidate all cache
  Future<void> invalidateAllCache() async {
    await _hiveService.clearAllCache();
  }

  /// Check if cache is valid for data type
  bool isCacheValid(String dataType, {Duration? customTtl}) {
    final ttl = customTtl ?? _cachePolicies[dataType]?.ttl ?? const Duration(hours: 1);
    return _hiveService.isCacheValid(dataType, maxAge: ttl);
  }

  /// Get cache statistics
  Map<String, dynamic> getCacheStats() {
    return _hiveService.getStorageStats();
  }

  /// Update cache policy for data type
  void updateCachePolicy(String dataType, CachePolicy policy) {
    _cachePolicies[dataType] = policy;
  }

  /// Get cache policy for data type
  CachePolicy getCachePolicy(String dataType) {
    return _cachePolicies[dataType] ?? const CachePolicy();
  }
}

/// Sync manager for handling offline operations
class SyncManager {
  static SyncManager? _instance;
  static SyncManager get instance => _instance ??= SyncManager._();
  
  SyncManager._();

  final HiveService _hiveService = HiveService.instance;
  final ConnectivityService _connectivityService = ConnectivityService.instance;
  final CacheManager _cacheManager = CacheManager.instance;
  
  bool _isSyncing = false;
  final StreamController<SyncStatus> _statusController = 
      StreamController<SyncStatus>.broadcast();

  /// Stream of sync status updates
  Stream<SyncStatus> get syncStream => _statusController.stream;

  /// Current sync status
  bool get isSyncing => _isSyncing;

  /// Start sync process when connection is restored
  Future<void> startAutoSync() async {
    _connectivityService.connectivityStream.listen((status) async {
      if (status == ConnectivityStatus.connected && !_isSyncing) {
        await syncPendingOperations();
      }
    });
  }

  /// Sync all pending operations
  Future<SyncResult> syncPendingOperations() async {
    if (_isSyncing) {
      return SyncResult(
        success: false,
        message: 'Sync already in progress',
        operationsProcessed: 0,
        operationsFailed: 0,
      );
    }

    _isSyncing = true;
    _statusController.add(SyncStatus.syncing);

    try {
      final pendingOperations = _hiveService.getPendingOperations();
      int processed = 0;
      int failed = 0;

      for (final operation in pendingOperations) {
        try {
          await _processOperation(operation);
          await _hiveService.markOperationCompleted(operation['timestamp']);
          processed++;
        } catch (e) {
          debugPrint('Failed to process operation: $e');
          failed++;
        }
      }

      await _hiveService.clearCompletedOperations();

      final result = SyncResult(
        success: failed == 0,
        message: processed > 0 
            ? 'Synced $processed operations${failed > 0 ? ', $failed failed' : ''}'
            : 'No operations to sync',
        operationsProcessed: processed,
        operationsFailed: failed,
      );

      _statusController.add(SyncStatus.completed);
      return result;
    } catch (e) {
      _statusController.add(SyncStatus.error);
      return SyncResult(
        success: false,
        message: 'Sync failed: $e',
        operationsProcessed: 0,
        operationsFailed: 0,
      );
    } finally {
      _isSyncing = false;
    }
  }

  /// Process individual operation
  Future<void> _processOperation(Map<String, dynamic> operation) async {
    final type = operation['type'] as String;
    final data = operation['data'] as Map<String, dynamic>;

    switch (type) {
      case 'create_product':
      case 'update_product':
      case 'delete_product':
        // Process product operations
        break;
      case 'update_order_status':
        // Process order operations
        break;
      case 'create_customer':
      case 'update_customer':
        // Process customer operations
        break;
      default:
        throw Exception('Unknown operation type: $type');
    }
  }

  /// Add operation to offline queue
  Future<void> addOfflineOperation({
    required String type,
    required Map<String, dynamic> data,
    String? entityId,
  }) async {
    final operation = {
      'type': type,
      'data': data,
      'entityId': entityId,
      'timestamp': DateTime.now().millisecondsSinceEpoch.toString(),
    };

    await _hiveService.addToOfflineQueue(operation);
  }

  /// Get pending operations count
  int get pendingOperationsCount {
    return _hiveService.getPendingOperations().length;
  }

  /// Dispose resources
  void dispose() {
    _statusController.close();
  }
}

/// Sync status enum
enum SyncStatus {
  idle,
  syncing,
  completed,
  error,
}

/// Sync result
class SyncResult {
  final bool success;
  final String message;
  final int operationsProcessed;
  final int operationsFailed;

  const SyncResult({
    required this.success,
    required this.message,
    required this.operationsProcessed,
    required this.operationsFailed,
  });
}

/// Offline queue for managing operations
class OfflineQueue {
  static OfflineQueue? _instance;
  static OfflineQueue get instance => _instance ??= OfflineQueue._();
  
  OfflineQueue._();

  final HiveService _hiveService = HiveService.instance;

  /// Queue operation for later sync
  Future<void> queueOperation({
    required String type,
    required Map<String, dynamic> data,
    String? entityId,
    int priority = 0,
  }) async {
    final operation = {
      'type': type,
      'data': data,
      'entityId': entityId,
      'priority': priority,
      'timestamp': DateTime.now().millisecondsSinceEpoch.toString(),
      'status': 'pending',
    };

    await _hiveService.addToOfflineQueue(operation);
  }

  /// Get queued operations sorted by priority
  List<Map<String, dynamic>> getQueuedOperations() {
    final operations = _hiveService.getPendingOperations();
    
    // Sort by priority (higher priority first) and timestamp
    operations.sort((a, b) {
      final priorityA = a['priority'] as int? ?? 0;
      final priorityB = b['priority'] as int? ?? 0;
      
      if (priorityA != priorityB) {
        return priorityB.compareTo(priorityA);
      }
      
      final timestampA = int.parse(a['timestamp'] as String);
      final timestampB = int.parse(b['timestamp'] as String);
      return timestampA.compareTo(timestampB);
    });

    return operations;
  }

  /// Clear all queued operations
  Future<void> clearQueue() async {
    final operations = getQueuedOperations();
    for (final operation in operations) {
      await _hiveService.markOperationCompleted(operation['timestamp']);
    }
    await _hiveService.clearCompletedOperations();
  }
}
