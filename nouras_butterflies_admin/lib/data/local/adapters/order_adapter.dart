import 'package:hive/hive.dart';
import '../../../data/models/order.dart';

/// Hive TypeAdapter for Order
class OrderAdapter extends TypeAdapter<Order> {
  @override
  final int typeId = 3;

  @override
  Order read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return Order(
      id: fields[0] as String,
      orderNumber: fields[1] as String,
      customerId: fields[2] as String,
      customerName: fields[3] as String,
      customerEmail: fields[4] as String,
      customerPhone: fields[5] as String,
      status: fields[6] as String,
      paymentStatus: fields[7] as String,
      paymentMethod: fields[8] as String,
      subtotal: (fields[9] as num).toDouble(),
      tax: (fields[10] as num).toDouble(),
      shipping: (fields[11] as num).toDouble(),
      discount: (fields[12] as num).toDouble(),
      total: (fields[13] as num).toDouble(),
      currency: fields[14] as String,
      items: (fields[15] as List).cast<OrderItem>(),
      shippingAddress: fields[16] as Address,
      billingAddress: fields[17] as Address?,
      notes: fields[18] as String?,
      createdAt: fields[19] as DateTime,
      updatedAt: fields[20] as DateTime,
      shippedAt: fields[21] as DateTime?,
      deliveredAt: fields[22] as DateTime?,
      trackingNumber: fields[23] as String?,
      carrier: fields[24] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, Order obj) {
    writer.writeByte(25);
    writer.writeByte(0);
    writer.write(obj.id);
    writer.writeByte(1);
    writer.write(obj.orderNumber);
    writer.writeByte(2);
    writer.write(obj.customerId);
    writer.writeByte(3);
    writer.write(obj.customerName);
    writer.writeByte(4);
    writer.write(obj.customerEmail);
    writer.writeByte(5);
    writer.write(obj.customerPhone);
    writer.writeByte(6);
    writer.write(obj.status);
    writer.writeByte(7);
    writer.write(obj.paymentStatus);
    writer.writeByte(8);
    writer.write(obj.paymentMethod);
    writer.writeByte(9);
    writer.write(obj.subtotal);
    writer.writeByte(10);
    writer.write(obj.tax);
    writer.writeByte(11);
    writer.write(obj.shipping);
    writer.writeByte(12);
    writer.write(obj.discount);
    writer.writeByte(13);
    writer.write(obj.total);
    writer.writeByte(14);
    writer.write(obj.currency);
    writer.writeByte(15);
    writer.write(obj.items);
    writer.writeByte(16);
    writer.write(obj.shippingAddress);
    writer.writeByte(17);
    writer.write(obj.billingAddress);
    writer.writeByte(18);
    writer.write(obj.notes);
    writer.writeByte(19);
    writer.write(obj.createdAt);
    writer.writeByte(20);
    writer.write(obj.updatedAt);
    writer.writeByte(21);
    writer.write(obj.shippedAt);
    writer.writeByte(22);
    writer.write(obj.deliveredAt);
    writer.writeByte(23);
    writer.write(obj.trackingNumber);
    writer.writeByte(24);
    writer.write(obj.carrier);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OrderAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for OrderItem
class OrderItemAdapter extends TypeAdapter<OrderItem> {
  @override
  final int typeId = 4;

  @override
  OrderItem read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return OrderItem(
      productId: fields[0] as String,
      productName: fields[1] as String,
      productNameAr: fields[2] as String,
      sku: fields[3] as String,
      quantity: fields[4] as int,
      price: (fields[5] as num).toDouble(),
      total: (fields[6] as num).toDouble(),
      image: fields[7] as String?,
      variant: fields[8] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, OrderItem obj) {
    writer.writeByte(9);
    writer.writeByte(0);
    writer.write(obj.productId);
    writer.writeByte(1);
    writer.write(obj.productName);
    writer.writeByte(2);
    writer.write(obj.productNameAr);
    writer.writeByte(3);
    writer.write(obj.sku);
    writer.writeByte(4);
    writer.write(obj.quantity);
    writer.writeByte(5);
    writer.write(obj.price);
    writer.writeByte(6);
    writer.write(obj.total);
    writer.writeByte(7);
    writer.write(obj.image);
    writer.writeByte(8);
    writer.write(obj.variant);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is OrderItemAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for Address
class AddressAdapter extends TypeAdapter<Address> {
  @override
  final int typeId = 5;

  @override
  Address read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return Address(
      street: fields[0] as String,
      city: fields[1] as String,
      state: fields[2] as String,
      postalCode: fields[3] as String,
      country: fields[4] as String,
      isDefault: fields[5] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, Address obj) {
    writer.writeByte(6);
    writer.writeByte(0);
    writer.write(obj.street);
    writer.writeByte(1);
    writer.write(obj.city);
    writer.writeByte(2);
    writer.write(obj.state);
    writer.writeByte(3);
    writer.write(obj.postalCode);
    writer.writeByte(4);
    writer.write(obj.country);
    writer.writeByte(5);
    writer.write(obj.isDefault);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AddressAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
