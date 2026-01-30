import '../models/product.dart';
import '../models/product_image.dart';
import '../models/product_variant.dart';
import '../models/product_badge.dart';
import '../models/product_details.dart';

class MockProducts {
  static final List<Product> products = [
    Product(
      id: '1',
      name: 'Hydrating Lip Glow',
      slug: 'hydrating-lip-glow',
      description: 'A nourishing lip treatment that provides long-lasting hydration and a natural, glossy finish.',
      price: 24.00,
      compareAtPrice: 32.00,
      images: [
        ProductImage(
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAwK_Apm9-W0ywaM_UxvjPX_IDVvPnPBXpnuVyBqwRGumI7PgoYwGRAkC1YU1jC2suWjNLrcGkmfEVayHJCEBDB-gi9S4dvzNXNi2zCB5YcLv_pcHXc7qKa2jpKb8PnfgAmVMOkura49F3twwAm-rss-ff-JzkdB4rFWqkjqmNuud02M2OoFfoy8ky79Fek8ea9Q6gmyV3-KRURyc07YgVJD4FpKks_X2cb4N0DZ0aDJ8Flp8eQ3InKcGHHWhdE50qmSe4Sh5qfbY',
          alt: 'Hydrating Lip Glow',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAwK_Apm9-W0ywaM_UxvjPX_IDVvPnPBXpnuVyBqwRGumI7PgoYwGRAkC1YU1jC2suWjNLrcGkmfEVayHJCEBDB-gi9S4dvzNXNi2zCB5YcLv_pcHXc7qKa2jpKb8PnfgAmVMOkura49F3twwAm-rss-ff-JzkdB4rFWqkjqmNuud02M2OoFfoy8ky79Fek8ea9Q6gmyV3-KRURyc07YgVJD4FpKks_X2cb4N0DZ0aDJ8Flp8eQ3InKcGHHWhdE50qmSe4Sh5qfbY',
        ),
        ProductImage(
          url: 'https://picsum.photos/seed/noura-lip-glow-swatch/400/500.jpg',
          alt: 'Hydrating Lip Glow Swatch',
          thumbnail: 'https://picsum.photos/seed/noura-lip-glow-swatch/80/80.jpg',
        ),
      ],
      rating: 4.9,
      reviewCount: 245,
      badges: [
        ProductBadge(type: ProductBadgeType.bestseller),
        ProductBadge(type: ProductBadgeType.vegan),
        ProductBadge(type: ProductBadgeType.crueltyFree),
      ],
      category: 'lip-gloss',
      inStock: true,
      isBestseller: true,
      variants: [
        ProductVariant(
          id: '1-1',
          name: 'Rose Nude',
          value: '#E8B4B8',
          color: '#E8B4B8',
          inStock: true,
        ),
        ProductVariant(
          id: '1-2',
          name: 'Petal Pink',
          value: '#FFB6C1',
          color: '#FFB6C1',
          inStock: true,
        ),
        ProductVariant(
          id: '1-3',
          name: 'Coral Bliss',
          value: '#FF7F50',
          color: '#FF7F50',
          inStock: true,
        ),
      ],
      productDetails: ProductDetails(
        ingredients: [
          Ingredient(
            id: 'ing-1',
            name: 'Rosehip Oil',
            description: 'Rich in vitamins A and C, helps to brighten and even out lip tone while providing deep hydration.',
            number: 1,
          ),
          Ingredient(
            id: 'ing-2',
            name: 'Desert Honey',
            description: 'Natural humectant that locks in moisture and provides antibacterial properties for healthy lips.',
            number: 2,
          ),
          Ingredient(
            id: 'ing-3',
            name: 'Shea Butter',
            description: 'Deeply nourishing and helps to repair dry, chapped lips with essential fatty acids.',
            number: 3,
          ),
          Ingredient(
            id: 'ing-4',
            name: 'Vitamin E',
            description: 'Powerful antioxidant that protects lips from environmental damage and premature aging.',
            number: 4,
          ),
        ],
        howToUse: HowToUse(
          steps: [
            HowToUseStep(
              stepNumber: 1,
              title: 'Start with Clean Lips',
              description: 'Ensure your lips are clean and dry before application for best results.',
            ),
            HowToUseStep(
              stepNumber: 2,
              title: 'Apply Generously',
              description: 'Swipe the applicator across your lips, starting from the center and moving outward.',
            ),
            HowToUseStep(
              stepNumber: 3,
              title: 'Build as Needed',
              description: 'Layer for more intensity and shine. Reapply throughout the day as desired.',
            ),
          ],
          videoThumbnail: VideoThumbnail(
            url: 'https://picsum.photos/seed/lip-glow-tutorial/800/450.jpg',
            alt: 'How to use Hydrating Lip Glow',
            duration: '2:30',
          ),
        ),
        reviews: [
          Review(
            id: 'review-1',
            rating: 5,
            text: 'Absolutely love this lip glow! It makes my lips look so plump and healthy. The color is perfect for everyday wear.',
            authorName: 'Sarah M.',
            avatar: 'https://picsum.photos/seed/sarah-avatar/100/100.jpg',
            verified: true,
            date: '2 weeks ago',
          ),
          Review(
            id: 'review-2',
            rating: 4,
            text: 'Great product! Very hydrating and lasts for hours. My only complaint is that I wish it came in more shades.',
            authorName: 'Emily R.',
            avatar: 'https://picsum.photos/seed/emily-avatar/100/100.jpg',
            verified: true,
            date: '1 month ago',
          ),
          Review(
            id: 'review-3',
            rating: 5,
            text: 'This is my holy grail lip product! It\'s not sticky at all and feels amazing on. Highly recommend!',
            authorName: 'Jessica L.',
            avatar: 'https://picsum.photos/seed/jessica-avatar/100/100.jpg',
            verified: true,
            date: '3 weeks ago',
          ),
        ],
      ),
    ),
    Product(
      id: '2',
      name: 'Radiant Cheek Tint',
      slug: 'radiant-cheek-tint',
      description: 'A lightweight cheek tint that gives your cheeks a natural, healthy glow with buildable color.',
      price: 18.00,
      compareAtPrice: 24.00,
      images: [
        ProductImage(
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxHD1agpHaqfyT4ibpFa6CIYXYv1n1WFXOEtairt0vIKDL_zgL6V8-DIiWfgvuW17tKDsDGsxk8z29xUokzx6EEzU61oYppa_7S2W4xMjK1LnprjW4fm8x5iUM8msJBQTKPPm0LiMtTxdXeJxNaBOBrznqcs1sYA9oDdD1lbLbnwIf7D-MODWRZG39Yz52SPdaCQwcJ0jVRr33Oo98nvALa105Naytw2UnrZswWk3Jk8-0qloyHSlfhSKCPpEbLMjt59HEao3dQqs',
          alt: 'Radiant Cheek Tint',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxHD1agpHaqfyT4ibpFa6CIYXYv1n1WFXOEtairt0vIKDL_zgL6V8-DIiWfgvuW17tKDsDGsxk8z29xUokzx6EEzU61oYppa_7S2W4xMjK1LnprjW4fm8x5iUM8msJBQTKPPm0LiMtTxdXeJxNaBOBrznqcs1sYA9oDdD1lbLbnwIf7D-MODWRZG39Yz52SPdaCQwcJ0jVRr33Oo98nvALa105Naytw2UnrZswWk3Jk8-0qloyHSlfhSKCPpEbLMjt59HEao3dQqs',
        ),
      ],
      rating: 4.8,
      reviewCount: 189,
      badges: [
        ProductBadge(type: ProductBadgeType.vegan),
        ProductBadge(type: ProductBadgeType.crueltyFree),
        ProductBadge(type: ProductBadgeType.parabenFree),
      ],
      category: 'blush',
      inStock: true,
      isBestseller: false,
      variants: [
        ProductVariant(
          id: '2-1',
          name: 'Peach Glow',
          value: '#FFDAB9',
          color: '#FFDAB9',
          inStock: true,
        ),
        ProductVariant(
          id: '2-2',
          name: 'Rose Flush',
          value: '#FF69B4',
          color: '#FF69B4',
          inStock: true,
        ),
      ],
    ),
    Product(
      id: '3',
      name: 'Silk Finish Powder',
      slug: 'silk-finish-powder',
      description: 'A luxurious setting powder that gives your skin a smooth, matte finish with a silk-like texture.',
      price: 32.00,
      compareAtPrice: 40.00,
      images: [
        ProductImage(
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATa-tK7F6aY5QuldDk_TLc0GVvCHtKxBebDiR0fGQHaO7K2sqDs2fMQO0udUt9PRifsOliw1a_95UpIjHxUXdV1fxcn0QFfRbdO09iuXLVRpcHY78fn1op8hqJR0TxrhfyJfy4ZbtphR1Xn_VlwRxFITFecH6zgy0FO3FwFJF8UArsAQjVVM50frizZb_8F7niTl5ebof9mCRA8vFytwHD0VVpm8DqGjkfuodLsJkJWfApu4BWvt__H-yT098jbUuUfvCaACp_0F8',
          alt: 'Silk Finish Powder',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATa-tK7F6aY5QuldDk_TLc0GVvCHtKxBebDiR0fGQHaO7K2sqDs2fMQO0udUt9PRifsOliw1a_95UpIjHxUXdV1fxcn0QFfRbdO09iuXLVRpcHY78fn1op8hqJR0TxrhfyJfy4ZbtphR1Xn_VlwRxFITFecH6zgy0FO3FwFJF8UArsAQjVVM50frizZb_8F7niTl5ebof9mCRA8vFytwHD0VVpm8DqGjkfuodLsJkJWfApu4BWvt__H-yT098jbUuUfvCaACp_0F8',
        ),
      ],
      rating: 5.0,
      reviewCount: 156,
      badges: [
        ProductBadge(type: ProductBadgeType.bestseller),
        ProductBadge(type: ProductBadgeType.vegan),
        ProductBadge(type: ProductBadgeType.crueltyFree),
      ],
      category: 'face-powder',
      inStock: true,
      isBestseller: true,
      variants: [
        ProductVariant(
          id: '3-1',
          name: 'Translucent',
          value: '#F5F5F5',
          color: '#F5F5F5',
          inStock: true,
        ),
        ProductVariant(
          id: '3-2',
          name: 'Warm Beige',
          value: '#F5DEB3',
          color: '#F5DEB3',
          inStock: true,
        ),
      ],
    ),
    Product(
      id: '4',
      name: 'Nourishing Face Oil',
      slug: 'nourishing-face-oil',
      description: 'A lightweight face oil that deeply nourishes and hydrates your skin without feeling greasy.',
      price: 45.00,
      compareAtPrice: 55.00,
      images: [
        ProductImage(
          url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJFCqur_jjctPnveIX_t9a_pxdgZZuLu3TIV_nzO8fnOkyKmHOD_e2JIX24fKqsvxZQrl09a9CpcJmmwSx6p3WxmdLkYGeSWuzs4vJeg9rYKb7ZA2u2ih2SGeYfTFy76efSo-7dmb3aVri8PqJPQY2v8L3kEW_Wcc-zgM62ckNoCuyPi61TZ84wxsVh8aM1sk64tUbQMLtlfPubjjF2D0SmJT9w2AuL-0iepAy5X1aDEjQSrIfNsvs5ebo1Mpq70RJOaTDWf38Egs',
          alt: 'Nourishing Face Oil',
          thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJFCqur_jjctPnveIX_t9a_pxdgZZuLu3TIV_nzO8fnOkyKmHOD_e2JIX24fKqsvxZQrl09a9CpcJmmwSx6p3WxmdLkYGeSWuzs4vJeg9rYKb7ZA2u2ih2SGeYfTFy76efSo-7dmb3aVri8PqJPQY2v8L3kEW_Wcc-zgM62ckNoCuyPi61TZ84wxsVh8aM1sk64tUbQMLtlfPubjjF2D0SmJT9w2AuL-0iepAy5X1aDEjQSrIfNsvs5ebo1Mpq70RJOaTDWf38Egs',
        ),
      ],
      rating: 4.7,
      reviewCount: 203,
      badges: [
        ProductBadge(type: ProductBadgeType.vegan),
        ProductBadge(type: ProductBadgeType.crueltyFree),
        ProductBadge(type: ProductBadgeType.organic),
      ],
      category: 'skincare',
      inStock: true,
      isBestseller: false,
      variants: [],
    ),
    Product(
      id: '5',
      name: 'Butterfly Wing Eyeshadow Palette',
      slug: 'butterfly-wing-eyeshadow-palette',
      description: 'A versatile eyeshadow palette inspired by the delicate colors of butterfly wings.',
      price: 38.00,
      compareAtPrice: 48.00,
      images: [
        ProductImage(
          url: 'https://picsum.photos/seed/butterfly-palette/400/500.jpg',
          alt: 'Butterfly Wing Eyeshadow Palette',
          thumbnail: 'https://picsum.photos/seed/butterfly-palette/80/80.jpg',
        ),
      ],
      rating: 4.6,
      reviewCount: 178,
      badges: [
        ProductBadge(type: ProductBadgeType.newProduct),
        ProductBadge(type: ProductBadgeType.vegan),
        ProductBadge(type: ProductBadgeType.crueltyFree),
      ],
      category: 'eyeshadow',
      inStock: true,
      isBestseller: false,
      variants: [],
    ),
    Product(
      id: '6',
      name: 'Rose Garden Butterfly Compact',
      slug: 'rose-garden-butterfly-compact',
      description: 'An elegant pressed powder compact featuring a beautiful butterfly design.',
      price: 28.00,
      compareAtPrice: 35.00,
      images: [
        ProductImage(
          url: 'https://picsum.photos/seed/rose-compact/400/500.jpg',
          alt: 'Rose Garden Butterfly Compact',
          thumbnail: 'https://picsum.photos/seed/rose-compact/80/80.jpg',
        ),
      ],
      rating: 4.8,
      reviewCount: 92,
      badges: [
        ProductBadge(type: ProductBadgeType.bestseller),
        ProductBadge(type: ProductBadgeType.crueltyFree),
      ],
      category: 'face-powder',
      inStock: true,
      isBestseller: true,
      variants: [
        ProductVariant(
          id: '6-1',
          name: 'Light',
          value: '#FAEBD7',
          color: '#FAEBD7',
          inStock: true,
        ),
        ProductVariant(
          id: '6-2',
          name: 'Medium',
          value: '#DEB887',
          color: '#DEB887',
          inStock: true,
        ),
      ],
    ),
  ];

  static Product? getProductById(String id) {
    try {
      return products.firstWhere((product) => product.id == id);
    } catch (e) {
      return null;
    }
  }

  static List<Product> getProductsByCategory(String category) {
    return products.where((product) => product.category == category).toList();
  }

  static List<Product> getBestsellers() {
    return products.where((product) => product.isBestseller).toList();
  }

  static List<Product> searchProducts(String query) {
    final lowerQuery = query.toLowerCase();
    return products.where((product) {
      return product.name.toLowerCase().contains(lowerQuery) ||
          product.description.toLowerCase().contains(lowerQuery);
    }).toList();
  }

  static List<Product> getFeaturedProducts({int limit = 8}) {
    return products.take(limit).toList();
  }

  static List<String> getAllCategories() {
    return products.map((product) => product.category).toSet().toList();
  }
}
