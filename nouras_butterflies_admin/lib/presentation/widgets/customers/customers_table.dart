import 'package:flutter/material.dart';
import '../../../data/models/customer.dart';
import '../../../core/constants/app_colors.dart';
import '../admin/data_table_widget.dart';
import '../common/widget_types.dart';

class CustomersTable extends StatelessWidget {
  final List<Customer> customers;
  final Function(Customer) onCustomerClick;
  final Function(String)? onSort;
  final String? sortColumn;
  final bool sortAscending;

  const CustomersTable({
    super.key,
    required this.customers,
    required this.onCustomerClick,
    this.onSort,
    this.sortColumn,
    this.sortAscending = true,
  });

  @override
  Widget build(BuildContext context) {
    return DataTableWidget<Customer>(
      columns: [
        DataTableColumn<Customer>(
          label: 'Customer',
          key: 'fullName',
          sortable: true,
          render: (value, customer) => _buildCustomerInfo(customer),
        ),
        DataTableColumn<Customer>(
          label: 'Membership',
          key: 'tier',
          sortable: true,
          render: (value, customer) => _buildMembershipTier(customer),
        ),
        DataTableColumn<Customer>(
          label: 'Total Orders',
          key: 'totalOrders',
          sortable: true,
          render: (value, customer) => _buildTotalOrders(customer),
        ),
        DataTableColumn<Customer>(
          label: 'Total Spent',
          key: 'totalSpent',
          sortable: true,
          render: (value, customer) => _buildTotalSpent(customer),
        ),
        DataTableColumn<Customer>(
          label: 'Last Order',
          key: 'lastOrderDate',
          sortable: true,
          render: (value, customer) => _buildLastOrderDate(customer),
        ),
        DataTableColumn<Customer>(
          label: 'Tags',
          key: 'tags',
          render: (value, customer) => _buildTags(customer),
        ),
      ],
      data: customers,
      actions: [
        DataTableAction<Customer>(
          icon: 'visibility',
          label: 'View Details',
          onTap: onCustomerClick,
        ),
        DataTableAction<Customer>(
          icon: 'edit',
          label: 'Edit Customer',
          onTap: (customer) {
            // TODO: Implement edit functionality
          },
        ),
        DataTableAction<Customer>(
          icon: 'message',
          label: 'Send Message',
          onTap: (customer) {
            // TODO: Implement message functionality
          },
        ),
      ],
      emptyStateTitle: 'No customers found',
      emptyStateSubtitle: 'There are no customers matching your criteria',
      emptyStateIcon: 'people',
      onSort: onSort,
      sortColumn: sortColumn,
      sortAscending: sortAscending,
    );
  }

  Widget _buildCustomerInfo(Customer customer) {
    return Row(
      children: [
        // Avatar
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: _getTierColor(customer.tier).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: _getTierColor(customer.tier).withOpacity(0.3),
            ),
          ),
          child: customer.avatar != null
              ? ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Image.network(
                    customer.avatar!,
                    width: 40,
                    height: 40,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Icon(
                        Icons.person,
                        color: _getTierColor(customer.tier),
                        size: 20,
                      );
                    },
                  ),
                )
              : Icon(
                  Icons.person,
                  color: _getTierColor(customer.tier),
                  size: 20,
                ),
        ),
        const SizedBox(width: 12),
        // Customer Info
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                customer.fullName,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                customer.email,
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textSoft.withOpacity(0.7),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildMembershipTier(Customer customer) {
    final color = _getTierColor(customer.tier);
    final tierText = _getTierText(customer.tier);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: color.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _getTierIcon(customer.tier),
            size: 14,
            color: color,
          ),
          const SizedBox(width: 6),
          Text(
            tierText,
            style: TextStyle(
              color: color,
              fontSize: 12,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTotalOrders(Customer customer) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppColors.adminPrimary.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        '${customer.totalOrders}',
        style: const TextStyle(
          fontWeight: FontWeight.w600,
          color: AppColors.adminPrimary,
        ),
      ),
    );
  }

  Widget _buildTotalSpent(Customer customer) {
    return Text(
      customer.formattedTotalSpent,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        color: AppColors.textDark,
      ),
    );
  }

  Widget _buildLastOrderDate(Customer customer) {
    if (customer.lastOrderDate == null) {
      return Text(
        'No orders',
        style: TextStyle(
          fontSize: 12,
          color: AppColors.textSoft.withOpacity(0.5),
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          _formatDate(customer.lastOrderDate!),
          style: const TextStyle(
            fontWeight: FontWeight.w500,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          _getTimeAgo(customer.lastOrderDate!),
          style: TextStyle(
            fontSize: 11,
            color: AppColors.textSoft.withOpacity(0.7),
          ),
        ),
      ],
    );
  }

  Widget _buildTags(Customer customer) {
    if (customer.tags.isEmpty) {
      return Text(
        'No tags',
        style: TextStyle(
          fontSize: 12,
          color: AppColors.textSoft.withOpacity(0.5),
        ),
      );
    }

    return Wrap(
      spacing: 4,
      runSpacing: 4,
      children: customer.tags.take(2).map((tag) {
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
          decoration: BoxDecoration(
            color: _getTagColor(tag).withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            tag,
            style: TextStyle(
              color: _getTagColor(tag),
              fontSize: 10,
              fontWeight: FontWeight.w500,
            ),
          ),
        );
      }).toList(),
    );
  }

  Color _getTierColor(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return AppColors.gray600;
      case MembershipTier.silver:
        return AppColors.gray400;
      case MembershipTier.gold:
        return AppColors.adminGold;
      case MembershipTier.platinum:
        return AppColors.adminPrimary;
    }
  }

  String _getTierText(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return 'Bronze';
      case MembershipTier.silver:
        return 'Silver';
      case MembershipTier.gold:
        return 'Gold';
      case MembershipTier.platinum:
        return 'Platinum';
    }
  }

  IconData _getTierIcon(MembershipTier tier) {
    switch (tier) {
      case MembershipTier.bronze:
        return Icons.military_tech;
      case MembershipTier.silver:
        return Icons.workspace_premium;
      case MembershipTier.gold:
        return Icons.star;
      case MembershipTier.platinum:
        return Icons.diamond;
    }
  }

  Color _getTagColor(String tag) {
    switch (tag.toLowerCase()) {
      case 'vip':
        return AppColors.adminGold;
      case 'new customer':
        return AppColors.success;
      case 'repeat customer':
        return AppColors.info;
      case 'wholesale':
        return AppColors.adminPrimary;
      case 'premium':
        return AppColors.adminCoral;
      case 'growing customer':
        return AppColors.adminSage;
      case 'loyal':
        return AppColors.warning;
      default:
        return AppColors.gray500;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
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
