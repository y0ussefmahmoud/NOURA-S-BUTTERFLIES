import '../models/product.dart';
import '../mock/mock_products.dart';

abstract class ProductRepository {
  Future<List<Product>> getProducts();
  Future<Product?> getProductById(String id);
  Future<List<Product>> getProductsByCategory(String category);
  Future<List<Product>> searchProducts(String query);
  Future<List<Product>> getBestsellers();
  Future<List<Product>> getFeaturedProducts({int limit = 8});
  Future<List<String>> getAllCategories();
}

class ProductRepositoryImpl implements ProductRepository {
  // In the future this will be replaced with API Service
  final bool useMockData;

  ProductRepositoryImpl({this.useMockData = true});

  @override
  Future<List<Product>> getProducts() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (useMockData) {
      return MockProducts.products;
    }
    
    // In the future: return await apiService.getProducts();
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Product?> getProductById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockProducts.getProductById(id);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Product>> getProductsByCategory(String category) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockProducts.getProductsByCategory(category);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Product>> searchProducts(String query) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockProducts.searchProducts(query);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Product>> getBestsellers() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockProducts.getBestsellers();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Product>> getFeaturedProducts({int limit = 8}) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockProducts.getFeaturedProducts(limit: limit);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<String>> getAllCategories() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockProducts.getAllCategories();
    }
    
    throw UnimplementedError('API not implemented yet');
  }
}
