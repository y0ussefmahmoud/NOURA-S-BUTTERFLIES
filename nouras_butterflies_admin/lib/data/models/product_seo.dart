import 'package:equatable/equatable.dart';

class ProductSEO extends Equatable {
  final String title;
  final String description;
  final List<String> keywords;

  const ProductSEO({
    required this.title,
    required this.description,
    required this.keywords,
  });

  factory ProductSEO.fromJson(Map<String, dynamic> json) {
    return ProductSEO(
      title: json['title'] as String,
      description: json['description'] as String,
      keywords: List<String>.from(json['keywords'] as List),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'keywords': keywords,
    };
  }

  ProductSEO copyWith({
    String? title,
    String? description,
    List<String>? keywords,
  }) {
    return ProductSEO(
      title: title ?? this.title,
      description: description ?? this.description,
      keywords: keywords ?? this.keywords,
    );
  }

  @override
  List<Object?> get props => [title, description, keywords];
}
