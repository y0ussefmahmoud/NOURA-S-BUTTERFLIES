import 'product.dart';

enum OrderStatus {
  pending,
  processing,
  shipped,
  delivered,
  cancelled;

  String get displayName {
    switch (this) {
      case OrderStatus.pending:
        return 'Pending';
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  static OrderStatus fromString(String value) {
    return OrderStatus.values.firstWhere(
      (status) => status.name == value.toLowerCase(),
      orElse: () => OrderStatus.pending,
    );
  }
}

enum PaymentStatus {
  pending,
  paid,
  failed,
  refunded;

  static PaymentStatus fromString(String value) {
    return PaymentStatus.values.firstWhere(
      (status) => status.name == value.toLowerCase(),
      orElse: () => PaymentStatus.pending,
    );
  }
}

class OrderItemVariant {
  final String name;
  final String value;

  const OrderItemVariant({
    required this.name,
    required this.value,
  });

  factory OrderItemVariant.fromJson(Map<String, dynamic> json) =>
      OrderItemVariant(
        name: json['name'] as String,
        value: json['value'] as String,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'value': value,
      };

  OrderItemVariant copyWith({
    String? name,
    String? value,
  }) =>
      OrderItemVariant(
        name: name ?? this.name,
        value: value ?? this.value,
      );
}

class OrderItem {
  final String productId;
  final Product product;
  final int quantity;
  final double price;
  final OrderItemVariant? variant;

  const OrderItem({
    required this.productId,
    required this.product,
    required this.quantity,
    required this.price,
    this.variant,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) => OrderItem(
        productId: json['productId'] as String,
        product: Product.fromJson(json['product'] as Map<String, dynamic>),
        quantity: json['quantity'] as int,
        price: (json['price'] as num).toDouble(),
        variant: json['variant'] != null
            ? OrderItemVariant.fromJson(json['variant'] as Map<String, dynamic>)
            : null,
      );

  Map<String, dynamic> toJson() => {
        'productId': productId,
        'product': product.toJson(),
        'quantity': quantity,
        'price': price,
        if (variant != null) 'variant': variant!.toJson(),
      };

  OrderItem copyWith({
    String? productId,
    Product? product,
    int? quantity,
    double? price,
    OrderItemVariant? variant,
  }) =>
      OrderItem(
        productId: productId ?? this.productId,
        product: product ?? this.product,
        quantity: quantity ?? this.quantity,
        price: price ?? this.price,
        variant: variant ?? this.variant,
      );

  double get total => price * quantity;
}

class ShippingAddress {
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;

  const ShippingAddress({
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
  });

  factory ShippingAddress.fromJson(Map<String, dynamic> json) =>
      ShippingAddress(
        street: json['street'] as String,
        city: json['city'] as String,
        state: json['state'] as String,
        zipCode: json['zipCode'] as String,
        country: json['country'] as String,
      );

  Map<String, dynamic> toJson() => {
        'street': street,
        'city': city,
        'state': state,
        'zipCode': zipCode,
        'country': country,
      };

  ShippingAddress copyWith({
    String? street,
    String? city,
    String? state,
    String? zipCode,
    String? country,
  }) =>
      ShippingAddress(
        street: street ?? this.street,
        city: city ?? this.city,
        state: state ?? this.state,
        zipCode: zipCode ?? this.zipCode,
        country: country ?? this.country,
      );
}

class OrderCustomer {
  final String id;
  final String name;
  final String email;
  final String? phone;

  const OrderCustomer({
    required this.id,
    required this.name,
    required this.email,
    this.phone,
  });

  factory OrderCustomer.fromJson(Map<String, dynamic> json) => OrderCustomer(
        id: json['id'] as String,
        name: json['name'] as String,
        email: json['email'] as String,
        phone: json['phone'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        if (phone != null) 'phone': phone,
      };

  OrderCustomer copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
  }) =>
      OrderCustomer(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        phone: phone ?? this.phone,
      );
}

class Order {
  final String id;
  final String orderNumber;
  final OrderCustomer customer;
  final List<OrderItem> items;
  final double subtotal;
  final double tax;
  final double shipping;
  final double total;
  final OrderStatus status;
  final String paymentMethod;
  final PaymentStatus paymentStatus;
  final ShippingAddress shippingAddress;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? shippedAt;
  final DateTime? deliveredAt;
  final String? trackingNumber;
  final String? notes;

  const Order({
    required this.id,
    required this.orderNumber,
    required this.customer,
    required this.items,
    required this.subtotal,
    required this.tax,
    required this.shipping,
    required this.total,
    required this.status,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.shippingAddress,
    required this.createdAt,
    required this.updatedAt,
    this.shippedAt,
    this.deliveredAt,
    this.trackingNumber,
    this.notes,
  });

  factory Order.fromJson(Map<String, dynamic> json) => Order(
        id: json['id'] as String,
        orderNumber: json['orderNumber'] as String,
        customer: OrderCustomer.fromJson(json['customer'] as Map<String, dynamic>),
        items: (json['items'] as List<dynamic>)
            .map((e) => OrderItem.fromJson(e as Map<String, dynamic>))
            .toList(),
        subtotal: (json['subtotal'] as num).toDouble(),
        tax: (json['tax'] as num).toDouble(),
        shipping: (json['shipping'] as num).toDouble(),
        total: (json['total'] as num).toDouble(),
        status: OrderStatus.fromString(json['status'] as String),
        paymentMethod: json['paymentMethod'] as String,
        paymentStatus: PaymentStatus.fromString(json['paymentStatus'] as String),
        shippingAddress: ShippingAddress.fromJson(
            json['shippingAddress'] as Map<String, dynamic>),
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        shippedAt: json['shippedAt'] != null
            ? DateTime.parse(json['shippedAt'] as String)
            : null,
        deliveredAt: json['deliveredAt'] != null
            ? DateTime.parse(json['deliveredAt'] as String)
            : null,
        trackingNumber: json['trackingNumber'] as String?,
        notes: json['notes'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'orderNumber': orderNumber,
        'customer': customer.toJson(),
        'items': items.map((e) => e.toJson()).toList(),
        'subtotal': subtotal,
        'tax': tax,
        'shipping': shipping,
        'total': total,
        'status': status.name,
        'paymentMethod': paymentMethod,
        'paymentStatus': paymentStatus.name,
        'shippingAddress': shippingAddress.toJson(),
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
        if (shippedAt != null) 'shippedAt': shippedAt!.toIso8601String(),
        if (deliveredAt != null) 'deliveredAt': deliveredAt!.toIso8601String(),
        if (trackingNumber != null) 'trackingNumber': trackingNumber,
        if (notes != null) 'notes': notes,
      };

  Order copyWith({
    String? id,
    String? orderNumber,
    OrderCustomer? customer,
    List<OrderItem>? items,
    double? subtotal,
    double? tax,
    double? shipping,
    double? total,
    OrderStatus? status,
    String? paymentMethod,
    PaymentStatus? paymentStatus,
    ShippingAddress? shippingAddress,
    DateTime? createdAt,
    DateTime? updatedAt,
    DateTime? shippedAt,
    DateTime? deliveredAt,
    String? trackingNumber,
    String? notes,
  }) =>
      Order(
        id: id ?? this.id,
        orderNumber: orderNumber ?? this.orderNumber,
        customer: customer ?? this.customer,
        items: items ?? this.items,
        subtotal: subtotal ?? this.subtotal,
        tax: tax ?? this.tax,
        shipping: shipping ?? this.shipping,
        total: total ?? this.total,
        status: status ?? this.status,
        paymentMethod: paymentMethod ?? this.paymentMethod,
        paymentStatus: paymentStatus ?? this.paymentStatus,
        shippingAddress: shippingAddress ?? this.shippingAddress,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        shippedAt: shippedAt ?? this.shippedAt,
        deliveredAt: deliveredAt ?? this.deliveredAt,
        trackingNumber: trackingNumber ?? this.trackingNumber,
        notes: notes ?? this.notes,
      );
}
