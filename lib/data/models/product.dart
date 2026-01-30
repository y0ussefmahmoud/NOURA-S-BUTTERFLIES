import 'product_image.dart';
import 'product_variant.dart';
import 'product_badge.dart';
import 'product_details.dart';

class Product {
  final String id;
  final String name;
  final String slug;
  final String description;
  final double price;
  final double? compareAtPrice;
  final List<ProductImage> images;
  final double rating;
  final int reviewCount;
  final List<ProductBadge> badges;
  final String category;
  final bool inStock;
  final List<ProductVariant> variants;
  final bool isBestseller;
  final ProductDetails? productDetails;

  const Product({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    required this.price,
    this.compareAtPrice,
    required this.images,
    required this.rating,
    required this.reviewCount,
    required this.badges,
    required this.category,
    required this.inStock,
    required this.variants,
    this.isBestseller = false,
    this.productDetails,
  });

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] as String,
        name: json['name'] as String,
        slug: json['slug'] as String,
        description: json['description'] as String,
        price: (json['price'] as num).toDouble(),
        compareAtPrice: json['compareAtPrice'] != null
            ? (json['compareAtPrice'] as num).toDouble()
            : null,
        images: (json['images'] as List<dynamic>)
            .map((e) => ProductImage.fromJson(e as Map<String, dynamic>))
            .toList(),
        rating: (json['rating'] as num).toDouble(),
        reviewCount: json['reviewCount'] as int,
        badges: (json['badges'] as List<dynamic>)
            .map((e) => ProductBadge.fromJson(e as Map<String, dynamic>))
            .toList(),
        category: json['category'] as String,
        inStock: json['inStock'] as bool? ?? json['in_stock'] as bool? ?? true,
        variants: (json['variants'] as List<dynamic>)
            .map((e) => ProductVariant.fromJson(e as Map<String, dynamic>))
            .toList(),
        isBestseller: json['isBestseller'] as bool? ?? false,
        productDetails: json['productDetails'] != null
            ? ProductDetails.fromJson(json['productDetails'] as Map<String, dynamic>)
            : null,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'slug': slug,
        'description': description,
        'price': price,
        if (compareAtPrice != null) 'compareAtPrice': compareAtPrice,
        'images': images.map((e) => e.toJson()).toList(),
        'rating': rating,
        'reviewCount': reviewCount,
        'badges': badges.map((e) => e.toJson()).toList(),
        'category': category,
        'inStock': inStock,
        'variants': variants.map((e) => e.toJson()).toList(),
        'isBestseller': isBestseller,
        if (productDetails != null) 'productDetails': productDetails!.toJson(),
      };

  Product copyWith({
    String? id,
    String? name,
    String? slug,
    String? description,
    double? price,
    double? compareAtPrice,
    List<ProductImage>? images,
    double? rating,
    int? reviewCount,
    List<ProductBadge>? badges,
    String? category,
    bool? inStock,
    List<ProductVariant>? variants,
    bool? isBestseller,
    ProductDetails? productDetails,
  }) =>
      Product(
        id: id ?? this.id,
        name: name ?? this.name,
        slug: slug ?? this.slug,
        description: description ?? this.description,
        price: price ?? this.price,
        compareAtPrice: compareAtPrice ?? this.compareAtPrice,
        images: images ?? this.images,
        rating: rating ?? this.rating,
        reviewCount: reviewCount ?? this.reviewCount,
        badges: badges ?? this.badges,
        category: category ?? this.category,
        inStock: inStock ?? this.inStock,
        variants: variants ?? this.variants,
        isBestseller: isBestseller ?? this.isBestseller,
        productDetails: productDetails ?? this.productDetails,
      );

  // Helper getters
  bool get hasDiscount => compareAtPrice != null && compareAtPrice! > price;
  double get discountPercentage =>
      hasDiscount ? ((compareAtPrice! - price) / compareAtPrice!) * 100 : 0;
  String get mainImageUrl => images.isNotEmpty ? images.first.url : '';
}
