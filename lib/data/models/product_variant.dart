class ProductVariant {
  final String id;
  final String name;
  final String value;
  final String? color;
  final bool inStock;

  const ProductVariant({
    required this.id,
    required this.name,
    required this.value,
    this.color,
    required this.inStock,
  });

  factory ProductVariant.fromJson(Map<String, dynamic> json) => ProductVariant(
        id: json['id'] as String,
        name: json['name'] as String,
        value: json['value'] as String,
        color: json['color'] as String?,
        inStock: json['inStock'] as bool? ?? json['in_stock'] as bool? ?? true,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'value': value,
        if (color != null) 'color': color,
        'inStock': inStock,
      };

  ProductVariant copyWith({
    String? id,
    String? name,
    String? value,
    String? color,
    bool? inStock,
  }) =>
      ProductVariant(
        id: id ?? this.id,
        name: name ?? this.name,
        value: value ?? this.value,
        color: color ?? this.color,
        inStock: inStock ?? this.inStock,
      );
}
