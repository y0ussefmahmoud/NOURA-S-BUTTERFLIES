import 'package:equatable/equatable.dart';

class ProductInventory extends Equatable {
  final int quantity;
  final int lowStockThreshold;
  final bool trackQuantity;
  final bool allowBackorder;

  const ProductInventory({
    required this.quantity,
    required this.lowStockThreshold,
    required this.trackQuantity,
    required this.allowBackorder,
  });

  factory ProductInventory.fromJson(Map<String, dynamic> json) {
    return ProductInventory(
      quantity: json['quantity'] as int,
      lowStockThreshold: json['lowStockThreshold'] as int,
      trackQuantity: json['trackQuantity'] as bool,
      allowBackorder: json['allowBackorder'] as bool,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'quantity': quantity,
      'lowStockThreshold': lowStockThreshold,
      'trackQuantity': trackQuantity,
      'allowBackorder': allowBackorder,
    };
  }

  ProductInventory copyWith({
    int? quantity,
    int? lowStockThreshold,
    bool? trackQuantity,
    bool? allowBackorder,
  }) {
    return ProductInventory(
      quantity: quantity ?? this.quantity,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      trackQuantity: trackQuantity ?? this.trackQuantity,
      allowBackorder: allowBackorder ?? this.allowBackorder,
    );
  }

  @override
  List<Object?> get props => [quantity, lowStockThreshold, trackQuantity, allowBackorder];
}
