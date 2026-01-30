enum MembershipTier {
  bronze,
  silver,
  gold,
  platinum,
}

class CustomerPreferences {
  final bool newsletter;
  final bool sms;
  final bool promotions;
  final bool newProducts;

  const CustomerPreferences({
    this.newsletter = true,
    this.sms = false,
    this.promotions = true,
    this.newProducts = true,
  });

  factory CustomerPreferences.fromJson(Map<String, dynamic> json) {
    return CustomerPreferences(
      newsletter: json['newsletter'] as bool? ?? true,
      sms: json['sms'] as bool? ?? false,
      promotions: json['promotions'] as bool? ?? true,
      newProducts: json['newProducts'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'newsletter': newsletter,
      'sms': sms,
      'promotions': promotions,
      'newProducts': newProducts,
    };
  }
}

class Customer {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String phone;
  final String? avatar;
  final MembershipTier tier;
  final CustomerPreferences preferences;
  final DateTime createdAt;
  final DateTime? lastOrderDate;
  final int totalOrders;
  final double totalSpent;
  final int loyaltyPoints;
  final List<String> tags;
  final String? adminNotes;

  const Customer({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    required this.phone,
    this.avatar,
    required this.tier,
    required this.preferences,
    required this.createdAt,
    this.lastOrderDate,
    this.totalOrders = 0,
    this.totalSpent = 0.0,
    this.loyaltyPoints = 0,
    this.tags = const [],
    this.adminNotes,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id'] as String,
      firstName: json['firstName'] as String,
      lastName: json['lastName'] as String,
      email: json['email'] as String,
      phone: json['phone'] as String,
      avatar: json['avatar'] as String?,
      tier: MembershipTier.values.firstWhere(
        (e) => e.name == json['tier'],
        orElse: () => MembershipTier.bronze,
      ),
      preferences: CustomerPreferences.fromJson(
        json['preferences'] as Map<String, dynamic>? ?? {},
      ),
      createdAt: DateTime.parse(json['createdAt'] as String),
      lastOrderDate: json['lastOrderDate'] != null
          ? DateTime.parse(json['lastOrderDate'] as String)
          : null,
      totalOrders: json['totalOrders'] as int? ?? 0,
      totalSpent: (json['totalSpent'] as num?)?.toDouble() ?? 0.0,
      loyaltyPoints: json['loyaltyPoints'] as int? ?? 0,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      adminNotes: json['adminNotes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'avatar': avatar,
      'tier': tier.name,
      'preferences': preferences.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'lastOrderDate': lastOrderDate?.toIso8601String(),
      'totalOrders': totalOrders,
      'totalSpent': totalSpent,
      'loyaltyPoints': loyaltyPoints,
      'tags': tags,
      'adminNotes': adminNotes,
    };
  }

  Customer copyWith({
    String? id,
    String? firstName,
    String? lastName,
    String? email,
    String? phone,
    String? avatar,
    MembershipTier? tier,
    CustomerPreferences? preferences,
    DateTime? createdAt,
    DateTime? lastOrderDate,
    int? totalOrders,
    double? totalSpent,
    int? loyaltyPoints,
    List<String>? tags,
    String? adminNotes,
  }) {
    return Customer(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      avatar: avatar ?? this.avatar,
      tier: tier ?? this.tier,
      preferences: preferences ?? this.preferences,
      createdAt: createdAt ?? this.createdAt,
      lastOrderDate: lastOrderDate ?? this.lastOrderDate,
      totalOrders: totalOrders ?? this.totalOrders,
      totalSpent: totalSpent ?? this.totalSpent,
      loyaltyPoints: loyaltyPoints ?? this.loyaltyPoints,
      tags: tags ?? this.tags,
      adminNotes: adminNotes ?? this.adminNotes,
    );
  }

  String get fullName => '$firstName $lastName';

  String get formattedTotalSpent => '\$${totalSpent.toStringAsFixed(2)}';

  String get formattedJoinDate {
    return '${createdAt.day}/${createdAt.month}/${createdAt.year}';
  }

  bool get isNewCustomer {
    final now = DateTime.now();
    final thirtyDaysAgo = now.subtract(const Duration(days: 30));
    return createdAt.isAfter(thirtyDaysAgo);
  }

  bool get isActive {
    if (lastOrderDate == null) return false;
    final now = DateTime.now();
    final ninetyDaysAgo = now.subtract(const Duration(days: 90));
    return lastOrderDate!.isAfter(ninetyDaysAgo);
  }

  bool get isVip => tier == MembershipTier.gold || tier == MembershipTier.platinum;
}
