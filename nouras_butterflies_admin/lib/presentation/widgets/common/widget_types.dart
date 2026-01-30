import 'package:flutter/material.dart';

enum ButtonVariant { primary, outline, ghost }
enum ButtonSize { small, medium, large }
enum StatsFormat { currency, number, percentage }
enum ChangeType { increase, decrease }
enum ActionVariant { normal, danger }

class DataTableColumn<T> {
  final String label;
  final String key;
  final bool sortable;
  final double? width;
  final Widget Function(dynamic value, T row)? render;
  
  const DataTableColumn({
    required this.label,
    required this.key,
    this.sortable = false,
    this.width,
    this.render,
  });
}

class DataTableAction<T> {
  final String icon;
  final String label;
  final ActionVariant variant;
  final void Function(T row) onTap;
  
  const DataTableAction({
    required this.icon,
    required this.label,
    this.variant = ActionVariant.normal,
    required this.onTap,
  });
}
