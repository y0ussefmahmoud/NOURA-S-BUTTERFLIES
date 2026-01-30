import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/routes/app_routes.dart';
import '../../../data/models/admin_product.dart';
import '../../../data/repositories/admin_product_repository.dart';
import '../../bloc/products/products_bloc.dart';
import '../../bloc/products/products_event.dart';
import '../../bloc/products/products_state.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/common/widget_types.dart';
import '../products/product_stats_cards.dart';
import '../products/products_filter_bar.dart';
import '../products/products_data_table.dart';
import '../products/products_pagination.dart';

class ProductsScreen extends StatelessWidget {
  const ProductsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ProductsBloc(
        AdminProductRepositoryImpl(useMockData: true),
      )..add(LoadProducts()),
      child: const ProductsView(),
    );
  }
}

class ProductsView extends StatelessWidget {
  const ProductsView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AdminLayout(
      currentRoute: '/products',
      child: BlocBuilder<ProductsBloc, ProductsState>(
        builder: (context, state) {
          if (state is ProductsLoading) {
            return const Center(
              child: CircularProgressIndicator(
                color: AppColors.primary,
              ),
            );
          }
          
          if (state is ProductsError) {
            return AppErrorWidget(
              title: 'Error Loading Products',
              subtitle: state.message,
              onRetry: () {
                context.read<ProductsBloc>().add(LoadProducts());
              },
              retryText: 'Try Again',
            );
          }
          
          if (state is ProductsLoaded) {
            return _buildProductsContent(context, state);
          }
          
          if (state is ProductOperationInProgress) {
            return Stack(
              children: [
                if (state.baseState is ProductsLoaded)
                  _buildProductsContent(context, state.baseState as ProductsLoaded),
                Container(
                  color: Colors.black.withOpacity(0.3),
                  child: Center(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(AppDimensions.spacing6),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CircularProgressIndicator(
                              color: AppColors.primary,
                            ),
                            const SizedBox(height: AppDimensions.spacing4),
                            Text(
                              state.operation,
                              style: AppTextStyles.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          }
          
          return const SizedBox.shrink();
        },
      ),
    );
  }

  Widget _buildProductsContent(BuildContext context, ProductsLoaded state) {
    return Scaffold(
      floatingActionButton: _buildFloatingActionButton(context),
      body: RefreshIndicator(
        onRefresh: () async {
          context.read<ProductsBloc>().add(RefreshProducts());
        },
        color: AppColors.primary,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(AppDimensions.spacing6),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Page Header
              _buildPageHeader(context),
              const SizedBox(height: AppDimensions.spacing8),
              
              // Stats Cards
              ProductStatsCards(
                total: state.totalProducts,
                active: state.activeProducts,
                lowStock: state.lowStockProducts,
                outOfStock: state.outOfStockProducts,
              ),
              const SizedBox(height: AppDimensions.spacing6),
              
              // Filter Bar
              ProductsFilterBar(
                searchQuery: state.searchQuery ?? '',
                selectedCategory: state.selectedCategory ?? 'all',
                selectedStatus: state.selectedStatus ?? 'all',
                categories: ['all', ...state.categories],
                onSearchChanged: (query) {
                  context.read<ProductsBloc>().add(SearchProducts(query));
                },
                onCategoryChanged: (category) {
                  context.read<ProductsBloc>().add(
                    FilterProducts(category: category),
                  );
                },
                onStatusChanged: (status) {
                  context.read<ProductsBloc>().add(
                    FilterProducts(status: status),
                  );
                },
                onBulkEdit: () {
                  _showBulkEditDialog(context);
                },
                onExport: () {
                  context.read<ProductsBloc>().add(
                    ExportProducts([]),
                  );
                },
                onClearFilters: () {
                  context.read<ProductsBloc>().add(ClearFilters());
                },
              ),
              const SizedBox(height: AppDimensions.spacing6),
              
              // Products Table
              ProductsDataTable(
                products: state.paginatedProducts,
                sortBy: state.sortBy,
                ascending: state.ascending,
                onSort: (sortBy) {
                  final currentAscending = state.sortBy == sortBy ? !state.ascending : true;
                  context.read<ProductsBloc>().add(
                    SortProducts(sortBy, currentAscending),
                  );
                },
                onEdit: (product) {
                  _navigateToEditProduct(context, product);
                },
                onDuplicate: (product) {
                  _showDuplicateConfirmation(context, product);
                },
                onDelete: (product) {
                  _showDeleteConfirmation(context, product);
                },
                onRowTap: (product) {
                  _navigateToProductDetails(context, product);
                },
              ),
              const SizedBox(height: AppDimensions.spacing6),
              
              // Pagination
              ProductsPagination(
                currentPage: state.currentPage,
                totalPages: state.totalPages,
                totalItems: state.filteredProducts.length,
                itemsPerPage: state.itemsPerPage,
                onPageChanged: (page) {
                  context.read<ProductsBloc>().add(ChangePage(page));
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPageHeader(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 768;
        
        if (isMobile) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Product Management',
                style: AppTextStyles.headlineLarge.copyWith(
                  color: AppColors.textDark,
                ),
              ),
              const SizedBox(height: AppDimensions.spacing2),
              Text(
                'Manage your product catalog, inventory, and pricing',
                style: AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSoft,
                ),
              ),
              const SizedBox(height: AppDimensions.spacing4),
              SizedBox(
                width: double.infinity,
                child: AppButton(
                  text: 'Add New Product',
                  icon: 'add',
                  onPressed: () {
                    _navigateToNewProduct(context);
                  },
                ),
              ),
            ],
          );
        } else {
          return Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Product Management',
                    style: AppTextStyles.headlineLarge.copyWith(
                      color: AppColors.textDark,
                    ),
                  ),
                  const SizedBox(height: AppDimensions.spacing2),
                  Text(
                    'Manage your product catalog, inventory, and pricing',
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: AppColors.textSoft,
                    ),
                  ),
                ],
              ),
              AppButton(
                text: 'Add New Product',
                icon: 'add',
                onPressed: () {
                  _navigateToNewProduct(context);
                },
              ),
            ],
          );
        }
      },
    );
  }

  Widget? _buildFloatingActionButton(BuildContext context) {
    return MediaQuery.of(context).size.width < 768
        ? FloatingActionButton(
            onPressed: () {
              _navigateToNewProduct(context);
            },
            backgroundColor: AppColors.primary,
            child: const Icon(
              Icons.add,
              color: Colors.white,
            ),
          )
        : null;
  }

  void _navigateToNewProduct(BuildContext context) {
    Navigator.pushNamed(context, AppRoutes.productAdd);
  }

  void _navigateToEditProduct(BuildContext context, AdminProduct product) {
    Navigator.pushNamed(
      context, 
      AppRoutes.productEdit,
      arguments: product.id,
    );
  }

  void _navigateToProductDetails(BuildContext context, AdminProduct product) {
    // TODO: Navigate to product details screen
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('View product details: ${product.name}'),
        backgroundColor: AppColors.info,
      ),
    );
  }

  void _showDeleteConfirmation(BuildContext context, AdminProduct product) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(
          'Delete Product',
          style: AppTextStyles.titleMedium,
        ),
        content: Text(
          'Are you sure you want to delete "${product.name}"? This action cannot be undone.',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'Cancel',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSoft,
              ),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<ProductsBloc>().add(DeleteProduct(product.id));
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Product deleted successfully'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
            child: Text(
              'Delete',
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDuplicateConfirmation(BuildContext context, AdminProduct product) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(
          'Duplicate Product',
          style: AppTextStyles.titleMedium,
        ),
        content: Text(
          'Create a duplicate of "${product.name}"?',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'Cancel',
              style: AppTextStyles.bodyMedium.copyWith(
                color: AppColors.textSoft,
              ),
            ),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(dialogContext);
              context.read<ProductsBloc>().add(DuplicateProduct(product.id));
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Product duplicated successfully'),
                  backgroundColor: AppColors.success,
                ),
              );
            },
            style: TextButton.styleFrom(
              foregroundColor: AppColors.adminGold,
            ),
            child: Text(
              'Duplicate',
              style: AppTextStyles.bodyMedium.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showBulkEditDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(
          'Bulk Edit',
          style: AppTextStyles.titleMedium,
        ),
        content: Text(
          'Select products to edit in bulk. This feature is coming soon.',
          style: AppTextStyles.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'OK',
              style: AppTextStyles.bodyMedium,
            ),
          ),
        ],
      ),
    );
  }
}
