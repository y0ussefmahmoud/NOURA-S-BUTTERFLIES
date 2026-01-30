import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/order.dart';
import '../../../data/repositories/order_repository.dart';
import '../../bloc/orders/orders_bloc.dart';
import '../../bloc/orders/orders_event.dart';
import '../../bloc/orders/orders_state.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/orders/order_status_badge.dart';
import '../../widgets/orders/orders_table.dart';
import '../../widgets/orders/order_timeline.dart';
import '../../widgets/orders/order_details_modal.dart';
import '../../widgets/orders/orders_filter_bar.dart';
import '../../widgets/common/button.dart';
import '../../widgets/common/pagination_widget.dart';
import 'order_details_screen.dart';
import '../../../core/constants/app_colors.dart';

class OrdersScreen extends StatelessWidget {
  const OrdersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => OrdersBloc(
        orderRepository: context.read<OrderRepository>(),
      )..add(LoadOrders()),
      child: const OrdersView(),
    );
  }
}

class OrdersView extends StatefulWidget {
  const OrdersView({super.key});

  @override
  State<OrdersView> createState() => _OrdersViewState();
}

class _OrdersViewState extends State<OrdersView> {
  String? _sortColumn;
  bool _sortAscending = true;

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      pageTitle: 'Order Management',
      breadcrumbs: const [
        BreadcrumbItem(label: 'Dashboard'),
        BreadcrumbItem(label: 'Orders'),
      ],
      child: BlocBuilder<OrdersBloc, OrdersState>(
        builder: (context, state) {
          if (state is OrdersLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state is OrdersError) {
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
                    'Error loading orders',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    state.message,
                    style: TextStyle(
                      color: AppColors.textSoft,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      context.read<OrdersBloc>().add(LoadOrders());
                    },
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            );
          }

          if (state is OrdersLoaded) {
            return Column(
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
                              'Order Management',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: AppColors.adminPrimary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Manage and track customer orders',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.textSoft,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Stats Summary
                      Row(
                        children: [
                          _buildStatCard(
                            'Total Orders',
                            '${state.orders.length}',
                            Icons.receipt_long,
                            AppColors.adminPrimary,
                          ),
                          const SizedBox(width: 16),
                          _buildStatCard(
                            'Pending',
                            '${state.orders.where((o) => o.status == OrderStatus.pending).length}',
                            Icons.pending,
                            AppColors.warning,
                          ),
                          const SizedBox(width: 16),
                          _buildStatCard(
                            'Processing',
                            '${state.orders.where((o) => o.status == OrderStatus.processing).length}',
                            Icons.autorenew,
                            AppColors.info,
                          ),
                          const SizedBox(width: 16),
                          _buildStatCard(
                            'Completed',
                            '${state.orders.where((o) => o.status == OrderStatus.delivered).length}',
                            Icons.check_circle,
                            AppColors.success,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Filters Bar
                OrdersFilterBar(
                  onStatusFilter: (status) {
                    context.read<OrdersBloc>().add(FilterOrdersByStatus(status));
                  },
                  onSearch: (query) {
                    context.read<OrdersBloc>().add(SearchOrders(query));
                  },
                  onDateRange: (start, end) {
                    context.read<OrdersBloc>().add(FilterOrdersByDateRange(start, end));
                  },
                ),
                const SizedBox(height: 24),
                // Orders Table
                Expanded(
                  child: OrdersTable(
                    orders: _getPaginatedOrders(state.filteredOrders, state.currentPage, state.pageSize),
                    onOrderClick: (order) {
                      _showOrderDetails(context, order);
                    },
                    onSort: (column) {
                      setState(() {
                        if (_sortColumn == column) {
                          _sortAscending = !_sortAscending;
                        } else {
                          _sortColumn = column;
                          _sortAscending = true;
                        }
                        // Apply sorting to the filtered orders
                        context.read<OrdersBloc>().add(SortOrders(column, _sortAscending));
                      });
                    },
                    sortColumn: _sortColumn,
                    sortAscending: _sortAscending,
                  ),
                ),
                const SizedBox(height: 16),
                // Pagination
                PaginationWidget(
                  currentPage: state.currentPage,
                  totalPages: (state.filteredOrders.length / state.pageSize).ceil(),
                  pageSize: state.pageSize,
                  totalItems: state.filteredOrders.length,
                  onPageChanged: (page) {
                    context.read<OrdersBloc>().add(ChangeOrdersPage(page, state.pageSize));
                  },
                  onPageSizeChanged: (pageSize) {
                    context.read<OrdersBloc>().add(ChangeOrdersPage(1, pageSize));
                  },
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSoft,
            ),
          ),
        ],
      ),
    );
  }

  void _showOrderDetails(BuildContext context, Order order) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => OrderDetailsScreen(orderId: order.id),
      ),
    );
  }

  List<Order> _getPaginatedOrders(List<Order> orders, int currentPage, int pageSize) {
    final startIndex = (currentPage - 1) * pageSize;
    final endIndex = startIndex + pageSize;
    
    if (startIndex >= orders.length) {
      return [];
    }
    
    return orders.sublist(startIndex, endIndex.clamp(0, orders.length));
  }
}
