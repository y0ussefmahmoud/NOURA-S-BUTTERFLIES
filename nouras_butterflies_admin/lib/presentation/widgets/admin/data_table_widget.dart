import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../common/widget_types.dart';
import '../common/material_icon.dart';
import '../common/loading_indicator.dart';
import '../common/empty_state.dart';
import 'virtual_data_table.dart';

/// Optimized data table widget with automatic virtual scrolling for large datasets
class DataTableWidget<T> extends HookWidget {
  final List<DataTableColumn<T>> columns;
  final List<T> data;
  final List<DataTableAction<T>>? actions;
  final String? emptyStateTitle;
  final String? emptyStateSubtitle;
  final String? emptyStateIcon;
  final bool loading;
  final Function(String key)? onSort;
  final String? sortColumn;
  final bool sortAscending;
  final int itemsPerPage;
  final Function(int page)? onLoadMore;
  final bool hasMore;
  final bool enableVirtualScrolling;

  const DataTableWidget({
    Key? key,
    required this.columns,
    required this.data,
    this.actions,
    this.emptyStateTitle,
    this.emptyStateSubtitle,
    this.emptyStateIcon,
    this.loading = false,
    this.onSort,
    this.sortColumn,
    this.sortAscending = true,
    this.itemsPerPage = 50,
    this.onLoadMore,
    this.hasMore = false,
    this.enableVirtualScrolling = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Use optimized data table with automatic virtual scrolling
    return OptimizedDataTableWidget<T>(
      columns: columns,
      data: data,
      actions: actions,
      emptyStateTitle: emptyStateTitle,
      emptyStateSubtitle: emptyStateSubtitle,
      emptyStateIcon: emptyStateIcon,
      loading: loading,
      onSort: onSort,
      sortColumn: sortColumn,
      sortAscending: sortAscending,
      itemsPerPage: itemsPerPage,
      onLoadMore: onLoadMore,
      hasMore: hasMore,
      enableVirtualScrolling: enableVirtualScrolling,
    );
  }
}
