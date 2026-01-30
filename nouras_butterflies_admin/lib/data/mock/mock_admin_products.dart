import '../../models/admin_product.dart';
import '../../models/product_inventory.dart';
import '../../models/product_supplier.dart';
import '../../models/product_seo.dart';

class MockAdminProducts {
  static List<AdminProduct> products = [
    AdminProduct(
      id: '1',
      name: 'Hydrating Lip Glow',
      nameAr: 'ملمع الشفاه المرطب',
      sku: 'HLG-001',
      slug: 'hydrating-lip-glow',
      description: 'A luxurious lip gloss that provides long-lasting hydration and a natural glow.',
      descriptionAr: 'ملمع شفاه فاخر يوفر ترطيبًا طويل الأمد ولمعانًا طبيعيًا.',
      price: 24.00,
      category: 'Lip Gloss',
      images: [
        'https://images.unsplash.com/photo-1586495777744-4413f210bfa0?w=300',
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.5,
      reviewCount: 128,
      inventory: ProductInventory(
        quantity: 45,
        lowStockThreshold: 10,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 12.00,
      supplier: ProductSupplier(
        name: 'Beauty Supplies Co',
        contact: 'contact@beautysupplies.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 2)),
      seo: ProductSEO(
        title: 'Hydrating Lip Glow - Noura\'s Butterflies',
        description: 'Get the perfect pout with our hydrating lip glow. Long-lasting moisture and natural shine.',
        keywords: ['lip gloss', 'hydrating', 'makeup', 'beauty'],
      ),
    ),
    AdminProduct(
      id: '2',
      name: 'Velvet Matte Lipstick',
      nameAr: 'أحمر شفاه مخملي مات',
      sku: 'VML-002',
      slug: 'velvet-matte-lipstick',
      description: 'Rich, velvety matte lipstick that stays comfortable all day.',
      descriptionAr: 'أحمر شفاه مات مخملي غني يبقى مريحًا طوال اليوم.',
      price: 28.00,
      category: 'Lipstick',
      images: [
        'https://images.unsplash.com/photo-1586495777744-4413f210bfa0?w=300',
      ],
      rating: 4.8,
      reviewCount: 89,
      inventory: ProductInventory(
        quantity: 12,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: true,
      ),
      cost: 14.50,
      supplier: ProductSupplier(
        name: 'Cosmetics International',
        contact: 'orders@cosmeticsintl.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 1)),
      seo: ProductSEO(
        title: 'Velvet Matte Lipstick - Noura\'s Butterflies',
        description: 'Experience luxury with our velvet matte lipstick. Rich color, comfortable wear.',
        keywords: ['lipstick', 'matte', 'velvet', 'long-lasting'],
      ),
    ),
    AdminProduct(
      id: '3',
      name: 'Butterfly Wing Eyeshadow Palette',
      nameAr: 'بالتظل عيون جناح الفراشة',
      sku: 'BWP-003',
      slug: 'butterfly-wing-eyeshadow-palette',
      description: '12 stunning shades inspired by butterfly wings for endless creativity.',
      descriptionAr: '12 ظلًا رائعًا مستوحى من أجنحة الفراشات للإبداع لا نهائي.',
      price: 45.00,
      category: 'Eyeshadow',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.7,
      reviewCount: 203,
      inventory: ProductInventory(
        quantity: 67,
        lowStockThreshold: 20,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 22.00,
      supplier: ProductSupplier(
        name: 'Premium Pigments Ltd',
        contact: 'sales@premiumpigments.com',
        leadTime: 10,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(hours: 6)),
      seo: ProductSEO(
        title: 'Butterfly Wing Eyeshadow Palette - Noura\'s Butterflies',
        description: 'Transform your look with our butterfly wing inspired eyeshadow palette.',
        keywords: ['eyeshadow', 'palette', 'butterfly', 'colors'],
      ),
    ),
    AdminProduct(
      id: '4',
      name: 'Radiant Blush',
      nameAr: 'بلاشر مشع',
      sku: 'RBL-004',
      slug: 'radiant-blush',
      description: 'Natural-looking blush that gives your cheeks a healthy, radiant glow.',
      descriptionAr: 'بلاشر مظهر طبيعي يمنح خديك توهجًا صحيًا مشعًا.',
      price: 22.00,
      category: 'Blush',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.3,
      reviewCount: 67,
      inventory: ProductInventory(
        quantity: 8,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 11.00,
      supplier: ProductSupplier(
        name: 'Beauty Supplies Co',
        contact: 'contact@beautysupplies.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 3)),
      seo: ProductSEO(
        title: 'Radiant Blush - Noura\'s Butterflies',
        description: 'Achieve a natural, radiant glow with our premium blush formula.',
        keywords: ['blush', 'radiant', 'cheeks', 'healthy glow'],
      ),
    ),
    AdminProduct(
      id: '5',
      name: 'Lengthening Mascara',
      nameAr: 'ماسكارا تطويل الرموش',
      sku: 'LMS-005',
      slug: 'lengthening-mascara',
      description: 'Dramatically lengthen and define your lashes with our smudge-proof formula.',
      descriptionAr: 'طول وحدد رموشك بشكل درامي مع تركيبتنا المقاومة لللطخ.',
      price: 26.00,
      category: 'Mascara',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.6,
      reviewCount: 156,
      inventory: ProductInventory(
        quantity: 0,
        lowStockThreshold: 10,
        trackQuantity: true,
        allowBackorder: true,
      ),
      cost: 13.00,
      supplier: ProductSupplier(
        name: 'Cosmetics International',
        contact: 'orders@cosmeticsintl.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 1)),
      seo: ProductSEO(
        title: 'Lengthening Mascara - Noura\'s Butterflies',
        description: 'Get longer, defined lashes with our smudge-proof lengthening mascara.',
        keywords: ['mascara', 'lengthening', 'lashes', 'smudge-proof'],
      ),
    ),
    AdminProduct(
      id: '6',
      name: 'Foundation Primer',
      nameAr: 'برايمر الأساس',
      sku: 'FPR-006',
      slug: 'foundation-primer',
      description: 'Create the perfect canvas for your makeup with our smoothing primer.',
      descriptionAr: 'أنشئ اللوحة المثالية لمكياجك مع برايمرنا الناعم.',
      price: 32.00,
      category: 'Primer',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.4,
      reviewCount: 92,
      inventory: ProductInventory(
        quantity: 34,
        lowStockThreshold: 12,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 16.00,
      supplier: ProductSupplier(
        name: 'Premium Pigments Ltd',
        contact: 'sales@premiumpigments.com',
        leadTime: 10,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(hours: 12)),
      seo: ProductSEO(
        title: 'Foundation Primer - Noura\'s Butterflies',
        description: 'Prep your skin perfectly with our smoothing foundation primer.',
        keywords: ['primer', 'foundation', 'makeup base', 'smoothing'],
      ),
    ),
    AdminProduct(
      id: '7',
      name: 'Setting Spray',
      nameAr: 'سبراي التثبيت',
      sku: 'SSP-007',
      slug: 'setting-spray',
      description: 'Lock in your makeup look all day with our long-lasting setting spray.',
      descriptionAr: 'ثبت مظهر مكياجك طوال اليوم مع سبراي التثبيت طويل الأمد لدينا.',
      price: 24.00,
      category: 'Setting Spray',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.5,
      reviewCount: 118,
      inventory: ProductInventory(
        quantity: 56,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 12.00,
      supplier: ProductSupplier(
        name: 'Beauty Supplies Co',
        contact: 'contact@beautysupplies.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 4)),
      seo: ProductSEO(
        title: 'Setting Spray - Noura\'s Butterflies',
        description: 'Keep your makeup flawless all day with our long-lasting setting spray.',
        keywords: ['setting spray', 'makeup fix', 'long-lasting', 'flawless'],
      ),
    ),
    AdminProduct(
      id: '8',
      name: 'Eyebrow Pencil',
      nameAr: 'قلم حواجب',
      sku: 'EBP-008',
      slug: 'eyebrow-pencil',
      description: 'Define and shape your eyebrows with our long-lasting eyebrow pencil.',
      descriptionAr: 'حدد وشكل حواجبك مع قلم الحواجب طويل الأمد لدينا.',
      price: 18.00,
      category: 'Eyebrow',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.2,
      reviewCount: 74,
      inventory: ProductInventory(
        quantity: 89,
        lowStockThreshold: 20,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 9.00,
      supplier: ProductSupplier(
        name: 'Cosmetics International',
        contact: 'orders@cosmeticsintl.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 2)),
      seo: ProductSEO(
        title: 'Eyebrow Pencil - Noura\'s Butterflies',
        description: 'Perfect your brows with our long-lasting eyebrow pencil.',
        keywords: ['eyebrow pencil', 'brows', 'makeup', 'definition'],
      ),
    ),
    AdminProduct(
      id: '9',
      name: 'Highlighter Palette',
      nameAr: 'بالتظل إضاءات',
      sku: 'HLP-009',
      slug: 'highlighter-palette',
      description: 'Achieve a radiant glow with our multi-toned highlighter palette.',
      descriptionAr: 'حقق توهجًا مشعًا مع بالتظل الإضاءات متعدد الألوان لدينا.',
      price: 38.00,
      category: 'Highlighter',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.7,
      reviewCount: 145,
      inventory: ProductInventory(
        quantity: 23,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 19.00,
      supplier: ProductSupplier(
        name: 'Premium Pigments Ltd',
        contact: 'sales@premiumpigments.com',
        leadTime: 10,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(hours: 8)),
      seo: ProductSEO(
        title: 'Highlighter Palette - Noura\'s Butterflies',
        description: 'Get your perfect glow with our multi-toned highlighter palette.',
        keywords: ['highlighter', 'palette', 'glow', 'radiant'],
      ),
    ),
    AdminProduct(
      id: '10',
      name: 'Makeup Brush Set',
      nameAr: 'مجموعة فرش مكياج',
      sku: 'MBS-010',
      slug: 'makeup-brush-set',
      description: 'Professional 12-piece brush set for flawless application.',
      descriptionAr: 'مجموعة فرش احترافية مكونة من 12 قطعة لتطبيق مثالي.',
      price: 65.00,
      category: 'Brushes',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.8,
      reviewCount: 267,
      inventory: ProductInventory(
        quantity: 41,
        lowStockThreshold: 10,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 32.50,
      supplier: ProductSupplier(
        name: 'Beauty Tools Inc',
        contact: 'info@beautytools.com',
        leadTime: 14,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 5)),
      seo: ProductSEO(
        title: 'Makeup Brush Set - Noura\'s Butterflies',
        description: 'Professional makeup brush set for flawless application every time.',
        keywords: ['brushes', 'makeup tools', 'professional', 'set'],
      ),
    ),
    AdminProduct(
      id: '11',
      name: 'Liquid Eyeliner',
      nameAr: 'لاينر سائل',
      sku: 'LEL-011',
      slug: 'liquid-eyeliner',
      description: 'Create precise lines with our smudge-proof liquid eyeliner.',
      descriptionAr: 'أنشئ خطوطًا دقيقة مع لاينر السائل المقاوم لللطخ لدينا.',
      price: 20.00,
      category: 'Eyeliner',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.3,
      reviewCount: 98,
      inventory: ProductInventory(
        quantity: 67,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 10.00,
      supplier: ProductSupplier(
        name: 'Cosmetics International',
        contact: 'orders@cosmeticsintl.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 1)),
      seo: ProductSEO(
        title: 'Liquid Eyeliner - Noura\'s Butterflies',
        description: 'Achieve perfect winged liner with our smudge-proof liquid eyeliner.',
        keywords: ['eyeliner', 'liquid', 'winged liner', 'precise'],
      ),
    ),
    AdminProduct(
      id: '12',
      name: 'Face Powder',
      nameAr: 'بودرة الوجه',
      sku: 'FAP-012',
      slug: 'face-powder',
      description: 'Set your makeup and control shine with our translucent face powder.',
      descriptionAr: 'ثبت مكياجك وتحكم في اللمعان مع بودرة الوجه الشفافة لدينا.',
      price: 25.00,
      category: 'Powder',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.4,
      reviewCount: 112,
      inventory: ProductInventory(
        quantity: 5,
        lowStockThreshold: 12,
        trackQuantity: true,
        allowBackorder: true,
      ),
      cost: 12.50,
      supplier: ProductSupplier(
        name: 'Beauty Supplies Co',
        contact: 'contact@beautysupplies.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 3)),
      seo: ProductSEO(
        title: 'Face Powder - Noura\'s Butterflies',
        description: 'Control shine and set your makeup with our translucent face powder.',
        keywords: ['face powder', 'translucent', 'oil control', 'setting'],
      ),
    ),
    AdminProduct(
      id: '13',
      name: 'Lip Liner',
      nameAr: 'قلم تحديد الشفاه',
      sku: 'LLI-013',
      slug: 'lip-liner',
      description: 'Define your lips perfectly with our long-lasting lip liner.',
      descriptionAr: 'حدد شفاهك بشكل مثالي مع قلم تحديد الشفاه طويل الأمد لدينا.',
      price: 16.00,
      category: 'Lip Liner',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.1,
      reviewCount: 56,
      inventory: ProductInventory(
        quantity: 78,
        lowStockThreshold: 18,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 8.00,
      supplier: ProductSupplier(
        name: 'Cosmetics International',
        contact: 'orders@cosmeticsintl.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 2)),
      seo: ProductSEO(
        title: 'Lip Liner - Noura\'s Butterflies',
        description: 'Perfect your lip shape with our long-lasting lip liner.',
        keywords: ['lip liner', 'lip definition', 'makeup', 'long-lasting'],
      ),
    ),
    AdminProduct(
      id: '14',
      name: 'Bronzer',
      nameAr: 'برونزر',
      sku: 'BRZ-014',
      slug: 'bronzer',
      description: 'Achieve a sun-kissed glow with our natural bronzer.',
      descriptionAr: 'حقق توهجًا مشمسًا مع برونزرنا الطبيعي.',
      price: 28.00,
      category: 'Bronzer',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.5,
      reviewCount: 83,
      inventory: ProductInventory(
        quantity: 31,
        lowStockThreshold: 10,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 14.00,
      supplier: ProductSupplier(
        name: 'Premium Pigments Ltd',
        contact: 'sales@premiumpigments.com',
        leadTime: 10,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(hours: 4)),
      seo: ProductSEO(
        title: 'Bronzer - Noura\'s Butterflies',
        description: 'Get a natural sun-kissed glow with our premium bronzer.',
        keywords: ['bronzer', 'sun-kissed', 'contour', 'natural glow'],
      ),
    ),
    AdminProduct(
      id: '15',
      name: 'Makeup Remover',
      nameAr: 'مزيل مكياج',
      sku: 'MKR-015',
      slug: 'makeup-remover',
      description: 'Gently remove all makeup with our nourishing makeup remover.',
      descriptionAr: 'أزل كل المكياج بلطف مع مزيل المكياج المغذي لدينا.',
      price: 18.00,
      category: 'Makeup Remover',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.6,
      reviewCount: 134,
      inventory: ProductInventory(
        quantity: 92,
        lowStockThreshold: 20,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 9.00,
      supplier: ProductSupplier(
        name: 'Skincare Essentials',
        contact: 'info@skincare.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 1)),
      seo: ProductSEO(
        title: 'Makeup Remover - Noura\'s Butterflies',
        description: 'Gently remove all makeup with our nourishing makeup remover.',
        keywords: ['makeup remover', 'gentle', 'nourishing', 'skincare'],
      ),
    ),
    // Add more products to reach 50+
    AdminProduct(
      id: '16',
      name: 'Concealer',
      nameAr: 'كونسيلر',
      sku: 'CNC-016',
      slug: 'concealer',
      description: 'Full coverage concealer that hides imperfections flawlessly.',
      descriptionAr: 'كونسيلر تغطية كاملة يخفي العيوب بشكل مثالي.',
      price: 22.00,
      category: 'Concealer',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.4,
      reviewCount: 167,
      inventory: ProductInventory(
        quantity: 44,
        lowStockThreshold: 12,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 11.00,
      supplier: ProductSupplier(
        name: 'Beauty Supplies Co',
        contact: 'contact@beautysupplies.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 2)),
      seo: ProductSEO(
        title: 'Concealer - Noura\'s Butterflies',
        description: 'Hide imperfections flawlessly with our full coverage concealer.',
        keywords: ['concealer', 'full coverage', 'imperfections', 'flawless'],
      ),
    ),
    AdminProduct(
      id: '17',
      name: 'Beauty Blender',
      nameAr: 'بيوتي بلندر',
      sku: 'BBL-017',
      slug: 'beauty-blender',
      description: 'Perfect makeup application with our original beauty blender.',
      descriptionAr: 'تطبيق مكياج مثالي مع بيوتي بلندر الأصلي لدينا.',
      price: 20.00,
      category: 'Tools',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.7,
      reviewCount: 289,
      inventory: ProductInventory(
        quantity: 156,
        lowStockThreshold: 25,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 10.00,
      supplier: ProductSupplier(
        name: 'Beauty Tools Inc',
        contact: 'info@beautytools.com',
        leadTime: 14,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 3)),
      seo: ProductSEO(
        title: 'Beauty Blender - Noura\'s Butterflies',
        description: 'Achieve flawless makeup application with our original beauty blender.',
        keywords: ['beauty blender', 'makeup sponge', 'flawless application', 'tools'],
      ),
    ),
    AdminProduct(
      id: '18',
      name: 'Nail Polish',
      nameAr: 'مانيكير',
      sku: 'NPL-018',
      slug: 'nail-polish',
      description: 'Long-lasting chip-resistant nail polish in vibrant colors.',
      descriptionAr: 'مانيكير طويل الأمد مقاوم للتقشر بألوان زاهية.',
      price: 12.00,
      category: 'Nail Polish',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.2,
      reviewCount: 78,
      inventory: ProductInventory(
        quantity: 234,
        lowStockThreshold: 30,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 6.00,
      supplier: ProductSupplier(
        name: 'Nail Essentials Co',
        contact: 'sales@nailessentials.com',
        leadTime: 5,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 4)),
      seo: ProductSEO(
        title: 'Nail Polish - Noura\'s Butterflies',
        description: 'Long-lasting chip-resistant nail polish in vibrant colors.',
        keywords: ['nail polish', 'manicure', 'long-lasting', 'vibrant colors'],
      ),
    ),
    AdminProduct(
      id: '19',
      name: 'Lip Balm',
      nameAr: 'بلسم الشفاه',
      sku: 'LBM-019',
      slug: 'lip-balm',
      description: 'Soothe and protect your lips with our nourishing lip balm.',
      descriptionAr: 'هدئ وحمي شفاهك مع بلسم الشفاه المغذي لدينا.',
      price: 8.00,
      category: 'Lip Care',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.5,
      reviewCount: 198,
      inventory: ProductInventory(
        quantity: 312,
        lowStockThreshold: 40,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 4.00,
      supplier: ProductSupplier(
        name: 'Skincare Essentials',
        contact: 'info@skincare.com',
        leadTime: 7,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(days: 1)),
      seo: ProductSEO(
        title: 'Lip Balm - Noura\'s Butterflies',
        description: 'Soothe and protect your lips with our nourishing lip balm.',
        keywords: ['lip balm', 'lip care', 'soothing', 'protective'],
      ),
    ),
    AdminProduct(
      id: '20',
      name: 'Eye Shadow Primer',
      nameAr: 'برايمر العيون',
      sku: 'ESP-020',
      slug: 'eye-shadow-primer',
      description: 'Make your eyeshadow last all day with our eye shadow primer.',
      descriptionAr: 'اجعل ظلال العيون تدوم طوال اليوم مع برايمر العيون لدينا.',
      price: 18.00,
      category: 'Primer',
      images: [
        'https://images.unsplash.com/photo-1596462502278-27d54b5f18a2?w=300',
      ],
      rating: 4.6,
      reviewCount: 145,
      inventory: ProductInventory(
        quantity: 67,
        lowStockThreshold: 15,
        trackQuantity: true,
        allowBackorder: false,
      ),
      cost: 9.00,
      supplier: ProductSupplier(
        name: 'Premium Pigments Ltd',
        contact: 'sales@premiumpigments.com',
        leadTime: 10,
      ),
      createdBy: 'admin@nouras.com',
      lastModified: DateTime.now().subtract(const Duration(hours: 6)),
      seo: ProductSEO(
        title: 'Eye Shadow Primer - Noura\'s Butterflies',
        description: 'Make your eyeshadow last all day with our eye shadow primer.',
        keywords: ['eye shadow primer', 'eyeshadow', 'long-lasting', 'primer'],
      ),
    ),
  ];

  // Search products by name or SKU
  static List<AdminProduct> searchProducts(String query) {
    if (query.isEmpty) return products;
    
    final lowercaseQuery = query.toLowerCase();
    return products.where((product) {
      return product.name.toLowerCase().contains(lowercaseQuery) ||
             product.nameAr.toLowerCase().contains(lowercaseQuery) ||
             product.sku.toLowerCase().contains(lowercaseQuery) ||
             product.category.toLowerCase().contains(lowercaseQuery);
    }).toList();
  }

  // Filter products by category
  static List<AdminProduct> filterByCategory(String category) {
    if (category == 'all') return products;
    return products.where((product) => product.category == category).toList();
  }

  // Filter products by stock status
  static List<AdminProduct> filterByStatus(String status) {
    switch (status) {
      case 'active':
        return products.where((p) => p.inventory.quantity > p.inventory.lowStockThreshold).toList();
      case 'low':
        return products.where((p) => 
          p.inventory.quantity > 0 && 
          p.inventory.quantity <= p.inventory.lowStockThreshold
        ).toList();
      case 'out':
        return products.where((p) => p.inventory.quantity == 0).toList();
      default:
        return products;
    }
  }

  // Get all unique categories
  static List<String> getAllCategories() {
    final categories = products.map((p) => p.category).toSet().toList();
    categories.sort();
    return categories;
  }

  // Get product by ID
  static AdminProduct? getProductById(String id) {
    try {
      return products.firstWhere((product) => product.id == id);
    } catch (e) {
      return null;
    }
  }

  // Get products by price range
  static List<AdminProduct> filterByPriceRange(double min, double max) {
    return products.where((product) => 
      product.price >= min && product.price <= max
    ).toList();
  }

  // Get low stock products
  static List<AdminProduct> getLowStockProducts() {
    return products.where((product) => 
      product.inventory.quantity > 0 && 
      product.inventory.quantity <= product.inventory.lowStockThreshold
    ).toList();
  }

  // Get out of stock products
  static List<AdminProduct> getOutOfStockProducts() {
    return products.where((product) => product.inventory.quantity == 0).toList();
  }

  // Get products by supplier
  static List<AdminProduct> getProductsBySupplier(String supplierName) {
    return products.where((product) => product.supplier.name == supplierName).toList();
  }

  // Sort products
  static List<AdminProduct> sortProducts(List<AdminProduct> productList, String sortBy, bool ascending) {
    final sortedList = List<AdminProduct>.from(productList);
    
    sortedList.sort((a, b) {
      int comparison;
      switch (sortBy) {
        case 'name':
          comparison = a.name.toLowerCase().compareTo(b.name.toLowerCase());
          break;
        case 'price':
          comparison = a.price.compareTo(b.price);
          break;
        case 'stock':
          comparison = a.inventory.quantity.compareTo(b.inventory.quantity);
          break;
        case 'category':
          comparison = a.category.toLowerCase().compareTo(b.category.toLowerCase());
          break;
        case 'rating':
          comparison = a.rating.compareTo(b.rating);
          break;
        case 'date':
          comparison = a.lastModified.compareTo(b.lastModified);
          break;
        default:
          comparison = a.name.toLowerCase().compareTo(b.name.toLowerCase());
      }
      return ascending ? comparison : -comparison;
    });
    
    return sortedList;
  }

  // CRUD Operations that persist changes
  
  // Delete product from the mock list
  static bool deleteProduct(String id) {
    try {
      products.removeWhere((product) => product.id == id);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Add new product to the mock list
  static void createProduct(AdminProduct product) {
    products.add(product);
  }

  // Update existing product in the mock list
  static bool updateProduct(AdminProduct updatedProduct) {
    try {
      final index = products.indexWhere((product) => product.id == updatedProduct.id);
      if (index != -1) {
        products[index] = updatedProduct;
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  // Duplicate product and add to mock list
  static AdminProduct? duplicateProduct(String id) {
    try {
      final originalProduct = getProductById(id);
      if (originalProduct == null) {
        return null;
      }
      
      // Create a duplicate with new ID and modified name
      final duplicatedProduct = originalProduct.copyWith(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: '${originalProduct.name} (Copy)',
        nameAr: '${originalProduct.nameAr} (نسخة)',
        sku: '${originalProduct.sku}-COPY',
        lastModified: DateTime.now(),
      );
      
      // Add to the mock list to persist the change
      products.add(duplicatedProduct);
      
      return duplicatedProduct;
    } catch (e) {
      return null;
    }
  }
}
