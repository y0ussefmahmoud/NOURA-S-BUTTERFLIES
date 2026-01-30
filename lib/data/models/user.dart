enum MembershipTier {
  bronze,
  silver,
  gold,
  platinum;

  String get displayName {
    switch (this) {
      case MembershipTier.bronze:
        return 'Bronze';
      case MembershipTier.silver:
        return 'Silver';
      case MembershipTier.gold:
        return 'Gold';
      case MembershipTier.platinum:
        return 'Platinum';
    }
  }

  static MembershipTier fromString(String value) {
    return MembershipTier.values.firstWhere(
      (tier) => tier.name == value.toLowerCase(),
      orElse: () => MembershipTier.bronze,
    );
  }
}

class User {
  final String id;
  final String name;
  final String email;
  final String? avatar;
  final MembershipTier membershipTier;
  final int points;
  final String? phone;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    this.avatar,
    required this.membershipTier,
    required this.points,
    this.phone,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
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
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        if (avatar != null) 'avatar': avatar,
        'membershipTier': membershipTier.name,
        'points': points,
        if (phone != null) 'phone': phone,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? avatar,
    MembershipTier? membershipTier,
    int? points,
    String? phone,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) =>
      User(
        id: id ?? this.id,
        name: name ?? this.name,
        email: email ?? this.email,
        avatar: avatar ?? this.avatar,
        membershipTier: membershipTier ?? this.membershipTier,
        points: points ?? this.points,
        phone: phone ?? this.phone,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
}
