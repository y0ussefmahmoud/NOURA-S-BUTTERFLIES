import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../../core/constants/app_colors.dart';
import '../../../data/cache/chart_data_cache.dart';
import '../../../../data/models/chart_data_point.dart';

/// Optimized line chart widget with caching and memoization
class OptimizedLineChartWidget extends HookWidget {
  final List<ChartDataPoint> data;
  final String? title;
  final bool showDots;
  final Color? lineColor;
  final double? lineWidth;
  final bool enableAnimation;
  final Duration animationDuration;
  final bool enableSampling;
  final int maxDataPoints;

  const OptimizedLineChartWidget({
    Key? key,
    required this.data,
    this.title,
    this.showDots = true,
    this.lineColor,
    this.lineWidth,
    this.enableAnimation = true,
    this.animationDuration = const Duration(milliseconds: 800),
    this.enableSampling = true,
    this.maxDataPoints = 100,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartCache = useMemoized(() => ChartDataCache());
    final animationController = useAnimationController(
      duration: animationDuration,
    );

    // Memoize processed data to avoid recalculation
    final processedData = useMemoized(() {
      var processedData = data;
      
      // Apply data sampling for large datasets
      if (enableSampling && data.length > maxDataPoints) {
        processedData = _sampleData(data, maxDataPoints);
      }
      
      return processedData;
    }, [data, enableSampling, maxDataPoints]);

    // Memoize chart data structure
    final lineChartData = useMemoized(() {
      return _createLineChartData(processedData, context);
    }, [processedData, showDots, lineColor, lineWidth]);

    // Check cache first
    final cacheKey = _generateCacheKey(processedData);
    final cachedWidget = chartCache.get(cacheKey);
    
    if (cachedWidget != null) {
      return cachedWidget;
    }

    // Start animation if enabled
    useEffect(() {
      if (enableAnimation) {
        animationController.forward();
      }
      return null;
    }, []);

    final chartWidget = RepaintBoundary(
      child: Column(
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
            child: enableAnimation
                ? AnimatedBuilder(
                    animation: animationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scaleX: animationController.value,
                        child: Opacity(
                          opacity: animationController.value,
                          child: child,
                        ),
                      );
                    },
                    child: LineChart(lineChartData),
                  )
                : LineChart(lineChartData),
          ),
        ],
      ),
    );

    // Cache the widget
    chartCache.put(cacheKey, chartWidget);
    
    return chartWidget;
  }

  /// Sample data points to reduce rendering complexity
  List<ChartDataPoint> _sampleData(List<ChartDataPoint> data, int maxPoints) {
    if (data.length <= maxPoints) return data;

    final step = (data.length / maxPoints).ceil();
    final sampledData = <ChartDataPoint>[];
    
    for (int i = 0; i < data.length; i += step) {
      sampledData.add(data[i]);
    }
    
    // Always include the last point
    if (sampledData.last != data.last) {
      sampledData.add(data.last);
    }
    
    return sampledData;
  }

  /// Create optimized line chart data
  LineChartData _createLineChartData(List<ChartDataPoint> data, BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return LineChartData(
      gridData: FlGridData(
        show: true,
        drawVerticalLine: false,
        getDrawingHorizontalLine: (value) {
          return FlLine(
            color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.1),
            strokeWidth: 1,
          );
        },
      ),
      titlesData: FlTitlesData(
        show: true,
        bottomTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 30,
            interval: _calculateInterval(data.length),
            getTitlesWidget: (value, meta) {
              return _buildBottomTitle(value, data, isDark);
            },
          ),
        ),
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 42,
            interval: _calculateYInterval(data),
            getTitlesWidget: (value, meta) {
              return _buildLeftTitle(value, isDark);
            },
          ),
        ),
        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      ),
      borderData: FlBorderData(
        show: true,
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.1),
        ),
      ),
      minX: 0,
      maxX: (data.length - 1).toDouble(),
      minY: _calculateMinY(data),
      maxY: _calculateMaxY(data),
      lineBarsData: [
        LineChartBarData(
          spots: data.asMap().entries.map((entry) {
            return FlSpot(entry.key.toDouble(), entry.key < data.length 
                ? data[entry.key].value 
                : entry.value.value);
          }).toList(),
          isCurved: true,
          gradient: LinearGradient(
            colors: [
              lineColor ?? AppColors.primary,
              (lineColor ?? AppColors.primary).withOpacity(0.8),
            ],
          ),
          barWidth: lineWidth ?? 3,
          isStrokeCapRound: true,
          dotData: FlDotData(
            show: showDots,
            getDotPainter: (spot, percent, barData, index) {
              return FlDotCirclePainter(
                radius: 4,
                color: lineColor ?? AppColors.primary,
                strokeWidth: 2,
                strokeColor: Colors.white,
              );
            },
          ),
          belowBarData: BarAreaData(
            show: true,
            gradient: LinearGradient(
              colors: [
                (lineColor ?? AppColors.primary).withOpacity(0.3),
                (lineColor ?? AppColors.primary).withOpacity(0.0),
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
      ],
      lineTouchData: LineTouchData(
        touchTooltipData: LineTouchTooltipData(
          tooltipBgColor: isDark ? Colors.grey[800]! : Colors.grey[700]!,
          tooltipRoundedRadius: 8,
          getTooltipItems: (spots) {
            return spots.map((spot) {
              final index = spot.x.toInt();
              if (index < data.length) {
                final dataPoint = data[index];
                return LineTooltipItem(
                  '${dataPoint.label}\n${dataPoint.value.toStringAsFixed(2)}',
                  const TextStyle(color: Colors.white, fontSize: 12),
                );
              }
              return null;
            }).toList();
          },
        ),
        handleBuiltInTouches: true,
      ),
    );
  }

  double _calculateInterval(int dataLength) {
    if (dataLength <= 10) return 1;
    if (dataLength <= 20) return 2;
    if (dataLength <= 50) return 5;
    return (dataLength / 10).ceil().toDouble();
  }

  double _calculateYInterval(List<ChartDataPoint> data) {
    if (data.isEmpty) return 1;
    
    final values = data.map((d) => d.value).toList();
    final minVal = values.reduce(min);
    final maxVal = values.reduce(max);
    final range = maxVal - minVal;
    
    if (range <= 10) return 2;
    if (range <= 50) return 10;
    if (range <= 100) return 20;
    return (range / 5).ceilToDouble();
  }

  double _calculateMinY(List<ChartDataPoint> data) {
    if (data.isEmpty) return 0;
    final minVal = data.map((d) => d.value).reduce(min);
    return (minVal * 0.9).floorToDouble();
  }

  double _calculateMaxY(List<ChartDataPoint> data) {
    if (data.isEmpty) return 100;
    final maxVal = data.map((d) => d.value).reduce(max);
    return (maxVal * 1.1).ceilToDouble();
  }

  Widget _buildBottomTitle(double value, List<ChartDataPoint> data, bool isDark) {
    final index = value.toInt();
    if (index >= 0 && index < data.length) {
      return SideTitleWidget(
        axisSide: AxisSide.bottom,
        space: 8,
        child: Text(
          data[index].label,
          style: TextStyle(
            fontSize: 10,
            color: isDark ? Colors.white.withOpacity(0.6) : Colors.black.withOpacity(0.6),
          ),
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildLeftTitle(double value, bool isDark) {
    return SideTitleWidget(
      axisSide: AxisSide.left,
      space: 8,
      child: Text(
        value.toStringAsFixed(0),
        style: TextStyle(
          fontSize: 10,
          color: isDark ? Colors.white.withOpacity(0.6) : Colors.black.withOpacity(0.6),
        ),
      ),
    );
  }

  String _generateCacheKey(List<ChartDataPoint> data) {
    final dataHash = data.map((d) => '${d.label}-${d.value}').join('|');
    return 'line_chart_${data.hashCode}_${showDots}_${lineColor?.value ?? 0}';
  }
}

/// Optimized bar chart widget with caching and memoization
class OptimizedBarChartWidget extends HookWidget {
  final List<ChartDataPoint> data;
  final String? title;
  final Color? barColor;
  final double? barWidth;
  final bool enableAnimation;
  final Duration animationDuration;
  final bool enableSampling;
  final int maxDataPoints;

  const OptimizedBarChartWidget({
    Key? key,
    required this.data,
    this.title,
    this.barColor,
    this.barWidth,
    this.enableAnimation = true,
    this.animationDuration = const Duration(milliseconds: 800),
    this.enableSampling = true,
    this.maxDataPoints = 50,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final chartCache = useMemoized(() => ChartDataCache());
    final animationController = useAnimationController(
      duration: animationDuration,
    );

    // Memoize processed data
    final processedData = useMemoized(() {
      var processedData = data;
      
      if (enableSampling && data.length > maxDataPoints) {
        processedData = _sampleData(data, maxDataPoints);
      }
      
      return processedData;
    }, [data, enableSampling, maxDataPoints]);

    // Memoize chart data structure
    final barChartData = useMemoized(() {
      return _createBarChartData(processedData, context);
    }, [processedData, barColor, barWidth]);

    // Check cache
    final cacheKey = _generateCacheKey(processedData);
    final cachedWidget = chartCache.get(cacheKey);
    
    if (cachedWidget != null) {
      return cachedWidget;
    }

    useEffect(() {
      if (enableAnimation) {
        animationController.forward();
      }
      return null;
    }, []);

    final chartWidget = RepaintBoundary(
      child: Column(
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
            child: enableAnimation
                ? AnimatedBuilder(
                    animation: animationController,
                    builder: (context, child) {
                      return Transform.scale(
                        scaleY: animationController.value,
                        child: Opacity(
                          opacity: animationController.value,
                          child: child,
                        ),
                      );
                    },
                    child: BarChart(barChartData),
                  )
                : BarChart(barChartData),
          ),
        ],
      ),
    );

    chartCache.put(cacheKey, chartWidget);
    return chartWidget;
  }

  List<ChartDataPoint> _sampleData(List<ChartDataPoint> data, int maxPoints) {
    if (data.length <= maxPoints) return data;

    final step = (data.length / maxPoints).ceil();
    final sampledData = <ChartDataPoint>[];
    
    for (int i = 0; i < data.length; i += step) {
      sampledData.add(data[i]);
    }
    
    if (sampledData.last != data.last) {
      sampledData.add(data.last);
    }
    
    return sampledData;
  }

  BarChartData _createBarChartData(List<ChartDataPoint> data, BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return BarChartData(
      alignment: BarChartAlignment.spaceAround,
      titlesData: FlTitlesData(
        show: true,
        bottomTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 30,
            interval: _calculateInterval(data.length),
            getTitlesWidget: (value, meta) {
              return _buildBottomTitle(value, data, isDark);
            },
          ),
        ),
        leftTitles: AxisTitles(
          sideTitles: SideTitles(
            showTitles: true,
            reservedSize: 42,
            interval: _calculateYInterval(data),
            getTitlesWidget: (value, meta) {
              return _buildLeftTitle(value, isDark);
            },
          ),
        ),
        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
      ),
      borderData: FlBorderData(
        show: true,
        border: Border.all(
          color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.1),
        ),
      ),
      barGroups: data.asMap().entries.map((entry) {
        return BarChartGroupData(
          x: entry.key,
          barRods: [
            BarChartRodData(
              toY: entry.value.value,
              color: barColor ?? AppColors.primary,
              width: barWidth ?? 20,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(4),
              ),
            ),
          ],
        );
      }).toList(),
      gridData: FlGridData(
        show: true,
        drawVerticalLine: false,
        getDrawingHorizontalLine: (value) {
          return FlLine(
            color: isDark ? Colors.white.withOpacity(0.1) : Colors.black.withOpacity(0.1),
            strokeWidth: 1,
          );
        },
      ),
      minY: _calculateMinY(data),
      maxY: _calculateMaxY(data),
      barTouchData: BarTouchData(
        touchTooltipData: BarTouchTooltipData(
          tooltipBgColor: isDark ? Colors.grey[800]! : Colors.grey[700]!,
          tooltipRoundedRadius: 8,
          getTooltipItem: (group, groupIndex, rod, rodIndex) {
            final index = group.x.toInt();
            if (index < data.length) {
              final dataPoint = data[index];
              return BarTooltipItem(
                '${dataPoint.label}\n${dataPoint.value.toStringAsFixed(2)}',
                const TextStyle(color: Colors.white, fontSize: 12),
              );
            }
            return null;
          },
        ),
      ),
    );
  }

  double _calculateInterval(int dataLength) {
    if (dataLength <= 10) return 1;
    if (dataLength <= 20) return 2;
    if (dataLength <= 50) return 5;
    return (dataLength / 10).ceil().toDouble();
  }

  double _calculateYInterval(List<ChartDataPoint> data) {
    if (data.isEmpty) return 1;
    
    final values = data.map((d) => d.value).toList();
    final minVal = values.reduce(min);
    final maxVal = values.reduce(max);
    final range = maxVal - minVal;
    
    if (range <= 10) return 2;
    if (range <= 50) return 10;
    if (range <= 100) return 20;
    return (range / 5).ceilToDouble();
  }

  double _calculateMinY(List<ChartDataPoint> data) {
    if (data.isEmpty) return 0;
    final minVal = data.map((d) => d.value).reduce(min);
    return (minVal * 0.9).floorToDouble();
  }

  double _calculateMaxY(List<ChartDataPoint> data) {
    if (data.isEmpty) return 100;
    final maxVal = data.map((d) => d.value).reduce(max);
    return (maxVal * 1.1).ceilToDouble();
  }

  Widget _buildBottomTitle(double value, List<ChartDataPoint> data, bool isDark) {
    final index = value.toInt();
    if (index >= 0 && index < data.length) {
      return SideTitleWidget(
        axisSide: AxisSide.bottom,
        space: 8,
        child: Text(
          data[index].label,
          style: TextStyle(
            fontSize: 10,
            color: isDark ? Colors.white.withOpacity(0.6) : Colors.black.withOpacity(0.6),
          ),
        ),
      );
    }
    return const SizedBox.shrink();
  }

  Widget _buildLeftTitle(double value, bool isDark) {
    return SideTitleWidget(
      axisSide: AxisSide.left,
      space: 8,
      child: Text(
        value.toStringAsFixed(0),
        style: TextStyle(
          fontSize: 10,
          color: isDark ? Colors.white.withOpacity(0.6) : Colors.black.withOpacity(0.6),
        ),
      ),
    );
  }

  String _generateCacheKey(List<ChartDataPoint> data) {
    final dataHash = data.map((d) => '${d.label}-${d.value}').join('|');
    return 'bar_chart_${data.hashCode}_${barColor?.value ?? 0}';
  }
}
