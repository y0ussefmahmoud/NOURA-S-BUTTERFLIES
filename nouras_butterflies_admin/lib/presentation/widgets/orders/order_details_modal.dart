import 'package:flutter/material.dart';
import '../../../data/models/order.dart';
import '../../../core/constants/app_colors.dart';
import '../common/button.dart';
import 'order_status_badge.dart';
import 'order_timeline.dart';

class OrderDetailsModal extends StatefulWidget {
  final Order order;
  final Function(OrderStatus) onStatusUpdate;

  const OrderDetailsModal({
    super.key,
    required this.order,
    required this.onStatusUpdate,
  });

  @override
  State<OrderDetailsModal> createState() => _OrderDetailsModalState();
}

class _OrderDetailsModalState extends State<OrderDetailsModal>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  OrderStatus? _selectedStatus;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _scaleAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    _animationController.forward();
    _selectedStatus = widget.order.status;
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          width: MediaQuery.of(context).size.width * 0.9,
          height: MediaQuery.of(context).size.height * 0.85,
          decoration: BoxDecoration(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.surfaceDark
                : AppColors.surfaceLight,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.borderDark
                  : AppColors.borderLight,
            ),
          ),
          child: Column(
            children: [
              // Header
              _buildHeader(),
              // Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Customer Info
                      _buildCustomerInfo(),
                      const SizedBox(height: 24),
                      // Order Items
                      _buildOrderItems(),
                      const SizedBox(height: 24),
                      // Order Summary
                      _buildOrderSummary(),
                      const SizedBox(height: 24),
                      // Shipping Address
                      _buildShippingAddress(),
                      const SizedBox(height: 24),
                      // Timeline
                      OrderTimeline(order: widget.order),
                      const SizedBox(height: 24),
                      // Status Update
                      _buildStatusUpdate(),
                    ],
                  ),
                ),
              ),
              // Footer Actions
              _buildFooterActions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: AppColors.adminPrimary.withOpacity(0.05),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
        border: Border(
          bottom: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.borderDark
                : AppColors.borderLight,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Order ${widget.order.id}',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: AppColors.adminPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    OrderStatusBadge(status: widget.order.status),
                    const SizedBox(width: 12),
                    Text(
                      'Created on ${widget.order.formattedDate}',
                      style: TextStyle(
                        color: AppColors.textSoft,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => Navigator.of(context).pop(),
            icon: Icon(
              Icons.close,
              color: AppColors.textSoft,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.gray800.withOpacity(0.3)
            : AppColors.gray50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Customer Information',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                Icons.person,
                color: AppColors.adminPrimary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                widget.order.customerName,
                style: const TextStyle(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                Icons.email,
                color: AppColors.adminPrimary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                widget.order.customerEmail,
                style: const TextStyle(
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Icon(
                Icons.phone,
                color: AppColors.adminPrimary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                widget.order.customerPhone,
                style: const TextStyle(
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderItems() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Order Items',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            border: Border.all(
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.borderDark
                  : AppColors.borderLight,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Column(
            children: widget.order.items.asMap().entries.map((entry) {
              final index = entry.key;
              final item = entry.value;
              final isLast = index == widget.order.items.length - 1;

              return Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  border: isLast
                      ? null
                      : Border(
                          bottom: BorderSide(
                            color: Theme.of(context).brightness == Brightness.dark
                                ? AppColors.borderDark
                                : AppColors.borderLight,
                          ),
                        ),
                ),
                child: Row(
                  children: [
                    // Product Image
                    Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: AppColors.gray200,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        Icons.image,
                        color: AppColors.gray400,
                      ),
                    ),
                    const SizedBox(width: 12),
                    // Product Details
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            item.productName,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              color: AppColors.textDark,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Qty: ${item.quantity} × \$${item.unitPrice.toStringAsFixed(2)}',
                            style: const TextStyle(
                              color: AppColors.textSoft,
                            ),
                          ),
                        ],
                      ),
                    ),
                    // Total Price
                    Text(
                      '\$${item.totalPrice.toStringAsFixed(2)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: AppColors.textDark,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildOrderSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.adminPrimary.withOpacity(0.1)
            : AppColors.adminPrimary.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Order Summary',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          _buildSummaryRow('Subtotal', '\$${widget.order.subtotal.toStringAsFixed(2)}'),
          const SizedBox(height: 8),
          _buildSummaryRow('Tax', '\$${widget.order.tax.toStringAsFixed(2)}'),
          const SizedBox(height: 8),
          _buildSummaryRow('Shipping', '\$${widget.order.shipping.toStringAsFixed(2)}'),
          const SizedBox(height: 12),
          Container(
            height: 1,
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.borderDark
                : AppColors.borderLight,
          ),
          const SizedBox(height: 12),
          _buildSummaryRow(
            'Total',
            '\$${widget.order.total.toStringAsFixed(2)}',
            isTotal: true,
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryRow(String label, String value, {bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.w600 : FontWeight.normal,
            fontSize: isTotal ? 16 : 14,
            color: isTotal ? AppColors.textDark : AppColors.textSoft,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontWeight: isTotal ? FontWeight.bold : FontWeight.w600,
            fontSize: isTotal ? 18 : 14,
            color: isTotal ? AppColors.adminPrimary : AppColors.textDark,
          ),
        ),
      ],
    );
  }

  Widget _buildShippingAddress() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.gray800.withOpacity(0.3)
            : AppColors.gray50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Shipping Address',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
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
                  widget.order.shippingAddress.fullAddress,
                  style: const TextStyle(
                    color: AppColors.textSoft,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatusUpdate() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.adminGold.withOpacity(0.1)
            : AppColors.adminGold.withOpacity(0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Update Order Status',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 12),
          DropdownButtonFormField<OrderStatus>(
            value: _selectedStatus,
            decoration: InputDecoration(
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
                borderSide: const BorderSide(color: AppColors.adminGold),
              ),
            ),
            items: OrderStatus.values.map((status) {
              return DropdownMenuItem(
                value: status,
                child: Row(
                  children: [
                    OrderStatusBadge(status: status),
                    const SizedBox(width: 8),
                  ],
                ),
              );
            }).toList(),
            onChanged: (status) {
              setState(() {
                _selectedStatus = status;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFooterActions() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.gray800.withOpacity(0.3)
            : AppColors.gray50,
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        border: Border(
          top: BorderSide(
            color: Theme.of(context).brightness == Brightness.dark
                ? AppColors.borderDark
                : AppColors.borderLight,
          ),
        ),
      ),
      child: Row(
        children: [
          Expanded(
            child: Button(
              text: 'Print Invoice',
              variant: ButtonVariant.outline,
              onPressed: () {
                // TODO: Implement print functionality
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Button(
              text: 'Send Email',
              variant: ButtonVariant.outline,
              onPressed: () {
                // TODO: Implement email functionality
              },
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Button(
              text: _selectedStatus != widget.order.status ? 'Update Status' : 'Close',
              variant: _selectedStatus != widget.order.status
                  ? ButtonVariant.primary
                  : ButtonVariant.outline,
              onPressed: () {
                if (_selectedStatus != widget.order.status) {
                  widget.onStatusUpdate(_selectedStatus!);
                }
                Navigator.of(context).pop();
              },
            ),
          ),
        ],
      ),
    );
  }
}
