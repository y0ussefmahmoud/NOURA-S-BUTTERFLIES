import 'package:flutter/material.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../data/models/admin_product.dart';
import '../../widgets/common/app_card.dart';

class ProductsDataTable extends StatelessWidget {
  final List<AdminProduct> products;
  final Function(AdminProduct) onEdit;
  final Function(AdminProduct) onDuplicate;
  final Function(AdminProduct) onDelete;
  final Function(AdminProduct) onRowTap;
  final String sortBy;
  final bool ascending;
  final Function(String) onSort;

  const ProductsDataTable({
    Key? key,
    required this.products,
    required this.onEdit,
    required this.onDuplicate,
    required this.onDelete,
    required this.onRowTap,
    this.sortBy = 'name',
    this.ascending = true,
    required this.onSort,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: EdgeInsets.zero,
      child: Column(
        children: [
          // Table Header
          Container(
            padding: const EdgeInsets.all(AppDimensions.spacing5),
            decoration: BoxDecoration(
              color: AppColors.backgroundLight.withOpacity(0.5),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(AppDimensions.radiusLg),
                topRight: Radius.circular(AppDimensions.radiusLg),
              ),
            ),
            child: Row(
              children: [
                Text(
                  'Products (${products.length})',
                  style: AppTextStyles.titleMedium.copyWith(
                    color: AppColors.textDark,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const Spacer(),
                if (products.isNotEmpty) ...[
                  Text(
                    'Showing ${products.length} items',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                ],
              ],
            ),
          ),
          
          // Table Content
          if (products.isEmpty)
            _buildEmptyState()
          else
            _buildTable(),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spacing12),
      child: Column(
        children: [
          Icon(
            Icons.inventory_2_outlined,
            size: AppDimensions.iconXl * 2,
            color: AppColors.textSoft.withOpacity(0.5),
          ),
          const SizedBox(height: AppDimensions.spacing4),
          Text(
            'No products found',
            style: AppTextStyles.titleMedium.copyWith(
              color: AppColors.textSoft,
            ),
          ),
          const SizedBox(height: AppDimensions.spacing2),
          Text(
            'Try adjusting your filters or search criteria',
            style: AppTextStyles.bodyMedium.copyWith(
              color: AppColors.textSoft,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTable() {
    return Column(
      children: [
        // Desktop Table
        _buildDesktopTable(),
        
        // Mobile Cards (shown on small screens)
        _buildMobileCards(),
      ],
    );
  }

  Widget _buildDesktopTable() {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Only show table on larger screens
        if (constraints.maxWidth < 768) {
          return const SizedBox.shrink();
        }

        return SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            columnSpacing: AppDimensions.spacing4,
            horizontalMargin: AppDimensions.spacing5,
            headingRowColor: MaterialStateProperty.all(
              AppColors.backgroundLight.withOpacity(0.3),
            ),
            dataRowColor: MaterialStateProperty.all(Colors.transparent),
            columns: [
              DataColumn(
                label: Text('Image', style: _headerTextStyle),
              ),
              DataColumn(
                label: GestureDetector(
                  onTap: () => onSort('name'),
                  child: Row(
                    children: [
                      Text('Product Name', style: _headerTextStyle),
                      if (sortBy == 'name') ...[
                        const SizedBox(width: AppDimensions.spacing1),
                        Icon(
                          ascending ? Icons.arrow_upward : Icons.arrow_downward,
                          size: AppDimensions.iconXs,
                          color: AppColors.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              DataColumn(
                label: GestureDetector(
                  onTap: () => onSort('category'),
                  child: Row(
                    children: [
                      Text('Category', style: _headerTextStyle),
                      if (sortBy == 'category') ...[
                        const SizedBox(width: AppDimensions.spacing1),
                        Icon(
                          ascending ? Icons.arrow_upward : Icons.arrow_downward,
                          size: AppDimensions.iconXs,
                          color: AppColors.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              DataColumn(
                label: GestureDetector(
                  onTap: () => onSort('price'),
                  child: Row(
                    children: [
                      Text('Price', style: _headerTextStyle),
                      if (sortBy == 'price') ...[
                        const SizedBox(width: AppDimensions.spacing1),
                        Icon(
                          ascending ? Icons.arrow_upward : Icons.arrow_downward,
                          size: AppDimensions.iconXs,
                          color: AppColors.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              DataColumn(
                label: GestureDetector(
                  onTap: () => onSort('stock'),
                  child: Row(
                    children: [
                      Text('Stock', style: _headerTextStyle),
                      if (sortBy == 'stock') ...[
                        const SizedBox(width: AppDimensions.spacing1),
                        Icon(
                          ascending ? Icons.arrow_upward : Icons.arrow_downward,
                          size: AppDimensions.iconXs,
                          color: AppColors.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              DataColumn(
                label: GestureDetector(
                  onTap: () => onSort('date'),
                  child: Row(
                    children: [
                      Text('Last Modified', style: _headerTextStyle),
                      if (sortBy == 'date') ...[
                        const SizedBox(width: AppDimensions.spacing1),
                        Icon(
                          ascending ? Icons.arrow_upward : Icons.arrow_downward,
                          size: AppDimensions.iconXs,
                          color: AppColors.primary,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              DataColumn(
                label: Text('Status', style: _headerTextStyle),
              ),
              DataColumn(
                label: Text('Actions', style: _headerTextStyle),
              ),
            ],
            rows: products.map((product) => _buildDataRow(product)).toList(),
          ),
        );
      },
    );
  }

  DataRow _buildDataRow(AdminProduct product) {
    return DataRow(
      onSelectChanged: (_) => onRowTap(product),
      cells: [
        // Image
        DataCell(
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              color: AppColors.gray100,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
              child: product.images.isNotEmpty
                  ? Image.network(
                      product.images.first,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.image,
                          color: AppColors.textSoft,
                          size: AppDimensions.iconMd,
                        );
                      },
                    )
                  : Icon(
                      Icons.image,
                      color: AppColors.textSoft,
                      size: AppDimensions.iconMd,
                    ),
            ),
          ),
        ),
        
        // Name & SKU
        DataCell(
          SizedBox(
            width: 200,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  product.name,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                    color: AppColors.textDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppDimensions.spacing1),
                Text(
                  product.nameAr,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSoft,
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: AppDimensions.spacing1),
                Text(
                  'SKU: ${product.sku}',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSoft,
                  ),
                ),
              ],
            ),
          ),
        ),
        
        // Category
        DataCell(
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: AppDimensions.spacing2,
              vertical: AppDimensions.spacing1,
            ),
            decoration: BoxDecoration(
              color: AppColors.accentPink.withOpacity(0.3),
              borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
            ),
            child: Text(
              product.category,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textDark,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ),
        
        // Price
        DataCell(
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '\$${product.price.toStringAsFixed(2)}',
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textDark,
                ),
              ),
              if (product.cost > 0)
                Text(
                  'Cost: \$${product.cost.toStringAsFixed(2)}',
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSoft,
                  ),
                ),
            ],
          ),
        ),
        
        // Stock
        DataCell(
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                product.inventory.quantity.toString(),
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w600,
                  color: _getStockColor(product.inventory),
                ),
              ),
              Text(
                'Threshold: ${product.inventory.lowStockThreshold}',
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
        ),
        
        // Last Modified
        DataCell(
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                _formatDate(product.lastModified),
                style: AppTextStyles.bodyMedium.copyWith(
                  fontWeight: FontWeight.w500,
                  color: AppColors.textDark,
                ),
              ),
              Text(
                _formatTime(product.lastModified),
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSoft,
                ),
              ),
            ],
          ),
        ),
        
        // Status Badge
        DataCell(_buildStatusBadge(product.inventory)),
        
        // Actions
        DataCell(
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildActionButton(
                icon: Icons.edit,
                tooltip: 'Edit',
                color: AppColors.info,
                onPressed: () => onEdit(product),
              ),
              _buildActionButton(
                icon: Icons.content_copy,
                tooltip: 'Duplicate',
                color: AppColors.adminGold,
                onPressed: () => onDuplicate(product),
              ),
              _buildActionButton(
                icon: Icons.delete,
                tooltip: 'Delete',
                color: AppColors.error,
                onPressed: () => onDelete(product),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String tooltip,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Tooltip(
      message: tooltip,
      child: IconButton(
        icon: Icon(icon, size: AppDimensions.iconSm),
        onPressed: onPressed,
        splashRadius: AppDimensions.iconLg,
        style: IconButton.styleFrom(
          foregroundColor: color,
          backgroundColor: color.withOpacity(0.1),
        ),
      ),
    );
  }

  Widget _buildStatusBadge(ProductInventory inventory) {
    String status;
    Color color;
    
    if (inventory.quantity == 0) {
      status = 'Out of Stock';
      color = AppColors.error;
    } else if (inventory.quantity <= inventory.lowStockThreshold) {
      status = 'Low Stock';
      color = AppColors.warning;
    } else {
      status = 'Active';
      color = AppColors.success;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppDimensions.spacing3,
        vertical: AppDimensions.spacing1,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppDimensions.radiusFull),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        status,
        style: AppTextStyles.bodySmall.copyWith(
          fontWeight: FontWeight.w600,
          color: color,
        ),
      ),
    );
  }

  Widget _buildMobileCards() {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Only show cards on mobile screens
        if (constraints.maxWidth >= 768) {
          return const SizedBox.shrink();
        }

        return Padding(
          padding: const EdgeInsets.all(AppDimensions.spacing5),
          child: Column(
            children: products.map((product) => _buildMobileCard(product)).toList(),
          ),
        );
      },
    );
  }

  Widget _buildMobileCard(AdminProduct product) {
    return AppCard(
      margin: const EdgeInsets.only(bottom: AppDimensions.spacing4),
      padding: const EdgeInsets.all(AppDimensions.spacing4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              // Product Image
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
                  color: AppColors.gray100,
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
                  child: product.images.isNotEmpty
                      ? Image.network(
                          product.images.first,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Icon(
                              Icons.image,
                              color: AppColors.textSoft,
                              size: AppDimensions.iconMd,
                            );
                          },
                        )
                      : Icon(
                          Icons.image,
                          color: AppColors.textSoft,
                          size: AppDimensions.iconMd,
                        ),
                ),
              ),
              const SizedBox(width: AppDimensions.spacing4),
              
              // Product Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product.name,
                      style: AppTextStyles.titleSmall.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      product.nameAr,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSoft,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    Text(
                      'SKU: ${product.sku}',
                      style: AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSoft,
                      ),
                    ),
                    const SizedBox(height: AppDimensions.spacing2),
                    _buildStatusBadge(product.inventory),
                  ],
                ),
              ),
            ],
          ),
          
          const SizedBox(height: AppDimensions.spacing4),
          
          // Details Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Price',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                  Text(
                    '\$${product.price.toStringAsFixed(2)}',
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Stock',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                  Text(
                    '${product.inventory.quantity} units',
                    style: AppTextStyles.bodyMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: _getStockColor(product.inventory),
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Category',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                  Text(
                    product.category,
                    style: AppTextStyles.bodySmall.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Last Modified',
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                  Text(
                    _formatDate(product.lastModified),
                    style: AppTextStyles.bodySmall.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ],
          ),
          
          const SizedBox(height: AppDimensions.spacing4),
          
          // Actions
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(
                onPressed: () => onEdit(product),
                child: Text('Edit'),
              ),
              TextButton(
                onPressed: () => onDuplicate(product),
                child: Text('Duplicate'),
              ),
              TextButton(
                onPressed: () => onDelete(product),
                style: TextButton.styleFrom(foregroundColor: AppColors.error),
                child: Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  TextStyle get _headerTextStyle {
    return AppTextStyles.bodySmall.copyWith(
      fontWeight: FontWeight.w600,
      color: AppColors.textDark,
    );
  }

  Color _getStockColor(ProductInventory inventory) {
    if (inventory.quantity == 0) return AppColors.error;
    if (inventory.quantity <= inventory.lowStockThreshold) return AppColors.warning;
    return AppColors.success;
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == 1) {
      return 'Yesterday';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${date.day}/${date.month}/${date.year}';
    }
  }

  String _formatTime(DateTime date) {
    return '${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}';
  }
}
