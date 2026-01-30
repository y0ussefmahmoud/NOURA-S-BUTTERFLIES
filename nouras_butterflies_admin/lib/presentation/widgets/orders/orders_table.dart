import 'package:flutter/material.dart';
import '../../../data/models/order.dart';
import '../../../core/constants/app_colors.dart';
import '../admin/data_table_widget.dart';
import '../common/widget_types.dart';
import 'order_status_badge.dart';

class OrdersTable extends StatelessWidget {
  final List<Order> orders;
  final Function(Order) onOrderClick;
  final Function(String)? onSort;
  final String? sortColumn;
  final bool sortAscending;

  const OrdersTable({
    super.key,
    required this.orders,
    required this.onOrderClick,
    this.onSort,
    this.sortColumn,
    this.sortAscending = true,
  });

  @override
  Widget build(BuildContext context) {
    return DataTableWidget<Order>(
      columns: [
        DataTableColumn<Order>(
          label: 'Order #',
          key: 'id',
          sortable: true,
          render: (value, order) => _buildOrderNumber(order),
        ),
        DataTableColumn<Order>(
          label: 'Customer',
          key: 'customerName',
          sortable: true,
          render: (value, order) => _buildCustomerInfo(order),
        ),
        DataTableColumn<Order>(
          label: 'Total',
          key: 'total',
          sortable: true,
          render: (value, order) => _buildTotal(order),
        ),
        DataTableColumn<Order>(
          label: 'Status',
          key: 'status',
          sortable: true,
          render: (value, order) => OrderStatusBadge(status: order.status),
        ),
        DataTableColumn<Order>(
          label: 'Payment',
          key: 'paymentStatus',
          sortable: true,
          render: (value, order) => _buildPaymentStatus(order),
        ),
        DataTableColumn<Order>(
          label: 'Date',
          key: 'createdAt',
          sortable: true,
          render: (value, order) => _buildDate(order),
        ),
      ],
      data: orders,
      actions: [
        DataTableAction<Order>(
          icon: 'visibility',
          label: 'View Details',
          onTap: onOrderClick,
        ),
      ],
      emptyStateTitle: 'No orders found',
      emptyStateSubtitle: 'There are no orders matching your criteria',
      emptyStateIcon: 'shopping_bag',
      onSort: onSort,
      sortColumn: sortColumn,
      sortAscending: sortAscending,
    );
  }

  Widget _buildOrderNumber(Order order) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: BoxDecoration(
            color: AppColors.adminPrimary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.receipt_long,
            size: 16,
            color: AppColors.adminPrimary,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          order.id,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: AppColors.adminPrimary,
          ),
        ),
      ],
    );
  }

  Widget _buildCustomerInfo(Order order) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          order.customerName,
          style: const TextStyle(
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          order.customerEmail,
          style: TextStyle(
            fontSize: 12,
            color: AppColors.textSoft.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildTotal(Order order) {
    return Text(
      order.formattedTotal,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        color: AppColors.textDark,
      ),
    );
  }

  Widget _buildPaymentStatus(Order order) {
    Color backgroundColor;
    Color textColor;
    String text;

    switch (order.paymentStatus) {
      case PaymentStatus.completed:
        backgroundColor = AppColors.success.withOpacity(0.1);
        textColor = AppColors.success;
        text = 'Paid';
        break;
      case PaymentStatus.pending:
        backgroundColor = AppColors.warning.withOpacity(0.1);
        textColor = AppColors.warning;
        text = 'Pending';
        break;
      case PaymentStatus.failed:
        backgroundColor = AppColors.error.withOpacity(0.1);
        textColor = AppColors.error;
        text = 'Failed';
        break;
      case PaymentStatus.refunded:
        backgroundColor = AppColors.gray400.withOpacity(0.1);
        textColor = AppColors.gray600;
        text = 'Refunded';
        break;
      default:
        backgroundColor = AppColors.gray400.withOpacity(0.1);
        textColor = AppColors.gray600;
        text = 'Unknown';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: textColor,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  Widget _buildDate(Order order) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          order.formattedDate,
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          _getTimeAgo(order.createdAt),
          style: TextStyle(
            fontSize: 11,
            color: AppColors.textSoft.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  String _getTimeAgo(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays > 0) {
      return '${difference.inDays} day${difference.inDays == 1 ? '' : 's'} ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hour${difference.inHours == 1 ? '' : 's'} ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minute${difference.inMinutes == 1 ? '' : 's'} ago';
    } else {
      return 'Just now';
    }
  }
}
