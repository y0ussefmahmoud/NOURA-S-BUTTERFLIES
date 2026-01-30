import '../models/admin_stats.dart';
import '../mock/mock_admin_stats.dart';

abstract class AdminStatsRepository {
  Future<SalesMetrics> getSalesMetrics();
  Future<List<TopProduct>> getTopProducts();
  Future<List<ChartDataPoint>> getRevenueChartData();
  Future<List<ChartDataPoint>> getOrdersChartData();
  Future<List<ChartDataPoint>> getCustomerGrowthChartData();
  Future<List<ChartDataPoint>> getConversionRateChartData();
  Future<AdminDashboardData> getDashboardData();
  Future<Map<String, dynamic>> getQuickStats();
}

class AdminStatsRepositoryImpl implements AdminStatsRepository {
  final bool useMockData;

  AdminStatsRepositoryImpl({this.useMockData = true});

  @override
  Future<SalesMetrics> getSalesMetrics() async {
    await Future.delayed(const Duration(milliseconds: 500));
    
    if (useMockData) {
      return MockAdminStats.salesMetrics;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<TopProduct>> getTopProducts() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockAdminStats.topProducts;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<ChartDataPoint>> getRevenueChartData() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockAdminStats.revenueChartData;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<ChartDataPoint>> getOrdersChartData() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockAdminStats.ordersChartData;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<ChartDataPoint>> getCustomerGrowthChartData() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockAdminStats.customerGrowthChartData;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<List<ChartDataPoint>> getConversionRateChartData() async {
    await Future.delayed(const Duration(milliseconds: 400));
    
    if (useMockData) {
      return MockAdminStats.conversionRateChartData;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<AdminDashboardData> getDashboardData() async {
    await Future.delayed(const Duration(milliseconds: 600));
    
    if (useMockData) {
      return MockAdminStats.dashboardData;
    }
    
    throw UnimplementedError('API not implemented yet');
  }

  @override
  Future<Map<String, dynamic>> getQuickStats() async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    if (useMockData) {
      return MockAdminStats.getQuickStats();
    }
    
    throw UnimplementedError('API not implemented yet');
  }
}
