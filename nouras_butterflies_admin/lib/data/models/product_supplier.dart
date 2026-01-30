import 'package:equatable/equatable.dart';

class ProductSupplier extends Equatable {
  final String name;
  final String contact;
  final int leadTime;

  const ProductSupplier({
    required this.name,
    required this.contact,
    required this.leadTime,
  });

  factory ProductSupplier.fromJson(Map<String, dynamic> json) {
    return ProductSupplier(
      name: json['name'] as String,
      contact: json['contact'] as String,
      leadTime: json['leadTime'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'contact': contact,
      'leadTime': leadTime,
    };
  }

  ProductSupplier copyWith({
    String? name,
    String? contact,
    int? leadTime,
  }) {
    return ProductSupplier(
      name: name ?? this.name,
      contact: contact ?? this.contact,
      leadTime: leadTime ?? this.leadTime,
    );
  }

  @override
  List<Object?> get props => [name, contact, leadTime];
}
