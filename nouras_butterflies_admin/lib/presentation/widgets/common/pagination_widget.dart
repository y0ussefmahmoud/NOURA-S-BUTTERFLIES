import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';

class PaginationWidget extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final int pageSize;
  final int totalItems;
  final Function(int) onPageChanged;
  final Function(int)? onPageSizeChanged;

  const PaginationWidget({
    super.key,
    required this.currentPage,
    required this.totalPages,
    required this.pageSize,
    required this.totalItems,
    required this.onPageChanged,
    this.onPageSizeChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).brightness == Brightness.dark
            ? AppColors.surfaceDark
            : AppColors.surfaceLight,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: Theme.of(context).brightness == Brightness.dark
              ? AppColors.borderDark
              : AppColors.borderLight,
        ),
      ),
      child: Row(
        children: [
          // Page Size Selector
          if (onPageSizeChanged != null) ...[
            Text(
              'Items per page:',
              style: TextStyle(
                color: AppColors.textSoft,
                fontSize: 14,
              ),
            ),
            const SizedBox(width: 8),
            DropdownButton<int>(
              value: pageSize,
              items: [10, 20, 50, 100].map((size) {
                return DropdownMenuItem(
                  value: size,
                  child: Text('$size'),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) {
                  onPageSizeChanged!(value);
                }
              },
            ),
            const SizedBox(width: 24),
          ],
          // Page Info
          Text(
            'Showing ${_getStartIndex()}-${_getEndIndex()} of $totalItems items',
            style: TextStyle(
              color: AppColors.textSoft,
              fontSize: 14,
            ),
          ),
          const Spacer(),
          // Page Navigation
          Row(
            children: [
              // Previous Button
              IconButton(
                onPressed: currentPage > 1
                    ? () => onPageChanged(currentPage - 1)
                    : null,
                icon: const Icon(Icons.chevron_left),
                tooltip: 'Previous',
              ),
              // Page Numbers
              ..._buildPageNumbers(),
              // Next Button
              IconButton(
                onPressed: currentPage < totalPages
                    ? () => onPageChanged(currentPage + 1)
                    : null,
                icon: const Icon(Icons.chevron_right),
                tooltip: 'Next',
              ),
            ],
          ),
        ],
      ),
    );
  }

  List<Widget> _buildPageNumbers() {
    final List<Widget> pageNumbers = [];
    final int startPage = _getStartPage();
    final int endPage = _getEndPage();

    for (int i = startPage; i <= endPage; i++) {
      if (i == currentPage) {
        pageNumbers.add(
          Container(
            width: 32,
            height: 32,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: AppColors.adminPrimary,
              borderRadius: BorderRadius.circular(6),
            ),
            child: Center(
              child: Text(
                '$i',
                style: const TextStyle(
                  color: AppColors.surfaceLight,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        );
      } else {
        pageNumbers.add(
          InkWell(
            onTap: () => onPageChanged(i),
            borderRadius: BorderRadius.circular(6),
            child: Container(
              width: 32,
              height: 32,
              margin: const EdgeInsets.symmetric(horizontal: 2),
              child: Center(
                child: Text(
                  '$i',
                  style: TextStyle(
                    color: AppColors.textDark,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ),
        );
      }
    }

    return pageNumbers;
  }

  int _getStartIndex() {
    return ((currentPage - 1) * pageSize) + 1;
  }

  int _getEndIndex() {
    return (currentPage * pageSize).clamp(0, totalItems);
  }

  int _getStartPage() {
    if (totalPages <= 7) {
      return 1;
    }
    
    if (currentPage <= 4) {
      return 1;
    }
    
    if (currentPage >= totalPages - 3) {
      return totalPages - 6;
    }
    
    return currentPage - 3;
  }

  int _getEndPage() {
    if (totalPages <= 7) {
      return totalPages;
    }
    
    if (currentPage <= 4) {
      return 7;
    }
    
    if (currentPage >= totalPages - 3) {
      return totalPages;
    }
    
    return currentPage + 3;
  }
}
