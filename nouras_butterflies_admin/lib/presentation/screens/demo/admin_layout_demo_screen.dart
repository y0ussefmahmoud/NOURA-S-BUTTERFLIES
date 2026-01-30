import 'package:flutter/material.dart';
import '../../../widgets/admin/admin_layout.dart';
import '../../../widgets/admin/stats_card.dart';
import '../../../widgets/admin/data_table_widget.dart';
import '../../../../core/constants/app_colors.dart';

class AdminLayoutDemoScreen extends StatelessWidget {
  const AdminLayoutDemoScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      pageTitle: 'Dashboard',
      breadcrumbs: [
        BreadcrumbItem(label: 'Admin'),
        BreadcrumbItem(label: 'Dashboard'),
      ],
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Stats Cards Row
          Row(
            children: [
              Expanded(
                child: StatsCard(
                  title: 'Total Orders',
                  value: '1,234',
                  icon: Icons.shopping_bag,
                  color: AppColors.adminPrimary,
                  change: '+12%',
                  changeType: 'increase',
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: StatsCard(
                  title: 'Total Revenue',
                  value: '\$45,678',
                  icon: Icons.attach_money,
                  color: AppColors.adminGold,
                  change: '+8%',
                  changeType: 'increase',
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: StatsCard(
                  title: 'Total Customers',
                  value: '892',
                  icon: Icons.people,
                  color: AppColors.adminSage,
                  change: '+5%',
                  changeType: 'increase',
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: StatsCard(
                  title: 'Products',
                  value: '156',
                  icon: Icons.inventory_2,
                  color: AppColors.adminCoral,
                  change: '+2%',
                  changeType: 'increase',
                ),
              ),
            ],
          ),
          
          const SizedBox(height: 32),
          
          // Recent Orders Table
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recent Orders',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.adminPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 300,
                    child: DataTableWidget(
                      columns: const [
                        DataColumn(
                          label: Text('Order ID'),
                        ),
                        DataColumn(
                          label: Text('Customer'),
                        ),
                        DataColumn(
                          label: Text('Amount'),
                        ),
                        DataColumn(
                          label: Text('Status'),
                        ),
                        DataColumn(
                          label: Text('Date'),
                        ),
                      ],
                      rows: [
                        DataRow(
                          cells: [
                            const DataCell(Text('#12345')),
                            const DataCell(Text('Sarah Johnson')),
                            const DataCell(Text('\$125.00')),
                            DataCell(
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.success.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Completed',
                                  style: TextStyle(
                                    color: AppColors.success,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                            const DataCell(Text('2024-01-20')),
                          ],
                        ),
                        DataRow(
                          cells: [
                            const DataCell(Text('#12346')),
                            const DataCell(Text('Michael Brown')),
                            const DataCell(Text('\$89.50')),
                            DataCell(
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.warning.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Processing',
                                  style: TextStyle(
                                    color: AppColors.warning,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                            const DataCell(Text('2024-01-20')),
                          ],
                        ),
                        DataRow(
                          cells: [
                            const DataCell(Text('#12347')),
                            const DataCell(Text('Emily Davis')),
                            const DataCell(Text('\$210.00')),
                            DataCell(
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.info.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Pending',
                                  style: TextStyle(
                                    color: AppColors.info,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ),
                            const DataCell(Text('2024-01-19')),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 32),
          
          // Welcome Message
          Card(
            elevation: 2,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Welcome to Admin Layout Demo! 🦋',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: AppColors.adminPrimary,
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'This is a demonstration of the admin layout system with:',
                    style: TextStyle(fontSize: 14),
                  ),
                  const SizedBox(height: 8),
                  ...[
                    '✅ Responsive sidebar that converts to drawer on mobile',
                    '✅ App bar with search, notifications, and profile',
                    '✅ Breadcrumb navigation',
                    '✅ Page titles and proper spacing',
                    '✅ Admin-specific color scheme',
                    '✅ Interactive components with proper routing',
                  ].map((item) => Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Text(
                      item,
                      style: const TextStyle(fontSize: 14),
                    ),
                  )),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
