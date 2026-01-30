import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/constants/app_colors.dart';
import '../../../../data/models/chart_data_point.dart';
import 'optimized_chart_widgets.dart';

/// Bar chart widget using optimized implementation
class BarChartWidget extends StatelessWidget {
  final List<ChartDataPoint> data;
  final String? title;
  final Color? barColor;
  final double? barWidth;
  final bool enableAnimation;
  final Duration animationDuration;

  const BarChartWidget({
    super.key,
    required this.data,
    this.title,
    this.barColor,
    this.barWidth,
    this.enableAnimation = true,
    this.animationDuration = const Duration(milliseconds: 800),
  });
  
  @override
  Widget build(BuildContext context) {
    return OptimizedBarChartWidget(
      data: data,
      title: title,
      barColor: barColor,
      barWidth: barWidth,
      enableAnimation: enableAnimation,
      animationDuration: animationDuration,
      enableSampling: true,
      maxDataPoints: 50,
    );
  }
}
