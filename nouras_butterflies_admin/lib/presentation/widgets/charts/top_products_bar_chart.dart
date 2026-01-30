import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/constants/app_colors.dart';
import '../../../../data/models/admin_dashboard_data.dart';

class TopProductsBarChart extends StatelessWidget {
  final List<TopProduct> products;
  final String? title;

  const TopProductsBarChart({
    super.key,
    required this.products,
    this.title,
  });
  
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
        ],
        SizedBox(
          height: 250,
          child: BarChart(
            BarChartData(
              alignment: BarChartAlignment.spaceAround,
              maxY: _getMaxY(),
              barTouchData: BarTouchData(
                enabled: true,
                touchTooltipData: BarTouchTooltipData(
                  getTooltipColor: (_) => AppColors.surface,
                  getTooltipItem: (group, groupIndex, rod, rodIndex) {
                    final product = products[group.x.toInt()];
                    return BarTooltipItem(
                      '${product.name}\n${product.unitsSold} units\n\$${product.revenue.toStringAsFixed(0)}',
                      const TextStyle(
                        color: AppColors.textPrimary,
                        fontSize: 12,
                      ),
                    );
                  },
                ),
              ),
              titlesData: FlTitlesData(
                show: true,
                bottomTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 60,
                    getTitlesWidget: (value, meta) {
                      if (value.toInt() < products.length) {
                        final product = products[value.toInt()];
                        return Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: RotatedBox(
                            quarterTurns: 1,
                            child: Text(
                              product.name.length > 15 
                                  ? '${product.name.substring(0, 15)}...'
                                  : product.name,
                              style: const TextStyle(
                                fontSize: 9,
                                color: AppColors.textSoft,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                        );
                      }
                      return const Text('');
                    },
                  ),
                ),
                leftTitles: AxisTitles(
                  sideTitles: SideTitles(
                    showTitles: true,
                    reservedSize: 40,
                    getTitlesWidget: (value, meta) {
                      return Text(
                        value.toInt().toString(),
                        style: const TextStyle(
                          fontSize: 10,
                          color: AppColors.textSoft,
                        ),
                      );
                    },
                  ),
                ),
                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              ),
              gridData: FlGridData(
                show: true,
                drawVerticalLine: false,
                getDrawingHorizontalLine: (value) {
                  return FlLine(
                    color: AppColors.textSoft.withOpacity(0.2),
                    strokeWidth: 1,
                  );
                },
              ),
              borderData: FlBorderData(show: false),
              barGroups: _getBarGroups(),
            ),
          ),
        ),
      ],
    );
  }
  
  List<BarChartGroupData> _getBarGroups() {
    return products.asMap().entries.map((entry) {
      final product = entry.value;
      return BarChartGroupData(
        x: entry.key,
        barRods: [
          BarChartRodData(
            toY: product.unitsSold.toDouble(),
            color: _getBarColor(product.growth),
            width: 16,
            borderRadius: BorderRadius.circular(4),
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                _getBarColor(product.growth),
                _getBarColor(product.growth).withOpacity(0.8),
              ],
            ),
          ),
        ],
      );
    }).toList();
  }
  
  Color _getBarColor(double growth) {
    if (growth > 0) {
      return Colors.green;
    } else if (growth < 0) {
      return Colors.red;
    } else {
      return AppColors.primary;
    }
  }
  
  double _getMaxY() {
    if (products.isEmpty) return 100;
    final maxUnits = products.map((e) => e.unitsSold.toDouble()).reduce((a, b) => a > b ? a : b);
    return maxUnits * 1.2; // Add 20% padding
  }
}
