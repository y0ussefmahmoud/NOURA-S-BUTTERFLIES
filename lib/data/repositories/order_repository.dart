import '../models/order.dart';
import '../mock/mock_orders.dart';

abstract class OrderRepository {
  Future<List<Order>> getOrders();
  Future<Order?> getOrderById(String id);
  Future<List<Order>> getOrdersByStatus(OrderStatus status);
  Future<List<Order>> getRecentOrders({int limit = 5});
  Future<List<Order>> getOrdersByCustomer(String customerId);
  Future<Order> createOrder(Order order);
  Future<Order> updateOrderStatus(String orderId, OrderStatus newStatus);
  Future<double> getTotalRevenue();
  Future<int> getTotalOrdersCount();
  Future<Map<OrderStatus, int>> getOrderStatusCounts();
}

class OrderRepositoryImpl implements OrderRepository {
  final bool useMockData;

  OrderRepositoryImpl({this.useMockData = true});

  @override
  Future<List<Order>> getOrders() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (useMockData) {
      return MockOrders.orders;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Order?> getOrderById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockOrders.getOrderById(id);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Order>> getOrdersByStatus(OrderStatus status) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockOrders.getOrdersByStatus(status);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Order>> getRecentOrders({int limit = 5}) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockOrders.getRecentOrders(limit: limit);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Order>> getOrdersByCustomer(String customerId) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockOrders.getOrdersByCustomer(customerId);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Order> createOrder(Order order) async {
    await Future.delayed(const Duration(milliseconds: 800));
    
    if (useMockData) {
      // In Mock Data we add the order to the list
      MockOrders.orders.add(order);
      return order;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Order> updateOrderStatus(String orderId, OrderStatus newStatus) async {
    await Future.delayed(const Duration(milliseconds: 600));
    
    if (useMockData) {
      final orderIndex = MockOrders.orders.indexWhere((o) => o.id == orderId);
      if (orderIndex == -1) {
        throw Exception('Order not found');
      }
      
      final order = MockOrders.orders[orderIndex];
      final updatedOrder = order.copyWith(
        status: newStatus,
        updatedAt: DateTime.now(),
        
        // Update timestamps based on status
        shippedAt: newStatus == OrderStatus.shipped ? DateTime.now() : order.shippedAt,
        deliveredAt: newStatus == OrderStatus.delivered ? DateTime.now() : order.deliveredAt,
      );
      
      MockOrders.orders[orderIndex] = updatedOrder;
      return updatedOrder;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<double> getTotalRevenue() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockOrders.getTotalRevenue();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<int> getTotalOrdersCount() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockOrders.getTotalOrdersCount();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Map<OrderStatus, int>> getOrderStatusCounts() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockOrders.getOrderStatusCounts();
    }
    
    throw UnimplementedError('API not implemented yet');
  }
}
