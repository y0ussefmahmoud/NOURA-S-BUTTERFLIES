import 'package:equatable/equatable.dart';
import 'product_inventory.dart';
import 'product_supplier.dart';
import 'product_seo.dart';

class AdminProduct extends Equatable {
  final String id;
  final String name;
  final String nameAr;
  final String slug;
  final String description;
  final String descriptionAr;
  final double price;
  final String category;
  final List<String> images;
  final double rating;
  final int reviewCount;
  
  // Admin-specific fields
  final String sku;
  final ProductInventory inventory;
  final double cost;
  final ProductSupplier supplier;
  final String createdBy;
  final DateTime lastModified;
  final ProductSEO seo;

  const AdminProduct({
    required this.id,
    required this.name,
    required this.nameAr,
    required this.slug,
    required this.description,
    required this.descriptionAr,
    required this.price,
    required this.category,
    required this.images,
    required this.rating,
    required this.reviewCount,
    required this.sku,
    required this.inventory,
    required this.cost,
    required this.supplier,
    required this.createdBy,
    required this.lastModified,
    required this.seo,
  });

  factory AdminProduct.fromJson(Map<String, dynamic> json) {
    return AdminProduct(
      id: json['id'] as String,
      name: json['name'] as String,
      nameAr: json['nameAr'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      descriptionAr: json['descriptionAr'] as String,
      price: (json['price'] as num).toDouble(),
      category: json['category'] as String,
      images: List<String>.from(json['images'] as List),
      rating: (json['rating'] as num).toDouble(),
      reviewCount: json['reviewCount'] as int,
      sku: json['sku'] as String,
      inventory: ProductInventory.fromJson(json['inventory'] as Map<String, dynamic>),
      cost: (json['cost'] as num).toDouble(),
      supplier: ProductSupplier.fromJson(json['supplier'] as Map<String, dynamic>),
      createdBy: json['createdBy'] as String,
      lastModified: DateTime.parse(json['lastModified'] as String),
      seo: ProductSEO.fromJson(json['seo'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameAr': nameAr,
      'slug': slug,
      'description': description,
      'descriptionAr': descriptionAr,
      'price': price,
      'category': category,
      'images': images,
      'rating': rating,
      'reviewCount': reviewCount,
      'sku': sku,
      'inventory': inventory.toJson(),
      'cost': cost,
      'supplier': supplier.toJson(),
      'createdBy': createdBy,
      'lastModified': lastModified.toIso8601String(),
      'seo': seo.toJson(),
    };
  }

  AdminProduct copyWith({
    String? id,
    String? name,
    String? nameAr,
    String? slug,
    String? description,
    String? descriptionAr,
    double? price,
    String? category,
    List<String>? images,
    double? rating,
    int? reviewCount,
    String? sku,
    ProductInventory? inventory,
    double? cost,
    ProductSupplier? supplier,
    String? createdBy,
    DateTime? lastModified,
    ProductSEO? seo,
  }) {
    return AdminProduct(
      id: id ?? this.id,
      name: name ?? this.name,
      nameAr: nameAr ?? this.nameAr,
      slug: slug ?? this.slug,
      description: description ?? this.description,
      descriptionAr: descriptionAr ?? this.descriptionAr,
      price: price ?? this.price,
      category: category ?? this.category,
      images: images ?? this.images,
      rating: rating ?? this.rating,
      reviewCount: reviewCount ?? this.reviewCount,
      sku: sku ?? this.sku,
      inventory: inventory ?? this.inventory,
      cost: cost ?? this.cost,
      supplier: supplier ?? this.supplier,
      createdBy: createdBy ?? this.createdBy,
      lastModified: lastModified ?? this.lastModified,
      seo: seo ?? this.seo,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        nameAr,
        slug,
        description,
        descriptionAr,
        price,
        category,
        images,
        rating,
        reviewCount,
        sku,
        inventory,
        cost,
        supplier,
        createdBy,
        lastModified,
        seo,
      ];
}
