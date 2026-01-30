import '../models/order.dart';
import '../mock/mock_orders.dart';
import '../cache/cache_manager.dart';
import '../../core/network/connectivity_service.dart';
import '../../core/error/error_handler.dart';
import '../../core/config/environment.dart';
import '../../services/api_service.dart';
import '../../services/api_exception.dart';

abstract class OrderRepository {
  Future<List<Order>> getOrders();
  Future<Order?> getOrderById(String id);
  Future<List<Order>> getOrdersByStatus(OrderStatus status);
  Future<List<Order>> searchOrders(String query);
  Future<Order> updateOrderStatus(String id, OrderStatus status);
  Future<void> deleteOrder(String id);
}

class OrderRepositoryImpl implements OrderRepository {
  final bool useMockData;
  final ApiService _apiService;
  List<Order> _orders = MockOrders.orders;
  
  OrderRepositoryImpl({
    required ApiService apiService,
    bool? useMockData,
  }) : _apiService = apiService,
       useMockData = useMockData ?? (EnvironmentConfig.environment == Environment.development);

  @override
  Future<List<Order>> getOrders() async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 500));
      return List.from(_orders);
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'orders',
            () => _apiService.getOrders(),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Order>;
          } else {
            throw result.error ?? Exception('Failed to fetch orders');
          }
        },
        operation: 'fetch_orders',
        context: {'method': 'getOrders'},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Order?> getOrderById(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      try {
        return _orders.firstWhere((order) => order.id == id);
      } catch (e) {
        return null;
      }
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'order_$id',
            () => _apiService.getOrderById(id),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as Order?;
          } else {
            throw result.error ?? Exception('Failed to fetch order');
          }
        },
        operation: 'fetch_order_by_id',
        context: {'orderId': id},
      );
    } on NotFoundException {
      return null;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<Order>> getOrdersByStatus(OrderStatus status) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      return _orders.where((order) => order.status == status).toList();
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'orders_status_${status.name}',
            () => _apiService.getOrdersByStatus(status),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Order>;
          } else {
            throw result.error ?? Exception('Failed to fetch orders by status');
          }
        },
        operation: 'fetch_orders_by_status',
        context: {'status': status.name},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<Order>> searchOrders(String query) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      final lowerQuery = query.toLowerCase();
      return _orders.where((order) {
        return order.id.toLowerCase().contains(lowerQuery) ||
            order.customerName.toLowerCase().contains(lowerQuery) ||
            order.customerEmail.toLowerCase().contains(lowerQuery);
      }).toList();
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'orders_search_$query',
            () => _apiService.searchOrders(query),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Order>;
          } else {
            throw result.error ?? Exception('Failed to search orders');
          }
        },
        operation: 'search_orders',
        context: {'query': query},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Order> updateOrderStatus(String id, OrderStatus status) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 500));
      
      final index = _orders.indexWhere((order) => order.id == id);
      if (index == -1) {
        throw Exception('Order not found');
      }

      final now = DateTime.now();
      final updatedOrder = _orders[index].copyWith(
        status: status,
        updatedAt: now,
        shippedAt: status == OrderStatus.shipped ? now : _orders[index].shippedAt,
        deliveredAt: status == OrderStatus.delivered ? now : _orders[index].deliveredAt,
      );

      _orders[index] = updatedOrder;
      return updatedOrder;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'update_order_status',
        data: {
          'orderId': id,
          'status': status.name,
        },
        entityId: id,
        priority: 1, // High priority
      );
      
      // Return optimistic update
      final cachedResult = await cacheManager.getData(
        'order_$id',
        () => throw Exception('No network'),
        strategy: CacheStrategy.cacheOnly,
      );
      
      if (cachedResult.hasData) {
        final order = cachedResult.data as Order;
        return order.copyWith(
          status: status,
          updatedAt: DateTime.now(),
          shippedAt: status == OrderStatus.shipped ? DateTime.now() : order.shippedAt,
          deliveredAt: status == OrderStatus.delivered ? DateTime.now() : order.deliveredAt,
        );
      }
      
      throw Exception('No network and no cached data');
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final result = await _apiService.updateOrderStatus(id, status);
          
          // Update cache with new data
          final cacheManager = CacheManager.instance;
          await cacheManager.saveData('order_$id', result);
          
          return result;
        },
        operation: 'update_order_status',
        context: {'orderId': id, 'status': status.name},
      );
    } on NotFoundException {
      throw Exception('Order not found');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> deleteOrder(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      _orders.removeWhere((order) => order.id == id);
      return;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'delete_order',
        data: {'orderId': id},
        entityId: id,
        priority: 1, // High priority
      );
      
      // Remove from cache optimistically
      await cacheManager.invalidateData('order_$id');
      return;
    }
    
    try {
      await ErrorHandler.instance.handleAsync(
        () async {
          await _apiService.deleteOrder(id);
          
          // Remove from cache
          final cacheManager = CacheManager.instance;
          await cacheManager.invalidateData('order_$id');
        },
        operation: 'delete_order',
        context: {'orderId': id},
      );
    } on NotFoundException {
      // Order not found, but deletion is successful
      return;
    } catch (e) {
      rethrow;
    }
  }

  // Additional helper methods
  Future<List<Order>> getOrdersByDateRange(DateTime start, DateTime end) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _orders.where((order) {
      return order.createdAt.isAfter(start.subtract(const Duration(days: 1))) &&
          order.createdAt.isBefore(end.add(const Duration(days: 1)));
    }).toList();
  }

  Future<List<Order>> getOrdersByCustomer(String customerId) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _orders.where((order) => order.customerId == customerId).toList();
  }
}
