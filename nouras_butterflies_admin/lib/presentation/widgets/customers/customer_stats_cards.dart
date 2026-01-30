import 'package:flutter/material.dart';
import '../../../data/repositories/customer_repository.dart';
import '../../../core/constants/app_colors.dart';

class CustomerStatsCards extends StatelessWidget {
  final CustomerStats stats;

  const CustomerStatsCards({
    super.key,
    required this.stats,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Total Customers',
            '${stats.total}',
            Icons.people,
            AppColors.adminPrimary,
            'All registered customers',
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'New This Month',
            '${stats.newThisMonth}',
            Icons.person_add,
            AppColors.adminGold,
            'New customers in the last 30 days',
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Active',
            '${stats.active}',
            Icons.person_pin_circle,
            AppColors.adminSage,
            'Customers with recent orders',
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'VIP Customers',
            '${stats.vip}',
            Icons.star,
            AppColors.adminCoral,
            'Gold and Platinum members',
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    String description,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.surfaceDark
            : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.borderDark
              : AppColors.borderLight,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 24,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      Icons.trending_up,
                      size: 12,
                      color: color,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '+12%',
                      style: TextStyle(
                        color: color,
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            value,
            style: TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).brightness == Brightness.dark
                  ? AppColors.textLight
                  : AppColors.textDark,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: AppColors.textSoft,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            description,
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSoft.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}
