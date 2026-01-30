import 'package:flutter/material.dart';
import '../../../data/models/order.dart';
import '../../../core/constants/app_colors.dart';

class OrderStatusBadge extends StatelessWidget {
  final OrderStatus status;

  const OrderStatusBadge({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _getBackgroundColor(),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: _getBorderColor(),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getIcon(),
            size: 14,
            color: _getTextColor(),
          ),
          const SizedBox(width: 6),
          Text(
            _getText(),
            style: TextStyle(
              color: _getTextColor(),
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Color _getBackgroundColor() {
    switch (status) {
      case OrderStatus.pending:
        return AppColors.warning.withOpacity(0.1);
      case OrderStatus.processing:
        return AppColors.info.withOpacity(0.1);
      case OrderStatus.shipped:
        return AppColors.success.withOpacity(0.1);
      case OrderStatus.delivered:
        return AppColors.success.withOpacity(0.15);
      case OrderStatus.cancelled:
        return AppColors.error.withOpacity(0.1);
    }
  }

  Color _getBorderColor() {
    switch (status) {
      case OrderStatus.pending:
        return AppColors.warning.withOpacity(0.3);
      case OrderStatus.processing:
        return AppColors.info.withOpacity(0.3);
      case OrderStatus.shipped:
        return AppColors.success.withOpacity(0.3);
      case OrderStatus.delivered:
        return AppColors.success.withOpacity(0.4);
      case OrderStatus.cancelled:
        return AppColors.error.withOpacity(0.3);
    }
  }

  Color _getTextColor() {
    switch (status) {
      case OrderStatus.pending:
        return AppColors.warning;
      case OrderStatus.processing:
        return AppColors.info;
      case OrderStatus.shipped:
        return AppColors.success;
      case OrderStatus.delivered:
        return AppColors.success;
      case OrderStatus.cancelled:
        return AppColors.error;
    }
  }

  IconData _getIcon() {
    switch (status) {
      case OrderStatus.pending:
        return Icons.pending;
      case OrderStatus.processing:
        return Icons.autorenew;
      case OrderStatus.shipped:
        return Icons.local_shipping;
      case OrderStatus.delivered:
        return Icons.check_circle;
      case OrderStatus.cancelled:
        return Icons.cancel;
    }
  }

  String _getText() {
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
}
