import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class SettingsTextField extends StatelessWidget {
  final String label;
  final String? hint;
  final String? helperText;
  final TextEditingController? controller;
  final String? initialValue;
  final ValueChanged<String>? onChanged;
  final TextInputType? keyboardType;
  final bool obscureText;
  final int? maxLines;
  final bool required;
  final bool enabled;
  final Widget? prefixIcon;
  final Widget? suffixIcon;

  const SettingsTextField({
    super.key,
    required this.label,
    this.hint,
    this.helperText,
    this.controller,
    this.initialValue,
    this.onChanged,
    this.keyboardType,
    this.obscureText = false,
    this.maxLines = 1,
    this.required = false,
    this.enabled = true,
    this.prefixIcon,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label
        Row(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textDark,
              ),
            ),
            if (required) ...[
              const SizedBox(width: 4),
              Text(
                '*',
                style: TextStyle(
                  color: AppColors.error,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 8),
        // Text Field
        TextField(
          controller: controller,
          initialValue: controller == null ? initialValue : null,
          onChanged: onChanged,
          keyboardType: keyboardType,
          obscureText: obscureText,
          maxLines: maxLines,
          enabled: enabled,
          decoration: InputDecoration(
            hintText: hint,
            helperText: helperText,
            prefixIcon: prefixIcon,
            suffixIcon: suffixIcon,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.borderDark
                    : AppColors.borderLight,
              ),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: Theme.of(context).brightness == Brightness.dark
                    ? AppColors.borderDark
                    : AppColors.borderLight,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(color: AppColors.adminPrimary),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(
                color: AppColors.gray300,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 12,
            ),
            filled: true,
            fillColor: enabled
                ? (Theme.of(context).brightness == Brightness.dark
                    ? AppColors.surfaceDark
                    : AppColors.surfaceLight)
                : AppColors.gray100,
          ),
        ),
      ],
    );
  }
}
