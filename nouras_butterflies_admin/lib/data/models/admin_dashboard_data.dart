import 'chart_data_point.dart';

class SalesMetrics {
  final MetricValue revenue;
  final MetricValue orders;
  final MetricValue customers;
  final MetricValue averageOrderValue;

  const SalesMetrics({
    required this.revenue,
    required this.orders,
    required this.customers,
    required this.averageOrderValue,
  });

  factory SalesMetrics.fromJson(Map<String, dynamic> json) {
    return SalesMetrics(
      revenue: MetricValue.fromJson(json['revenue'] as Map<String, dynamic>),
      orders: MetricValue.fromJson(json['orders'] as Map<String, dynamic>),
      customers: MetricValue.fromJson(json['customers'] as Map<String, dynamic>),
      averageOrderValue: MetricValue.fromJson(json['averageOrderValue'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'revenue': revenue.toJson(),
      'orders': orders.toJson(),
      'customers': customers.toJson(),
      'averageOrderValue': averageOrderValue.toJson(),
    };
  }
}

class MetricValue {
  final double current;
  final double growth;

  const MetricValue({
    required this.current,
    required this.growth,
  });

  factory MetricValue.fromJson(Map<String, dynamic> json) {
    return MetricValue(
      current: (json['current'] as num).toDouble(),
      growth: (json['growth'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'current': current,
      'growth': growth,
    };
  }
}

class TopProduct {
  final String id;
  final String name;
  final int unitsSold;
  final double revenue;
  final double growth;

  const TopProduct({
    required this.id,
    required this.name,
    required this.unitsSold,
    required this.revenue,
    required this.growth,
  });

  factory TopProduct.fromJson(Map<String, dynamic> json) {
    return TopProduct(
      id: json['id'] as String,
      name: json['name'] as String,
      unitsSold: json['unitsSold'] as int,
      revenue: (json['revenue'] as num).toDouble(),
      growth: (json['growth'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'unitsSold': unitsSold,
      'revenue': revenue,
      'growth': growth,
    };
  }
}

class AdminDashboardData {
  final SalesMetrics salesMetrics;
  final List<ChartDataPoint> revenueChartData;
  final List<TopProduct> topProducts;

  const AdminDashboardData({
    required this.salesMetrics,
    required this.revenueChartData,
    required this.topProducts,
  });

  factory AdminDashboardData.fromJson(Map<String, dynamic> json) {
    return AdminDashboardData(
      salesMetrics: SalesMetrics.fromJson(json['salesMetrics'] as Map<String, dynamic>),
      revenueChartData: (json['revenueChartData'] as List)
          .map((item) => ChartDataPoint.fromJson(item as Map<String, dynamic>))
          .toList(),
      topProducts: (json['topProducts'] as List)
          .map((item) => TopProduct.fromJson(item as Map<String, dynamic>))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'salesMetrics': salesMetrics.toJson(),
      'revenueChartData': revenueChartData.map((item) => item.toJson()).toList(),
      'topProducts': topProducts.map((item) => item.toJson()).toList(),
    };
  }
}
