class User {
  final String id;
  final String name;
  final String email;
  final String membershipTier;
  final int points;
  final String createdAt;
  final String updatedAt;

  const User({
    required this.id,
    required this.name,
    required this.email,
    required this.membershipTier,
    required this.points,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as String,
      name: json['name'] as String,
      email: json['email'] as String,
      membershipTier: json['membershipTier'] as String,
      points: json['points'] as int,
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'membershipTier': membershipTier,
      'points': points,
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  User copyWith({
    String? id,
    String? name,
    String? email,
    String? membershipTier,
    int? points,
    String? createdAt,
    String? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      membershipTier: membershipTier ?? this.membershipTier,
      points: points ?? this.points,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User &&
        other.id == id &&
        other.name == name &&
        other.email == email &&
        other.membershipTier == membershipTier &&
        other.points == points &&
        other.createdAt == createdAt &&
        other.updatedAt == updatedAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        email.hashCode ^
        membershipTier.hashCode ^
        points.hashCode ^
        createdAt.hashCode ^
        updatedAt.hashCode;
  }

  @override
  String toString() {
    return 'User(id: $id, name: $name, email: $email, membershipTier: $membershipTier, points: $points)';
  }
}
