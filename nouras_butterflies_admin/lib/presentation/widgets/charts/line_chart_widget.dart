import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/constants/app_colors.dart';
import '../../../../data/models/chart_data_point.dart';
import 'optimized_chart_widgets.dart';

/// Line chart widget using optimized implementation
class LineChartWidget extends StatelessWidget {
  final List<ChartDataPoint> data;
  final String? title;
  final bool showDots;
  final Color? lineColor;
  final double? lineWidth;
  final bool enableAnimation;
  final Duration animationDuration;

  const LineChartWidget({
    super.key,
    required this.data,
    this.title,
    this.showDots = true,
    this.lineColor,
    this.lineWidth,
    this.enableAnimation = true,
    this.animationDuration = const Duration(milliseconds: 800),
  });
  
  @override
  Widget build(BuildContext context) {
    return OptimizedLineChartWidget(
      data: data,
      title: title,
      showDots: showDots,
      lineColor: lineColor,
      lineWidth: lineWidth,
      enableAnimation: enableAnimation,
      animationDuration: animationDuration,
      enableSampling: true,
      maxDataPoints: 100,
    );
  }
}
