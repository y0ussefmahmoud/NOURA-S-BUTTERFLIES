import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import 'widget_types.dart';
import 'material_icon.dart';

class AppButton extends StatelessWidget {
  final String text;
  final ButtonVariant variant;
  final ButtonSize size;
  final bool loading;
  final bool disabled;
  final String? icon;
  final bool iconAfterText;
  final VoidCallback? onPressed;
  final double? width;
  
  const AppButton({
    Key? key,
    required this.text,
    this.variant = ButtonVariant.primary,
    this.size = ButtonSize.medium,
    this.loading = false,
    this.disabled = false,
    this.icon,
    this.iconAfterText = false,
    this.onPressed,
    this.width,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    // Get dimensions based on size
    final padding = _getPadding();
    final fontSize = _getFontSize();
    
    // Get colors based on variant
    final backgroundColor = _getBackgroundColor(isDark);
    final foregroundColor = _getForegroundColor(isDark);
    final borderColor = _getBorderColor(isDark);
    
    return SizedBox(
      width: width,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: (loading || disabled) ? null : onPressed,
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          splashColor: foregroundColor.withOpacity(0.1),
          highlightColor: foregroundColor.withOpacity(0.05),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            padding: padding,
            decoration: BoxDecoration(
              color: disabled ? Colors.grey.withOpacity(0.3) : backgroundColor,
              border: variant == ButtonVariant.outline 
                ? Border.all(color: disabled ? Colors.grey : borderColor)
                : null,
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              boxShadow: variant == ButtonVariant.primary && !disabled
                ? [
                    BoxShadow(
                      color: AppColors.primary.withOpacity(0.2),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
            ),
            child: Center(
              child: loading
                ? SizedBox(
                    width: fontSize * 1.2,
                    height: fontSize * 1.2,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(foregroundColor),
                    ),
                  )
                : Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (icon != null && !iconAfterText) ...[
                        MaterialIcon(
                          icon!,
                          size: fontSize,
                          color: foregroundColor,
                        ),
                        SizedBox(width: AppDimensions.spacing2),
                      ],
                      Text(
                        text,
                        style: TextStyle(
                          fontSize: fontSize,
                          fontWeight: FontWeight.w600,
                          color: disabled ? Colors.grey : foregroundColor,
                        ),
                      ),
                      if (icon != null && iconAfterText) ...[
                        SizedBox(width: AppDimensions.spacing2),
                        MaterialIcon(
                          icon!,
                          size: fontSize,
                          color: foregroundColor,
                        ),
                      ],
                    ],
                  ),
            ),
          ),
        ),
      ),
    );
  }

  EdgeInsets _getPadding() {
    switch (size) {
      case ButtonSize.small:
        return const EdgeInsets.symmetric(horizontal: 8, vertical: 12);
      case ButtonSize.medium:
        return const EdgeInsets.symmetric(horizontal: 12, vertical: 16);
      case ButtonSize.large:
        return const EdgeInsets.symmetric(horizontal: 16, vertical: 20);
    }
  }

  double _getFontSize() {
    switch (size) {
      case ButtonSize.small:
        return 12;
      case ButtonSize.medium:
        return 14;
      case ButtonSize.large:
        return 16;
    }
  }

  Color _getBackgroundColor(bool isDark) {
    switch (variant) {
      case ButtonVariant.primary:
        return AppColors.primary;
      case ButtonVariant.outline:
        return Colors.transparent;
      case ButtonVariant.ghost:
        return Colors.transparent;
    }
  }

  Color _getForegroundColor(bool isDark) {
    switch (variant) {
      case ButtonVariant.primary:
        return Colors.white;
      case ButtonVariant.outline:
        return AppColors.primary;
      case ButtonVariant.ghost:
        return AppColors.primary;
    }
  }

  Color _getBorderColor(bool isDark) {
    switch (variant) {
      case ButtonVariant.outline:
        return AppColors.primary;
      default:
        return Colors.transparent;
    }
  }
}
