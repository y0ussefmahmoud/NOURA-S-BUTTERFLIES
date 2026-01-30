class MetricValue {
  final double current;
  final double previous;
  final double growth;

  const MetricValue({
    required this.current,
    required this.previous,
    required this.growth,
  });

  factory MetricValue.fromJson(Map<String, dynamic> json) => MetricValue(
        current: (json['current'] as num).toDouble(),
        previous: (json['previous'] as num).toDouble(),
        growth: (json['growth'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'current': current,
        'previous': previous,
        'growth': growth,
      };

  MetricValue copyWith({
    double? current,
    double? previous,
    double? growth,
  }) =>
      MetricValue(
        current: current ?? this.current,
        previous: previous ?? this.previous,
        growth: growth ?? this.growth,
      );

  bool get isPositiveGrowth => growth > 0;
  bool get isNegativeGrowth => growth < 0;
  double get growthPercentage => growth.abs();
}

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

  factory SalesMetrics.fromJson(Map<String, dynamic> json) => SalesMetrics(
        revenue: MetricValue.fromJson(json['revenue'] as Map<String, dynamic>),
        orders: MetricValue.fromJson(json['orders'] as Map<String, dynamic>),
        customers:
            MetricValue.fromJson(json['customers'] as Map<String, dynamic>),
        averageOrderValue: MetricValue.fromJson(
            json['averageOrderValue'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        'revenue': revenue.toJson(),
        'orders': orders.toJson(),
        'customers': customers.toJson(),
        'averageOrderValue': averageOrderValue.toJson(),
      };

  SalesMetrics copyWith({
    MetricValue? revenue,
    MetricValue? orders,
    MetricValue? customers,
    MetricValue? averageOrderValue,
  }) =>
      SalesMetrics(
        revenue: revenue ?? this.revenue,
        orders: orders ?? this.orders,
        customers: customers ?? this.customers,
        averageOrderValue: averageOrderValue ?? this.averageOrderValue,
      );
}

class TopProduct {
  final String id;
  final String name;
  final String image;
  final double revenue;
  final int unitsSold;
  final double growth;

  const TopProduct({
    required this.id,
    required this.name,
    required this.image,
    required this.revenue,
    required this.unitsSold,
    required this.growth,
  });

  factory TopProduct.fromJson(Map<String, dynamic> json) => TopProduct(
        id: json['id'] as String,
        name: json['name'] as String,
        image: json['image'] as String,
        revenue: (json['revenue'] as num).toDouble(),
        unitsSold: json['unitsSold'] as int,
        growth: (json['growth'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'image': image,
        'revenue': revenue,
        'unitsSold': unitsSold,
        'growth': growth,
      };

  TopProduct copyWith({
    String? id,
    String? name,
    String? image,
    double? revenue,
    int? unitsSold,
    double? growth,
  }) =>
      TopProduct(
        id: id ?? this.id,
        name: name ?? this.name,
        image: image ?? this.image,
        revenue: revenue ?? this.revenue,
        unitsSold: unitsSold ?? this.unitsSold,
        growth: growth ?? this.growth,
      );

  bool get isPositiveGrowth => growth > 0;
  bool get isNegativeGrowth => growth < 0;
  double get growthPercentage => growth.abs();
}

class ChartDataPoint {
  final String label;
  final double value;
  final DateTime? date;

  const ChartDataPoint({
    required this.label,
    required this.value,
    this.date,
  });

  factory ChartDataPoint.fromJson(Map<String, dynamic> json) => ChartDataPoint(
        label: json['label'] as String,
        value: (json['value'] as num).toDouble(),
        date: json['date'] != null ? DateTime.parse(json['date'] as String) : null,
      );

  Map<String, dynamic> toJson() => {
        'label': label,
        'value': value,
        if (date != null) 'date': date!.toIso8601String(),
      };

  ChartDataPoint copyWith({
    String? label,
    double? value,
    DateTime? date,
  }) =>
      ChartDataPoint(
        label: label ?? this.label,
        value: value ?? this.value,
        date: date ?? this.date,
      );
}

class AdminDashboardData {
  final SalesMetrics salesMetrics;
  final List<TopProduct> topProducts;
  final List<ChartDataPoint> revenueChartData;
  final List<ChartDataPoint> ordersChartData;

  const AdminDashboardData({
    required this.salesMetrics,
    required this.topProducts,
    required this.revenueChartData,
    required this.ordersChartData,
  });

  factory AdminDashboardData.fromJson(Map<String, dynamic> json) =>
      AdminDashboardData(
        salesMetrics: SalesMetrics.fromJson(json['salesMetrics'] as Map<String, dynamic>),
        topProducts: (json['topProducts'] as List<dynamic>)
            .map((e) => TopProduct.fromJson(e as Map<String, dynamic>))
            .toList(),
        revenueChartData: (json['revenueChartData'] as List<dynamic>)
            .map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
            .toList(),
        ordersChartData: (json['ordersChartData'] as List<dynamic>)
            .map((e) => ChartDataPoint.fromJson(e as Map<String, dynamic>))
            .toList(),
      );

  Map<String, dynamic> toJson() => {
        'salesMetrics': salesMetrics.toJson(),
        'topProducts': topProducts.map((e) => e.toJson()).toList(),
        'revenueChartData': revenueChartData.map((e) => e.toJson()).toList(),
        'ordersChartData': ordersChartData.map((e) => e.toJson()).toList(),
      };

  AdminDashboardData copyWith({
    SalesMetrics? salesMetrics,
    List<TopProduct>? topProducts,
    List<ChartDataPoint>? revenueChartData,
    List<ChartDataPoint>? ordersChartData,
  }) =>
      AdminDashboardData(
        salesMetrics: salesMetrics ?? this.salesMetrics,
        topProducts: topProducts ?? this.topProducts,
        revenueChartData: revenueChartData ?? this.revenueChartData,
        ordersChartData: ordersChartData ?? this.ordersChartData,
      );
}
