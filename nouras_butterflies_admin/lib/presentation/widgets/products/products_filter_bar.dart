import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../widgets/common/app_card.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/app_text_field.dart';
import '../../widgets/common/widget_types.dart';

class ProductsFilterBar extends StatelessWidget {
  final String searchQuery;
  final String selectedCategory;
  final String selectedStatus;
  final List<String> categories;
  final Function(String) onSearchChanged;
  final Function(String) onCategoryChanged;
  final Function(String) onStatusChanged;
  final VoidCallback onBulkEdit;
  final VoidCallback onExport;
  final VoidCallback onClearFilters;

  const ProductsFilterBar({
    Key? key,
    required this.searchQuery,
    required this.selectedCategory,
    required this.selectedStatus,
    required this.categories,
    required this.onSearchChanged,
    required this.onCategoryChanged,
    required this.onStatusChanged,
    required this.onBulkEdit,
    required this.onExport,
    required this.onClearFilters,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: const EdgeInsets.all(AppDimensions.spacing5),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Search and Filters Row
          LayoutBuilder(
            builder: (context, constraints) {
              if (constraints.maxWidth < 768) {
                // Mobile layout
                return _buildMobileLayout();
              } else {
                // Desktop layout
                return _buildDesktopLayout();
              }
            },
          ),
          
          // Active filters display
          if (_hasActiveFilters) ...[
            const SizedBox(height: AppDimensions.spacing4),
            _buildActiveFilters(),
          ],
        ],
      ),
    );
  }

  Widget _buildDesktopLayout() {
    return Row(
      children: [
        // Search Field
        Expanded(
          flex: 2,
          child: AppTextField(
            hint: 'Search products by name or SKU...',
            prefixIcon: 'search',
            initialValue: searchQuery,
            onChanged: onSearchChanged,
          ),
        ),
        const SizedBox(width: AppDimensions.spacing4),
        
        // Category Dropdown
        SizedBox(
          width: 200,
          child: _buildCategoryDropdown(),
        ),
        const SizedBox(width: AppDimensions.spacing4),
        
        // Status Dropdown
        SizedBox(
          width: 180,
          child: _buildStatusDropdown(),
        ),
        const SizedBox(width: AppDimensions.spacing4),
        
        // Action Buttons
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AppButton(
              text: 'Bulk Edit',
              variant: ButtonVariant.outline,
              onPressed: onBulkEdit,
            ),
            const SizedBox(width: AppDimensions.spacing2),
            AppButton(
              text: 'Export',
              variant: ButtonVariant.outline,
              onPressed: onExport,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMobileLayout() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Search Field
        AppTextField(
          hint: 'Search products by name or SKU...',
          prefixIcon: 'search',
          initialValue: searchQuery,
          onChanged: onSearchChanged,
        ),
        const SizedBox(height: AppDimensions.spacing4),
        
        // Filter Dropdowns Row
        Row(
          children: [
            Expanded(child: _buildCategoryDropdown()),
            const SizedBox(width: AppDimensions.spacing3),
            Expanded(child: _buildStatusDropdown()),
          ],
        ),
        const SizedBox(height: AppDimensions.spacing4),
        
        // Action Buttons Row
        Row(
          children: [
            Expanded(
              child: AppButton(
                text: 'Bulk Edit',
                variant: ButtonVariant.outline,
                onPressed: onBulkEdit,
              ),
            ),
            const SizedBox(width: AppDimensions.spacing3),
            Expanded(
              child: AppButton(
                text: 'Export',
                variant: ButtonVariant.outline,
                onPressed: onExport,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildCategoryDropdown() {
    return DropdownButtonFormField<String>(
      value: selectedCategory == 'all' ? null : selectedCategory,
      decoration: InputDecoration(
        labelText: 'Category',
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.spacing4,
          vertical: AppDimensions.spacing3,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        labelStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textSoft,
        ),
      ),
      items: [
        const DropdownMenuItem<String>(
          value: null,
          child: Text('All Categories'),
        ),
        ...categories.map((category) {
          return DropdownMenuItem<String>(
            value: category,
            child: Text(
              category,
              style: AppTextStyles.bodyMedium,
            ),
          );
        }),
      ],
      onChanged: (value) {
        onCategoryChanged(value ?? 'all');
      },
    );
  }

  Widget _buildStatusDropdown() {
    return DropdownButtonFormField<String>(
      value: selectedStatus == 'all' ? null : selectedStatus,
      decoration: InputDecoration(
        labelText: 'Stock Status',
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppDimensions.spacing4,
          vertical: AppDimensions.spacing3,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        labelStyle: AppTextStyles.bodyMedium.copyWith(
          color: AppColors.textSoft,
        ),
      ),
      items: const [
        DropdownMenuItem<String>(
          value: null,
          child: Text('All Status'),
        ),
        DropdownMenuItem<String>(
          value: 'active',
          child: Text('Active'),
        ),
        DropdownMenuItem<String>(
          value: 'low',
          child: Text('Low Stock'),
        ),
        DropdownMenuItem<String>(
          value: 'out',
          child: Text('Out of Stock'),
        ),
      ],
      onChanged: (value) {
        onStatusChanged(value ?? 'all');
      },
    );
  }

  Widget _buildActiveFilters() {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spacing3),
      decoration: BoxDecoration(
        color: AppColors.accentPink.withOpacity(0.3),
        borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Row(
        children: [
          Icon(
            Icons.filter_list,
            size: AppDimensions.iconSm,
            color: AppColors.textSoft,
          ),
          const SizedBox(width: AppDimensions.spacing2),
          Text(
            'Active Filters:',
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textSoft,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(width: AppDimensions.spacing3),
          Expanded(
            child: Wrap(
              spacing: AppDimensions.spacing2,
              runSpacing: AppDimensions.spacing2,
              children: [
                if (searchQuery.isNotEmpty) _buildFilterChip('Search: $searchQuery'),
                if (selectedCategory != 'all' && selectedCategory.isNotEmpty) 
                  _buildFilterChip('Category: $selectedCategory'),
                if (selectedStatus != 'all' && selectedStatus.isNotEmpty) 
                  _buildFilterChip('Status: $selectedStatus'),
              ],
            ),
          ),
          AppButton(
            text: 'Clear All',
            variant: ButtonVariant.ghost,
            onPressed: onClearFilters,
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.spacing3,
        vertical: AppDimensions.spacing1,
      ),
      decoration: BoxDecoration(
        color: AppColors.primary.withOpacity(0.8),
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
      ),
      child: Text(
        label,
        style: AppTextStyles.bodySmall.copyWith(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  bool get _hasActiveFilters {
    return searchQuery.isNotEmpty ||
           (selectedCategory != 'all' && selectedCategory.isNotEmpty) ||
           (selectedStatus != 'all' && selectedStatus.isNotEmpty);
  }
}
