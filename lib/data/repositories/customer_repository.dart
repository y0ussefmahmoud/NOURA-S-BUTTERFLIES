import '../models/customer.dart';
import '../models/user.dart';
import '../mock/mock_customers.dart';

abstract class CustomerRepository {
  Future<List<Customer>> getCustomers();
  Future<Customer?> getCustomerById(String id);
  Future<List<Customer>> getCustomersByTier(MembershipTier tier);
  Future<List<Customer>> getVipCustomers();
  Future<List<Customer>> getNewCustomers({int days = 30});
  Future<List<Customer>> getActiveCustomers({int days = 90});
  Future<Map<MembershipTier, int>> getCustomerCountsByTier();
  Future<double> getTotalCustomerSpending();
  Future<int> getTotalCustomerPoints();
}

class CustomerRepositoryImpl implements CustomerRepository {
  final bool useMockData;

  CustomerRepositoryImpl({this.useMockData = true});

  @override
  Future<List<Customer>> getCustomers() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (useMockData) {
      return MockCustomers.customers;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Customer?> getCustomerById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockCustomers.getCustomerById(id);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Customer>> getCustomersByTier(MembershipTier tier) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockCustomers.getCustomersByTier(tier);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Customer>> getVipCustomers() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockCustomers.getVipCustomers();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Customer>> getNewCustomers({int days = 30}) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockCustomers.getNewCustomers(days: days);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<Customer>> getActiveCustomers({int days = 90}) async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockCustomers.getActiveCustomers(days: days);
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Map<MembershipTier, int>> getCustomerCountsByTier() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockCustomers.getCustomerCountsByTier();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<double> getTotalCustomerSpending() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockCustomers.getTotalCustomerSpending();
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<int> getTotalCustomerPoints() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockCustomers.getTotalCustomerPoints();
    }
    
    throw UnimplementedError('API not implemented yet');
  }
}
