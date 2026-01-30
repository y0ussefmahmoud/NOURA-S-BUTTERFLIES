enum ProductBadgeType {
  newProduct('new'),
  bestseller('bestseller'),
  sale('sale'),
  vegan('vegan'),
  crueltyFree('cruelty-free'),
  parabenFree('paraben-free'),
  organic('organic');

  final String value;
  const ProductBadgeType(this.value);

  static ProductBadgeType fromString(String value) {
    return ProductBadgeType.values.firstWhere(
      (type) => type.value == value,
      orElse: () => ProductBadgeType.newProduct,
    );
  }
}

class ProductBadge {
  final ProductBadgeType type;
  final String? text;

  const ProductBadge({
    required this.type,
    this.text,
  });

  factory ProductBadge.fromJson(Map<String, dynamic> json) => ProductBadge(
        type: ProductBadgeType.fromString(json['type'] as String),
        text: json['text'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'type': type.value,
        if (text != null) 'text': text,
      };

  ProductBadge copyWith({
    ProductBadgeType? type,
    String? text,
  }) =>
      ProductBadge(
        type: type ?? this.type,
        text: text ?? this.text,
      );
}
