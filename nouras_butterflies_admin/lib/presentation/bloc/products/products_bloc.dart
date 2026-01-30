import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';
import '../../../data/models/admin_product.dart';
import '../../../data/repositories/admin_product_repository.dart';
import '../../../../data/models/product_form_data.dart';
import '../../../core/error/error_handler.dart';
import '../../../core/error/error_messages.dart';
import 'products_event.dart';
import 'products_state.dart';

class ProductsBloc extends Bloc<ProductsEvent, ProductsState> {
  final AdminProductRepository repository;
  Timer? _debounce;
  final ErrorHandler _errorHandler = ErrorHandler.instance;
  ProductsState? _lastSuccessfulState;

  ProductsBloc(this.repository) : super(ProductsLoading()) {
    on<LoadProducts>(_onLoadProducts);
    on<SearchProducts>(_onSearchProducts);
    on<FilterProducts>(_onFilterProducts);
    on<SortProducts>(_onSortProducts);
    on<ChangePage>(_onChangePage);
    on<DeleteProduct>(_onDeleteProduct);
    on<DuplicateProduct>(_onDuplicateProduct);
    on<RefreshProducts>(_onRefreshProducts);
    on<ClearFilters>(_onClearFilters);
    on<BulkDeleteProducts>(_onBulkDeleteProducts);
    on<ExportProducts>(_onExportProducts);
    on<CreateProduct>(_onCreateProduct);
    onUpdateProduct>(_onUpdateProduct);
    onSaveProductDraft>(_onSaveProductDraft);
  }

  Future<void> _onLoadProducts(
    LoadProducts event,
    Emitter<ProductsState> emit,
  ) async {
    try {
      emit(ProductsLoading());
      
      final result = await _errorHandler.handleAsync(
        () async {
          final products = await repository.getProducts();
          final categories = await repository.getCategories();
          return (products, categories);
        },
        operationName: 'load_products',
        retryStrategy: const RetryStrategy(maxAttempts: 3),
      );
      
      final products = result.$1;
      final categories = result.$2;
      
      final loadedState = ProductsLoaded(
        products: products,
        filteredProducts: products,
        categories: categories,
      );
      
      _lastSuccessfulState = loadedState;
      emit(loadedState);
    } catch (e) {
      final appException = _errorHandler._convertException(e, 'load_products', null);
      _errorHandler.logError(appException, screen: 'products', action: 'load');
      
      // Try to restore last successful state
      if (_lastSuccessfulState != null) {
        emit(ProductsPartialError(
          message: ErrorMessages.getMessage('network_error'),
          technicalMessage: appException.technicalMessage,
          baseState: _lastSuccessfulState!,
          canRetry: true,
        ));
      } else {
        emit(ProductsError(
          ErrorMessages.getMessage('network_error'),
          technicalMessage: appException.technicalMessage,
          errorCode: appException.errorCode,
        ));
      }
    }
  }

  Future<void> _onSearchProducts(
    SearchProducts event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    // Cancel previous timer
    _debounce?.cancel();
    
    // Show loading state immediately for better UX
    final currentState = state as ProductsLoaded;
    emit(currentState.copyWith(isLoading: true));

    // Start new timer (300ms debounce)
    _debounce = Timer(const Duration(milliseconds: 300), () async {
      try {
        final searchResults = await repository.searchProducts(event.query);
        
        // Apply existing filters to search results
        List<AdminProduct> filteredResults = searchResults;
        
        if (currentState.selectedCategory != null && currentState.selectedCategory != 'all') {
          filteredResults = filteredResults
              .where((p) => p.category == currentState.selectedCategory)
              .toList();
        }
        
        if (currentState.selectedStatus != null && currentState.selectedStatus != 'all') {
          filteredResults = _applyStatusFilter(filteredResults, currentState.selectedStatus!);
        }
        
        if (currentState.minPrice != null || currentState.maxPrice != null) {
          filteredResults = filteredResults.where((p) {
            if (currentState.minPrice != null && p.price < currentState.minPrice!) return false;
            if (currentState.maxPrice != null && p.price > currentState.maxPrice!) return false;
            return true;
          }).toList();
        }

        // Apply sorting
        filteredResults = _applySorting(filteredResults, currentState.sortBy, currentState.ascending);

        emit(currentState.copyWith(
          products: searchResults,
          filteredProducts: filteredResults,
          searchQuery: event.query.isEmpty ? null : event.query,
          currentPage: 1, // Reset to first page on search
          isLoading: false,
        ));
      } catch (e) {
        emit(currentState.copyWith(isLoading: false));
        // Don't emit error state for search failures, just keep current state
      }
    });
  }

  Future<void> _onFilterProducts(
    FilterProducts event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    try {
      final currentState = state as ProductsLoaded;
      emit(currentState.copyWith(isLoading: true));

      final filteredResults = await repository.filterProducts(
        category: event.category,
        status: event.status,
        minPrice: event.minPrice,
        maxPrice: event.maxPrice,
      );

      // Apply search if exists
      List<AdminProduct> finalResults = filteredResults;
      if (currentState.searchQuery != null && currentState.searchQuery!.isNotEmpty) {
        finalResults = await repository.searchProducts(currentState.searchQuery!);
        finalResults = finalResults.where((p) => filteredResults.contains(p)).toList();
      }

      // Apply sorting
      finalResults = _applySorting(finalResults, currentState.sortBy, currentState.ascending);

      emit(currentState.copyWith(
        products: filteredResults,
        filteredProducts: finalResults,
        selectedCategory: event.category,
        selectedStatus: event.status,
        minPrice: event.minPrice,
        maxPrice: event.maxPrice,
        currentPage: 1, // Reset to first page on filter
        isLoading: false,
      ));
    } catch (e) {
      final currentState = state as ProductsLoaded;
      emit(currentState.copyWith(isLoading: false));
    }
  }

  Future<void> _onSortProducts(
    SortProducts event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    final currentState = state as ProductsLoaded;
    final sortedProducts = _applySorting(
      currentState.filteredProducts,
      event.sortBy,
      event.ascending,
    );

    emit(currentState.copyWith(
      filteredProducts: sortedProducts,
      sortBy: event.sortBy,
      ascending: event.ascending,
    ));
  }

  Future<void> _onChangePage(
    ChangePage event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    final currentState = state as ProductsLoaded;
    final page = event.page.clamp(1, currentState.totalPages);
    
    if (page != currentState.currentPage) {
      emit(currentState.copyWith(currentPage: page));
    }
  }

  Future<void> _onDeleteProduct(
    DeleteProduct event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    try {
      final currentState = state as ProductsLoaded;
      emit(ProductOperationInProgress(currentState, 'Deleting product...'));

      await _errorHandler.handleAsync(
        () => repository.deleteProduct(event.id),
        operationName: 'delete_product',
        context: {'product_id': event.id},
      );

      final updatedProducts = currentState.products.where((p) => p.id != event.id).toList();
      final updatedFiltered = currentState.filteredProducts.where((p) => p.id != event.id).toList();

      final loadedState = ProductsLoaded(
        products: updatedProducts,
        filteredProducts: updatedFiltered,
        searchQuery: currentState.searchQuery,
        selectedCategory: currentState.selectedCategory,
        selectedStatus: currentState.selectedStatus,
        minPrice: currentState.minPrice,
        maxPrice: currentState.maxPrice,
        sortBy: currentState.sortBy,
        ascending: currentState.ascending,
        currentPage: _calculateNewPage(currentState.currentPage, updatedFiltered.length, currentState.itemsPerPage),
        itemsPerPage: currentState.itemsPerPage,
        categories: currentState.categories,
      );
      
      _lastSuccessfulState = loadedState;
      emit(ProductsActionSuccess(
        ErrorMessages.getSuccessMessage('deleted'),
        loadedState,
      ));
    } catch (e) {
      final appException = _errorHandler._convertException(e, 'delete_product', {'product_id': event.id});
      _errorHandler.logError(appException, screen: 'products', action: 'delete');
      
      final currentState = state as ProductsLoaded;
      emit(ProductsError(
        ErrorMessages.getMessage('operation_failed'),
        technicalMessage: appException.technicalMessage,
        errorCode: appException.errorCode,
      ));
    }
  }

  Future<void> _onDuplicateProduct(
    DuplicateProduct event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    try {
      final currentState = state as ProductsLoaded;
      emit(ProductOperationInProgress(currentState, 'Duplicating product...'));

      final duplicatedProduct = await repository.duplicateProduct(event.id);

      final updatedProducts = [...currentState.products, duplicatedProduct];
      final updatedFiltered = [...currentState.filteredProducts, duplicatedProduct];

      emit(ProductsLoaded(
        products: updatedProducts,
        filteredProducts: updatedFiltered,
        searchQuery: currentState.searchQuery,
        selectedCategory: currentState.selectedCategory,
        selectedStatus: currentState.selectedStatus,
        minPrice: currentState.minPrice,
        maxPrice: currentState.maxPrice,
        sortBy: currentState.sortBy,
        ascending: currentState.ascending,
        currentPage: currentState.currentPage,
        itemsPerPage: currentState.itemsPerPage,
        categories: currentState.categories,
      ));
    } catch (e) {
      emit(ProductsError('Failed to duplicate product: ${e.toString()}'));
    }
  }

  Future<void> _onRefreshProducts(
    RefreshProducts event,
    Emitter<ProductsState> emit,
  ) async {
    add(LoadProducts());
  }

  Future<void> _onClearFilters(
    ClearFilters event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    final currentState = state as ProductsLoaded;
    emit(currentState.copyWith(
      filteredProducts: currentState.products,
      searchQuery: null,
      selectedCategory: null,
      selectedStatus: null,
      minPrice: null,
      maxPrice: null,
      currentPage: 1,
    ));
  }

  Future<void> _onBulkDeleteProducts(
    BulkDeleteProducts event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    try {
      final currentState = state as ProductsLoaded;
      emit(ProductOperationInProgress(currentState, 'Deleting products...'));

      for (final id in event.ids) {
        await repository.deleteProduct(id);
      }

      final updatedProducts = currentState.products.where((p) => !event.ids.contains(p.id)).toList();
      final updatedFiltered = currentState.filteredProducts.where((p) => !event.ids.contains(p.id)).toList();

      emit(ProductsLoaded(
        products: updatedProducts,
        filteredProducts: updatedFiltered,
        searchQuery: currentState.searchQuery,
        selectedCategory: currentState.selectedCategory,
        selectedStatus: currentState.selectedStatus,
        minPrice: currentState.minPrice,
        maxPrice: currentState.maxPrice,
        sortBy: currentState.sortBy,
        ascending: currentState.ascending,
        currentPage: _calculateNewPage(currentState.currentPage, updatedFiltered.length, currentState.itemsPerPage),
        itemsPerPage: currentState.itemsPerPage,
        categories: currentState.categories,
      ));
    } catch (e) {
      emit(ProductsError('Failed to delete products: ${e.toString()}'));
    }
  }

  Future<void> _onExportProducts(
    ExportProducts event,
    Emitter<ProductsState> emit,
  ) async {
    if (state is! ProductsLoaded) return;

    try {
      final currentState = state as ProductsLoaded;
      emit(ProductOperationInProgress(currentState, 'Exporting products...'));

      // Simulate export process
      await Future.delayed(const Duration(seconds: 2));

      // In a real implementation, this would generate and download a file
      // For now, we'll just return to the previous state
      emit(currentState);
    } catch (e) {
      emit(ProductsError('Failed to export products: ${e.toString()}'));
    }
  }

  List<AdminProduct> _applySorting(List<AdminProduct> products, String sortBy, bool ascending) {
    final sortedList = List<AdminProduct>.from(products);
    
    sortedList.sort((a, b) {
      int comparison;
      switch (sortBy) {
        case 'name':
          comparison = a.name.toLowerCase().compareTo(b.name.toLowerCase());
          break;
        case 'price':
          comparison = a.price.compareTo(b.price);
          break;
        case 'stock':
          comparison = a.inventory.quantity.compareTo(b.inventory.quantity);
          break;
        case 'category':
          comparison = a.category.toLowerCase().compareTo(b.category.toLowerCase());
          break;
        case 'rating':
          comparison = a.rating.compareTo(b.rating);
          break;
        case 'sku':
          comparison = a.sku.toLowerCase().compareTo(b.sku.toLowerCase());
          break;
        case 'date':
          comparison = a.lastModified.compareTo(b.lastModified);
          break;
        default:
          comparison = a.name.toLowerCase().compareTo(b.name.toLowerCase());
      }
      return ascending ? comparison : -comparison;
    });
    
    return sortedList;
  }

  List<AdminProduct> _applyStatusFilter(List<AdminProduct> products, String status) {
    switch (status) {
      case 'active':
        return products.where((p) => p.inventory.quantity > p.inventory.lowStockThreshold).toList();
      case 'low':
        return products.where((p) => 
          p.inventory.quantity > 0 && 
          p.inventory.quantity <= p.inventory.lowStockThreshold
        ).toList();
      case 'out':
        return products.where((p) => p.inventory.quantity == 0).toList();
      default:
        return products;
    }
  }

  int _calculateNewPage(int currentPage, int totalItems, int itemsPerPage) {
    final totalPages = (totalItems / itemsPerPage).ceil();
    if (totalPages == 0) return 1;
    return currentPage > totalPages ? totalPages : currentPage;
  }

  @override
  Future<void> close() {
    _debounce?.cancel();
    return super.close();
  }

  Future<void> _onCreateProduct(
    CreateProduct event,
    Emitter<ProductsState> emit,
  ) async {
    try {
      // Validate form data
      final validationError = event.productData.validate();
      if (validationError.isNotEmpty) {
        emit(ProductSaveError('Validation failed: $validationError', state));
        return;
      }

      emit(ProductSaving(state));

      // Convert ProductFormData to AdminProduct
      final adminProduct = AdminProduct(
        id: event.productData.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
        name: event.productData.name,
        nameAr: event.productData.nameAr,
        sku: event.productData.sku,
        slug: event.productData.name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9\s-]'), '').replaceAll(RegExp(r'\s+'), '-'),
        description: event.productData.description,
        descriptionAr: event.productData.descriptionAr,
        price: event.productData.basePrice,
        category: event.productData.category,
        images: event.productData.images,
        rating: 0.0,
        reviewCount: 0,
        inventory: event.productData.inventory,
        cost: event.productData.cost,
        supplier: event.productData.supplier,
        createdBy: 'admin@nouras.com',
        lastModified: DateTime.now(),
        seo: event.productData.seo,
      );

      final createdProduct = await repository.createProduct(adminProduct);
      
      emit(ProductSaved(createdProduct, state));

      // Refresh products list
      add(LoadProducts());
    } catch (e) {
      emit(ProductSaveError('Failed to create product: ${e.toString()}', state));
    }
  }

  Future<void> _onUpdateProduct(
    UpdateProduct event,
    Emitter<ProductsState> emit,
  ) async {
    try {
      // Validate form data
      final validationError = event.productData.validate();
      if (validationError.isNotEmpty) {
        emit(ProductSaveError('Validation failed: $validationError', state));
        return;
      }

      if (event.productData.id == null) {
        emit(ProductSaveError('Product ID is required for update', state));
        return;
      }

      emit(ProductSaving(state));

      // Convert ProductFormData to AdminProduct
      final adminProduct = AdminProduct(
        id: event.productData.id!,
        name: event.productData.name,
        nameAr: event.productData.nameAr,
        sku: event.productData.sku,
        slug: event.productData.name.toLowerCase().replaceAll(RegExp(r'[^a-z0-9\s-]'), '').replaceAll(RegExp(r'\s+'), '-'),
        description: event.productData.description,
        descriptionAr: event.productData.descriptionAr,
        price: event.productData.basePrice,
        category: event.productData.category,
        images: event.productData.images,
        rating: 0.0, // Preserve existing rating in real implementation
        reviewCount: 0, // Preserve existing review count in real implementation
        inventory: event.productData.inventory,
        cost: event.productData.cost,
        supplier: event.productData.supplier,
        createdBy: 'admin@nouras.com',
        lastModified: DateTime.now(),
        seo: event.productData.seo,
      );

      final updatedProduct = await repository.updateProduct(adminProduct);
      
      emit(ProductSaved(updatedProduct, state));

      // Refresh products list
      add(LoadProducts());
    } catch (e) {
      emit(ProductSaveError('Failed to update product: ${e.toString()}', state));
    }
  }

  Future<void> _onSaveProductDraft(
    SaveProductDraft event,
    Emitter<ProductsState> emit,
  ) async {
    try {
      emit(ProductSaving(state));

      // For draft saving, we can skip some validations
      if (event.productData.id == null) {
        // Create new draft
        final adminProduct = AdminProduct(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          name: event.productData.name.isEmpty ? 'Draft Product' : event.productData.name,
          nameAr: event.productData.nameAr.isEmpty ? 'منتج مسودة' : event.productData.nameAr,
          sku: event.productData.sku.isEmpty ? 'DRAFT-${DateTime.now().millisecondsSinceEpoch}' : event.productData.sku,
          slug: 'draft-${DateTime.now().millisecondsSinceEpoch}',
          description: event.productData.description,
          descriptionAr: event.productData.descriptionAr,
          price: event.productData.basePrice,
          category: event.productData.category.isEmpty ? 'Uncategorized' : event.productData.category,
          images: event.productData.images,
          rating: 0.0,
          reviewCount: 0,
          inventory: event.productData.inventory,
          cost: event.productData.cost,
          supplier: event.productData.supplier,
          createdBy: 'admin@nouras.com',
          lastModified: DateTime.now(),
          seo: event.productData.seo,
        );

        final createdDraft = await repository.createProduct(adminProduct);
        emit(ProductSaveDrafted(createdDraft, state));
      } else {
        // Update existing draft
        final adminProduct = AdminProduct(
          id: event.productData.id!,
          name: event.productData.name.isEmpty ? 'Draft Product' : event.productData.name,
          nameAr: event.productData.nameAr.isEmpty ? 'منتج مسودة' : event.productData.nameAr,
          sku: event.productData.sku.isEmpty ? 'DRAFT-${DateTime.now().millisecondsSinceEpoch}' : event.productData.sku,
          slug: 'draft-${DateTime.now().millisecondsSinceEpoch}',
          description: event.productData.description,
          descriptionAr: event.productData.descriptionAr,
          price: event.productData.basePrice,
          category: event.productData.category.isEmpty ? 'Uncategorized' : event.productData.category,
          images: event.productData.images,
          rating: 0.0,
          reviewCount: 0,
          inventory: event.productData.inventory,
          cost: event.productData.cost,
          supplier: event.productData.supplier,
          createdBy: 'admin@nouras.com',
          lastModified: DateTime.now(),
          seo: event.productData.seo,
        );

        final updatedDraft = await repository.updateProduct(adminProduct);
        emit(ProductSaveDrafted(updatedDraft, state));
      }

      // Refresh products list
      add(LoadProducts());
    } catch (e) {
      emit(ProductSaveError('Failed to save draft: ${e.toString()}', state));
    }
  }
}
