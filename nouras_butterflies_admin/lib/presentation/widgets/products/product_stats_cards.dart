import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../widgets/common/app_card.dart';

class ProductStatsCards extends StatelessWidget {
  final int total;
  final int active;
  final int lowStock;
  final int outOfStock;

  const ProductStatsCards({
    Key? key,
    required this.total,
    required this.active,
    required this.lowStock,
    required this.outOfStock,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Responsive grid
        int crossAxisCount = 4;
        if (constraints.maxWidth < 1200) {
          crossAxisCount = 2;
        }
        if (constraints.maxWidth < 600) {
          crossAxisCount = 1;
        }

        return GridView.count(
          crossAxisCount: crossAxisCount,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: AppDimensions.spacing4,
          crossAxisSpacing: AppDimensions.spacing4,
          childAspectRatio: 1.5,
          children: [
            _buildStatCard(
              title: 'Total Products',
              value: total.toString(),
              icon: Icons.inventory_2,
              color: AppColors.info,
            ),
            _buildStatCard(
              title: 'Active',
              value: active.toString(),
              icon: Icons.check_circle,
              color: AppColors.success,
            ),
            _buildStatCard(
              title: 'Low Stock',
              value: lowStock.toString(),
              icon: Icons.warning,
              color: AppColors.warning,
            ),
            _buildStatCard(
              title: 'Out of Stock',
              value: outOfStock.toString(),
              icon: Icons.cancel,
              color: AppColors.error,
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return AppCard(
      padding: const EdgeInsets.all(AppDimensions.spacing5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.textSoft,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: AppDimensions.spacing2),
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        alignment: Alignment.centerLeft,
                        child: Text(
                          value,
                          style: AppTextStyles.headlineSmall.copyWith(
                            color: AppColors.textDark,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: AppDimensions.spacing3),
                Container(
                  width: AppDimensions.iconXl,
                  height: AppDimensions.iconXl,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: AppDimensions.iconLg,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
