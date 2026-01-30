import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';

enum CardShadow { soft, butterflyGlow }

class AppCard extends StatefulWidget {
  final Widget child;
  final CardShadow shadow;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double? borderRadius;
  final Color? backgroundColor;
  final VoidCallback? onTap;
  final bool showBorder;

  const AppCard({
    Key? key,
    required this.child,
    this.shadow = CardShadow.soft,
    this.padding,
    this.margin,
    this.borderRadius,
    this.backgroundColor,
    this.onTap,
    this.showBorder = true,
  }) : super(key: key);

  @override
  State<AppCard> createState() => _AppCardState();
}

class _AppCardState extends State<AppCard>
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
    if (widget.onTap != null) {
      if (isHovering) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    }
  }

  List<BoxShadow> _getShadow() {
    switch (widget.shadow) {
      case CardShadow.soft:
        return [
          BoxShadow(
            color: Colors.black.withOpacity(0.12),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ];
      case CardShadow.butterflyGlow:
        return [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ];
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Container(
      margin: widget.margin,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: widget.onTap,
                borderRadius: BorderRadius.circular(
                  widget.borderRadius ?? AppDimensions.radiusLg,
                ),
                onHover: _onHover,
                child: Container(
                  padding: widget.padding ?? const EdgeInsets.all(AppDimensions.spacing6),
                  decoration: BoxDecoration(
                    color: widget.backgroundColor ??
                        (isDark ? AppColors.surfaceDark : AppColors.surfaceLight),
                    borderRadius: BorderRadius.circular(
                      widget.borderRadius ?? AppDimensions.radiusLg,
                    ),
                    border: widget.showBorder
                        ? Border.all(
                            color: isDark ? AppColors.borderDark : AppColors.borderLight,
                            width: 1,
                          )
                        : null,
                    boxShadow: _getShadow(),
                  ),
                  child: widget.child,
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
