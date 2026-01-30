import '../models/customer.dart';
import '../mock/mock_customers.dart';
import '../cache/cache_manager.dart';
import '../../core/network/connectivity_service.dart';
import '../../core/error/error_handler.dart';
import '../../core/config/environment.dart';
import '../../services/api_service.dart';
import '../../services/api_exception.dart';

abstract class CustomerRepository {
  Future<List<Customer>> getCustomers();
  Future<Customer?> getCustomerById(String id);
  Future<List<Customer>> getCustomersByTier(MembershipTier tier);
  Future<List<Customer>> searchCustomers(String query);
  Future<Customer> updateCustomer(Customer customer);
  Future<Customer> updateCustomerNotes(String id, String notes);
  Future<void> deleteCustomer(String id);
}

class CustomerRepositoryImpl implements CustomerRepository {
  final bool useMockData;
  final ApiService _apiService;
  List<Customer> _customers = MockCustomers.customers;
  
  CustomerRepositoryImpl({
    required ApiService apiService,
    bool? useMockData,
  }) : _apiService = apiService,
       useMockData = useMockData ?? (EnvironmentConfig.environment == Environment.development);

  @override
  Future<List<Customer>> getCustomers() async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 500));
      return List.from(_customers);
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'customers',
            () => _apiService.getCustomers(),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Customer>;
          } else {
            throw result.error ?? Exception('Failed to fetch customers');
          }
        },
        operation: 'fetch_customers',
        context: {'method': 'getCustomers'},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Customer?> getCustomerById(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      try {
        return _customers.firstWhere((customer) => customer.id == id);
      } catch (e) {
        return null;
      }
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'customer_$id',
            () => _apiService.getCustomerById(id),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as Customer?;
          } else {
            throw result.error ?? Exception('Failed to fetch customer');
          }
        },
        operation: 'fetch_customer_by_id',
        context: {'customerId': id},
      );
    } on NotFoundException {
      return null;
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<Customer>> getCustomersByTier(MembershipTier tier) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      return _customers.where((customer) => customer.tier == tier).toList();
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'customers_tier_${tier.name}',
            () async {
              final allCustomers = await _apiService.getCustomers();
              return allCustomers.where((customer) => customer.tier == tier).toList();
            },
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Customer>;
          } else {
            throw result.error ?? Exception('Failed to fetch customers by tier');
          }
        },
        operation: 'fetch_customers_by_tier',
        context: {'tier': tier.name},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<List<Customer>> searchCustomers(String query) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      final lowerQuery = query.toLowerCase();
      return _customers.where((customer) {
        return customer.firstName.toLowerCase().contains(lowerQuery) ||
            customer.lastName.toLowerCase().contains(lowerQuery) ||
            customer.email.toLowerCase().contains(lowerQuery) ||
            customer.fullName.toLowerCase().contains(lowerQuery);
      }).toList();
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final cacheManager = CacheManager.instance;
          final result = await cacheManager.getData(
            'customers_search_$query',
            () => _apiService.searchCustomers(query),
            strategy: ConnectivityService.instance.isConnected 
                ? CacheStrategy.networkFirst 
                : CacheStrategy.cacheFirst,
          );
          
          if (result.hasData) {
            return result.data as List<Customer>;
          } else {
            throw result.error ?? Exception('Failed to search customers');
          }
        },
        operation: 'search_customers',
        context: {'query': query},
      );
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Customer> updateCustomer(Customer customer) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 500));
      
      final index = _customers.indexWhere((c) => c.id == customer.id);
      if (index == -1) {
        throw Exception('Customer not found');
      }

      _customers[index] = customer;
      return customer;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'update_customer',
        data: customer.toJson(),
        entityId: customer.id,
        priority: 1, // High priority
      );
      
      // Return optimistic update
      final cachedResult = await cacheManager.getData(
        'customer_${customer.id}',
        () => throw Exception('No network'),
        strategy: CacheStrategy.cacheOnly,
      );
      
      if (cachedResult.hasData) {
        return customer;
      }
      
      throw Exception('No network and no cached data');
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final result = await _apiService.updateCustomer(customer);
          
          // Update cache with new data
          final cacheManager = CacheManager.instance;
          await cacheManager.saveData('customer_${customer.id}', result);
          
          return result;
        },
        operation: 'update_customer',
        context: {'customerId': customer.id},
      );
    } on NotFoundException {
      throw Exception('Customer not found');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<Customer> updateCustomerNotes(String id, String notes) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      
      final index = _customers.indexWhere((customer) => customer.id == id);
      if (index == -1) {
        throw Exception('Customer not found');
      }

      final updatedCustomer = _customers[index].copyWith(adminNotes: notes);
      _customers[index] = updatedCustomer;
      return updatedCustomer;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'update_customer_notes',
        data: {
          'customerId': id,
          'notes': notes,
        },
        entityId: id,
        priority: 1, // High priority
      );
      
      // Return optimistic update
      final cachedResult = await cacheManager.getData(
        'customer_$id',
        () => throw Exception('No network'),
        strategy: CacheStrategy.cacheOnly,
      );
      
      if (cachedResult.hasData) {
        final customer = cachedResult.data as Customer;
        return customer.copyWith(adminNotes: notes);
      }
      
      throw Exception('No network and no cached data');
    }
    
    try {
      return await ErrorHandler.instance.handleAsync(
        () async {
          final existingCustomer = await _apiService.getCustomerById(id);
          if (existingCustomer == null) {
            throw Exception('Customer not found');
          }
          
          final updatedCustomer = existingCustomer.copyWith(adminNotes: notes);
          
          // Update cache with new data
          final cacheManager = CacheManager.instance;
          await cacheManager.saveData('customer_$id', updatedCustomer);
          
          return updatedCustomer;
        },
        operation: 'update_customer_notes',
        context: {'customerId': id},
      );
    } on NotFoundException {
      throw Exception('Customer not found');
    } catch (e) {
      rethrow;
    }
  }

  @override
  Future<void> deleteCustomer(String id) async {
    if (useMockData) {
      await Future.delayed(const Duration(milliseconds: 300));
      _customers.removeWhere((customer) => customer.id == id);
      return;
    }
    
    // Queue operation if offline
    if (!ConnectivityService.instance.isConnected) {
      final cacheManager = CacheManager.instance;
      await cacheManager.queueOperation(
        type: 'delete_customer',
        data: {'customerId': id},
        entityId: id,
        priority: 1, // High priority
      );
      
      // Remove from cache optimistically
      await cacheManager.invalidateData('customer_$id');
      return;
    }
    
    try {
      await ErrorHandler.instance.handleAsync(
        () async {
          await _apiService.deleteCustomer(id);
          
          // Remove from cache
          final cacheManager = CacheManager.instance;
          await cacheManager.invalidateData('customer_$id');
        },
        operation: 'delete_customer',
        context: {'customerId': id},
      );
    } catch (e) {
      rethrow;
    }
  }

  // Additional helper methods
  Future<List<Customer>> getNewCustomers() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _customers.where((customer) => customer.isNewCustomer).toList();
  }

  Future<List<Customer>> getActiveCustomers() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _customers.where((customer) => customer.isActive).toList();
  }

  Future<List<Customer>> getVipCustomers() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return _customers.where((customer) => customer.isVip).toList();
  }

  Future<CustomerStats> getCustomerStats() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    final total = _customers.length;
    final newCustomers = _customers.where((c) => c.isNewCustomer).length;
    final activeCustomers = _customers.where((c) => c.isActive).length;
    final vipCustomers = _customers.where((c) => c.isVip).length;

    return CustomerStats(
      total: total,
      newThisMonth: newCustomers,
      active: activeCustomers,
      vip: vipCustomers,
    );
  }
}

class CustomerStats {
  final int total;
  final int newThisMonth;
  final int active;
  final int vip;

  const CustomerStats({
    required this.total,
    required this.newThisMonth,
    required this.active,
    required this.vip,
  });
}
