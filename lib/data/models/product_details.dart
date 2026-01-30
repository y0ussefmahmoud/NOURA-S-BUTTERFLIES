class Ingredient {
  final String id;
  final String name;
  final String description;
  final String? icon;
  final int? number;

  const Ingredient({
    required this.id,
    required this.name,
    required this.description,
    this.icon,
    this.number,
  });

  factory Ingredient.fromJson(Map<String, dynamic> json) => Ingredient(
        id: json['id'] as String,
        name: json['name'] as String,
        description: json['description'] as String,
        icon: json['icon'] as String?,
        number: json['number'] as int?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'description': description,
        if (icon != null) 'icon': icon,
        if (number != null) 'number': number,
      };
}

class HowToUseStep {
  final int stepNumber;
  final String title;
  final String description;

  const HowToUseStep({
    required this.stepNumber,
    required this.title,
    required this.description,
  });

  factory HowToUseStep.fromJson(Map<String, dynamic> json) => HowToUseStep(
        stepNumber: json['stepNumber'] as int,
        title: json['title'] as String,
        description: json['description'] as String,
      );

  Map<String, dynamic> toJson() => {
        'stepNumber': stepNumber,
        'title': title,
        'description': description,
      };
}

class VideoThumbnail {
  final String url;
  final String alt;
  final String? duration;

  const VideoThumbnail({
    required this.url,
    required this.alt,
    this.duration,
  });

  factory VideoThumbnail.fromJson(Map<String, dynamic> json) => VideoThumbnail(
        url: json['url'] as String,
        alt: json['alt'] as String,
        duration: json['duration'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'url': url,
        'alt': alt,
        if (duration != null) 'duration': duration,
      };
}

class HowToUse {
  final List<HowToUseStep> steps;
  final VideoThumbnail videoThumbnail;

  const HowToUse({
    required this.steps,
    required this.videoThumbnail,
  });

  factory HowToUse.fromJson(Map<String, dynamic> json) => HowToUse(
        steps: (json['steps'] as List<dynamic>)
            .map((e) => HowToUseStep.fromJson(e as Map<String, dynamic>))
            .toList(),
        videoThumbnail: VideoThumbnail.fromJson(json['videoThumbnail'] as Map<String, dynamic>),
      );

  Map<String, dynamic> toJson() => {
        'steps': steps.map((e) => e.toJson()).toList(),
        'videoThumbnail': videoThumbnail.toJson(),
      };
}

class Review {
  final String id;
  final int rating;
  final String text;
  final String authorName;
  final String avatar;
  final bool verified;
  final String date;

  const Review({
    required this.id,
    required this.rating,
    required this.text,
    required this.authorName,
    required this.avatar,
    required this.verified,
    required this.date,
  });

  factory Review.fromJson(Map<String, dynamic> json) => Review(
        id: json['id'] as String,
        rating: json['rating'] as int,
        text: json['text'] as String,
        authorName: json['authorName'] as String,
        avatar: json['avatar'] as String,
        verified: json['verified'] as bool,
        date: json['date'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'rating': rating,
        'text': text,
        'authorName': authorName,
        'avatar': avatar,
        'verified': verified,
        'date': date,
      };
}

class ProductDetails {
  final List<Ingredient>? ingredients;
  final HowToUse? howToUse;
  final List<Review>? reviews;
  final List<String>? fullIngredientsList;

  const ProductDetails({
    this.ingredients,
    this.howToUse,
    this.reviews,
    this.fullIngredientsList,
  });

  factory ProductDetails.fromJson(Map<String, dynamic> json) => ProductDetails(
        ingredients: json['ingredients'] != null
            ? (json['ingredients'] as List<dynamic>)
                .map((e) => Ingredient.fromJson(e as Map<String, dynamic>))
                .toList()
            : null,
        howToUse: json['howToUse'] != null
            ? HowToUse.fromJson(json['howToUse'] as Map<String, dynamic>)
            : null,
        reviews: json['reviews'] != null
            ? (json['reviews'] as List<dynamic>)
                .map((e) => Review.fromJson(e as Map<String, dynamic>))
                .toList()
            : null,
        fullIngredientsList: json['fullIngredientsList'] != null
            ? (json['fullIngredientsList'] as List<dynamic>).map((e) => e as String).toList()
            : null,
      );

  Map<String, dynamic> toJson() => {
        if (ingredients != null) 'ingredients': ingredients!.map((e) => e.toJson()).toList(),
        if (howToUse != null) 'howToUse': howToUse!.toJson(),
        if (reviews != null) 'reviews': reviews!.map((e) => e.toJson()).toList(),
        if (fullIngredientsList != null) 'fullIngredientsList': fullIngredientsList,
      };
}
