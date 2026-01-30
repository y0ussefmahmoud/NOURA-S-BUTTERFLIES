import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../common/widget_types.dart';
import '../common/material_icon.dart';

class StatsCard extends StatefulWidget {
  final String title;
  final dynamic value;
  final String icon;
  final StatsFormat format;
  final double? change;
  final ChangeType? changeType;
  final String? subtitle;

  const StatsCard({
    Key? key,
    required this.title,
    required this.value,
    required this.icon,
    this.format = StatsFormat.number,
    this.change,
    this.changeType,
    this.subtitle,
  }) : super(key: key);

  @override
  State<StatsCard> createState() => _StatsCardState();
}

class _StatsCardState extends State<StatsCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 1.02,
    ).animate(CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    ));
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _onHover(bool isHovering) {
    if (isHovering) {
      _animationController.forward();
    } else {
      _animationController.reverse();
    }
  }

  String _formatValue(dynamic value) {
    switch (widget.format) {
      case StatsFormat.currency:
        return '\$${value.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        )}';
      case StatsFormat.percentage:
        return '${value.toString()}%';
      case StatsFormat.number:
        return value.toString().replaceAllMapped(
          RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
          (Match m) => '${m[1]},',
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: MouseRegion(
            onEnter: (_) => _onHover(true),
            onExit: (_) => _onHover(false),
            child: Container(
              padding: const EdgeInsets.all(AppDimensions.spacing6),
              decoration: BoxDecoration(
                color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                border: Border.all(
                  color: isDark ? AppColors.borderDark : AppColors.borderLight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  widget.title,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurface.withOpacity(0.7),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                const SizedBox(height: AppDimensions.spacing1),
                                Text(
                                  _formatValue(widget.value),
                                  style: theme.textTheme.headlineMedium?.copyWith(
                                    color: theme.colorScheme.onSurface,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(AppDimensions.spacing3),
                            decoration: BoxDecoration(
                              color: AppColors.adminPrimary.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
                            ),
                            child: MaterialIcon(
                              widget.icon,
                              size: 24,
                              color: AppColors.adminPrimary,
                            ),
                          ),
                        ],
                      ),
                      if (widget.subtitle != null || widget.change != null) ...[
                        const SizedBox(height: AppDimensions.spacing3),
                        Row(
                          children: [
                            if (widget.change != null && widget.changeType != null) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: AppDimensions.spacing2,
                                  vertical: AppDimensions.spacing1,
                                ),
                                decoration: BoxDecoration(
                                  color: widget.changeType == ChangeType.increase
                                      ? Colors.green.shade100
                                      : Colors.red.shade100,
                                  borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    MaterialIcon(
                                      widget.changeType == ChangeType.increase
                                          ? 'arrow_upward'
                                          : 'arrow_downward',
                                      size: 16,
                                      color: widget.changeType == ChangeType.increase
                                          ? Colors.green.shade700
                                          : Colors.red.shade700,
                                    ),
                                    const SizedBox(width: 2),
                                    Text(
                                      '${widget.change!.abs().toStringAsFixed(1)}%',
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w600,
                                        color: widget.changeType == ChangeType.increase
                                            ? Colors.green.shade700
                                            : Colors.red.shade700,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                            if (widget.subtitle != null) ...[
                              if (widget.change != null && widget.changeType != null)
                                const SizedBox(width: AppDimensions.spacing2),
                              Expanded(
                                child: Text(
                                  widget.subtitle!,
                                  style: theme.textTheme.bodySmall?.copyWith(
                                    color: theme.colorScheme.onSurface.withOpacity(0.6),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ],
                  ),
                  // Decorative corner element
                  Positioned(
                    top: 0,
                    right: 0,
                    child: CustomPaint(
                      size: const Size(40, 40),
                      painter: TrianglePainter(
                        color: AppColors.primary.withOpacity(0.05),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class TrianglePainter extends CustomPainter {
  final Color color;

  TrianglePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(size.width, 0);
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
