import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import 'app_button.dart';
import 'material_icon.dart';

class EmptyState extends StatelessWidget {
  final String icon;
  final String title;
  final String? subtitle;
  final String? actionText;
  final VoidCallback? onAction;
  final double? iconSize;

  const EmptyState({
    Key? key,
    required this.icon,
    required this.title,
    this.subtitle,
    this.actionText,
    this.onAction,
    this.iconSize,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppDimensions.spacing8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            MaterialIcon(
              icon,
              size: iconSize ?? 64,
              color: theme.colorScheme.onSurface.withOpacity(0.3),
            ),
            const SizedBox(height: AppDimensions.spacing4),
            Text(
              title,
              style: theme.textTheme.headlineSmall?.copyWith(
                color: theme.colorScheme.onSurface.withOpacity(0.7),
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: AppDimensions.spacing2),
              Text(
                subtitle!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.5),
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (actionText != null && onAction != null) ...[
              const SizedBox(height: AppDimensions.spacing6),
              AppButton(
                text: actionText!,
                variant: ButtonVariant.primary,
                onPressed: onAction,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
