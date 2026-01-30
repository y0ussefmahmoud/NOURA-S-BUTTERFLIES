import 'package:flutter/material.dart';
import '../../../data/models/order.dart';
import '../../../core/constants/app_colors.dart';
import '../common/button.dart';

class OrdersFilterBar extends StatefulWidget {
  final Function(OrderStatus?) onStatusFilter;
  final Function(String) onSearch;
  final Function(DateTime?, DateTime?) onDateRange;

  const OrdersFilterBar({
    super.key,
    required this.onStatusFilter,
    required this.onSearch,
    required this.onDateRange,
  });

  @override
  State<OrdersFilterBar> createState() => _OrdersFilterBarState();
}

class _OrdersFilterBarState extends State<OrdersFilterBar> {
  final TextEditingController _searchController = TextEditingController();
  OrderStatus? _selectedStatus;
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search and Filters Row
          Row(
            children: [
              // Search Bar
              Expanded(
                flex: 2,
                child: TextField(
                  controller: _searchController,
                  decoration: InputDecoration(
                    hintText: 'Search by order number or customer...',
                    prefixIcon: Icon(
                      Icons.search,
                      color: AppColors.textSoft,
                    ),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Theme.of(context).brightness == Brightness.dark
                            ? AppColors.borderDark
                            : AppColors.borderLight,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.adminPrimary),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 12,
                    ),
                  ),
                  onChanged: (value) {
                    widget.onSearch(value);
                  },
                ),
              ),
              const SizedBox(width: 16),
              // Status Filter
              SizedBox(
                width: 200,
                child: DropdownButtonFormField<OrderStatus>(
                  value: _selectedStatus,
                  decoration: InputDecoration(
                    labelText: 'Status',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Theme.of(context).brightness == Brightness.dark
                            ? AppColors.borderDark
                            : AppColors.borderLight,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: AppColors.adminPrimary),
                    ),
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                  ),
                  items: [
                    const DropdownMenuItem(
                      value: null,
                      child: Text('All Status'),
                    ),
                    ...OrderStatus.values.map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Row(
                          children: [
                            _buildStatusIcon(status),
                            const SizedBox(width: 8),
                            Text(_getStatusText(status)),
                          ],
                        ),
                      );
                    }),
                  ],
                  onChanged: (status) {
                    setState(() {
                      _selectedStatus = status;
                    });
                    widget.onStatusFilter(status);
                  },
                ),
              ),
              const SizedBox(width: 16),
              // Date Range Button
              Button(
                text: _getDateRangeText(),
                variant: ButtonVariant.outline,
                onPressed: _showDateRangePicker,
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Active Filters Row
          Row(
            children: [
              Text(
                'Active Filters:',
                style: TextStyle(
                  color: AppColors.textSoft,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(width: 12),
              if (_selectedStatus != null) ...[
                _buildFilterChip(
                  'Status: ${_getStatusText(_selectedStatus!)}',
                  () {
                    setState(() {
                      _selectedStatus = null;
                    });
                    widget.onStatusFilter(null);
                  },
                ),
                const SizedBox(width: 8),
              ],
              if (_startDate != null && _endDate != null) ...[
                _buildFilterChip(
                  'Date: ${_formatDate(_startDate!)} - ${_formatDate(_endDate!)}',
                  () {
                    setState(() {
                      _startDate = null;
                      _endDate = null;
                    });
                    widget.onDateRange(null, null);
                  },
                ),
                const SizedBox(width: 8),
              ],
              if (_searchController.text.isNotEmpty) ...[
                _buildFilterChip(
                  'Search: ${_searchController.text}',
                  () {
                    _searchController.clear();
                    widget.onSearch('');
                  },
                ),
              ],
              const Spacer(),
              // Clear All Filters
              if (_hasActiveFilters())
                TextButton(
                  onPressed: _clearAllFilters,
                  child: Text(
                    'Clear All',
                    style: TextStyle(
                      color: AppColors.adminCoral,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusIcon(OrderStatus status) {
    IconData icon;
    Color color;

    switch (status) {
      case OrderStatus.pending:
        icon = Icons.pending;
        color = AppColors.warning;
        break;
      case OrderStatus.processing:
        icon = Icons.autorenew;
        color = AppColors.info;
        break;
      case OrderStatus.shipped:
        icon = Icons.local_shipping;
        color = AppColors.success;
        break;
      case OrderStatus.delivered:
        icon = Icons.check_circle;
        color = AppColors.success;
        break;
      case OrderStatus.cancelled:
        icon = Icons.cancel;
        color = AppColors.error;
        break;
    }

    return Icon(icon, size: 16, color: color);
  }

  String _getStatusText(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  String _getDateRangeText() {
    if (_startDate == null || _endDate == null) {
      return 'Date Range';
    }
    return '${_formatDate(_startDate!)} - ${_formatDate(_endDate!)}';
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  Widget _buildFilterChip(String label, VoidCallback onRemove) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: AppColors.adminPrimary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppColors.adminPrimary.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: TextStyle(
              color: AppColors.adminPrimary,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 6),
          InkWell(
            onTap: onRemove,
            child: Icon(
              Icons.close,
              size: 14,
              color: AppColors.adminPrimary,
            ),
          ),
        ],
      ),
    );
  }

  bool _hasActiveFilters() {
    return _selectedStatus != null ||
        (_startDate != null && _endDate != null) ||
        _searchController.text.isNotEmpty;
  }

  void _clearAllFilters() {
    setState(() {
      _searchController.clear();
      _selectedStatus = null;
      _startDate = null;
      _endDate = null;
    });
    widget.onSearch('');
    widget.onStatusFilter(null);
    widget.onDateRange(null, null);
  }

  Future<void> _showDateRangePicker() async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: DateTime(2020),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      initialDateRange: _startDate != null && _endDate != null
          ? DateTimeRange(start: _startDate!, end: _endDate!)
          : null,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: AppColors.adminPrimary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        _startDate = picked.start;
        _endDate = picked.end;
      });
      widget.onDateRange(_startDate, _endDate);
    }
  }
}
