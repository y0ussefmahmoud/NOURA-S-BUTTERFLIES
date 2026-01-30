import 'package:equatable/equatable.dart';
import '../../../data/models/admin_product.dart';

abstract class ProductsState extends Equatable {
  const ProductsState();

  @override
  List<Object?> get props => [];
}

class ProductsLoading extends ProductsState {}

class ProductsLoaded extends ProductsState {
  final List<AdminProduct> products;
  final List<AdminProduct> filteredProducts;
  final String? searchQuery;
  final String? selectedCategory;
  final String? selectedStatus;
  final double? minPrice;
  final double? maxPrice;
  final String sortBy;
  final bool ascending;
  final int currentPage;
  final int itemsPerPage;
  final List<String> categories;
  final bool isLoading;

  const ProductsLoaded({
    required this.products,
    required this.filteredProducts,
    this.searchQuery,
    this.selectedCategory,
    this.selectedStatus,
    this.minPrice,
    this.maxPrice,
    this.sortBy = 'name',
    this.ascending = true,
    this.currentPage = 1,
    this.itemsPerPage = 10,
    required this.categories,
    this.isLoading = false,
  });

  // Stats
  int get totalProducts => products.length;
  int get activeProducts => products.where((p) => p.inventory.quantity > p.inventory.lowStockThreshold).length;
  int get lowStockProducts => products.where((p) => 
    p.inventory.quantity > 0 && 
    p.inventory.quantity <= p.inventory.lowStockThreshold
  ).length;
  int get outOfStockProducts => products.where((p) => p.inventory.quantity == 0).length;

  // Pagination
  int get totalPages => (filteredProducts.length / itemsPerPage).ceil();
  
  List<AdminProduct> get paginatedProducts {
    if (filteredProducts.isEmpty) return [];
    
    final start = (currentPage - 1) * itemsPerPage;
    final end = start + itemsPerPage;
    
    if (start >= filteredProducts.length) return [];
    
    return filteredProducts.sublist(
      start,
      end > filteredProducts.length ? filteredProducts.length : end,
    );
  }

  // Filter info
  bool get hasActiveFilters => 
      searchQuery != null && searchQuery!.isNotEmpty ||
      selectedCategory != null && selectedCategory != 'all' ||
      selectedStatus != null && selectedStatus != 'all' ||
      minPrice != null ||
      maxPrice != null;

  ProductsLoaded copyWith({
    List<AdminProduct>? products,
    List<AdminProduct>? filteredProducts,
    String? searchQuery,
    String? selectedCategory,
    String? selectedStatus,
    double? minPrice,
    double? maxPrice,
    String? sortBy,
    bool? ascending,
    int? currentPage,
    int? itemsPerPage,
    List<String>? categories,
    bool? isLoading,
  }) {
    return ProductsLoaded(
      products: products ?? this.products,
      filteredProducts: filteredProducts ?? this.filteredProducts,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      selectedStatus: selectedStatus ?? this.selectedStatus,
      minPrice: minPrice ?? this.minPrice,
      maxPrice: maxPrice ?? this.maxPrice,
      sortBy: sortBy ?? this.sortBy,
      ascending: ascending ?? this.ascending,
      currentPage: currentPage ?? this.currentPage,
      itemsPerPage: itemsPerPage ?? this.itemsPerPage,
      categories: categories ?? this.categories,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  @override
  List<Object?> get props => [
        products,
        filteredProducts,
        searchQuery,
        selectedCategory,
        selectedStatus,
        minPrice,
        maxPrice,
        sortBy,
        ascending,
        currentPage,
        itemsPerPage,
        categories,
        isLoading,
      ];
}

class ProductsError extends ProductsState {
  final String message;
  final String? technicalMessage;
  final String? errorCode;

  const ProductsError(
    this.message, {
    this.technicalMessage,
    this.errorCode,
  });

  @override
  List<Object?> get props => [message, technicalMessage, errorCode];
}

class ProductsPartialError extends ProductsState {
  final String message;
  final String? technicalMessage;
  final ProductsState baseState;
  final bool canRetry;
  final List<String>? recoveryActions;

  const ProductsPartialError({
    required this.message,
    this.technicalMessage,
    required this.baseState,
    this.canRetry = false,
    this.recoveryActions,
  });

  @override
  List<Object?> get props => [
        message,
        technicalMessage,
        baseState,
        canRetry,
        recoveryActions,
      ];
}

class ProductsRetrying extends ProductsState {
  final ProductsState baseState;
  final int attempt;
  final int maxAttempts;
  final String operation;

  const ProductsRetrying({
    required this.baseState,
    required this.attempt,
    required this.maxAttempts,
    required this.operation,
  });

  @override
  List<Object?> get props => [baseState, attempt, maxAttempts, operation];
}

class ProductsActionSuccess extends ProductsState {
  final String message;
  final ProductsState previousState;

  const ProductsActionSuccess(this.message, this.previousState);

  @override
  List<Object?> get props => [message, previousState];
}

class ProductOperationInProgress extends ProductsState {
  final ProductsState baseState;
  final String operation;

  const ProductOperationInProgress(this.baseState, this.operation);

  @override
  List<Object?> get props => [baseState, operation];
}

class ProductSaving extends ProductsState {
  final ProductsState baseState;

  const ProductSaving(this.baseState);

  @override
  List<Object?> get props => [baseState];
}

class ProductSaved extends ProductsState {
  final AdminProduct product;
  final ProductsState previousState;

  const ProductSaved(this.product, this.previousState);

  @override
  List<Object?> get props => [product, previousState];
}

class ProductSaveDrafted extends ProductsState {
  final AdminProduct product;
  final ProductsState previousState;

  const ProductSaveDrafted(this.product, this.previousState);

  @override
  List<Object?> get props => [product, previousState];
}

class ProductSaveError extends ProductsState {
  final String message;
  final ProductsState previousState;

  const ProductSaveError(this.message, this.previousState);

  @override
  List<Object?> get props => [message, previousState];
}
