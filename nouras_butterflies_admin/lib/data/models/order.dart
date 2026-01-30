enum OrderStatus {
  pending,
  processing,
  shipped,
  delivered,
  cancelled,
}

enum PaymentStatus {
  pending,
  processing,
  completed,
  failed,
  refunded,
}

class ShippingAddress {
  final String street;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final bool isDefault;

  const ShippingAddress({
    required this.street,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    this.isDefault = false,
  });

  factory ShippingAddress.fromJson(Map<String, dynamic> json) {
    return ShippingAddress(
      street: json['street'] as String,
      city: json['city'] as String,
      state: json['state'] as String,
      postalCode: json['postalCode'] as String,
      country: json['country'] as String,
      isDefault: json['isDefault'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'postalCode': postalCode,
      'country': country,
      'isDefault': isDefault,
    };
  }

  String get fullAddress {
    return '$street, $city, $state $postalCode, $country';
  }
}

class OrderItem {
  final String id;
  final String productId;
  final String productName;
  final String productImage;
  final int quantity;
  final double unitPrice;
  final double totalPrice;

  const OrderItem({
    required this.id,
    required this.productId,
    required this.productName,
    required this.productImage,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as String,
      productId: json['productId'] as String,
      productName: json['productName'] as String,
      productImage: json['productImage'] as String,
      quantity: json['quantity'] as int,
      unitPrice: (json['unitPrice'] as num).toDouble(),
      totalPrice: (json['totalPrice'] as num).toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'productId': productId,
      'productName': productName,
      'productImage': productImage,
      'quantity': quantity,
      'unitPrice': unitPrice,
      'totalPrice': totalPrice,
    };
  }
}

class Order {
  final String id;
  final String customerId;
  final String customerName;
  final String customerEmail;
  final String customerPhone;
  final List<OrderItem> items;
  final ShippingAddress shippingAddress;
  final OrderStatus status;
  final PaymentStatus paymentStatus;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final DateTime? shippedAt;
  final DateTime? deliveredAt;
  final String? trackingNumber;
  final double subtotal;
  final double tax;
  final double shipping;
  final double total;
  final String? notes;

  const Order({
    required this.id,
    required this.customerId,
    required this.customerName,
    required this.customerEmail,
    required this.customerPhone,
    required this.items,
    required this.shippingAddress,
    required this.status,
    required this.paymentStatus,
    required this.createdAt,
    this.updatedAt,
    this.shippedAt,
    this.deliveredAt,
    this.trackingNumber,
    required this.subtotal,
    required this.tax,
    required this.shipping,
    required this.total,
    this.notes,
  });

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'] as String,
      customerId: json['customerId'] as String,
      customerName: json['customerName'] as String,
      customerEmail: json['customerEmail'] as String,
      customerPhone: json['customerPhone'] as String,
      items: (json['items'] as List<dynamic>)
          .map((item) => OrderItem.fromJson(item as Map<String, dynamic>))
          .toList(),
      shippingAddress: ShippingAddress.fromJson(json['shippingAddress'] as Map<String, dynamic>),
      status: OrderStatus.values.firstWhere(
        (e) => e.name == json['status'],
        orElse: () => OrderStatus.pending,
      ),
      paymentStatus: PaymentStatus.values.firstWhere(
        (e) => e.name == json['paymentStatus'],
        orElse: () => PaymentStatus.pending,
      ),
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt'] as String) : null,
      shippedAt: json['shippedAt'] != null ? DateTime.parse(json['shippedAt'] as String) : null,
      deliveredAt: json['deliveredAt'] != null ? DateTime.parse(json['deliveredAt'] as String) : null,
      trackingNumber: json['trackingNumber'] as String?,
      subtotal: (json['subtotal'] as num).toDouble(),
      tax: (json['tax'] as num).toDouble(),
      shipping: (json['shipping'] as num).toDouble(),
      total: (json['total'] as num).toDouble(),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'customerId': customerId,
      'customerName': customerName,
      'customerEmail': customerEmail,
      'customerPhone': customerPhone,
      'items': items.map((item) => item.toJson()).toList(),
      'shippingAddress': shippingAddress.toJson(),
      'status': status.name,
      'paymentStatus': paymentStatus.name,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'shippedAt': shippedAt?.toIso8601String(),
      'deliveredAt': deliveredAt?.toIso8601String(),
      'trackingNumber': trackingNumber,
      'subtotal': subtotal,
      'tax': tax,
      'shipping': shipping,
      'total': total,
      'notes': notes,
    };
  }

  Order copyWith({
    String? id,
    String? customerId,
    String? customerName,
    String? customerEmail,
    String? customerPhone,
    List<OrderItem>? items,
    ShippingAddress? shippingAddress,
    OrderStatus? status,
    PaymentStatus? paymentStatus,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? shippedAt,
    DateTime? deliveredAt,
    String? trackingNumber,
    double? subtotal,
    double? tax,
    double? shipping,
    double? total,
    String? notes,
  }) {
    return Order(
      id: id ?? this.id,
      customerId: customerId ?? this.customerId,
      customerName: customerName ?? this.customerName,
      customerEmail: customerEmail ?? this.customerEmail,
      customerPhone: customerPhone ?? this.customerPhone,
      items: items ?? this.items,
      shippingAddress: shippingAddress ?? this.shippingAddress,
      status: status ?? this.status,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      shippedAt: shippedAt ?? this.shippedAt,
      deliveredAt: deliveredAt ?? this.deliveredAt,
      trackingNumber: trackingNumber ?? this.trackingNumber,
      subtotal: subtotal ?? this.subtotal,
      tax: tax ?? this.tax,
      shipping: shipping ?? this.shipping,
      total: total ?? this.total,
      notes: notes ?? this.notes,
    );
  }

  String get formattedDate {
    return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
  }

  String get formattedTotal {
    return '\$${total.toStringAsFixed(2)}';
  }
}
