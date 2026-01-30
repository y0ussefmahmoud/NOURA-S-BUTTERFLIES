import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/dashboard/dashboard_bloc.dart';
import '../../bloc/dashboard/dashboard_event.dart';
import '../../bloc/dashboard/dashboard_state.dart';
import '../../widgets/admin/stats_card.dart';
import '../../widgets/admin/data_table_widget.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/charts/bar_chart_widget.dart';
import '../../widgets/charts/line_chart_widget.dart';
import '../../widgets/charts/top_products_bar_chart.dart';
import '../../widgets/common/app_card.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/routes/app_routes.dart';
import '../../../data/mock/mock_admin_stats.dart';
import '../../../data/mock/mock_orders.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});
  
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => DashboardBloc()..add(LoadDashboardData()),
      child: AdminLayout(
        currentRoute: AppRoutes.adminDashboard,
        child: BlocBuilder<DashboardBloc, DashboardState>(
          builder: (context, state) {
            if (state is DashboardLoading) {
              return const Center(child: CircularProgressIndicator());
            }
            
            if (state is DashboardError) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.error_outline,
                      size: 64,
                      color: AppColors.error,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Error loading dashboard',
                      style: AppTextStyles.h3,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      state.message,
                      style: AppTextStyles.body.copyWith(
                        color: AppColors.textSoft,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      onPressed: () {
                        context.read<DashboardBloc>().add(LoadDashboardData());
                      },
                      child: const Text('Try Again'),
                    ),
                  ],
                ),
              );
            }
            
            if (state is DashboardLoaded) {
              return _buildDashboardContent(context, state);
            }
            
            return const SizedBox();
          },
        ),
      ),
    );
  }
  
  Widget _buildDashboardContent(
    BuildContext context, 
    DashboardLoaded state,
  ) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          _buildHeader(),
          const SizedBox(height: 32),
          
          // Stats Grid
          _buildStatsGrid(state.data.salesMetrics),
          const SizedBox(height: 32),
          
          // Charts Section
          _buildChartsSection(state),
          const SizedBox(height: 32),
          
          // Recent Orders
          _buildRecentOrders(),
        ],
      ),
    );
  }
  
  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Welcome back, Admin! 👋',
          style: AppTextStyles.h1,
        ),
        const SizedBox(height: 8),
        Text(
          "Here's what's happening with your store today.",
          style: AppTextStyles.body.copyWith(
            color: AppColors.textSoft,
          ),
        ),
      ],
    );
  }
  
  Widget _buildStatsGrid(SalesMetrics metrics) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final crossAxisCount = constraints.maxWidth > 1200 ? 4 : 
                               constraints.maxWidth > 768 ? 2 : 1;
        
        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 16,
          crossAxisSpacing: 16,
          childAspectRatio: 1.5,
          children: [
            StatsCard(
              title: 'Total Sales',
              value: '\$${metrics.revenue.current.toStringAsFixed(2)}',
              change: metrics.revenue.growth,
              icon: Icons.trending_up,
              subtitle: 'Revenue this month',
            ),
            StatsCard(
              title: 'New Orders',
              value: metrics.orders.current.toInt().toString(),
              change: metrics.orders.growth,
              icon: Icons.shopping_bag,
              subtitle: 'Orders this month',
            ),
            StatsCard(
              title: 'Customers',
              value: metrics.customers.current.toInt().toString(),
              change: metrics.customers.growth,
              icon: Icons.people,
              subtitle: 'Active customers',
            ),
            StatsCard(
              title: 'Avg Order Value',
              value: '\$${metrics.averageOrderValue.current.toStringAsFixed(2)}',
              change: metrics.averageOrderValue.growth,
              icon: Icons.attach_money,
              subtitle: 'Per order',
            ),
          ],
        );
      },
    );
  }
  
  Widget _buildChartsSection(DashboardLoaded state) {
    return Column(
      children: [
        // Monthly Sales Line Chart
        AppCard(
          child: LineChartWidget(
            data: MockAdminStats.monthlySalesData,
            title: 'Monthly Sales Trend',
          ),
        ),
        const SizedBox(height: 24),
        
        // Revenue and Top Products Section
        LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth > 1024) {
              // Desktop: Side by side
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: _buildRevenueChart(state),
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    flex: 1,
                    child: _buildTopSellers(state.data.topProducts),
                  ),
                ],
              );
            } else {
              // Mobile: Stacked
              return Column(
                children: [
                  _buildRevenueChart(state),
                  const SizedBox(height: 24),
                  _buildTopSellers(state.data.topProducts),
                ],
              );
            }
          },
        ),
        const SizedBox(height: 24),
        
        // Top Products Bar Chart
        AppCard(
          child: TopProductsBarChart(
            products: state.data.topProducts,
            title: 'Top Selling Products (Units Sold)',
          ),
        ),
      ],
    );
  }
  
  Widget _buildRevenueChart(DashboardLoaded state) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Sales Revenue', style: AppTextStyles.h3),
              DropdownButton<String>(
                value: state.selectedPeriod,
                items: const [
                  DropdownMenuItem(value: '1month', child: Text('Last Month')),
                  DropdownMenuItem(value: '3months', child: Text('Last 3 Months')),
                  DropdownMenuItem(value: '6months', child: Text('Last 6 Months')),
                  DropdownMenuItem(value: '1year', child: Text('Last Year')),
                ],
                onChanged: (value) {
                  if (value != null) {
                    context.read<DashboardBloc>().add(ChangePeriod(value));
                  }
                },
              ),
            ],
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 250,
            child: BarChartWidget(
              data: state.data.revenueChartData,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTopSellers(List<TopProduct> products) {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Top Sellers', style: AppTextStyles.h3),
          const SizedBox(height: 24),
          ...products.map((product) => _buildTopSellerItem(product)),
        ],
      ),
    );
  }
  
  Widget _buildTopSellerItem(TopProduct product) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.inventory_2, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  style: AppTextStyles.body,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  '${product.unitsSold} units sold',
                  style: AppTextStyles.caption,
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '\$${product.revenue.toStringAsFixed(0)}',
                style: AppTextStyles.body.copyWith(fontWeight: FontWeight.bold),
              ),
              Text(
                '${product.growth > 0 ? '+' : ''}${product.growth.toStringAsFixed(1)}%',
                style: AppTextStyles.caption.copyWith(
                  color: product.growth > 0 ? Colors.green : Colors.red,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
  
  Widget _buildRecentOrders() {
    return AppCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Recent Orders', style: AppTextStyles.h3),
              TextButton(
                onPressed: () {
                  Navigator.pushNamed(context, AppRoutes.adminOrders);
                },
                child: const Text('View all orders'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          DataTableWidget(
            columns: _getOrderColumns(),
            data: MockOrders.orders.take(5).toList(),
            onRowTap: (order) {
              // Navigate to order details
              Navigator.pushNamed(
                context,
                AppRoutes.adminOrderDetails,
                arguments: order.id,
              );
            },
          ),
        ],
      ),
    );
  }
  
  List<DataColumn> _getOrderColumns() {
    return [
      const DataColumn(
        label: Text('Order ID'),
        tooltip: 'Order identification',
      ),
      const DataColumn(
        label: Text('Customer'),
        tooltip: 'Customer name',
      ),
      const DataColumn(
        label: Text('Date'),
        tooltip: 'Order date',
      ),
      const DataColumn(
        label: Text('Total'),
        tooltip: 'Order total amount',
      ),
      const DataColumn(
        label: Text('Status'),
        tooltip: 'Order status',
      ),
    ];
  }
}
