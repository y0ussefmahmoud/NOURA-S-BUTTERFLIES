import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/customer.dart';
import '../../../data/repositories/customer_repository.dart';
import '../../bloc/customers/customers_bloc.dart';
import '../../bloc/customers/customers_event.dart';
import '../../bloc/customers/customers_state.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/customers/customer_stats_cards.dart';
import '../../widgets/customers/customers_filter_bar.dart';
import '../../widgets/customers/customers_table.dart';
import '../../widgets/customers/customer_details_modal.dart';
import '../../../core/constants/app_colors.dart';

class CustomersScreen extends StatelessWidget {
  const CustomersScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => CustomersBloc(
        customerRepository: context.read<CustomerRepository>(),
      )..add(LoadCustomers()),
      child: const CustomersView(),
    );
  }
}

class CustomersView extends StatefulWidget {
  const CustomersView({super.key});

  @override
  State<CustomersView> createState() => _CustomersViewState();
}

class _CustomersViewState extends State<CustomersView> {
  String? _sortColumn;
  bool _sortAscending = true;

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      pageTitle: 'Customer Management',
      breadcrumbs: const [
        BreadcrumbItem(label: 'Dashboard'),
        BreadcrumbItem(label: 'Customers'),
      ],
      child: BlocBuilder<CustomersBloc, CustomersState>(
        builder: (context, state) {
          if (state is CustomersLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          if (state is CustomersError) {
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
                    'Error loading customers',
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
                      context.read<CustomersBloc>().add(LoadCustomers());
                    },
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            );
          }

          if (state is CustomersLoaded && state.stats != null) {
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
                              'Customer Management',
                              style: TextStyle(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: AppColors.adminPrimary,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Manage customer relationships and preferences',
                              style: TextStyle(
                                fontSize: 16,
                                color: AppColors.textSoft,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Add Customer Button
                      ElevatedButton.icon(
                        onPressed: () {
                          // TODO: Implement add customer functionality
                        },
                        icon: const Icon(Icons.add),
                        label: const Text('Add Customer'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.adminPrimary,
                          foregroundColor: AppColors.surfaceLight,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                // Stats Cards
                CustomerStatsCards(stats: state.stats!),
                const SizedBox(height: 24),
                // Filters Bar
                CustomersFilterBar(
                  onTierFilter: (tier) {
                    context.read<CustomersBloc>().add(FilterCustomersByTier(tier));
                  },
                  onSearch: (query) {
                    context.read<CustomersBloc>().add(SearchCustomers(query));
                  },
                ),
                const SizedBox(height: 24),
                // Customers Table
                Expanded(
                  child: CustomersTable(
                    customers: state.filteredCustomers,
                    onCustomerClick: (customer) {
                      _showCustomerDetails(context, customer);
                    },
                    onSort: (column) {
                      setState(() {
                        if (_sortColumn == column) {
                          _sortAscending = !_sortAscending;
                        } else {
                          _sortColumn = column;
                          _sortAscending = true;
                        }
                        // Apply sorting to the filtered customers
                        context.read<CustomersBloc>().add(SortCustomers(column, _sortAscending));
                      });
                    },
                    sortColumn: _sortColumn,
                    sortAscending: _sortAscending,
                  ),
                ),
              ],
            );
          }

          return const SizedBox.shrink();
        },
      ),
    );
  }

  void _showCustomerDetails(BuildContext context, Customer customer) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => CustomerDetailsModal(
        customer: customer,
        onNotesUpdate: (notes) {
          context.read<CustomersBloc>().add(UpdateCustomerNotes(customer.id, notes));
        },
      ),
    );
  }
}
