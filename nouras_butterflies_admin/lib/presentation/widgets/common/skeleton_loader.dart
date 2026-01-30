import 'package:flutter/material.dart';

/// Skeleton loader for cards
class SkeletonCard extends StatelessWidget {
  final double height;
  final double width;
  final double borderRadius;
  final Color? baseColor;
  final Color? highlightColor;

  const SkeletonCard({
    Key? key,
    this.height = 100,
    this.width = double.infinity,
    this.borderRadius = 8,
    this.baseColor,
    this.highlightColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        color: baseColor ?? (isDark ? Colors.grey[800] : Colors.grey[200]),
      ),
      child: _Shimmer(
        baseColor: baseColor ?? (isDark ? Colors.grey[800] : Colors.grey[200]),
        highlightColor: highlightColor ?? (isDark ? Colors.grey[600] : Colors.grey[300]),
        borderRadius: borderRadius,
      ),
    );
  }
}

/// Skeleton loader for lists
class SkeletonList extends StatelessWidget {
  final int itemCount;
  final double itemHeight;
  final double spacing;
  final Widget? header;
  final Widget? footer;
  final bool showAvatar;
  final bool showSubtitle;
  final double borderRadius;

  const SkeletonList({
    Key? key,
    this.itemCount = 5,
    this.itemHeight = 72,
    this.spacing = 8,
    this.header,
    this.footer,
    this.showAvatar = true,
    this.showSubtitle = true,
    this.borderRadius = 8,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (header != null) header!,
        ...List.generate(itemCount, (index) {
          return Padding(
            padding: EdgeInsets.only(bottom: index < itemCount - 1 ? spacing : 0),
            child: SkeletonListItem(
              showAvatar: showAvatar,
              showSubtitle: showSubtitle,
              borderRadius: borderRadius,
            ),
          );
        }),
        if (footer != null) footer!,
      ],
    );
  }
}

/// Skeleton list item
class SkeletonListItem extends StatelessWidget {
  final bool showAvatar;
  final bool showSubtitle;
  final double borderRadius;

  const SkeletonListItem({
    Key? key,
    this.showAvatar = true,
    this.showSubtitle = true,
    this.borderRadius = 8,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 72,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.grey[800]
            : Colors.white,
      ),
      child: Row(
        children: [
          if (showAvatar) ...[
            SkeletonCard(
              width: 40,
              height: 40,
              borderRadius: 20,
            ),
            const SizedBox(width: 16),
          ],
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                SkeletonCard(
                  height: 16,
                  width: double.infinity,
                  borderRadius: 4,
                ),
                if (showSubtitle) ...[
                  const SizedBox(height: 8),
                  SkeletonCard(
                    height: 12,
                    width: 200,
                    borderRadius: 4,
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Skeleton loader for tables
class SkeletonTable extends StatelessWidget {
  final int rowCount;
  final int columnCount;
  final double rowHeight;
  final double columnSpacing;
  final List<double>? columnWidths;
  final bool showHeader;

  const SkeletonTable({
    Key? key,
    this.rowCount = 5,
    this.columnCount = 4,
    this.rowHeight = 56,
    this.columnSpacing = 16,
    this.columnWidths,
    this.showHeader = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (showHeader) ...[
          Container(
            height: rowHeight,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Theme.of(context).brightness == Brightness.dark
                  ? Colors.grey[800]
                  : Colors.grey[100],
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(8),
                topRight: Radius.circular(8),
              ),
            ),
            child: Row(
              children: List.generate(columnCount, (index) {
                final width = columnWidths != null && index < columnWidths!.length
                    ? columnWidths![index]
                    : null;
                
                return Expanded(
                  flex: width == null ? 1 : 0,
                  child: Container(
                    width: width,
                    height: 16,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(4),
                      color: Theme.of(context).brightness == Brightness.dark
                          ? Colors.grey[600]
                          : Colors.grey[300],
                    ),
                  ),
                );
              }),
            ),
          ),
        ],
        ...List.generate(rowCount, (rowIndex) {
          return Container(
            height: rowHeight,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: Theme.of(context).brightness == Brightness.dark
                      ? Colors.grey[800]!
                      : Colors.grey[200]!,
                  width: 0.5,
                ),
              ),
            ),
            child: Row(
              children: List.generate(columnCount, (colIndex) {
                final width = columnWidths != null && colIndex < columnWidths!.length
                    ? columnWidths![colIndex]
                    : null;
                
                return Expanded(
                  flex: width == null ? 1 : 0,
                  child: SkeletonCard(
                    width: width,
                    height: 12,
                    borderRadius: 4,
                  ),
                );
              }),
            ),
          );
        }),
      ],
    );
  }
}

/// Skeleton loader for charts
class SkeletonChart extends StatelessWidget {
  final double height;
  final double width;
  final ChartType chartType;

  const SkeletonChart({
    Key? key,
    this.height = 250,
    this.width = double.infinity,
    this.chartType = ChartType.line,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    switch (chartType) {
      case ChartType.line:
        return _buildLineChartSkeleton();
      case ChartType.bar:
        return _buildBarChartSkeleton();
      case ChartType.pie:
        return _buildPieChartSkeleton();
    }
  }

  Widget _buildLineChartSkeleton() {
    return Container(
      height: height,
      width: width,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.grey[800]
            : Colors.white,
      ),
      child: Column(
        children: [
          // Title skeleton
          SkeletonCard(
            height: 16,
            width: 120,
            borderRadius: 4,
          ),
          const SizedBox(height: 16),
          // Chart area skeleton
          Expanded(
            child: Column(
              children: [
                // Y-axis labels
                Row(
                  children: List.generate(5, (index) {
                    return Expanded(
                      child: SkeletonCard(
                        height: 10,
                        width: 30,
                        borderRadius: 4,
                      ),
                    );
                  }),
                ),
                const SizedBox(height: 8),
                // Chart lines
                Expanded(
                  child: Stack(
                    children: [
                      // Grid lines
                      ...List.generate(4, (index) {
                        return Positioned(
                          top: (index + 1) * 60.0,
                          left: 0,
                          right: 0,
                          child: Container(
                            height: 1,
                            color: Theme.of(context).brightness == Brightness.dark
                                ? Colors.grey[700]
                                : Colors.grey[200],
                          ),
                        );
                      }),
                      // Line skeleton
                      Positioned.fill(
                        child: CustomPaint(
                          painter: _LineSkeletonPainter(
                            Theme.of(context).brightness == Brightness.dark
                                ? Colors.grey[600]!
                                : Colors.grey[300]!,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // X-axis labels
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: List.generate(6, (index) {
                    return SkeletonCard(
                      height: 10,
                      width: 20,
                      borderRadius: 4,
                    );
                  }),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBarChartSkeleton() {
    return Container(
      height: height,
      width: width,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.grey[800]
            : Colors.white,
      ),
      child: Column(
        children: [
          // Title skeleton
          SkeletonCard(
            height: 16,
            width: 120,
            borderRadius: 4,
          ),
          const SizedBox(height: 16),
          // Chart area skeleton
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(8, (index) {
                return SkeletonCard(
                  width: 20,
                  height: (index + 1) * 20.0,
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(4),
                  ),
                );
              }),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPieChartSkeleton() {
    return Container(
      height: height,
      width: width,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: Theme.of(context).brightness == Brightness.dark
            ? Colors.grey[800]
            : Colors.white,
      ),
      child: Column(
        children: [
          // Title skeleton
          SkeletonCard(
            height: 16,
            width: 120,
            borderRadius: 4,
          ),
          const SizedBox(height: 16),
          // Pie chart skeleton
          Expanded(
            child: Center(
              child: Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Theme.of(context).brightness == Brightness.dark
                      ? Colors.grey[700]
                      : Colors.grey[200],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom painter for line chart skeleton
class _LineSkeletonPainter extends CustomPainter {
  final Color color;

  _LineSkeletonPainter(this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();
    
    // Create a wavy line to simulate a chart
    final points = <Offset>[];
    for (int i = 0; i <= 6; i++) {
      final x = (size.width / 6) * i;
      final y = size.height / 2 + (i % 2 == 0 ? -30 : 30) * (i / 6);
      points.add(Offset(x, y));
    }

    path.moveTo(points.first.dx, points.first.dy);
    for (int i = 1; i < points.length; i++) {
      final cp1 = Offset(
        (points[i - 1].dx + points[i].dx) / 2,
        points[i - 1].dy,
      );
      final cp2 = Offset(
        (points[i - 1].dx + points[i].dx) / 2,
        points[i].dy,
      );
      path.cubicTo(cp1.dx, cp1.dy, cp2.dx, cp2.dy, points[i].dx, points[i].dy);
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Skeleton loader for forms
class SkeletonForm extends StatelessWidget {
  final int fieldCount;
  final bool showLabels;
  final bool showButtons;

  const SkeletonForm({
    Key? key,
    this.fieldCount = 5,
    this.showLabels = true,
    this.showButtons = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ...List.generate(fieldCount, (index) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (showLabels) ...[
                  SkeletonCard(
                    height: 12,
                    width: 80,
                    borderRadius: 4,
                  ),
                  const SizedBox(height: 8),
                ],
                SkeletonCard(
                  height: 48,
                  width: double.infinity,
                  borderRadius: 8,
                ),
              ],
            ),
          );
        }),
        if (showButtons) ...[
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: SkeletonCard(
                  height: 48,
                  borderRadius: 8,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: SkeletonCard(
                  height: 48,
                  borderRadius: 8,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

/// Shimmer effect widget
class _Shimmer extends StatefulWidget {
  final Color baseColor;
  final Color highlightColor;
  final double borderRadius;

  const _Shimmer({
    required this.baseColor,
    required this.highlightColor,
    required this.borderRadius,
  });

  @override
  State<_Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<_Shimmer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );

    _animation = Tween<double>(
      begin: -2.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    ));

    _controller.repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return ClipRRect(
          borderRadius: BorderRadius.circular(widget.borderRadius),
          child: DecoratedBox(
            position: DecorationPosition.background,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                stops: [
                  _animation.value - 1,
                  _animation.value,
                  _animation.value + 1,
                ],
                colors: [
                  widget.baseColor,
                  widget.highlightColor,
                  widget.baseColor,
                ],
              ),
            ),
            child: const SizedBox.expand(),
          ),
        );
      },
    );
  }
}

/// Chart types for skeleton charts
enum ChartType {
  line,
  bar,
  pie,
}

/// Generic skeleton loader
class SkeletonLoader extends StatelessWidget {
  final Widget child;
  final bool isLoading;

  const SkeletonLoader({
    Key? key,
    required this.child,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return child;
    }
    return child;
  }
}
