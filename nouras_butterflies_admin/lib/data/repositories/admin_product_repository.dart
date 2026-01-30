import '../models/admin_product.dart';
import '../cache/cache_manager.dart';
import '../../core/network/connectivity_service.dart';
import '../../services/api_service.dart';
import '../../services/api_exception.dart';

abstract class AdminProductRepository {
  Future<List<AdminProduct>> getProducts();
  Future<AdminProduct?> getProductById(String id);
  Future<List<AdminProduct>> searchProducts(String query);
  Future<List<AdminProduct>> filterProducts({
    String? category,
    String? status,
    double? minPrice,
    double? maxPrice,
  });
  Future<AdminProduct> createProduct(AdminProduct product);
  Future<AdminProduct> updateProduct(AdminProduct product);
  Future<void> deleteProduct(String id);
  Future<List<String>> getCategories();
  Future<List<AdminProduct>> sortProducts(String sortBy, bool ascending);
  Future<AdminProduct> duplicateProduct(String id);
}

class AdminProductRepositoryImpl implements AdminProductRepository {
  final bool useMockData;
  final ApiService _apiService;
  
  AdminProductRepositoryImpl({
    required ApiService apiService,
    bool? useMockData,
  }) : _apiService = apiService,
       useMockData = useMockData ?? (EnvironmentConfig.environment == Environment.development);

  @override
  Future<List<AdminProduct>> getProducts() async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 500));
      return MockAdminProducts.products;
    }
    
    try {
      final cacheManager = CacheManager.instance;
      final result = await cacheManager.getData(
        'products',
        () => _apiService.getProducts(),
        strategy: ConnectivityService.instance.isConnected 
            ? CacheStrategy.networkFirst 
            : CacheStrategy.cacheFirst,
      );
      
      if (result.hasData) {
        return result.data as List<AdminProduct>;
      } else {
        throw result.error ?? Exception('Failed to fetch products');
      }
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<AdminProduct?> getProductById(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      return MockAdminProducts.getProductById(id);
    }
    
    try {
      return await _apiService.getProductById(id);
    } on NotFoundException {
      return null;
    } on NetworkException {
      // Fallback to mock data if network fails
      return MockAdminProducts.getProductById(id);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<AdminProduct>> searchProducts(String query) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      return MockAdminProducts.searchProducts(query);
    }
    
    try {
      return await _apiService.searchProducts(query);
    } on NetworkException {
      // Fallback to mock data if network fails
      return MockAdminProducts.searchProducts(query);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<AdminProduct>> filterProducts({
    String? category,
    String? status,
    double? minPrice,
    double? maxPrice,
  }) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      List<AdminProduct> filteredProducts = MockAdminProducts.products;
      
      if (category != null && category != 'all') {
        filteredProducts = MockAdminProducts.filterByCategory(category);
      }
      
      if (status != null && status != 'all') {
        filteredProducts = MockAdminProducts.filterByStatus(status);
      }
      
      if (minPrice != null || maxPrice != null) {
        filteredProducts = MockAdminProducts.filterByPriceRange(
          minPrice ?? 0,
          maxPrice ?? double.infinity,
        );
      }
      
      return filteredProducts;
    }
    
    try {
      return await _apiService.filterProducts(
        category: category,
        minPrice: minPrice,
        maxPrice: maxPrice,
        inStock: status == 'in_stock',
      );
    } on NetworkException {
      // Fallback to mock data if network fails
      List<AdminProduct> filteredProducts = MockAdminProducts.products;
      
      if (category != null && category != 'all') {
        filteredProducts = MockAdminProducts.filterByCategory(category);
      }
      
      if (status != null && status != 'all') {
        filteredProducts = MockAdminProducts.filterByStatus(status);
      }
      
      if (minPrice != null || maxPrice != null) {
        filteredProducts = MockAdminProducts.filterByPriceRange(
          minPrice ?? 0,
          maxPrice ?? double.infinity,
        );
      }
      
      return filteredProducts;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<AdminProduct> createProduct(AdminProduct product) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 800));
      // Create new product with generated ID
      final newProduct = product.copyWith(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        lastModified: DateTime.now(),
      );
      
      // Persist to mock list
      MockAdminProducts.createProduct(newProduct);
      
      return newProduct;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      final tempId = DateTime.now().millisecondsSinceEpoch.toString();
      final newProduct = product.copyWith(
        id: tempId,
        lastModified: DateTime.now(),
      );
      
      await cacheManager.queueOperation(
        type: 'create_product',
        data: newProduct.toJson(),
        entityId: tempId,
        priority: 1, // High priority
      );
      
      // Cache the optimistic update
      await cacheManager.saveData('product_$tempId', newProduct);
      
      return newProduct;
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final result = await _apiService.createProduct(product);
          
          // Update cache with new data
          final cacheManager = CacheManager.instance;
          await cacheManager.saveData('product_${result.id}', result);
          
          return result;
        },
        operation: 'create_product',
        context: {'productId': product.id},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<AdminProduct> updateProduct(AdminProduct product) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 600));
      // Update product with new last modified timestamp
      final updatedProduct = product.copyWith(lastModified: DateTime.now());
      
      // Persist to mock list
      final success = MockAdminProducts.updateProduct(updatedProduct);
      if (!success) {
        throw Exception('Product not found for update');
      }
      
      return updatedProduct;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      final updatedProduct = product.copyWith(lastModified: DateTime.now());
      
      await cacheManager.queueOperation(
        type: 'update_product',
        data: updatedProduct.toJson(),
        entityId: product.id,
        priority: 1, // High priority
      );
      
      // Cache the optimistic update
      await cacheManager.saveData('product_${product.id}', updatedProduct);
      
      return updatedProduct;
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final result = await _apiService.updateProduct(product.id, product);
          
          // Update cache with new data
          final cacheManager = CacheManager.instance;
          await cacheManager.saveData('product_${product.id}', result);
          
          return result;
        },
        operation: 'update_product',
        context: {'productId': product.id},
      );
    } on NotFoundException {
      throw Exception('Product not found for update');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> deleteProduct(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 400));
      // Persist deletion to mock list
      final success = MockAdminProducts.deleteProduct(id);
      if (!success) {
        throw Exception('Product not found for deletion');
      }
      return;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'delete_product',
        data: {'productId': id},
        entityId: id,
        priority: 1, // High priority
      );
      
      // Remove from cache optimistically
      await cacheManager.invalidateData('product_$id');
      return;
    }
    
    try {
      await ErrorHandler.instance.handleAsync(
        () async {
          await _apiService.deleteProduct(id);
          
          // Remove from cache
          final cacheManager = CacheManager.instance;
          await cacheManager.invalidateData('product_$id');
        },
        operation: 'delete_product',
        context: {'productId': id},
      );
    } on NotFoundException {
      throw Exception('Product not found for deletion');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<String>> getCategories() async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 200));
      return MockAdminProducts.getAllCategories();
    }
    
    try {
      return await _apiService.getCategories();
    } on NetworkException {
      // Fallback to mock data if network fails
      return MockAdminProducts.getAllCategories();
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<AdminProduct>> sortProducts(String sortBy, bool ascending) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      return MockAdminProducts.sortProducts(MockAdminProducts.products, sortBy, ascending);
    }
    
    // For API, we'll use filter with sort parameters (this would need to be implemented in API)
    try {
      return await _apiService.filterProducts();
    } on NetworkException {
      // Fallback to mock data if network fails
      return MockAdminProducts.sortProducts(MockAdminProducts.products, sortBy, ascending);
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<AdminProduct> duplicateProduct(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 600));
      // Use the persistent duplicate method from MockAdminProducts
      final duplicatedProduct = MockAdminProducts.duplicateProduct(id);
      if (duplicatedProduct == null) {
        throw Exception('Product not found for duplication');
      }
      
      return duplicatedProduct;
    }
    
    try {
      // First get the product to duplicate
      final originalProduct = await _apiService.getProductById(id);
      
      // Create a new product with modified data
      final duplicatedProduct = originalProduct.copyWith(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: '${originalProduct.name} (Copy)',
        nameAr: '${originalProduct.nameAr} (نسخة)',
        slug: '${originalProduct.slug}-copy-${DateTime.now().millisecondsSinceEpoch}',
        lastModified: DateTime.now(),
      );
      
      // Create the duplicated product
      return await _apiService.createProduct(duplicatedProduct);
    } on NotFoundException {
      throw Exception('Product not found for duplication');
    } on NetworkException {
      // Fallback to mock data if network fails
      await Future.delayed(const Duration(milliseconds: 600));
      final duplicatedProduct = MockAdminProducts.duplicateProduct(id);
      if (duplicatedProduct == null) {
        throw Exception('Product not found for duplication');
      }
      
      return duplicatedProduct;
    } catch (e) {
      rethrow;
    }
  }
}

// Import the mock data
import '../mock/mock_admin_products.dart';
