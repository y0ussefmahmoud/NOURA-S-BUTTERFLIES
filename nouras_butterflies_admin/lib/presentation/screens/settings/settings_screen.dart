import 'package:flutter/material.dart';
import '../widgets/admin/admin_layout.dart';
import '../widgets/settings/tabs/store_settings_tab.dart';
import '../widgets/settings/tabs/payment_settings_tab.dart';
import '../widgets/settings/tabs/shipping_settings_tab.dart';
import '../widgets/settings/tabs/email_templates_tab.dart';
import '../widgets/settings/tabs/tax_settings_tab.dart';
import '../widgets/settings/tabs/user_management_tab.dart';
import '../../core/constants/app_colors.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen>
    with TickerProviderStateMixin {
  late TabController _tabController;
  final List<String> _tabs = [
    'Store',
    'Payment',
    'Shipping',
    'Email',
    'Tax',
    'Users',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      pageTitle: 'Settings',
      breadcrumbs: const [
        BreadcrumbItem(label: 'Dashboard'),
        BreadcrumbItem(label: 'Settings'),
      ],
      child: Column(
        children: [
          // Page Header
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.surfaceDark
                  : AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.borderDark
                    : AppColors.borderLight,
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Settings',
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: AppColors.adminPrimary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Configure your store settings and preferences',
                        style: TextStyle(
                          fontSize: 16,
                          color: AppColors.textSoft,
                        ),
                      ),
                    ],
                  ),
                ),
                // Quick Actions
                Row(
                  children: [
                    ElevatedButton.icon(
                      onPressed: _exportSettings,
                      icon: const Icon(Icons.download, size: 16),
                      label: const Text('Export'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.adminPrimary.withOpacity(0.1),
                        foregroundColor: AppColors.adminPrimary,
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      onPressed: _importSettings,
                      icon: const Icon(Icons.upload, size: 16),
                      label: const Text('Import'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.adminPrimary.withOpacity(0.1),
                        foregroundColor: AppColors.adminPrimary,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          // Tab Navigation
          Container(
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.surfaceDark
                  : AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.borderDark
                    : AppColors.borderLight,
              ),
            ),
            child: TabBar(
              controller: _tabController,
              isScrollable: true,
              labelColor: AppColors.adminPrimary,
              unselectedLabelColor: AppColors.textSoft,
              indicatorColor: AppColors.adminPrimary,
              indicatorWeight: 3,
              indicatorSize: TabBarIndicatorSize.tab,
              labelStyle: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
              unselectedLabelStyle: const TextStyle(
                fontWeight: FontWeight.normal,
                fontSize: 14,
              ),
              tabs: _tabs.map((tab) {
                return Tab(
                  text: tab,
                  icon: _getTabIcon(tab),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 24),
          // Tab Content
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                const StoreSettingsTab(),
                const PaymentSettingsTab(),
                const ShippingSettingsTab(),
                const EmailTemplatesTab(),
                const TaxSettingsTab(),
                const UserManagementTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _getTabIcon(String tab) {
    switch (tab) {
      case 'Store':
        return const Icon(Icons.store, size: 20);
      case 'Payment':
        return const Icon(Icons.payment, size: 20);
      case 'Shipping':
        return const Icon(Icons.local_shipping, size: 20);
      case 'Email':
        return const Icon(Icons.email, size: 20);
      case 'Tax':
        return const Icon(Icons.receipt_long, size: 20);
      case 'Users':
        return const Icon(Icons.people, size: 20);
      default:
        return const Icon(Icons.settings, size: 20);
    }
  }

  void _exportSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Export settings functionality coming soon!'),
      ),
    );
  }

  void _importSettings() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Import settings functionality coming soon!'),
      ),
    );
  }
}
