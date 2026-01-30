import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/order.dart';
import '../../../data/repositories/order_repository.dart';
import '../../bloc/orders/orders_bloc.dart';
import '../../bloc/orders/orders_event.dart';
import '../../bloc/orders/orders_state.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/orders/order_timeline.dart';
import '../../widgets/common/button.dart';
import '../../../core/constants/app_colors.dart';

class OrderDetailsScreen extends StatefulWidget {
  final String orderId;

  const OrderDetailsScreen({
    super.key,
    required this.orderId,
  });

  @override
  State<OrderDetailsScreen> createState() => _OrderDetailsScreenState();
}

class _OrderDetailsScreenState extends State<OrderDetailsScreen> {
  Order? _order;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _loadOrder();
  }

  Future<void> _loadOrder() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final repository = context.read<OrderRepository>();
      final order = await repository.getOrderById(widget.orderId);
      
      if (mounted) {
        setState(() {
          _order = order;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error loading order: $e'),
            backgroundColor: AppColors.error,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      pageTitle: 'Order Details',
      breadcrumbs: [
        const BreadcrumbItem(label: 'Dashboard'),
        const BreadcrumbItem(label: 'Orders'),
        BreadcrumbItem(label: 'Order #${widget.orderId}'),
      ],
      child: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _order != null
              ? _buildOrderDetails()
              : Center(
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
                        'Order not found',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: AppColors.textDark,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Button(
                        text: 'Back to Orders',
                        onPressed: () => Navigator.of(context).pop(),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildOrderDetails() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Order Header
          _buildOrderHeader(),
          const SizedBox(height: 24),
          // Order Status and Timeline
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 2,
                child: _buildOrderStatusSection(),
              ),
              const SizedBox(width: 24),
              Expanded(
                flex: 3,
                child: _buildOrderTimeline(),
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Customer Information
          _buildCustomerInformation(),
          const SizedBox(height: 24),
          // Order Items
          _buildOrderItems(),
          const SizedBox(height: 24),
          // Order Summary
          _buildOrderSummary(),
          const SizedBox(height: 24),
          // Shipping Information
          _buildShippingInformation(),
          const SizedBox(height: 24),
          // Action Buttons
          _buildActionButtons(),
        ],
      ),
    );
  }

  Widget _buildOrderHeader() {
    return Container(
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
                  'Order #${_order!.id}',
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: AppColors.adminPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Placed on ${_formatDate(_order!.createdAt)}',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppColors.textSoft,
                  ),
                ),
              ],
            ),
          ),
          // Order Status Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: _getStatusColor(_order!.status).withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: _getStatusColor(_order!.status).withOpacity(0.3),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _getStatusIcon(_order!.status),
                  size: 16,
                  color: _getStatusColor(_order!.status),
                ),
                const SizedBox(width: 6),
                Text(
                  _getStatusText(_order!.status),
                  style: TextStyle(
                    color: _getStatusColor(_order!.status),
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOrderStatusSection() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Order Status',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          // Current Status
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _getStatusColor(_order!.status).withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: _getStatusColor(_order!.status).withOpacity(0.3),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  _getStatusIcon(_order!.status),
                  color: _getStatusColor(_order!.status),
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _getStatusText(_order!.status),
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                          color: _getStatusColor(_order!.status),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _getStatusDescription(_order!.status),
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSoft,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Status Update Button
          Button(
            text: 'Update Status',
            onPressed: _showStatusUpdateDialog,
            variant: ButtonVariant.outline,
          ),
        ],
      ),
    );
  }

  Widget _buildOrderTimeline() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Order Timeline',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          OrderTimeline(order: _order!),
        ],
      ),
    );
  }

  Widget _buildCustomerInformation() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Customer Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              // Customer Avatar
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: AppColors.adminGold.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(30),
                  border: Border.all(
                    color: AppColors.adminGold.withOpacity(0.3),
                  ),
                ),
                child: Icon(
                  Icons.person,
                  color: AppColors.adminGold,
                  size: 30,
                ),
              ),
              const SizedBox(width: 16),
              // Customer Details
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _order!.customerName,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _order!.customerEmail,
                      style: TextStyle(
                        color: AppColors.textSoft,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _order!.customerPhone,
                      style: TextStyle(
                        color: AppColors.textSoft,
                      ),
                    ),
                  ],
                ),
              ),
              // Contact Actions
              Column(
                children: [
                  IconButton(
                    onPressed: () {
                      // TODO: Implement email functionality
                    },
                    icon: Icon(
                      Icons.email,
                      color: AppColors.adminPrimary,
                    ),
                    tooltip: 'Send Email',
                  ),
                  IconButton(
                    onPressed: () {
                      // TODO: Implement phone functionality
                    },
                    icon: Icon(
                      Icons.phone,
                      color: AppColors.adminPrimary,
                    ),
                    tooltip: 'Call Customer',
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItems() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Order Items',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          // Items Table
          Table(
            border: TableBorder.all(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.borderDark
                  : AppColors.borderLight,
            ),
            columnWidths: const {
              0: FlexColumnWidth(1),
              1: FlexColumnWidth(3),
              2: FlexColumnWidth(1),
              3: FlexColumnWidth(1),
              4: FlexColumnWidth(1),
            },
            children: [
              // Header
              TableRow(
                decoration: BoxDecoration(
                  color: AppColors.adminPrimary.withOpacity(0.1),
                ),
                children: [
                  _buildTableCell('Image', isHeader: true),
                  _buildTableCell('Product', isHeader: true),
                  _buildTableCell('Quantity', isHeader: true),
                  _buildTableCell('Price', isHeader: true),
                  _buildTableCell('Total', isHeader: true),
                ],
              ),
              // Items
              ..._order!.items.map((item) => TableRow(
                children: [
                  _buildTableCell(
                    '',
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.gray100,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Icon(
                        Icons.image,
                        color: AppColors.gray400,
                      ),
                    ),
                  ),
                  _buildTableCell(item.name),
                  _buildTableCell('${item.quantity}'),
                  _buildTableCell('\$${item.price.toStringAsFixed(2)}'),
                  _buildTableCell('\$${(item.price * item.quantity).toStringAsFixed(2)}'),
                ],
              )),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderSummary() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Order Summary',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          _buildSummaryRow('Subtotal', '\$${_order!.subtotal.toStringAsFixed(2)}'),
          _buildSummaryRow('Shipping', '\$${_order!.shippingCost.toStringAsFixed(2)}'),
          _buildSummaryRow('Tax', '\$${_order!.tax.toStringAsFixed(2)}'),
          const Divider(),
          _buildSummaryRow(
            'Total',
            '\$${_order!.total.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildShippingInformation() {
    return Container(
      padding: const EdgeInsets.all(20),
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
          Text(
            'Shipping Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.adminPrimary,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Icon(
                Icons.location_on,
                color: AppColors.adminPrimary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  '${_order!.shippingAddress.street}, ${_order!.shippingAddress.city}, ${_order!.shippingAddress.state} ${_order!.shippingAddress.zipCode}',
                  style: TextStyle(
                    color: AppColors.textDark,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          if (_order!.trackingNumber != null) ...[
            Row(
              children: [
                Icon(
                  Icons.local_shipping,
                  color: AppColors.adminPrimary,
                  size: 20,
                ),
                const SizedBox(width: 8),
                Text(
                  'Tracking: ${_order!.trackingNumber}',
                  style: TextStyle(
                    color: AppColors.textDark,
                  ),
                ),
                const SizedBox(width: 8),
                Button(
                  text: 'Track',
                  onPressed: () {
                    // TODO: Implement tracking functionality
                  },
                  variant: ButtonVariant.outline,
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Row(
      children: [
        Button(
          text: 'Print Order',
          onPressed: () {
            // TODO: Implement print functionality
          },
          variant: ButtonVariant.outline,
        ),
        const SizedBox(width: 12),
        Button(
          text: 'Send Invoice',
          onPressed: () {
            // TODO: Implement invoice functionality
          },
          variant: ButtonVariant.outline,
        ),
        const SizedBox(width: 12),
        Button(
          text: 'Refund Order',
          onPressed: () {
            // TODO: Implement refund functionality
          },
          variant: ButtonVariant.outline,
        ),
        const SizedBox(width: 12),
        Button(
          text: 'Back to Orders',
          onPressed: () => Navigator.of(context).pop(),
        ),
      ],
    );
  }

  Widget _buildTableCell(String text, {bool isHeader = false, Widget? child}) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: child ??
          Text(
            text,
            style: TextStyle(
              fontWeight: isHeader ? FontWeight.w600 : FontWeight.normal,
              color: isHeader ? AppColors.adminPrimary : AppColors.textDark,
            ),
          ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isTotal ? FontWeight.w600 : FontWeight.normal,
              fontSize: isTotal ? 16 : 14,
              color: AppColors.textDark,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              fontSize: isTotal ? 18 : 14,
              color: isTotal ? AppColors.adminPrimary : AppColors.textDark,
            ),
          ),
        ],
      ),
    );
  }

  void _showStatusUpdateDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Update Order Status'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: OrderStatus.values.map((status) {
            return RadioListTile<OrderStatus>(
              title: Text(_getStatusText(status)),
              subtitle: Text(_getStatusDescription(status)),
              value: status,
              groupValue: _order!.status,
              onChanged: (value) {
                if (value != null) {
                  Navigator.of(context).pop();
                  _updateOrderStatus(value);
                }
              },
            );
          }).toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
        ],
      ),
    );
  }

  void _updateOrderStatus(OrderStatus newStatus) {
    context.read<OrdersBloc>().add(UpdateOrderStatus(_order!.id, newStatus));
    setState(() {
      _order = _order!.copyWith(status: newStatus);
    });
  }

  Color _getStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return AppColors.warning;
      case OrderStatus.confirmed:
        return AppColors.info;
      case OrderStatus.processing:
        return AppColors.adminPrimary;
      case OrderStatus.shipped:
        return AppColors.adminSage;
      case OrderStatus.delivered:
        return AppColors.success;
      case OrderStatus.cancelled:
        return AppColors.error;
      case OrderStatus.refunded:
        return AppColors.adminCoral;
    }
  }

  IconData _getStatusIcon(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return Icons.pending;
      case OrderStatus.confirmed:
        return Icons.check_circle_outline;
      case OrderStatus.processing:
        return Icons.autorenew;
      case OrderStatus.shipped:
        return Icons.local_shipping;
      case OrderStatus.delivered:
        return Icons.done_all;
      case OrderStatus.cancelled:
        return Icons.cancel;
      case OrderStatus.refunded:
        return Icons.replay;
    }
  }

  String _getStatusText(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.confirmed:
        return 'Confirmed';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
      case OrderStatus.refunded:
        return 'Refunded';
    }
  }

  String _getStatusDescription(OrderStatus status) {
    switch (status) {
      case OrderStatus.pending:
        return 'Order is waiting for confirmation';
      case OrderStatus.confirmed:
        return 'Order has been confirmed and is being prepared';
      case OrderStatus.processing:
        return 'Order is currently being processed';
      case OrderStatus.shipped:
        return 'Order has been shipped and is on its way';
      case OrderStatus.delivered:
        return 'Order has been successfully delivered';
      case OrderStatus.cancelled:
        return 'Order has been cancelled';
      case OrderStatus.refunded:
        return 'Order has been refunded';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year} at ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}
