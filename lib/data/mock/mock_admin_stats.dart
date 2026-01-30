import '../models/admin_stats.dart';

class MockAdminStats {
  static final SalesMetrics salesMetrics = SalesMetrics(
    revenue: MetricValue(
      current: 15420.50,
      previous: 12345.00,
      growth: 25.0,
    ),
    orders: MetricValue(
      current: 342,
      previous: 298,
      growth: 14.8,
    ),
    customers: MetricValue(
      current: 89,
      previous: 76,
      growth: 17.1,
    ),
    averageOrderValue: MetricValue(
      current: 45.09,
      previous: 41.45,
      growth: 8.8,
    ),
  );

  static final List<TopProduct> topProducts = [
    TopProduct(
      id: '1',
      name: 'Hydrating Lip Glow',
      image: '/images/products/hydrating-lip-glow.jpg',
      revenue: 3247.50,
      unitsSold: 130,
      growth: 15.2,
    ),
    TopProduct(
      id: '2',
      name: 'Radiant Cheek Tint',
      image: '/images/products/radiant-cheek-tint.jpg',
      revenue: 2890.00,
      unitsSold: 156,
      growth: 12.8,
    ),
    TopProduct(
      id: '3',
      name: 'Silk Finish Powder',
      image: '/images/products/silk-finish-powder.jpg',
      revenue: 2156.25,
      unitsSold: 67,
      growth: 8.5,
    ),
    TopProduct(
      id: '4',
      name: 'Nourishing Face Oil',
      image: '/images/products/nourishing-face-oil.jpg',
      revenue: 1987.80,
      unitsSold: 44,
      growth: 22.1,
    ),
    TopProduct(
      id: '6',
      name: 'Rose Garden Butterfly Compact',
      image: '/images/products/rose-garden-compact.jpg',
      revenue: 1654.20,
      unitsSold: 59,
      growth: 5.3,
    ),
  ];

  static final List<ChartDataPoint> revenueChartData = [
    ChartDataPoint(label: 'Jan', value: 12000),
    ChartDataPoint(label: 'Feb', value: 14500),
    ChartDataPoint(label: 'Mar', value: 13200),
    ChartDataPoint(label: 'Apr', value: 16800),
    ChartDataPoint(label: 'May', value: 19200),
    ChartDataPoint(label: 'Jun', value: 15420),
  ];

  static final List<ChartDataPoint> ordersChartData = [
    ChartDataPoint(label: 'Jan', value: 280),
    ChartDataPoint(label: 'Feb', value: 320),
    ChartDataPoint(label: 'Mar', value: 295),
    ChartDataPoint(label: 'Apr', value: 340),
    ChartDataPoint(label: 'May', value: 385),
    ChartDataPoint(label: 'Jun', value: 342),
  ];

  static final List<ChartDataPoint> customerGrowthChartData = [
    ChartDataPoint(label: 'Jan', value: 45),
    ChartDataPoint(label: 'Feb', value: 52),
    ChartDataPoint(label: 'Mar', value: 58),
    ChartDataPoint(label: 'Apr', value: 67),
    ChartDataPoint(label: 'May', value: 76),
    ChartDataPoint(label: 'Jun', value: 89),
  ];

  static final List<ChartDataPoint> conversionRateChartData = [
    ChartDataPoint(label: 'Jan', value: 3.2),
    ChartDataPoint(label: 'Feb', value: 3.5),
    ChartDataPoint(label: 'Mar', value: 3.1),
    ChartDataPoint(label: 'Apr', value: 3.8),
    ChartDataPoint(label: 'May', value: 4.1),
    ChartDataPoint(label: 'Jun', value: 3.9),
  ];

  static final AdminDashboardData dashboardData = AdminDashboardData(
    salesMetrics: salesMetrics,
    topProducts: topProducts,
    revenueChartData: revenueChartData,
    ordersChartData: ordersChartData,
  );

  // Additional analytics methods
  static double getCurrentMonthRevenue() {
    return salesMetrics.revenue.current;
  }

  static double getPreviousMonthRevenue() {
    return salesMetrics.revenue.previous;
  }

  static int getCurrentMonthOrders() {
    return salesMetrics.orders.current.toInt();
  }

  static int getPreviousMonthOrders() {
    return salesMetrics.orders.previous.toInt();
  }

  static int getCurrentMonthCustomers() {
    return salesMetrics.customers.current.toInt();
  }

  static double getCurrentMonthAverageOrderValue() {
    return salesMetrics.averageOrderValue.current;
  }

  static List<TopProduct> getTopPerformingProducts({int limit = 5}) {
    return topProducts.take(limit).toList();
  }

  static List<ChartDataPoint> getRevenueTrendData() {
    return revenueChartData;
  }

  static List<ChartDataPoint> getOrdersTrendData() {
    return ordersChartData;
  }

  static List<ChartDataPoint> getCustomerGrowthData() {
    return customerGrowthChartData;
  }

  static List<ChartDataPoint> getConversionRateData() {
    return conversionRateChartData;
  }

  // Quick stats for dashboard widgets
  static Map<String, dynamic> getQuickStats() {
    return {
      'totalRevenue': getCurrentMonthRevenue(),
      'totalOrders': getCurrentMonthOrders(),
      'totalCustomers': getCurrentMonthCustomers(),
      'averageOrderValue': getCurrentMonthAverageOrderValue(),
      'revenueGrowth': salesMetrics.revenue.growth,
      'ordersGrowth': salesMetrics.orders.growth,
      'customersGrowth': salesMetrics.customers.growth,
      'aovGrowth': salesMetrics.averageOrderValue.growth,
    };
  }
}
