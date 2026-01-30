import 'dart:convert';

class ProductFormData {
  final String? id;
  final String name;
  final String nameAr;
  final String description;
  final String descriptionAr;
  final String ingredients;
  final String category;
  final String sku;
  final double basePrice;
  final double discountPercentage;
  final List<String> images;
  final bool isVegan;
  final bool isNatural;
  final bool showOnHomepage;
  final ProductInventory inventory;
  final double cost;
  final ProductSupplier supplier;
  final ProductSEO seo;
  final DateTime createdAt;
  final DateTime updatedAt;

  ProductFormData({
    this.id,
    required this.name,
    required this.nameAr,
    required this.description,
    required this.descriptionAr,
    this.ingredients = '',
    required this.category,
    required this.sku,
    required this.basePrice,
    this.discountPercentage = 0.0,
    this.images = const [],
    this.isVegan = false,
    this.isNatural = false,
    this.showOnHomepage = false,
    required this.inventory,
    required this.cost,
    required this.supplier,
    required this.seo,
    DateTime? createdAt,
    DateTime? updatedAt,
  })  : createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now();

  ProductFormData copyWith({
    String? id,
    String? name,
    String? nameAr,
    String? description,
    String? descriptionAr,
    String? ingredients,
    String? category,
    String? sku,
    double? basePrice,
    double? discountPercentage,
    List<String>? images,
    bool? isVegan,
    bool? isNatural,
    bool? showOnHomepage,
    ProductInventory? inventory,
    double? cost,
    ProductSupplier? supplier,
    ProductSEO? seo,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return ProductFormData(
      id: id ?? this.id,
      name: name ?? this.name,
      nameAr: nameAr ?? this.nameAr,
      description: description ?? this.description,
      descriptionAr: descriptionAr ?? this.descriptionAr,
      ingredients: ingredients ?? this.ingredients,
      category: category ?? this.category,
      sku: sku ?? this.sku,
      basePrice: basePrice ?? this.basePrice,
      discountPercentage: discountPercentage ?? this.discountPercentage,
      images: images ?? this.images,
      isVegan: isVegan ?? this.isVegan,
      isNatural: isNatural ?? this.isNatural,
      showOnHomepage: showOnHomepage ?? this.showOnHomepage,
      inventory: inventory ?? this.inventory,
      cost: cost ?? this.cost,
      supplier: supplier ?? this.supplier,
      seo: seo ?? this.seo,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'nameAr': nameAr,
      'description': description,
      'descriptionAr': descriptionAr,
      'ingredients': ingredients,
      'category': category,
      'sku': sku,
      'basePrice': basePrice,
      'discountPercentage': discountPercentage,
      'images': images,
      'isVegan': isVegan,
      'isNatural': isNatural,
      'showOnHomepage': showOnHomepage,
      'inventory': inventory.toJson(),
      'cost': cost,
      'supplier': supplier.toJson(),
      'seo': seo.toJson(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  factory ProductFormData.fromJson(Map<String, dynamic> json) {
    return ProductFormData(
      id: json['id'],
      name: json['name'] ?? '',
      nameAr: json['nameAr'] ?? '',
      description: json['description'] ?? '',
      descriptionAr: json['descriptionAr'] ?? '',
      ingredients: json['ingredients'] ?? '',
      category: json['category'] ?? '',
      sku: json['sku'] ?? '',
      basePrice: (json['basePrice'] ?? 0.0).toDouble(),
      discountPercentage: (json['discountPercentage'] ?? 0.0).toDouble(),
      images: List<String>.from(json['images'] ?? []),
      isVegan: json['isVegan'] ?? false,
      isNatural: json['isNatural'] ?? false,
      showOnHomepage: json['showOnHomepage'] ?? false,
      inventory: ProductInventory.fromJson(json['inventory'] ?? {}),
      cost: (json['cost'] ?? 0.0).toDouble(),
      supplier: ProductSupplier.fromJson(json['supplier'] ?? {}),
      seo: ProductSEO.fromJson(json['seo'] ?? {}),
      createdAt: json['createdAt'] != null 
          ? DateTime.parse(json['createdAt'])
          : null,
      updatedAt: json['updatedAt'] != null 
          ? DateTime.parse(json['updatedAt'])
          : null,
    );
  }

  String validate() {
    final errors = <String>[];

    // Name validation
    if (name.trim().isEmpty) {
      errors.add('Product name is required');
    } else if (name.trim().length < 3) {
      errors.add('Product name must be at least 3 characters');
    } else if (name.trim().length > 100) {
      errors.add('Product name must not exceed 100 characters');
    }

    // Arabic name validation
    if (nameAr.trim().isEmpty) {
      errors.add('Arabic product name is required');
    } else if (nameAr.trim().length < 3) {
      errors.add('Arabic product name must be at least 3 characters');
    } else if (nameAr.trim().length > 100) {
      errors.add('Arabic product name must not exceed 100 characters');
    }

    // Description validation
    if (description.trim().isEmpty) {
      errors.add('Description is required');
    } else if (description.trim().length < 10) {
      errors.add('Description must be at least 10 characters');
    } else if (description.trim().length > 500) {
      errors.add('Description must not exceed 500 characters');
    }

    // Arabic description validation
    if (descriptionAr.trim().isEmpty) {
      errors.add('Arabic description is required');
    } else if (descriptionAr.trim().length < 10) {
      errors.add('Arabic description must be at least 10 characters');
    } else if (descriptionAr.trim().length > 500) {
      errors.add('Arabic description must not exceed 500 characters');
    }

    // Category validation
    if (category.trim().isEmpty) {
      errors.add('Category is required');
    }

    // SKU validation
    if (sku.trim().isEmpty) {
      errors.add('SKU is required');
    } else if (!RegExp(r'^[a-zA-Z0-9_-]+$').hasMatch(sku)) {
      errors.add('SKU must contain only letters, numbers, hyphens, and underscores');
    }

    // Price validation
    if (basePrice <= 0) {
      errors.add('Base price must be greater than 0');
    }

    // Discount validation
    if (discountPercentage < 0 || discountPercentage > 100) {
      errors.add('Discount percentage must be between 0 and 100');
    }

    // Images validation
    if (images.isEmpty) {
      errors.add('At least one product image is required');
    } else if (images.length > 10) {
      errors.add('Maximum 10 images allowed');
    }

    // Inventory validation
    final inventoryError = inventory.validate();
    if (inventoryError != null) {
      errors.add(inventoryError);
    }

    // Cost validation
    if (cost < 0) {
      errors.add('Cost must be greater than or equal to 0');
    }

    // Supplier validation
    final supplierError = supplier.validate();
    if (supplierError != null) {
      errors.add(supplierError);
    }

    // SEO validation
    final seoError = seo.validate();
    if (seoError != null) {
      errors.add(seoError);
    }

    return errors.isEmpty ? '' : errors.join('\n');
  }

  @override
  String toString() {
    return 'ProductFormData(id: $id, name: $name, category: $category, sku: $sku)';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ProductFormData &&
        other.id == id &&
        other.name == name &&
        other.nameAr == nameAr &&
        other.description == description &&
        other.descriptionAr == descriptionAr &&
        other.ingredients == ingredients &&
        other.category == category &&
        other.sku == sku &&
        other.basePrice == basePrice &&
        other.discountPercentage == discountPercentage &&
        other.images.length == images.length &&
        other.isVegan == isVegan &&
        other.isNatural == isNatural &&
        other.showOnHomepage == showOnHomepage &&
        other.inventory == inventory &&
        other.cost == cost &&
        other.supplier == supplier &&
        other.seo == seo;
  }

  @override
  int get hashCode {
    return Object.hash(
      id,
      name,
      nameAr,
      description,
      descriptionAr,
      ingredients,
      category,
      sku,
      basePrice,
      discountPercentage,
      images,
      isVegan,
      isNatural,
      showOnHomepage,
      inventory,
      cost,
      supplier,
      seo,
    );
  }
}

class ProductInventory {
  final int quantity;
  final int lowStockThreshold;
  final bool trackQuantity;
  final bool allowBackorder;

  ProductInventory({
    this.quantity = 0,
    this.lowStockThreshold = 10,
    this.trackQuantity = true,
    this.allowBackorder = false,
  });

  ProductInventory copyWith({
    int? quantity,
    int? lowStockThreshold,
    bool? trackQuantity,
    bool? allowBackorder,
  }) {
    return ProductInventory(
      quantity: quantity ?? this.quantity,
      lowStockThreshold: lowStockThreshold ?? this.lowStockThreshold,
      trackQuantity: trackQuantity ?? this.trackQuantity,
      allowBackorder: allowBackorder ?? this.allowBackorder,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'quantity': quantity,
      'lowStockThreshold': lowStockThreshold,
      'trackQuantity': trackQuantity,
      'allowBackorder': allowBackorder,
    };
  }

  factory ProductInventory.fromJson(Map<String, dynamic> json) {
    return ProductInventory(
      quantity: json['quantity'] ?? 0,
      lowStockThreshold: json['lowStockThreshold'] ?? 10,
      trackQuantity: json['trackQuantity'] ?? true,
      allowBackorder: json['allowBackorder'] ?? false,
    );
  }

  String? validate() {
    if (quantity < 0) {
      return 'Quantity must be greater than or equal to 0';
    }
    if (lowStockThreshold < 0) {
      return 'Low stock threshold must be greater than or equal to 0';
    }
    return null;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ProductInventory &&
        other.quantity == quantity &&
        other.lowStockThreshold == lowStockThreshold &&
        other.trackQuantity == trackQuantity &&
        other.allowBackorder == allowBackorder;
  }

  @override
  int get hashCode {
    return Object.hash(
      quantity,
      lowStockThreshold,
      trackQuantity,
      allowBackorder,
    );
  }
}

class ProductSupplier {
  final String name;
  final String contact;
  final int leadTime;

  ProductSupplier({
    this.name = '',
    this.contact = '',
    this.leadTime = 7,
  });

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

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'contact': contact,
      'leadTime': leadTime,
    };
  }

  factory ProductSupplier.fromJson(Map<String, dynamic> json) {
    return ProductSupplier(
      name: json['name'] ?? '',
      contact: json['contact'] ?? '',
      leadTime: json['leadTime'] ?? 7,
    );
  }

  String? validate() {
    if (leadTime < 0) {
      return 'Lead time must be greater than or equal to 0';
    }
    return null;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ProductSupplier &&
        other.name == name &&
        other.contact == contact &&
        other.leadTime == leadTime;
  }

  @override
  int get hashCode {
    return Object.hash(name, contact, leadTime);
  }
}

class ProductSEO {
  final String title;
  final String description;
  final List<String> keywords;

  ProductSEO({
    this.title = '',
    this.description = '',
    this.keywords = const [],
  });

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

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'description': description,
      'keywords': keywords,
    };
  }

  factory ProductSEO.fromJson(Map<String, dynamic> json) {
    return ProductSEO(
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      keywords: List<String>.from(json['keywords'] ?? []),
    );
  }

  String? validate() {
    if (title.length > 60) {
      return 'SEO title must not exceed 60 characters';
    }
    if (description.length > 160) {
      return 'SEO description must not exceed 160 characters';
    }
    return null;
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ProductSEO &&
        other.title == title &&
        other.description == description &&
        other.keywords.length == keywords.length;
  }

  @override
  int get hashCode {
    return Object.hash(title, description, keywords);
  }
}
