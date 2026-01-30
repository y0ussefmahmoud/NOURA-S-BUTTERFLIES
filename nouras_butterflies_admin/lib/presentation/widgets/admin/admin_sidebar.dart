import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../../../core/routes/app_routes.dart';

class AdminSidebar extends StatefulWidget {
  final String currentRoute;
  final VoidCallback? onClose;

  const AdminSidebar({
    Key? key,
    required this.currentRoute,
    this.onClose,
  }) : super(key: key);

  @override
  State<AdminSidebar> createState() => _AdminSidebarState();
}

class _AdminSidebarState extends State<AdminSidebar> {
  final List<Map<String, String>> menuItems = [
    {'name': 'Dashboard', 'route': '/admin/dashboard', 'icon': 'dashboard'},
    {'name': 'Products', 'route': '/admin/products', 'icon': 'inventory_2'},
    {'name': 'Orders', 'route': '/admin/orders', 'icon': 'shopping_bag'},
    {'name': 'Customers', 'route': '/admin/customers', 'icon': 'people'},
    {'name': 'Settings', 'route': '/admin/settings', 'icon': 'settings'},
  ];

  @override
  Widget build(BuildContext context) {
    final isMobile = MediaQuery.of(context).size.width < 1024;

    if (isMobile) {
      return Drawer(
        backgroundColor: AppColors.adminSidebar,
        child: _buildSidebarContent(),
      );
    }

    return Container(
      width: 256,
      color: AppColors.adminSidebar,
      child: _buildSidebarContent(),
    );
  }

  Widget _buildSidebarContent() {
    return Column(
      children: [
        _buildBrandHeader(),
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: menuItems.map((item) => _buildMenuItem(item)).toList(),
          ),
        ),
        _buildHelpCenter(),
      ],
    );
  }

  Widget _buildBrandHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: AppColors.adminPrimary.withOpacity(0.2),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.adminPrimary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(
              Icons.flutter_dash,
              color: Colors.white,
              size: 24,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Noura's Butterflies",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Text(
                  'Admin Panel',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuItem(Map<String, String> item) {
    final isActive = widget.currentRoute == item['route'];
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: InkWell(
        onTap: () {
          if (widget.onClose != null) {
            widget.onClose!();
          }
          Navigator.pushReplacementNamed(context, item['route']!);
        },
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: isActive ? AppColors.adminPrimary : Colors.transparent,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            children: [
              Icon(
                _getIconData(item['icon']!),
                color: Colors.white,
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  item['name']!,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHelpCenter() {
    return Container(
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: AppColors.adminPrimary.withOpacity(0.2),
            width: 1,
          ),
        ),
      ),
      child: InkWell(
        onTap: () {
          // Navigate to help center
        },
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              const Icon(
                Icons.help_outline,
                color: Colors.white,
                size: 20,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Help Center',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  IconData _getIconData(String iconName) {
    switch (iconName) {
      case 'dashboard':
        return Icons.dashboard;
      case 'shopping_bag':
        return Icons.shopping_bag;
      case 'inventory_2':
        return Icons.inventory_2;
      case 'people':
        return Icons.people;
      case 'campaign':
        return Icons.campaign;
      case 'settings':
        return Icons.settings;
      default:
        return Icons.circle;
    }
  }
}
