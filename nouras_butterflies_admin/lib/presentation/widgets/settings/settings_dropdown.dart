import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class SettingsDropdown<T> extends StatelessWidget {
  final String label;
  final String? hint;
  final T? value;
  final List<DropdownMenuItem<T>> items;
  final ValueChanged<T?>? onChanged;
  final bool required;
  final bool enabled;
  final Widget? prefixIcon;

  const SettingsDropdown({
    super.key,
    required this.label,
    this.hint,
    this.value,
    required this.items,
    this.onChanged,
    this.required = false,
    this.enabled = true,
    this.prefixIcon,
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
        // Dropdown
        DropdownButtonFormField<T>(
          value: value,
          hint: hint != null ? Text(hint!) : null,
          items: items,
          onChanged: enabled ? onChanged : null,
          decoration: InputDecoration(
            prefixIcon: prefixIcon,
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
