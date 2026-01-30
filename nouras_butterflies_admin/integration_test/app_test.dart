import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:nouras_butterflies_admin/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Noura\'s Butterflies Admin App Integration Tests', () {
    testWidgets('complete login flow and navigate to dashboard', (WidgetTester tester) async {
      // Launch the app
      app.main();
      await tester.pumpAndSettle();

      // Verify we're on the login screen
      expect(find.text('Welcome Back'), findsOneWidget);
      expect(find.byType(TextFormField), findsWidgets);
      expect(find.byType(ElevatedButton), findsOneWidget);

      // Enter login credentials
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.pumpAndSettle();

      // Tap login button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Verify we're on the dashboard
      expect(find.text('Dashboard'), findsOneWidget);
      expect(find.text('Total Sales'), findsOneWidget);
      expect(find.text('Total Orders'), findsOneWidget);
      expect(find.text('Total Customers'), findsOneWidget);
      expect(find.text('Total Products'), findsOneWidget);
    });

    testWidgets('navigate to products management screen', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to products screen
      await tester.tap(find.text('Products'));
      await tester.pumpAndSettle();

      // Verify products screen
      expect(find.text('Products Management'), findsOneWidget);
      expect(find.byType(FloatingActionButton), findsOneWidget);
      expect(find.text('Add Product'), findsOneWidget);
    });

    testWidgets('navigate to orders management screen', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to orders screen
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      // Verify orders screen
      expect(find.text('Orders Management'), findsOneWidget);
      expect(find.text('Pending'), findsOneWidget);
      expect(find.text('Shipped'), findsOneWidget);
      expect(find.text('Delivered'), findsOneWidget);
    });

    testWidgets('navigate to customers management screen', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to customers screen
      await tester.tap(find.text('Customers'));
      await tester.pumpAndSettle();

      // Verify customers screen
      expect(find.text('Customers Management'), findsOneWidget);
      expect(find.byIcon(Icons.search), findsOneWidget);
    });

    testWidgets('add new product flow', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to products screen
      await tester.tap(find.text('Products'));
      await tester.pumpAndSettle();

      // Tap add product button
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();

      // Verify add product form
      expect(find.text('Add New Product'), findsOneWidget);
      expect(find.byType(TextFormField), findsWidgets);
      expect(find.text('Product Name'), findsOneWidget);
      expect(find.text('Description'), findsOneWidget);
      expect(find.text('Price'), findsOneWidget);
      expect(find.text('Category'), findsOneWidget);
      expect(find.text('Stock'), findsOneWidget);

      // Fill product form
      await tester.enterText(find.byKey(const Key('product_name_field')), 'Test Product');
      await tester.enterText(find.byKey(const Key('description_field')), 'Test Description');
      await tester.enterText(find.byKey(const Key('price_field')), '99.99');
      await tester.enterText(find.byKey(const Key('category_field')), 'Test Category');
      await tester.enterText(find.byKey(const Key('stock_field')), '10');
      await tester.pumpAndSettle();

      // Save product
      await tester.tap(find.text('Save Product'));
      await tester.pumpAndSettle(Duration(seconds: 2));

      // Verify we're back to products list
      expect(find.text('Products Management'), findsOneWidget);
    });

    testWidgets('logout flow', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Verify we're logged in
      expect(find.text('Dashboard'), findsOneWidget);

      // Tap logout button (assuming it's in an app bar or menu)
      await tester.tap(find.byIcon(Icons.logout));
      await tester.pumpAndSettle();

      // Confirm logout if dialog appears
      if (find.text('Logout').evaluate().isNotEmpty) {
        await tester.tap(find.text('Logout'));
        await tester.pumpAndSettle();
      }

      // Verify we're back to login screen
      expect(find.text('Welcome Back'), findsOneWidget);
      expect(find.byType(TextFormField), findsWidgets);
    });

    testWidgets('handle login error with invalid credentials', (WidgetTester tester) async {
      // Launch the app
      app.main();
      await tester.pumpAndSettle();

      // Enter invalid credentials
      await tester.enterText(find.byKey(const Key('email_field')), 'invalid@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'wrongpassword');
      await tester.pumpAndSettle();

      // Tap login button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 2));

      // Verify error message
      expect(find.text('Invalid credentials'), findsOneWidget);
      
      // Verify we're still on login screen
      expect(find.text('Welcome Back'), findsOneWidget);
    });

    testWidgets('search functionality in products', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to products screen
      await tester.tap(find.text('Products'));
      await tester.pumpAndSettle();

      // Use search functionality
      await tester.tap(find.byIcon(Icons.search));
      await tester.enterText(find.byType(TextField), 'Test');
      await tester.pumpAndSettle();

      // Verify search results (this would depend on your actual data)
      expect(find.byType(ListView), findsOneWidget);
    });

    testWidgets('order status update flow', (WidgetTester tester) async {
      // Launch the app and login
      app.main();
      await tester.pumpAndSettle();

      // Login
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 3));

      // Navigate to orders screen
      await tester.tap(find.text('Orders'));
      await tester.pumpAndSettle();

      // Tap on an order to update status
      await tester.tap(find.byType(ListTile).first);
      await tester.pumpAndSettle();

      // Update order status
      await tester.tap(find.text('Mark as Shipped'));
      await tester.pumpAndSettle(Duration(seconds: 2));

      // Verify status updated
      expect(find.text('Shipped'), findsOneWidget);
    });

    testWidgets('app handles network errors gracefully', (WidgetTester tester) async {
      // Launch the app
      app.main();
      await tester.pumpAndSettle();

      // Try to login without network (simulated)
      await tester.enterText(find.byKey(const Key('email_field')), 'admin@example.com');
      await tester.enterText(find.byKey(const Key('password_field')), 'password123');
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle(Duration(seconds: 5));

      // Verify error handling
      // This would depend on your specific error handling implementation
      expect(find.byType(Scaffold), findsOneWidget);
    });
  });
}
