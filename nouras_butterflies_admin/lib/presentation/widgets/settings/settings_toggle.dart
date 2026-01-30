import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class SettingsToggle extends StatelessWidget {
  final String label;
  final String? subtitle;
  final bool value;
  final ValueChanged<bool>? onChanged;
  final bool enabled;
  final Widget? icon;

  const SettingsToggle({
    super.key,
    required this.label,
    this.subtitle,
    required this.value,
    this.onChanged,
    this.enabled = true,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        if (icon != null) ...[
          icon!,
          const SizedBox(width: 12),
        ],
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: enabled ? AppColors.textDark : AppColors.textSoft,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle!,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSoft.withOpacity(0.7),
                  ),
                ),
              ],
            ],
          ),
        ),
        Switch(
          value: value,
          onChanged: enabled ? onChanged : null,
          activeColor: AppColors.adminPrimary,
          inactiveThumbColor: AppColors.gray400,
          activeTrackColor: AppColors.adminPrimary.withOpacity(0.3),
          inactiveTrackColor: AppColors.gray300,
        ),
      ],
    );
  }
}
