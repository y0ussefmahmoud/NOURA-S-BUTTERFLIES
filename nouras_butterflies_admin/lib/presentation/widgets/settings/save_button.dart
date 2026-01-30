import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../common/button.dart';

class SaveButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final ButtonVariant variant;

  const SaveButton({
    super.key,
    this.text = 'Save Changes',
    this.onPressed,
    this.isLoading = false,
    this.variant = ButtonVariant.primary,
  });

  @override
  Widget build(BuildContext context) {
    return Button(
      text: isLoading ? 'Saving...' : text,
      onPressed: isLoading ? null : onPressed,
      variant: variant,
    );
  }
}
