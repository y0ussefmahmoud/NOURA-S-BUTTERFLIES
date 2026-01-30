import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../widgets/common/app_card.dart';

class ProductsPagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final int totalItems;
  final int itemsPerPage;
  final Function(int) onPageChanged;

  const ProductsPagination({
    Key? key,
    required this.currentPage,
    required this.totalPages,
    required this.totalItems,
    required this.itemsPerPage,
    required this.onPageChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (totalPages <= 1) return const SizedBox.shrink();

    return AppCard(
      padding: const EdgeInsets.all(AppDimensions.spacing5),
      child: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth < 768) {
            return _buildMobilePagination();
          } else {
            return _buildDesktopPagination();
          }
        },
      ),
    );
  }

  Widget _buildDesktopPagination() {
    final startItem = (currentPage - 1) * itemsPerPage + 1;
    final endItem = currentPage * itemsPerPage > totalItems 
        ? totalItems 
        : currentPage * itemsPerPage;

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        // Items info
        Text(
          'Showing $startItem-$endItem of $totalItems products',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSoft,
          ),
        ),
        
        // Pagination controls
        Row(
          children: [
            // Previous button
            _buildPageButton(
              icon: Icons.chevron_left,
              onPressed: currentPage > 1 
                  ? () => onPageChanged(currentPage - 1)
                  : null,
              tooltip: 'Previous',
            ),
            
            const SizedBox(width: AppDimensions.spacing2),
            
            // Page numbers
            _buildPageNumbers(),
            
            const SizedBox(width: AppDimensions.spacing2),
            
            // Next button
            _buildPageButton(
              icon: Icons.chevron_right,
              onPressed: currentPage < totalPages 
                  ? () => onPageChanged(currentPage + 1)
                  : null,
              tooltip: 'Next',
            ),
          ],
        ),
        
        // Items per page selector
        _buildItemsPerPageSelector(),
      ],
    );
  }

  Widget _buildMobilePagination() {
    final startItem = (currentPage - 1) * itemsPerPage + 1;
    final endItem = currentPage * itemsPerPage > totalItems 
        ? totalItems 
        : currentPage * itemsPerPage;

    return Column(
      children: [
        // Items info
        Text(
          'Showing $startItem-$endItem of $totalItems products',
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSoft,
          ),
          textAlign: TextAlign.center,
        ),
        
        const SizedBox(height: AppDimensions.spacing4),
        
        // Pagination controls
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Previous button
            _buildPageButton(
              icon: Icons.chevron_left,
              onPressed: currentPage > 1 
                  ? () => onPageChanged(currentPage - 1)
                  : null,
              tooltip: 'Previous',
            ),
            
            const SizedBox(width: AppDimensions.spacing3),
            
            // Current page info
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppDimensions.spacing4,
                vertical: AppDimensions.spacing2,
              ),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              ),
              child: Text(
                '$currentPage / $totalPages',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            
            const SizedBox(width: AppDimensions.spacing3),
            
            // Next button
            _buildPageButton(
              icon: Icons.chevron_right,
              onPressed: currentPage < totalPages 
                  ? () => onPageChanged(currentPage + 1)
                  : null,
              tooltip: 'Next',
            ),
          ],
        ),
        
        const SizedBox(height: AppDimensions.spacing4),
        
        // Items per page selector
        _buildItemsPerPageSelector(isMobile: true),
      ],
    );
  }

  Widget _buildPageNumbers() {
    final List<int> visiblePages = _getVisiblePages();
    
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        // First page
        if (visiblePages.first > 1) ...[
          _buildPageNumber(1),
          if (visiblePages.first > 2) ...[
            const SizedBox(width: AppDimensions.spacing1),
            Text(
              '...',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSoft,
              ),
            ),
            const SizedBox(width: AppDimensions.spacing1),
          ],
        ],
        
        // Visible pages
        ...visiblePages.map((page) => _buildPageNumber(page)),
        
        // Last page
        if (visiblePages.last < totalPages) ...[
          if (visiblePages.last < totalPages - 1) ...[
            const SizedBox(width: AppDimensions.spacing1),
            Text(
              '...',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSoft,
              ),
            ),
            const SizedBox(width: AppDimensions.spacing1),
          ],
          _buildPageNumber(totalPages),
        ],
      ],
    );
  }

  Widget _buildPageNumber(int page) {
    final isActive = page == currentPage;
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: Tooltip(
        message: 'Page $page',
        child: InkWell(
          onTap: () => onPageChanged(page),
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          child: Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: isActive 
                  ? AppColors.primary 
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              border: Border.all(
                color: isActive 
                    ? AppColors.primary 
                    : AppColors.borderLight,
                width: 1,
              ),
            ),
            child: Center(
              child: Text(
                page.toString(),
                style: AppTextStyles.bodyMedium.copyWith(
                  color: isActive 
                      ? Colors.white 
                      : AppColors.textDark,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPageButton({
    required IconData icon,
    required VoidCallback? onPressed,
    required String tooltip,
  }) {
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onPressed,
        borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
        child: Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: onPressed != null 
                ? AppColors.primary.withOpacity(0.1)
                : Colors.transparent,
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
            border: Border.all(
              color: onPressed != null 
                  ? AppColors.primary 
                  : AppColors.borderLight,
              width: 1,
            ),
          ),
          child: Icon(
            icon,
            size: AppDimensions.iconMd,
            color: onPressed != null 
                ? AppColors.primary 
                : AppColors.textSoft,
          ),
        ),
      ),
    );
  }

  Widget _buildItemsPerPageSelector({bool isMobile = false}) {
    return Row(
      mainAxisSize: isMobile ? MainAxisSize.max : MainAxisSize.min,
      children: [
        if (!isMobile) ...[
          Text(
            'Items per page:',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSoft,
            ),
          ),
          const SizedBox(width: AppDimensions.spacing3),
        ],
        
        Container(
          padding: const EdgeInsets.symmetric(horizontal: AppDimensions.spacing2),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.borderLight),
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<int>(
              value: itemsPerPage,
              isDense: true,
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textDark,
              ),
              items: [10, 25, 50, 100].map((count) {
                return DropdownMenuItem<int>(
                  value: count,
                  child: Text(
                    count.toString(),
                    style: AppTextStyles.bodyMedium,
                  ),
                );
              }).toList(),
              onChanged: (value) {
                if (value != null) {
                  // Navigate to page 1 when changing items per page
                  onPageChanged(1);
                  // Note: You'll need to handle the items per page change in the parent widget
                }
              },
            ),
          ),
        ),
      ],
    );
  }

  List<int> _getVisiblePages() {
    final List<int> visiblePages = [];
    final int maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (int i = 1; i <= totalPages; i++) {
        visiblePages.add(i);
      }
    } else {
      // Show pages around current page
      final int start = (currentPage - 2).clamp(1, totalPages - maxVisible + 1);
      final int end = start + maxVisible - 1;
      
      for (int i = start; i <= end; i++) {
        visiblePages.add(i);
      }
    }
    
    return visiblePages;
  }
}
