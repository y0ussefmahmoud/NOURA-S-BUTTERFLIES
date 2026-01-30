import '../models/admin_dashboard_data.dart';
import '../models/chart_data_point.dart';

class MockAdminStats {
  static AdminDashboardData get dashboardData {
    return AdminDashboardData(
      salesMetrics: SalesMetrics(
        revenue: MetricValue(current: 45678.90, growth: 12.5),
        orders: MetricValue(current: 234, growth: 8.3),
        customers: MetricValue(current: 1234, growth: 15.7),
        averageOrderValue: MetricValue(current: 195.20, growth: 3.8),
      ),
      revenueChartData: [
        ChartDataPoint(label: 'Jan', value: 32000),
        ChartDataPoint(label: 'Feb', value: 35000),
        ChartDataPoint(label: 'Mar', value: 38000),
        ChartDataPoint(label: 'Apr', value: 42000),
        ChartDataPoint(label: 'May', value: 39000),
        ChartDataPoint(label: 'Jun', value: 45678),
      ],
      topProducts: [
        TopProduct(
          id: '1',
          name: 'Butterfly Necklace Gold',
          unitsSold: 45,
          revenue: 6750.0,
          growth: 12.5,
        ),
        TopProduct(
          id: '2',
          name: 'Silver Butterfly Ring',
          unitsSold: 38,
          revenue: 3420.0,
          growth: 8.3,
        ),
        TopProduct(
          id: '3',
          name: 'Butterfly Earrings Set',
          unitsSold: 32,
          revenue: 2880.0,
          growth: -2.1,
        ),
        TopProduct(
          id: '4',
          name: 'Rose Gold Butterfly Bracelet',
          unitsSold: 28,
          revenue: 4200.0,
          growth: 15.7,
        ),
        TopProduct(
          id: '5',
          name: 'Diamond Butterfly Pendant',
          unitsSold: 15,
          revenue: 8900.0,
          growth: 25.3,
        ),
      ],
    );
  }

  static List<ChartDataPoint> get monthlySalesData {
    return [
      ChartDataPoint(label: 'Jan', value: 32000),
      ChartDataPoint(label: 'Feb', value: 35000),
      ChartDataPoint(label: 'Mar', value: 38000),
      ChartDataPoint(label: 'Apr', value: 42000),
      ChartDataPoint(label: 'May', value: 39000),
      ChartDataPoint(label: 'Jun', value: 45678),
      ChartDataPoint(label: 'Jul', value: 48000),
      ChartDataPoint(label: 'Aug', value: 52000),
      ChartDataPoint(label: 'Sep', value: 49000),
      ChartDataPoint(label: 'Oct', value: 51000),
      ChartDataPoint(label: 'Nov', value: 54000),
      ChartDataPoint(label: 'Dec', value: 58000),
    ];
  }
}
