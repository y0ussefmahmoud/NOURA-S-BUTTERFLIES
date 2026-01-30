import 'package:flutter/material.dart';
import '../../core/constants/app_colors.dart';

enum LoadingSize { small, medium, large }

class LoadingIndicator extends StatelessWidget {
  final LoadingSize size;
  final String? message;
  final Color? color;

  const LoadingIndicator({
    Key? key,
    this.size = LoadingSize.medium,
    this.message,
    this.color,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final indicatorColor = color ?? AppColors.primary;
    
    double getIndicatorSize() {
      switch (size) {
        case LoadingSize.small:
          return 16;
        case LoadingSize.medium:
          return 24;
        case LoadingSize.large:
          return 32;
      }
    }

    double getFontSize() {
      switch (size) {
        case LoadingSize.small:
          return 12;
        case LoadingSize.medium:
          return 14;
        case LoadingSize.large:
          return 16;
      }
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: getIndicatorSize(),
          height: getIndicatorSize(),
          child: CircularProgressIndicator(
            strokeWidth: 2,
            valueColor: AlwaysStoppedAnimation<Color>(indicatorColor),
          ),
        ),
        if (message != null) ...[
          const SizedBox(height: 8),
          Text(
            message!,
            style: TextStyle(
              fontSize: getFontSize(),
              color: theme.colorScheme.onSurface.withOpacity(0.7),
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ],
    );
  }
}
