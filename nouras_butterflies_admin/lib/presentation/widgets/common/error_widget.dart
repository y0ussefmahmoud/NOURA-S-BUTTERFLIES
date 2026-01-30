import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import 'app_button.dart';
import 'material_icon.dart';

class AppErrorWidget extends StatelessWidget {
  final String title;
  final String? subtitle;
  final VoidCallback? onRetry;
  final String? retryText;

  const AppErrorWidget({
    Key? key,
    required this.title,
    this.subtitle,
    this.onRetry,
    this.retryText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppDimensions.spacing8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(AppDimensions.spacing4),
              decoration: BoxDecoration(
                color: AppColors.error.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: MaterialIcon(
                'error',
                size: 48,
                color: AppColors.error,
              ),
            ),
            const SizedBox(height: AppDimensions.spacing4),
            Text(
              title,
              style: theme.textTheme.headlineSmall?.copyWith(
                color: AppColors.error,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            if (subtitle != null) ...[
              const SizedBox(height: AppDimensions.spacing2),
              Text(
                subtitle!,
                style: theme.textTheme.bodyMedium?.copyWith(
                  color: theme.colorScheme.onSurface.withOpacity(0.7),
                ),
                textAlign: TextAlign.center,
              ),
            ],
            if (onRetry != null) ...[
              const SizedBox(height: AppDimensions.spacing6),
              AppButton(
                text: retryText ?? 'Try Again',
                variant: ButtonVariant.outline,
                onPressed: onRetry,
              ),
            ],
          ],
        ),
      ),
    );
  }
}
