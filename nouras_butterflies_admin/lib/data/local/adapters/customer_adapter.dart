import 'package:hive/hive.dart';
import '../../../data/models/customer.dart';

/// Hive TypeAdapter for Customer
class CustomerAdapter extends TypeAdapter<Customer> {
  @override
  final int typeId = 6;

  @override
  Customer read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return Customer(
      id: fields[0] as String,
      name: fields[1] as String,
      email: fields[2] as String,
      phone: fields[3] as String,
      avatar: fields[4] as String?,
      dateOfBirth: fields[5] as DateTime?,
      gender: fields[6] as String?,
      addresses: (fields[7] as List).cast<Address>(),
      defaultAddress: fields[8] as Address?,
      preferences: fields[9] as CustomerPreferences?,
      loyaltyPoints: fields[10] as int,
      totalSpent: (fields[11] as num).toDouble(),
      orderCount: fields[12] as int,
      lastOrderAt: fields[13] as DateTime?,
      status: fields[14] as String,
      isVerified: fields[15] as bool,
      isSubscribedToNewsletter: fields[16] as bool,
      createdAt: fields[17] as DateTime,
      updatedAt: fields[18] as DateTime,
    );
  }

  @override
  void write(BinaryWriter writer, Customer obj) {
    writer.writeByte(19);
    writer.writeByte(0);
    writer.write(obj.id);
    writer.writeByte(1);
    writer.write(obj.name);
    writer.writeByte(2);
    writer.write(obj.email);
    writer.writeByte(3);
    writer.write(obj.phone);
    writer.writeByte(4);
    writer.write(obj.avatar);
    writer.writeByte(5);
    writer.write(obj.dateOfBirth);
    writer.writeByte(6);
    writer.write(obj.gender);
    writer.writeByte(7);
    writer.write(obj.addresses);
    writer.writeByte(8);
    writer.write(obj.defaultAddress);
    writer.writeByte(9);
    writer.write(obj.preferences);
    writer.writeByte(10);
    writer.write(obj.loyaltyPoints);
    writer.writeByte(11);
    writer.write(obj.totalSpent);
    writer.writeByte(12);
    writer.write(obj.orderCount);
    writer.writeByte(13);
    writer.write(obj.lastOrderAt);
    writer.writeByte(14);
    writer.write(obj.status);
    writer.writeByte(15);
    writer.write(obj.isVerified);
    writer.writeByte(16);
    writer.write(obj.isSubscribedToNewsletter);
    writer.writeByte(17);
    writer.write(obj.createdAt);
    writer.writeByte(18);
    writer.write(obj.updatedAt);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CustomerAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for CustomerPreferences
class CustomerPreferencesAdapter extends TypeAdapter<CustomerPreferences> {
  @override
  final int typeId = 7;

  @override
  CustomerPreferences read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return CustomerPreferences(
      language: fields[0] as String?,
      currency: fields[1] as String?,
      notifications: fields[2] as bool,
      emailNotifications: fields[3] as bool,
      smsNotifications: fields[4] as bool,
      preferredCategories: (fields[5] as List?)?.cast<String>(),
      favoriteProducts: (fields[6] as List?)?.cast<String>(),
    );
  }

  @override
  void write(BinaryWriter writer, CustomerPreferences obj) {
    writer.writeByte(7);
    writer.writeByte(0);
    writer.write(obj.language);
    writer.writeByte(1);
    writer.write(obj.currency);
    writer.writeByte(2);
    writer.write(obj.notifications);
    writer.writeByte(3);
    writer.write(obj.emailNotifications);
    writer.writeByte(4);
    writer.write(obj.smsNotifications);
    writer.writeByte(5);
    writer.write(obj.favoriteCategories);
    writer.writeByte(6);
    writer.write(obj.favoriteProducts);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is CustomerPreferencesAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
