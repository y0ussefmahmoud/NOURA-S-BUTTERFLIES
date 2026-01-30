import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import '../../core/constants/app_colors.dart';
import '../../core/constants/app_dimensions.dart';
import '../common/widget_types.dart';
import '../common/material_icon.dart';
import '../common/loading_indicator.dart';
import '../common/empty_state.dart';

/// Virtual scrolling data table for optimal performance with large datasets
class VirtualDataTable<T> extends StatefulWidget {
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
  final double rowHeight;
  final double headerHeight;
  final bool enableInfiniteScroll;
  final ScrollController? scrollController;

  const VirtualDataTable({
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
    this.rowHeight = 56.0,
    this.headerHeight = 48.0,
    this.enableInfiniteScroll = true,
    this.scrollController,
  }) : super(key: key);

  @override
  State<VirtualDataTable<T>> createState() => _VirtualDataTableState<T>();
}

class _VirtualDataTableState<T> extends State<VirtualDataTable<T>>
    with AutomaticKeepAliveClientMixin {
  late ScrollController _scrollController;
  final Set<String> _hoveredRows = <String>{};
  final Map<String, GlobalKey> _rowKeys = {};
  int _visibleStart = 0;
  int _visibleEnd = 0;
  bool _isLoadingMore = false;

  @override
  bool get wantKeepAlive => true;

  @override
  void initState() {
    super.initState();
    _scrollController = widget.scrollController ?? ScrollController();
    _scrollController.addListener(_onScroll);
    _calculateVisibleRange();
  }

  @override
  void dispose() {
    if (widget.scrollController == null) {
      _scrollController.dispose();
    } else {
      _scrollController.removeListener(_onScroll);
    }
    super.dispose();
  }

  @override
  void didUpdateWidget(VirtualDataTable<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.data.length != widget.data.length) {
      _calculateVisibleRange();
    }
  }

  void _onScroll() {
    _calculateVisibleRange();
    
    // Infinite scroll logic
    if (widget.enableInfiniteScroll && 
        widget.onLoadMore != null && 
        !_isLoadingMore &&
        widget.hasMore) {
      
      final maxScroll = _scrollController.position.maxScrollExtent;
      final currentScroll = _scrollController.position.pixels;
      final threshold = maxScroll * 0.8; // Load more when 80% scrolled
      
      if (currentScroll >= threshold) {
        _loadMore();
      }
    }
  }

  void _calculateVisibleRange() {
    if (!mounted) return;
    
    final viewportHeight = _scrollController.position.viewportDimension;
    final scrollOffset = _scrollController.position.pixels;
    
    final startIndex = (scrollOffset / widget.rowHeight).floor().clamp(0, widget.data.length);
    final endIndex = ((scrollOffset + viewportHeight) / widget.rowHeight).ceil().clamp(0, widget.data.length);
    
    // Add buffer for smooth scrolling
    final buffer = 10;
    final newStart = (startIndex - buffer).clamp(0, widget.data.length);
    final newEnd = (endIndex + buffer).clamp(0, widget.data.length);
    
    if (newStart != _visibleStart || newEnd != _visibleEnd) {
      setState(() {
        _visibleStart = newStart;
        _visibleEnd = newEnd;
      });
    }
  }

  Future<void> _loadMore() async {
    if (_isLoadingMore) return;
    
    setState(() {
      _isLoadingMore = true;
    });

    try {
      await widget.onLoadMore!((widget.data.length / widget.itemsPerPage).ceil() + 1);
    } finally {
      if (mounted) {
        setState(() {
          _isLoadingMore = false;
        });
      }
    }
  }

  void _onRowHover(String key, bool isHovering) {
    setState(() {
      if (isHovering) {
        _hoveredRows.add(key);
      } else {
        _hoveredRows.remove(key);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (widget.loading && widget.data.isEmpty) {
      return Container(
        padding: EdgeInsets.all(AppDimensions.spacing8),
        child: const Center(
          child: LoadingIndicator(size: LoadingSize.large),
        ),
      );
    }

    if (widget.data.isEmpty) {
      return EmptyState(
        icon: widget.emptyStateIcon ?? 'inbox',
        title: widget.emptyStateTitle ?? 'No data available',
        subtitle: widget.emptyStateSubtitle,
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Column(
        children: [
          // Fixed header
          _buildHeader(theme, isDark),
          // Virtual scrolling content
          Expanded(
            child: _buildVirtualContent(theme, isDark),
          ),
          // Loading more indicator
          if (_isLoadingMore)
            Container(
              padding: const EdgeInsets.all(AppDimensions.spacing4),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  ),
                  SizedBox(width: AppDimensions.spacing2),
                  Text('Loading more...'),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildHeader(ThemeData theme, bool isDark) {
    return Container(
      height: widget.headerHeight,
      padding: const EdgeInsets.all(AppDimensions.spacing4),
      decoration: BoxDecoration(
        color: AppColors.gray50,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppDimensions.radiusLg),
          topRight: Radius.circular(AppDimensions.radiusLg),
        ),
      ),
      child: Row(
        children: widget.columns.map((column) {
          return Expanded(
            flex: _calculateFlex(column),
            child: Container(
              width: column.width,
              padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spacing3),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      column.label,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  if (column.sortable) ...[
                    const SizedBox(width: 4),
                    InkWell(
                      onTap: column.sortable && widget.onSort != null
                          ? () => widget.onSort!(column.key)
                          : null,
                      borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                      child: MaterialIcon(
                        widget.sortColumn == column.key
                            ? (widget.sortAscending ? 'arrow_upward' : 'arrow_downward')
                            : 'swap_vert',
                        size: 16,
                        color: widget.sortColumn == column.key
                            ? AppColors.primary
                            : theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildVirtualContent(ThemeData theme, bool isDark) {
    final visibleItems = widget.data.sublist(_visibleStart, _visibleEnd);
    final visibleItemCount = _visibleEnd - _visibleStart;
    
    return ListView.builder(
      controller: _scrollController,
      itemCount: visibleItemCount + (widget.hasMore ? 1 : 0),
      itemExtent: widget.rowHeight,
      cacheExtent: widget.rowHeight * 20, // Cache 20 items for smooth scrolling
      itemBuilder: (context, index) {
        if (index >= visibleItemCount) {
          // Loading placeholder for infinite scroll
          return const Center(
            child: Padding(
              padding: EdgeInsets.all(AppDimensions.spacing2),
              child: CircularProgressIndicator(),
            ),
          );
        }

        final item = visibleItems[index];
        final actualIndex = _visibleStart + index;
        final rowKey = item.toString();
        final isHovered = _hoveredRows.contains(rowKey);
        final globalKey = _rowKeys.putIfAbsent(rowKey, () => GlobalKey());

        return RepaintBoundary(
          key: globalKey,
          child: MouseRegion(
            onEnter: (_) => _onRowHover(rowKey, true),
            onExit: (_) => _onRowHover(rowKey, false),
            child: Container(
              height: widget.rowHeight,
              padding: const EdgeInsets.all(AppDimensions.spacing4),
              decoration: BoxDecoration(
                color: isHovered ? AppColors.gray50.withOpacity(0.5) : Colors.transparent,
                border: Border(
                  top: BorderSide(
                    color: isDark ? AppColors.borderDark : AppColors.borderLight,
                    width: 0.5,
                  ),
                ),
              ),
              child: Row(
                children: [
                  ...widget.columns.map((column) {
                    final value = _getValue(item, column.key);
                    
                    return Expanded(
                      flex: _calculateFlex(column),
                      child: Container(
                        width: column.width,
                        padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spacing3),
                        child: column.render != null
                            ? column.render!(value, item)
                            : Text(
                                value?.toString() ?? '',
                                style: theme.textTheme.bodyMedium?.copyWith(
                                  color: theme.colorScheme.onSurface,
                                ),
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                              ),
                      ),
                    );
                  }).toList(),
                  if (widget.actions != null && widget.actions!.isNotEmpty) ...[
                    const SizedBox(width: AppDimensions.spacing3),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: widget.actions!.map((action) {
                        return Padding(
                          padding: const EdgeInsets.only(left: AppDimensions.spacing1),
                          child: Tooltip(
                            message: action.label,
                            child: InkWell(
                              onTap: () => action.onTap(item),
                              borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                              child: Container(
                                padding: const EdgeInsets.all(AppDimensions.spacing2),
                                decoration: BoxDecoration(
                                  color: action.variant == ActionVariant.danger
                                      ? AppColors.error.withOpacity(0.1)
                                      : theme.colorScheme.primary.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                                ),
                                child: MaterialIcon(
                                  action.icon,
                                  size: 16,
                                  color: action.variant == ActionVariant.danger
                                      ? AppColors.error
                                      : theme.colorScheme.primary,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  int _calculateFlex(DataTableColumn<T> column) {
    if (column.width != null) {
      return 0; // Fixed width columns don't use flex
    }
    
    // Default flex based on column type
    switch (column.key.toLowerCase()) {
      case 'id':
        return 1;
      case 'name':
      case 'title':
        return 3;
      case 'email':
      case 'price':
      case 'date':
        return 2;
      default:
        return 2;
    }
  }

  dynamic _getValue(T item, String key) {
    try {
      // Handle nested keys like 'user.name'
      final keys = key.split('.');
      dynamic value = item;
      
      for (final k in keys) {
        if (value is Map) {
          value = value[k];
        } else {
          // Try to convert object to Map if it has toJson() method
          try {
            final toJsonMethod = value.toJson;
            if (toJsonMethod is Function) {
              final mapValue = toJsonMethod();
              if (mapValue is Map) {
                value = mapValue[k];
              } else {
                return null;
              }
            } else {
              // Fallback: try to access property dynamically
              final instance = value as dynamic;
              value = instance[k];
            }
          } catch (e) {
            // If all methods fail, return null
            return null;
          }
        }
      }
      
      return value;
    } catch (e) {
      return null;
    }
  }
}

/// Optimized data table widget with lazy loading and performance improvements
class OptimizedDataTableWidget<T> extends HookWidget {
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

  const OptimizedDataTableWidget({
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
    final scrollController = useScrollController();
    
    // Use virtual scrolling for large datasets
    if (enableVirtualScrolling && data.length > 100) {
      return VirtualDataTable<T>(
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
        scrollController: scrollController,
      );
    }
    
    // Use regular optimized data table for smaller datasets
    return _OptimizedRegularDataTable<T>(
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
      scrollController: scrollController,
    );
  }
}

/// Regular data table with performance optimizations
class _OptimizedRegularDataTable<T> extends StatefulWidget {
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
  final ScrollController scrollController;

  const _OptimizedRegularDataTable({
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
    required this.scrollController,
  }) : super(key: key);

  @override
  State<_OptimizedRegularDataTable<T>> createState() => _OptimizedRegularDataTableState<T>();
}

class _OptimizedRegularDataTableState<T> extends State<_OptimizedRegularDataTable<T>>
    with AutomaticKeepAliveClientMixin {
  final Set<String> _hoveredRows = <String>{};

  @override
  bool get wantKeepAlive => true;

  void _onRowHover(String key, bool isHovering) {
    setState(() {
      if (isHovering) {
        _hoveredRows.add(key);
      } else {
        _hoveredRows.remove(key);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    if (widget.loading) {
      return Container(
        padding: EdgeInsets.all(AppDimensions.spacing8),
        child: const Center(
          child: LoadingIndicator(size: LoadingSize.large),
        ),
      );
    }

    if (widget.data.isEmpty) {
      return EmptyState(
        icon: widget.emptyStateIcon ?? 'inbox',
        title: widget.emptyStateTitle ?? 'No data available',
        subtitle: widget.emptyStateSubtitle,
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: isDark ? AppColors.surfaceDark : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        border: Border.all(
          color: isDark ? AppColors.borderDark : AppColors.borderLight,
        ),
      ),
      child: Column(
        children: [
          // Header
          _buildHeader(theme, isDark),
          // Data rows with ListView.separated for better performance
          Expanded(
            child: ListView.separated(
              controller: widget.scrollController,
              itemCount: widget.data.length,
              separatorBuilder: (context, index) => Divider(
                height: 0.5,
                color: isDark ? AppColors.borderDark : AppColors.borderLight,
              ),
              itemBuilder: (context, index) {
                final item = widget.data[index];
                final rowKey = item.toString();
                final isHovered = _hoveredRows.contains(rowKey);

                return RepaintBoundary(
                  child: MouseRegion(
                    onEnter: (_) => _onRowHover(rowKey, true),
                    onExit: (_) => _onRowHover(rowKey, false),
                    child: Container(
                      height: 56,
                      padding: const EdgeInsets.all(AppDimensions.spacing4),
                      decoration: BoxDecoration(
                        color: isHovered ? AppColors.gray50.withOpacity(0.5) : Colors.transparent,
                      ),
                      child: Row(
                        children: [
                          ...widget.columns.map((column) {
                            final value = _getValue(item, column.key);
                            
                            return Expanded(
                              flex: _calculateFlex(column),
                              child: Container(
                                width: column.width,
                                padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spacing3),
                                child: column.render != null
                                    ? column.render!(value, item)
                                    : Text(
                                        value?.toString() ?? '',
                                        style: theme.textTheme.bodyMedium?.copyWith(
                                          color: theme.colorScheme.onSurface,
                                        ),
                                        overflow: TextOverflow.ellipsis,
                                        maxLines: 1,
                                      ),
                              ),
                            );
                          }).toList(),
                          if (widget.actions != null && widget.actions!.isNotEmpty) ...[
                            const SizedBox(width: AppDimensions.spacing3),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: widget.actions!.map((action) {
                                return Padding(
                                  padding: const EdgeInsets.only(left: AppDimensions.spacing1),
                                  child: Tooltip(
                                    message: action.label,
                                    child: InkWell(
                                      onTap: () => action.onTap(item),
                                      borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                                      child: Container(
                                        padding: const EdgeInsets.all(AppDimensions.spacing2),
                                        decoration: BoxDecoration(
                                          color: action.variant == ActionVariant.danger
                                              ? AppColors.error.withOpacity(0.1)
                                              : theme.colorScheme.primary.withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                                        ),
                                        child: MaterialIcon(
                                          action.icon,
                                          size: 16,
                                          color: action.variant == ActionVariant.danger
                                              ? AppColors.error
                                              : theme.colorScheme.primary,
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(ThemeData theme, bool isDark) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spacing4),
      decoration: BoxDecoration(
        color: AppColors.gray50,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppDimensions.radiusLg),
          topRight: Radius.circular(AppDimensions.radiusLg),
        ),
      ),
      child: Row(
        children: widget.columns.map((column) {
          return Expanded(
            flex: _calculateFlex(column),
            child: Container(
              width: column.width,
              padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spacing3),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      column.label,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurface.withOpacity(0.7),
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  if (column.sortable) ...[
                    const SizedBox(width: 4),
                    InkWell(
                      onTap: column.sortable && widget.onSort != null
                          ? () => widget.onSort!(column.key)
                          : null,
                      borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                      child: MaterialIcon(
                        widget.sortColumn == column.key
                            ? (widget.sortAscending ? 'arrow_upward' : 'arrow_downward')
                            : 'swap_vert',
                        size: 16,
                        color: widget.sortColumn == column.key
                            ? AppColors.primary
                            : theme.colorScheme.onSurface.withOpacity(0.5),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  int _calculateFlex(DataTableColumn<T> column) {
    if (column.width != null) {
      return 0; // Fixed width columns don't use flex
    }
    
    // Default flex based on column type
    switch (column.key.toLowerCase()) {
      case 'id':
        return 1;
      case 'name':
      case 'title':
        return 3;
      case 'email':
      case 'price':
      case 'date':
        return 2;
      default:
        return 2;
    }
  }

  dynamic _getValue(T item, String key) {
    try {
      // Handle nested keys like 'user.name'
      final keys = key.split('.');
      dynamic value = item;
      
      for (final k in keys) {
        if (value is Map) {
          value = value[k];
        } else {
          // Try to convert object to Map if it has toJson() method
          try {
            final toJsonMethod = value.toJson;
            if (toJsonMethod is Function) {
              final mapValue = toJsonMethod();
              if (mapValue is Map) {
                value = mapValue[k];
              } else {
                return null;
              }
            } else {
              // Fallback: try to access property dynamically
              final instance = value as dynamic;
              value = instance[k];
            }
          } catch (e) {
            // If all methods fail, return null
            return null;
          }
        }
      }
      
      return value;
    } catch (e) {
      return null;
    }
  }
}
