import 'user.dart';

class CustomerPreferences {
  final bool newsletter;
  final bool sms;
  final bool promotions;

  const CustomerPreferences({
    required this.newsletter,
    required this.sms,
    required this.promotions,
  });

  factory CustomerPreferences.fromJson(Map<String, dynamic> json) =>
      CustomerPreferences(
        newsletter: json['newsletter'] as bool,
        sms: json['sms'] as bool,
        promotions: json['promotions'] as bool,
      );

  Map<String, dynamic> toJson() => {
        'newsletter': newsletter,
        'sms': sms,
        'promotions': promotions,
      };

  CustomerPreferences copyWith({
    bool? newsletter,
    bool? sms,
    bool? promotions,
  }) =>
      CustomerPreferences(
        newsletter: newsletter ?? this.newsletter,
        sms: sms ?? this.sms,
        promotions: promotions ?? this.promotions,
      );
}

class Customer extends User {
  final int totalOrders;
  final double totalSpent;
  final DateTime? lastOrderDate;
  final List<String> tags;
  final String? notes;
  final CustomerPreferences preferences;

  const Customer({
    required super.id,
    required super.name,
    required super.email,
    super.avatar,
    required super.membershipTier,
    required super.points,
    super.phone,
    required super.createdAt,
    required super.updatedAt,
    required this.totalOrders,
    required this.totalSpent,
    this.lastOrderDate,
    required this.tags,
    this.notes,
    required this.preferences,
  });

  factory Customer.fromJson(Map<String, dynamic> json) => Customer(
        id: json['id'] as String,
        name: json['name'] as String,
        email: json['email'] as String,
        avatar: json['avatar'] as String?,
        membershipTier: MembershipTier.fromString(
            json['membershipTier'] as String? ?? 'bronze'),
        points: json['points'] as int,
        phone: json['phone'] as String?,
        createdAt: DateTime.parse(json['createdAt'] as String),
        updatedAt: DateTime.parse(json['updatedAt'] as String),
        totalOrders: json['totalOrders'] as int,
        totalSpent: (json['totalSpent'] as num).toDouble(),
        lastOrderDate: json['lastOrderDate'] != null
            ? DateTime.parse(json['lastOrderDate'] as String)
            : null,
        tags: (json['tags'] as List<dynamic>).cast<String>(),
        notes: json['notes'] as String?,
        preferences: CustomerPreferences.fromJson(
            json['preferences'] as Map<String, dynamic>),
      );

  @override
  Map<String, dynamic> toJson() => {
        ...super.toJson(),
        'totalOrders': totalOrders,
        'totalSpent': totalSpent,
        if (lastOrderDate != null)
          'lastOrderDate': lastOrderDate!.toIso8601String(),
        'tags': tags,
        if (notes != null) 'notes': notes,
        'preferences': preferences.toJson(),
      };

  @override
  Customer copyWith({
    String? id,
    String? name,
    String? email,
    String? avatar,
    MembershipTier? membershipTier,
    int? points,
    String? phone,
    DateTime? createdAt,
    DateTime? updatedAt,
    int? totalOrders,
    double? totalSpent,
    DateTime? lastOrderDate,
    List<String>? tags,
    String? notes,
    CustomerPreferences? preferences,
  }) =>
      Customer(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        avatar: avatar ?? this.avatar,
        membershipTier: membershipTier ?? this.membershipTier,
        points: points ?? this.points,
        phone: phone ?? this.phone,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
        totalOrders: totalOrders ?? this.totalOrders,
        totalSpent: totalSpent ?? this.totalSpent,
        lastOrderDate: lastOrderDate ?? this.lastOrderDate,
        tags: tags ?? this.tags,
        notes: notes ?? this.notes,
        preferences: preferences ?? this.preferences,
      );
}
