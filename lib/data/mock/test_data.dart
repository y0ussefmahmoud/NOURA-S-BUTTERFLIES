import '../models/models.dart';
import 'mock_products.dart';
import 'mock_orders.dart';
import 'mock_customers.dart';
import 'mock_admin_stats.dart';

class TestData {
  static void printAllData() {
    print('=== Products ===');
    print('Total: ${MockProducts.products.length}');
    print('First product: ${MockProducts.products.first.name}');
    
    print('\n=== Orders ===');
    print('Total: ${MockOrders.orders.length}');
    print('First order: ${MockOrders.orders.first.orderNumber}');
    
    print('\n=== Customers ===');
    print('Total: ${MockCustomers.customers.length}');
    print('First customer: ${MockCustomers.customers.first.name}');
    
    print('\n=== Sales Metrics ===');
    print('Revenue: \$${MockAdminStats.salesMetrics.revenue.current}');
    print('Orders: ${MockAdminStats.salesMetrics.orders.current}');
  }

  static void testSerialization() {
    // Test Product serialization
    final product = MockProducts.products.first;
    final productJson = product.toJson();
    final productFromJson = Product.fromJson(productJson);
    print('Product serialization: ${product.name == productFromJson.name ? "✓" : "✗"}');
    
    // Test Order serialization
    final order = MockOrders.orders.first;
    final orderJson = order.toJson();
    final orderFromJson = Order.fromJson(orderJson);
    print('Order serialization: ${order.orderNumber == orderFromJson.orderNumber ? "✓" : "✗"}');
    
    // Test Customer serialization
    final customer = MockCustomers.customers.first;
    final customerJson = customer.toJson();
    final customerFromJson = Customer.fromJson(customerJson);
    print('Customer serialization: ${customer.name == customerFromJson.name ? "✓" : "✗"}');
    
    // Test AdminStats serialization
    final salesMetrics = MockAdminStats.salesMetrics;
    final salesMetricsJson = salesMetrics.toJson();
    final salesMetricsFromJson = SalesMetrics.fromJson(salesMetricsJson);
    print('SalesMetrics serialization: ${salesMetrics.revenue.current == salesMetricsFromJson.revenue.current ? "✓" : "✗"}');
  }

  static void testRepositoryMethods() {
    print('\n=== Testing Repository Methods ===');
    
    // Test Product methods
    final bestsellers = MockProducts.getBestsellers();
    print('Bestsellers count: ${bestsellers.length}');
    
    final lipProducts = MockProducts.getProductsByCategory('lip-gloss');
    print('Lip gloss products: ${lipProducts.length}');
    
    final searchResults = MockProducts.searchProducts('lip');
    print('Search results for "lip": ${searchResults.length}');
    
    // Test Order methods
    final pendingOrders = MockOrders.getOrdersByStatus(OrderStatus.pending);
    print('Pending orders: ${pendingOrders.length}');
    
    final recentOrders = MockOrders.getRecentOrders(limit: 3);
    print('Recent orders (3): ${recentOrders.length}');
    
    // Test Customer methods
    final goldCustomers = MockCustomers.getCustomersByTier(MembershipTier.gold);
    print('Gold tier customers: ${goldCustomers.length}');
    
    final vipCustomers = MockCustomers.getVipCustomers();
    print('VIP customers: ${vipCustomers.length}');
  }

  static void testModelHelpers() {
    print('\n=== Testing Model Helper Methods ===');
    
    // Test Product helpers
    final product = MockProducts.products.first;
    print('Product has discount: ${product.hasDiscount}');
    print('Product discount percentage: ${product.discountPercentage.toStringAsFixed(1)}%');
    print('Product main image URL: ${product.mainImageUrl.isNotEmpty ? "✓" : "✗"}');
    
    // Test MetricValue helpers
    final revenue = MockAdminStats.salesMetrics.revenue;
    print('Revenue growth is positive: ${revenue.isPositiveGrowth}');
    print('Revenue growth percentage: ${revenue.growthPercentage.toStringAsFixed(1)}%');
    
    // Test TopProduct helpers
    final topProduct = MockAdminStats.topProducts.first;
    print('Top product growth is positive: ${topProduct.isPositiveGrowth}');
    print('Top product growth percentage: ${topProduct.growthPercentage.toStringAsFixed(1)}%');
  }

  static void runAllTests() {
    print('🧪 Running Data Layer Tests\n');
    
    printAllData();
    testSerialization();
    testRepositoryMethods();
    testModelHelpers();
    
    print('\n✅ All tests completed!');
  }

  // Quick validation method
  static bool validateDataIntegrity() {
    try {
      // Check if all products have valid data
      for (final product in MockProducts.products) {
        if (product.id.isEmpty || product.name.isEmpty || product.price <= 0) {
          print('Invalid product data: ${product.name}');
          return false;
        }
      }
      
      // Check if all orders have valid data
      for (final order in MockOrders.orders) {
        if (order.id.isEmpty || order.orderNumber.isEmpty || order.total <= 0) {
          print('Invalid order data: ${order.orderNumber}');
          return false;
        }
      }
      
      // Check if all customers have valid data
      for (final customer in MockCustomers.customers) {
        if (customer.id.isEmpty || customer.name.isEmpty || customer.email.isEmpty) {
          print('Invalid customer data: ${customer.name}');
          return false;
        }
      }
      
      print('✅ Data integrity validation passed');
      return true;
    } catch (e) {
      print('❌ Data integrity validation failed: $e');
      return false;
    }
  }
}
