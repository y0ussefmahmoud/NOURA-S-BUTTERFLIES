import 'package:flutter/material.dart';
import '../../../data/models/order.dart';
import '../../../core/constants/app_colors.dart';

class OrderTimeline extends StatelessWidget {
  final Order order;

  const OrderTimeline({
    super.key,
    required this.order,
  });

  @override
  Widget build(BuildContext context) {
    final timelineSteps = _getTimelineSteps();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Order Timeline',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 16),
        ...timelineSteps.asMap().entries.map((entry) {
          final index = entry.key;
          final step = entry.value;
          final isLast = index == timelineSteps.length - 1;

          return _TimelineStep(
            step: step,
            isLast: isLast,
          );
        }).toList(),
      ],
    );
  }

  List<_TimelineStepData> _getTimelineSteps() {
    final steps = <_TimelineStepData>[];

    // Created step (always present)
    steps.add(_TimelineStepData(
      title: 'Order Created',
      description: 'Order was successfully placed',
      date: order.createdAt,
      status: _TimelineStepStatus.completed,
      icon: Icons.shopping_cart,
    ));

    // Processing step
    if (order.status == OrderStatus.processing ||
        order.status == OrderStatus.shipped ||
        order.status == OrderStatus.delivered) {
      steps.add(_TimelineStepData(
        title: 'Processing',
        description: 'Order is being prepared',
        date: order.createdAt.add(const Duration(hours: 2)),
        status: _TimelineStepStatus.completed,
        icon: Icons.autorenew,
      ));
    } else if (order.status == OrderStatus.pending) {
      steps.add(_TimelineStepData(
        title: 'Processing',
        description: 'Order will be processed soon',
        date: DateTime.now().add(const Duration(hours: 2)),
        status: _TimelineStepStatus.current,
        icon: Icons.autorenew,
      ));
    }

    // Shipped step
    if (order.status == OrderStatus.shipped || order.status == OrderStatus.delivered) {
      steps.add(_TimelineStepData(
        title: 'Shipped',
        description: order.trackingNumber != null
            ? 'Tracking: ${order.trackingNumber}'
            : 'Order has been shipped',
        date: order.shippedAt ?? DateTime.now(),
        status: _TimelineStepStatus.completed,
        icon: Icons.local_shipping,
      ));
    } else if (order.status == OrderStatus.processing) {
      steps.add(_TimelineStepData(
        title: 'Shipped',
        description: 'Order will be shipped soon',
        date: DateTime.now().add(const Duration(days: 1)),
        status: _TimelineStepStatus.upcoming,
        icon: Icons.local_shipping,
      ));
    }

    // Delivered step
    if (order.status == OrderStatus.delivered) {
      steps.add(_TimelineStepData(
        title: 'Delivered',
        description: 'Order has been delivered successfully',
        date: order.deliveredAt ?? DateTime.now(),
        status: _TimelineStepStatus.completed,
        icon: Icons.check_circle,
      ));
    } else if (order.status == OrderStatus.shipped) {
      steps.add(_TimelineStepData(
        title: 'Delivered',
        description: 'Order will be delivered soon',
        date: DateTime.now().add(const Duration(days: 3)),
        status: _TimelineStepStatus.current,
        icon: Icons.check_circle,
      ));
    } else {
      steps.add(_TimelineStepData(
        title: 'Delivered',
        description: 'Order will be delivered after shipping',
        date: DateTime.now().add(const Duration(days: 5)),
        status: _TimelineStepStatus.upcoming,
        icon: Icons.check_circle,
      ));
    }

    // Cancelled step (if applicable)
    if (order.status == OrderStatus.cancelled) {
      steps.add(_TimelineStepData(
        title: 'Cancelled',
        description: 'Order was cancelled',
        date: order.updatedAt ?? DateTime.now(),
        status: _TimelineStepStatus.cancelled,
        icon: Icons.cancel,
      ));
    }

    return steps;
  }
}

class _TimelineStep extends StatelessWidget {
  final _TimelineStepData step;
  final bool isLast;

  const _TimelineStep({
    required this.step,
    required this.isLast,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Column(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: _getBackgroundColor(),
                shape: BoxShape.circle,
                border: Border.all(
                  color: _getBorderColor(),
                  width: 2,
                ),
              ),
              child: Icon(
                step.icon,
                size: 20,
                color: _getIconColor(),
              ),
            ),
            if (!isLast)
              Container(
                width: 2,
                height: 60,
                color: _getLineColor(),
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  step.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: _getTextColor(),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  step.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: step.status == _TimelineStepStatus.upcoming
                        ? AppColors.textSoft.withOpacity(0.5)
                        : AppColors.textSoft,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  _formatDate(step.date),
                  style: TextStyle(
                    fontSize: 12,
                    color: step.status == _TimelineStepStatus.upcoming
                        ? AppColors.textSoft.withOpacity(0.4)
                        : AppColors.textSoft.withOpacity(0.7),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Color _getBackgroundColor() {
    switch (step.status) {
      case _TimelineStepStatus.completed:
        return AppColors.success.withOpacity(0.1);
      case _TimelineStepStatus.current:
        return AppColors.info.withOpacity(0.1);
      case _TimelineStepStatus.upcoming:
        return AppColors.gray100;
      case _TimelineStepStatus.cancelled:
        return AppColors.error.withOpacity(0.1);
    }
  }

  Color _getBorderColor() {
    switch (step.status) {
      case _TimelineStepStatus.completed:
        return AppColors.success;
      case _TimelineStepStatus.current:
        return AppColors.info;
      case _TimelineStepStatus.upcoming:
        return AppColors.gray300;
      case _TimelineStepStatus.cancelled:
        return AppColors.error;
    }
  }

  Color _getIconColor() {
    switch (step.status) {
      case _TimelineStepStatus.completed:
        return AppColors.success;
      case _TimelineStepStatus.current:
        return AppColors.info;
      case _TimelineStepStatus.upcoming:
        return AppColors.gray400;
      case _TimelineStepStatus.cancelled:
        return AppColors.error;
    }
  }

  Color _getTextColor() {
    switch (step.status) {
      case _TimelineStepStatus.completed:
        return AppColors.textDark;
      case _TimelineStepStatus.current:
        return AppColors.info;
      case _TimelineStepStatus.upcoming:
        return AppColors.textSoft.withOpacity(0.6);
      case _TimelineStepStatus.cancelled:
        return AppColors.error;
    }
  }

  Color _getLineColor() {
    switch (step.status) {
      case _TimelineStepStatus.completed:
        return AppColors.success;
      case _TimelineStepStatus.current:
      case _TimelineStepStatus.upcoming:
        return AppColors.gray300;
      case _TimelineStepStatus.cancelled:
        return AppColors.error;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final orderDate = DateTime(date.year, date.month, date.day);

    if (orderDate == today) {
      return 'Today at ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    } else if (orderDate == today.subtract(const Duration(days: 1))) {
      return 'Yesterday at ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    } else {
      return '${date.day}/${date.month}/${date.year} at ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
    }
  }
}

class _TimelineStepData {
  final String title;
  final String description;
  final DateTime date;
  final _TimelineStepStatus status;
  final IconData icon;

  _TimelineStepData({
    required this.title,
    required this.description,
    required this.date,
    required this.status,
    required this.icon,
  });
}

enum _TimelineStepStatus {
  completed,
  current,
  upcoming,
  cancelled,
}
