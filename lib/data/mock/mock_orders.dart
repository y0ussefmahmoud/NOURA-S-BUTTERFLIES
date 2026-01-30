import '../models/order.dart';
import '../models/product.dart';
import 'mock_products.dart';

class MockOrders {
  static final List<Order> orders = [
    Order(
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: OrderCustomer(
        id: 'c1',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-0123',
      ),
      items: [
        OrderItem(
          productId: '1',
          product: MockProducts.products[0],
          quantity: 2,
          price: 24.99,
        ),
      ],
      subtotal: 49.98,
      tax: 4.00,
      shipping: 5.99,
      total: 58.97,
      status: OrderStatus.delivered,
      paymentMethod: 'Credit Card',
      paymentStatus: PaymentStatus.paid,
      shippingAddress: ShippingAddress(
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      ),
      createdAt: DateTime(2024, 1, 15),
      updatedAt: DateTime(2024, 1, 17),
      shippedAt: DateTime(2024, 1, 16),
      deliveredAt: DateTime(2024, 1, 17),
      trackingNumber: 'TRK123456789',
    ),
    Order(
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: OrderCustomer(
        id: 'c2',
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        phone: '+1-555-0124',
      ),
      items: [
        OrderItem(
          productId: '2',
          product: MockProducts.products[1],
          quantity: 1,
          price: 18.00,
        ),
        OrderItem(
          productId: '3',
          product: MockProducts.products[2],
          quantity: 1,
          price: 32.00,
        ),
      ],
      subtotal: 50.00,
      tax: 4.00,
      shipping: 5.99,
      total: 59.99,
      status: OrderStatus.shipped,
      paymentMethod: 'PayPal',
      paymentStatus: PaymentStatus.paid,
      shippingAddress: ShippingAddress(
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
      ),
      createdAt: DateTime(2024, 1, 18),
      updatedAt: DateTime(2024, 1, 20),
      shippedAt: DateTime(2024, 1, 20),
      trackingNumber: 'TRK987654321',
    ),
    Order(
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: OrderCustomer(
        id: 'c3',
        name: 'Jessica Chen',
        email: 'jessica.c@email.com',
        phone: '+1-555-0125',
      ),
      items: [
        OrderItem(
          productId: '4',
          product: MockProducts.products[3],
          quantity: 1,
          price: 45.00,
        ),
      ],
      subtotal: 45.00,
      tax: 3.60,
      shipping: 5.99,
      total: 54.59,
      status: OrderStatus.processing,
      paymentMethod: 'Credit Card',
      paymentStatus: PaymentStatus.paid,
      shippingAddress: ShippingAddress(
        street: '789 Pine St',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60007',
        country: 'USA',
      ),
      createdAt: DateTime(2024, 1, 21),
      updatedAt: DateTime(2024, 1, 21),
    ),
    Order(
      id: '4',
      orderNumber: 'ORD-2024-004',
      customer: OrderCustomer(
        id: 'c4',
        name: 'Maria Garcia',
        email: 'maria.g@email.com',
        phone: '+1-555-0126',
      ),
      items: [
        OrderItem(
          productId: '1',
          product: MockProducts.products[0],
          quantity: 3,
          price: 24.00,
          variant: OrderItemVariant(
            name: 'Rose Nude',
            value: '#E8B4B8',
          ),
        ),
        OrderItem(
          productId: '2',
          product: MockProducts.products[1],
          quantity: 2,
          price: 18.00,
          variant: OrderItemVariant(
            name: 'Peach Glow',
            value: '#FFDAB9',
          ),
        ),
      ],
      subtotal: 108.00,
      tax: 8.64,
      shipping: 0.00, // Free shipping for orders over $100
      total: 116.64,
      status: OrderStatus.pending,
      paymentMethod: 'Apple Pay',
      paymentStatus: PaymentStatus.pending,
      shippingAddress: ShippingAddress(
        street: '321 Elm St',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001',
        country: 'USA',
      ),
      createdAt: DateTime(2024, 1, 22),
      updatedAt: DateTime(2024, 1, 22),
    ),
    Order(
      id: '5',
      orderNumber: 'ORD-2024-005',
      customer: OrderCustomer(
        id: 'c5',
        name: 'Amanda White',
        email: 'amanda.w@email.com',
        phone: '+1-555-0127',
      ),
      items: [
        OrderItem(
          productId: '6',
          product: MockProducts.products[5],
          quantity: 1,
          price: 28.00,
        ),
      ],
      subtotal: 28.00,
      tax: 2.24,
      shipping: 5.99,
      total: 36.23,
      status: OrderStatus.cancelled,
      paymentMethod: 'Credit Card',
      paymentStatus: PaymentStatus.refunded,
      shippingAddress: ShippingAddress(
        street: '654 Maple Dr',
        city: 'Phoenix',
        state: 'AZ',
        zipCode: '85001',
        country: 'USA',
      ),
      createdAt: DateTime(2024, 1, 10),
      updatedAt: DateTime(2024, 1, 12),
      notes: 'Customer requested cancellation due to shipping delay',
    ),
  ];

  static Order? getOrderById(String id) {
    try {
      return orders.firstWhere((order) => order.id == id);
    } catch (e) {
      return null;
    }
  }

  static List<Order> getOrdersByStatus(OrderStatus status) {
    return orders.where((order) => order.status == status).toList();
  }

  static List<Order> getRecentOrders({int limit = 5}) {
    final sortedOrders = List<Order>.from(orders)
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
    return sortedOrders.take(limit).toList();
  }

  static List<Order> getOrdersByCustomer(String customerId) {
    return orders.where((order) => order.customer.id == customerId).toList();
  }

  static double getTotalRevenue() {
    return orders
        .where((order) => order.paymentStatus == PaymentStatus.paid)
        .fold(0.0, (sum, order) => sum + order.total);
  }

  static int getTotalOrdersCount() {
    return orders.length;
  }

  static Map<OrderStatus, int> getOrderStatusCounts() {
    final Map<OrderStatus, int> counts = {};
    for (final order in orders) {
      counts[order.status] = (counts[order.status] ?? 0) + 1;
    }
    return counts;
  }
}
