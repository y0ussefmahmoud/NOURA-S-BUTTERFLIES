import 'package:hive/hive.dart';
import '../../../data/models/admin_product.dart';

/// Hive TypeAdapter for AdminProduct
class AdminProductAdapter extends TypeAdapter<AdminProduct> {
  @override
  final int typeId = 0;

  @override
  AdminProduct read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return AdminProduct(
      id: fields[0] as String,
      name: fields[1] as String,
      nameAr: fields[2] as String,
      sku: fields[3] as String,
      slug: fields[4] as String,
      description: fields[5] as String,
      descriptionAr: fields[6] as String,
      price: (fields[7] as num).toDouble(),
      category: fields[8] as String,
      images: (fields[9] as List).cast<String>(),
      rating: (fields[10] as num).toDouble(),
      reviewCount: fields[11] as int,
      inventory: fields[12] as ProductInventory,
      cost: (fields[13] as num?)?.toDouble(),
      supplier: fields[14] as String?,
      createdBy: fields[15] as String,
      lastModified: fields[16] as DateTime,
      seo: fields[17] as SEOData?,
    );
  }

  @override
  void write(BinaryWriter writer, AdminProduct obj) {
    writer.writeByte(18);
    writer.writeByte(0);
    writer.write(obj.id);
    writer.writeByte(1);
    writer.write(obj.name);
    writer.writeByte(2);
    writer.write(obj.nameAr);
    writer.writeByte(3);
    writer.write(obj.sku);
    writer.writeByte(4);
    writer.write(obj.slug);
    writer.writeByte(5);
    writer.write(obj.description);
    writer.writeByte(6);
    writer.write(obj.descriptionAr);
    writer.writeByte(7);
    writer.write(obj.price);
    writer.writeByte(8);
    writer.write(obj.category);
    writer.writeByte(9);
    writer.write(obj.images);
    writer.writeByte(10);
    writer.write(obj.rating);
    writer.writeByte(11);
    writer.write(obj.reviewCount);
    writer.writeByte(12);
    writer.write(obj.inventory);
    writer.writeByte(13);
    writer.write(obj.cost);
    writer.writeByte(14);
    writer.write(obj.supplier);
    writer.writeByte(15);
    writer.write(obj.createdBy);
    writer.writeByte(16);
    writer.write(obj.lastModified);
    writer.writeByte(17);
    writer.write(obj.seo);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is AdminProductAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for ProductInventory
class ProductInventoryAdapter extends TypeAdapter<ProductInventory> {
  @override
  final int typeId = 1;

  @override
  ProductInventory read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return ProductInventory(
      quantity: fields[0] as int,
      lowStockThreshold: fields[1] as int,
      maxStock: fields[2] as int,
      reorderPoint: fields[3] as int,
      reorderQuantity: fields[4] as int,
      warehouseLocation: fields[5] as String?,
      trackQuantity: fields[6] as bool,
      allowBackorder: fields[7] as bool,
    );
  }

  @override
  void write(BinaryWriter writer, ProductInventory obj) {
    writer.writeByte(8);
    writer.writeByte(0);
    writer.write(obj.quantity);
    writer.writeByte(1);
    writer.write(obj.lowStockThreshold);
    writer.writeByte(2);
    writer.write(obj.maxStock);
    writer.writeByte(3);
    writer.write(obj.reorderPoint);
    writer.writeByte(4);
    writer.write(obj.reorderQuantity);
    writer.writeByte(5);
    writer.write(obj.warehouseLocation);
    writer.writeByte(6);
    writer.write(obj.trackQuantity);
    writer.writeByte(7);
    writer.write(obj.allowBackorder);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProductInventoryAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}

/// Hive TypeAdapter for SEOData
class SEODataAdapter extends TypeAdapter<SEOData> {
  @override
  final int typeId = 2;

  @override
  SEOData read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    
    return SEOData(
      title: fields[0] as String?,
      description: fields[1] as String?,
      keywords: (fields[2] as List?)?.cast<String>(),
      ogImage: fields[3] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, SEOData obj) {
    writer.writeByte(4);
    writer.writeByte(0);
    writer.write(obj.title);
    writer.writeByte(1);
    writer.write(obj.description);
    writer.writeByte(2);
    writer.write(obj.keywords);
    writer.writeByte(3);
    writer.write(obj.ogImage);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SEODataAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
