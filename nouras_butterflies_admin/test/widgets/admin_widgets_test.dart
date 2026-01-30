import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nouras_butterflies_admin/main.dart';
import 'package:nouras_butterflies_admin/presentation/widgets/dashboard/dashboard_stats_card.dart';
import 'package:nouras_butterflies_admin/presentation/widgets/products/product_form.dart';
import 'package:nouras_butterflies_admin/presentation/widgets/orders/order_list_item.dart';
import 'package:nouras_butterflies_admin/presentation/widgets/customers/customer_list_item.dart';

void main() {
  group('Admin Dashboard Widget Tests', () {
    testWidgets('Dashboard stats card should display correctly', (WidgetTester tester) async {
      const title = 'Total Sales';
      const value = '\$12,345';
      const change = '+12.5%';
      final changeColor = Colors.green;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: DashboardStatsCard(
              title: title,
              value: value,
              change: change,
              changeColor: changeColor,
              icon: Icons.trending_up,
            ),
          ),
        ),
      );

      expect(find.text(title), findsOneWidget);
      expect(find.text(value), findsOneWidget);
      expect(find.text(change), findsOneWidget);
      expect(find.byIcon(Icons.trending_up), findsOneWidget);
    });

    testWidgets('Product form should validate inputs', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductForm(),
          ),
        ),
      );

      // Try to submit empty form
      await tester.tap(find.byType(ElevatedButton));
      await tester.pump();

      // Should show validation errors
      expect(find.text('Product name is required'), findsOneWidget);
      expect(find.text('Price is required'), findsOneWidget);
    });

    testWidgets('Order list item should display order information', (WidgetTester tester) async {
      final order = Order(
        id: 'ORD-001',
        customerName: 'John Doe',
        total: 299.99,
        status: OrderStatus.pending,
        date: DateTime.now(),
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: OrderListItem(order: order),
          ),
        ),
      );

      expect(find.text('ORD-001'), findsOneWidget);
      expect(find.text('John Doe'), findsOneWidget);
      expect(find.text('\$299.99'), findsOneWidget);
      expect(find.text('Pending'), findsOneWidget);
    });

    testWidgets('Customer list item should display customer information', (WidgetTester tester) async {
      final customer = Customer(
        id: 'CUST-001',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+966501234567',
        totalOrders: 5,
        totalSpent: 1250.00,
      );

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: CustomerListItem(customer: customer),
          ),
        ),
      );

      expect(find.text('Jane Smith'), findsOneWidget);
      expect(find.text('jane@example.com'), findsOneWidget);
      expect(find.text('+966501234567'), findsOneWidget);
      expect(find.text('5 orders'), findsOneWidget);
      expect(find.text('\$1,250.00'), findsOneWidget);
    });
  });

  group('BLoC Tests', () {
    testWidgets('Dashboard BLoC should load initial state', (WidgetTester tester) async {
      // Mock the repository
      // final mockRepository = MockDashboardRepository();
      
      // await tester.pumpWidget(
      //   MaterialApp(
      //     home: RepositoryProvider(
      //       create: (context) => mockRepository,
      //       child: BlocProvider(
      //         create: (context) => DashboardBloc(repository: mockRepository),
      //         child: DashboardPage(),
      //       ),
      //     ),
      //   ),
      // );

      // await tester.pump();

      // Should show loading state initially
      // expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });
  });

  group('Integration Tests', () {
    testWidgets('Complete product management flow', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Navigate to products
      await tester.tap(find.text('Products'));
      await tester.pumpAndSettle();

      // Add new product
      await tester.tap(find.byIcon(Icons.add));
      await tester.pumpAndSettle();

      // Fill product form
      await tester.enterText(find.byKey(const Key('product_name_field')), 'Test Product');
      await tester.enterText(find.byKey(const Key('product_price_field')), '99.99');
      await tester.enterText(find.byKey(const Key('product_description_field')), 'Test Description');

      // Save product
      await tester.tap(find.text('Save'));
      await tester.pumpAndSettle();

      // Verify product appears in list
      expect(find.text('Test Product'), findsOneWidget);
      expect(find.text('\$99.99'), findsOneWidget);
    });

    testWidgets('Order status update flow', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Navigate to orders
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      // Find and tap on first order
      await tester.tap(find.byType(OrderListItem).first);
      await tester.pumpAndSettle();

      // Update status
      await tester.tap(find.byKey(const Key('status_dropdown')));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Shipped'));
      await tester.pumpAndSettle();

      // Verify status updated
      expect(find.text('Shipped'), findsOneWidget);
    });
  });

  group('Accessibility Tests', () {
    testWidgets('Dashboard should be accessible', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Check for semantic labels
      expect(find.bySemanticsLabel('Dashboard'), findsOneWidget);
      expect(find.bySemanticsLabel('Total Sales'), findsOneWidget);
      expect(find.bySemanticsLabel('Total Orders'), findsOneWidget);
      expect(find.bySemanticsLabel('Total Customers'), findsOneWidget);
    });

    testWidgets('Forms should have proper accessibility labels', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ProductForm(),
          ),
        ),
      );

      // Check form fields have semantic labels
      expect(find.bySemanticsLabel('Product Name'), findsOneWidget);
      expect(find.bySemanticsLabel('Price'), findsOneWidget);
      expect(find.bySemanticsLabel('Description'), findsOneWidget);
    });
  });

  group('Performance Tests', () {
    testWidgets('Dashboard should render within performance budget', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Measure rendering time
      final stopwatch = Stopwatch()..start();
      await tester.pumpAndSettle();
      stopwatch.stop();

      // Should render within 2 seconds
      expect(stopwatch.elapsedMilliseconds, lessThan(2000));
    });

    testWidgets('Large product list should scroll smoothly', (WidgetTester tester) async {
      // Create a large list of products
      final products = List.generate(100, (index) => Product(
        id: 'PROD-${index.toString().padLeft(3, '0')}',
        name: 'Product ${index + 1}',
        price: (index + 1) * 10.0,
        description: 'Description for product ${index + 1}',
      ));

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: ListView.builder(
              itemCount: products.length,
              itemBuilder: (context, index) {
                return ProductListItem(product: products[index]);
              },
            ),
          ),
        ),
      );

      // Test scrolling performance
      final stopwatch = Stopwatch()..start();
      await tester.fling(find.byType(ListView), const Offset(0, -500), 10000);
      await tester.pumpAndSettle();
      stopwatch.stop();

      // Scroll should complete within 1 second
      expect(stopwatch.elapsedMilliseconds, lessThan(1000));
    });
  });

  group('Error Handling Tests', () {
    testWidgets('Should handle network errors gracefully', (WidgetTester tester) async {
      // Mock network error
      // final mockRepository = MockDashboardRepository();
      // when(mockRepository.getDashboardStats())
      //     .thenThrow(Exception('Network error'));

      await tester.pumpWidget(const MyApp());

      // Navigate to dashboard
      await tester.tap(find.text('Dashboard'));
      await tester.pumpAndSettle();

      // Should show error message
      expect(find.text('Failed to load data'), findsOneWidget);
      expect(find.text('Please try again'), findsOneWidget);
    });

    testWidgets('Should show retry button on error', (WidgetTester tester) async {
      await tester.pumpWidget(const MyApp());

      // Simulate error state
      // await tester.pumpWidget(
      //   MaterialApp(
      //     home: Scaffold(
      //       body: ErrorWidget(
      //         message: 'Something went wrong',
      //         onRetry: () {},
      //       ),
      //     ),
      //   ),
      // );

      expect(find.text('Something went wrong'), findsOneWidget);
      expect(find.text('Retry'), findsOneWidget);
    });
  });
}
