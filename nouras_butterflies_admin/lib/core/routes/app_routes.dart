import 'package:flutter/material.dart';
import '../../presentation/screens/demo/admin_layout_demo_screen.dart';
import '../../presentation/screens/auth/login_screen.dart';
import '../../presentation/screens/dashboard/dashboard_screen.dart';
import '../../presentation/screens/products/products_screen.dart';
import '../../presentation/screens/products/product_form_screen.dart';
import '../../presentation/layout/admin_layout.dart';

/// أسماء المسارات
class AppRoutes {
  AppRoutes._();

  // ========== Auth Routes ==========
  static const String login = '/login';
  static const String splash = '/';

  // ========== Admin Routes ==========
  static const String adminDashboard = '/admin/dashboard';
  static const String adminOrders = '/admin/orders';
  static const String adminOrderDetails = '/admin/orders/details';
  static const String adminProducts = '/admin/products';
  static const String adminCustomers = '/admin/customers';
  static const String adminMarketing = '/admin/marketing';
  static const String adminSettings = '/admin/settings';

  // ========== Main Routes ==========
  static const String dashboard = '/dashboard';
  
  // ========== Product Routes ==========
  static const String products = '/products';
  static const String productAdd = '/products/add';
  static const String productEdit = '/products/edit';
  
  // ========== Order Routes ==========
  static const String orders = '/orders';
  static const String orderDetails = '/orders/details';
  
  // ========== Customer Routes ==========
  static const String customers = '/customers';
  static const String customerDetails = '/customers/details';
  
  // ========== Settings Routes ==========
  static const String settings = '/settings';

  // ========== Helper Methods ==========
  
  /// Helper method للتنقل
  static void navigateTo(BuildContext context, String route) {
    Navigator.pushNamed(context, route);
  }
  
  /// Helper method للتحقق من active route
  static bool isActive(BuildContext context, String route) {
    return ModalRoute.of(context)?.settings.name == route;
  }
}

/// Route Generator
class RouteGenerator {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    // سيتم تنفيذ هذا في المراحل القادمة
    // حالياً نرجع صفحة placeholder
    
    switch (settings.name) {
      case AppRoutes.splash:
        return MaterialPageRoute(
          builder: (_) => const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          ),
        );
      
      case AppRoutes.login:
        return MaterialPageRoute(
          builder: (_) => const LoginScreen(),
        );
      
      case AppRoutes.adminDashboard:
        return MaterialPageRoute(
          builder: (_) => const DashboardScreen(),
        );
      
      case AppRoutes.adminOrders:
        return MaterialPageRoute(
          builder: (_) => const AdminLayoutDemoScreen(),
        );
      
      case AppRoutes.adminOrderDetails:
        return MaterialPageRoute(
          builder: (_) => const AdminLayoutDemoScreen(),
        );
      
      case AppRoutes.adminProducts:
        return MaterialPageRoute(
          builder: (_) => const ProductsScreen(),
        );
      
      case AppRoutes.adminCustomers:
        return MaterialPageRoute(
          builder: (_) => const AdminLayoutDemoScreen(),
        );
      
      case AppRoutes.adminMarketing:
        return MaterialPageRoute(
          builder: (_) => const AdminLayoutDemoScreen(),
        );
      
      case AppRoutes.adminSettings:
        return MaterialPageRoute(
          builder: (_) => const AdminLayoutDemoScreen(),
        );
      
      case AppRoutes.products:
        return MaterialPageRoute(
          builder: (_) => const ProductsScreen(),
        );
      
      case AppRoutes.productAdd:
        return MaterialPageRoute(
          builder: (_) => const ProductFormScreen(),
        );
      
      case AppRoutes.productEdit:
        final productId = settings.arguments as String?;
        return MaterialPageRoute(
          builder: (_) => ProductFormScreen(productId: productId),
        );
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}
