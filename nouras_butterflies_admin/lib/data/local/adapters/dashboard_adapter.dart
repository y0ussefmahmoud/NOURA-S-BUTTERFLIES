import 'package:hive/hive.dart';
import '../../../data/models/dashboard_data.dart';

/// Hive TypeAdapter for AdminDashboardData
class AdminDashboardDataAdapter extends TypeAdapter<AdminDashboardData> {
  @override
  final int typeId = 8;

  @override
  AdminDashboardData read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return AdminDashboardData(
      totalRevenue: (fields[0] as num).toDouble(),
      totalOrders: fields[1] as int,
      totalCustomers: fields[2] as int,
      totalProducts: fields[3] as int,
      averageOrderValue: (fields[4] as num).toDouble(),
      conversionRate: (fields[5] as num).toDouble(),
      revenueGrowth: (fields[6] as num).toDouble(),
      ordersGrowth: (fields[7] as num).toDouble(),
      customersGrowth: (fields[8] as num).toDouble(),
      topSellingProducts: (fields[9] as List).cast<TopProduct>(),
      recentOrders: (fields[10] as List).cast<RecentOrder>(),
      salesByCategory: (fields[11] as List).cast<CategorySales>(),
      monthlyRevenue: (fields[12] as List).cast<MonthlyRevenue>(),
      lowStockProducts: fields[13] as int,
      outOfStockProducts: fields[14] as int,
      pendingOrders: fields[15] as int,
      processingOrders: fields[16] as int,
      shippedOrders: fields[17] as int,
      deliveredOrders: fields[18] as int,
      cancelledOrders: fields[19] as int,
      returnedOrders: fields[20] as int,
      newCustomers: fields[21] as int,
      activeCustomers: fields[22] as int,
      churnedCustomers: fields[23] as int,
      lastUpdated: fields[24] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, AdminDashboardData obj) {
    writer.writeByte(25);
    writer.writeByte(0);
    writer.write(obj.totalRevenue);
    writer.writeByte(1);
    writer.write(obj.totalOrders);
    writer.writeByte(2);
    writer.write(obj.totalCustomers);
    writer.writeByte(3);
    writer.write(obj.totalProducts);
    writer.writeByte(4);
    writer.write(obj.averageOrderValue);
    writer.writeByte(5);
    writer.write(obj.conversionRate);
    writer.writeByte(6);
    writer.write(obj.revenueGrowth);
    writer.writeByte(7);
    writer.write(obj.ordersGrowth);
    writer.writeByte(8);
    writer.write(obj.customersGrowth);
    writer.writeByte(9);
    writer.write(obj.topSellingProducts);
    writer.writeByte(10);
    writer.write(obj.recentOrders);
    writer.writeByte(11);
    writer.write(obj.salesByCategory);
    writer.writeByte(12);
    writer.write(obj.monthlyRevenue);
    writer.writeByte(13);
    writer.write(obj.lowStockProducts);
    writer.writeByte(14);
    writer.write(obj.outOfStockProducts);
    writer.writeByte(15);
    writer.write(obj.pendingOrders);
    writer.writeByte(16);
    writer.write(obj.processingOrders);
    writer.writeByte(17);
    writer.write(obj.shippedOrders);
    writer.writeByte(18);
    writer.write(obj.deliveredOrders);
    writer.writeByte(19);
    writer.write(obj.cancelledOrders);
    writer.writeByte(20);
    writer.write(obj.returnedOrders);
    writer.writeByte(21);
    writer.write(obj.newCustomers);
    writer.writeByte(22);
    writer.write(obj.activeCustomers);
    writer.writeByte(23);
    writer.write(obj.churnedCustomers);
    writer.writeByte(24);
    writer.write(obj.lastUpdated);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AdminDashboardDataAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for TopProduct
class TopProductAdapter extends TypeAdapter<TopProduct> {
  @override
  final int typeId = 9;

  @override
  TopProduct read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return TopProduct(
      id: fields[0] as String,
      name: fields[1] as String,
      nameAr: fields[2] as String,
      sku: fields[3] as String,
      image: fields[4] as String?,
      category: fields[5] as String,
      price: (fields[6] as num).toDouble(),
      totalSold: fields[7] as int,
      revenue: (fields[8] as num).toDouble(),
      rating: (fields[9] as num).toDouble(),
    );
  }

  @override
  void write(BinaryWriter writer, TopProduct obj) {
    writer.writeByte(10);
    writer.writeByte(0);
    writer.write(obj.id);
    writer.writeByte(1);
    writer.write(obj.name);
    writer.writeByte(2);
    writer.write(obj.nameAr);
    writer.writeByte(3);
    writer.write(obj.sku);
    writer.writeByte(4);
    writer.write(obj.image);
    writer.writeByte(5);
    writer.write(obj.category);
    writer.writeByte(6);
    writer.write(obj.price);
    writer.writeByte(7);
    writer.write(obj.totalSold);
    writer.writeByte(8);
    writer.write(obj.revenue);
    writer.writeByte(9);
    writer.write(obj.rating);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is TopProductAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for RecentOrder
class RecentOrderAdapter extends TypeAdapter<RecentOrder> {
  @override
  final int typeId = 10;

  @override
  RecentOrder read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return RecentOrder(
      id: fields[0] as String,
      orderNumber: fields[1] as String,
      customerName: fields[2] as String,
      customerEmail: fields[3] as String,
      status: fields[4] as String,
      total: (fields[5] as num).toDouble(),
      currency: fields[6] as String,
      createdAt: fields[7] as DateTime,
      itemCount: fields[8] as int,
    );
  }

  @override
  void write(BinaryWriter writer, RecentOrder obj) {
    writer.writeByte(9);
    writer.writeByte(0);
    writer.write(obj.id);
    writer.writeByte(1);
    writer.write(obj.orderNumber);
    writer.writeByte(2);
    writer.write(obj.customerName);
    writer.writeByte(3);
    writer.write(obj.customerEmail);
    writer.writeByte(4);
    writer.write(obj.status);
    writer.writeByte(5);
    writer.write(obj.total);
    writer.writeByte(6);
    writer.write(obj.currency);
    writer.writeByte(7);
    writer.write(obj.createdAt);
    writer.writeByte(8);
    writer.write(obj.itemCount);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is RecentOrderAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for CategorySales
class CategorySalesAdapter extends TypeAdapter<CategorySales> {
  @override
  final int typeId = 11;

  @override
  CategorySales read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return CategorySales(
      category: fields[0] as String,
      sales: (fields[1] as num).toDouble(),
      orders: fields[2] as int,
      percentage: (fields[3] as num).toDouble(),
    );
  }

  @override
  void write(BinaryWriter writer, CategorySales obj) {
    writer.writeByte(4);
    writer.writeByte(0);
    writer.write(obj.category);
    writer.writeByte(1);
    writer.write(obj.sales);
    writer.writeByte(2);
    writer.write(obj.orders);
    writer.writeByte(3);
    writer.write(obj.percentage);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CategorySalesAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for MonthlyRevenue
class MonthlyRevenueAdapter extends TypeAdapter<MonthlyRevenue> {
  @override
  final int typeId = 12;

  @override
  MonthlyRevenue read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return MonthlyRevenue(
      month: fields[0] as String,
      revenue: (fields[1] as num).toDouble(),
      orders: fields[2] as int,
      customers: fields[3] as int,
    );
  }

  @override
  void write(BinaryWriter writer, MonthlyRevenue obj) {
    writer.writeByte(4);
    writer.writeByte(0);
    writer.write(obj.month);
    writer.writeByte(1);
    writer.write(obj.revenue);
    writer.writeByte(2);
    writer.write(obj.orders);
    writer.writeByte(3);
    writer.write(obj.customers);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MonthlyRevenueAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
