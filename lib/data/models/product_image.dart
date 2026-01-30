class ProductImage {
  final String url;
  final String alt;
  final String? thumbnail;

  const ProductImage({
    required this.url,
    required this.alt,
    this.thumbnail,
  });

  factory ProductImage.fromJson(Map<String, dynamic> json) => ProductImage(
        url: json['url'] as String,
        alt: json['alt'] as String,
        thumbnail: json['thumbnail'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'url': url,
        'alt': alt,
        if (thumbnail != null) 'thumbnail': thumbnail,
      };

  ProductImage copyWith({
    String? url,
    String? alt,
    String? thumbnail,
  }) =>
      ProductImage(
        url: url ?? this.url,
        alt: alt ?? this.alt,
        thumbnail: thumbnail ?? this.thumbnail,
      );
}
