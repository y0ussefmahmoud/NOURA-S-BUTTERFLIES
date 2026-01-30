import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../data/models/product_form_data.dart';

class ProductFormFields extends StatefulWidget {
  final ProductFormData? initialData;
  final GlobalKey<FormState> formKey;
  final ValueChanged<ProductFormData> onChanged;

  const ProductFormFields({
    Key? key,
    this.initialData,
    required this.formKey,
    required this.onChanged,
  }) : super(key: key);

  @override
  State<ProductFormFields> createState() => _ProductFormFieldsState();
}

class _ProductFormFieldsState extends State<ProductFormFields> {
  late TextEditingController _nameController;
  late TextEditingController _nameArController;
  late TextEditingController _descriptionController;
  late TextEditingController _descriptionArController;
  late TextEditingController _priceController;
  late TextEditingController _stockController;
  late TextEditingController _costController;
  late TextEditingController _skuController;
  late TextEditingController _supplierNameController;
  late TextEditingController _supplierContactController;
  late TextEditingController _supplierLeadTimeController;
  late TextEditingController _seoTitleController;
  late TextEditingController _seoDescriptionController;

  String _selectedCategory = 'Lip Gloss';
  String _selectedStatus = 'active';
  bool _isVegan = false;
  bool _isNatural = false;
  bool _showOnHomepage = false;
  bool _trackQuantity = true;
  bool _allowBackorder = false;
  int _lowStockThreshold = 10;

  final List<String> _categories = [
    'Lip Gloss',
    'Lipstick',
    'Eyeshadow',
    'Blush',
    'Mascara',
    'Primer',
    'Setting Spray',
    'Eyebrow',
    'Highlighter',
    'Brushes',
    'Eyeliner',
    'Powder',
    'Lip Liner',
    'Bronzer',
    'Makeup Remover',
    'Concealer',
    'Tools',
    'Nail Polish',
    'Lip Care',
  ];

  @override
  void initState() {
    super.initState();
    _initializeControllers();
    _populateInitialData();
  }

  void _initializeControllers() {
    _nameController = TextEditingController();
    _nameArController = TextEditingController();
    _descriptionController = TextEditingController();
    _descriptionArController = TextEditingController();
    _priceController = TextEditingController();
    _stockController = TextEditingController();
    _costController = TextEditingController();
    _skuController = TextEditingController();
    _supplierNameController = TextEditingController();
    _supplierContactController = TextEditingController();
    _supplierLeadTimeController = TextEditingController();
    _seoTitleController = TextEditingController();
    _seoDescriptionController = TextEditingController();

    // Add listeners for real-time updates
    _nameController.addListener(_updateFormData);
    _nameArController.addListener(_updateFormData);
    _descriptionController.addListener(_updateFormData);
    _descriptionArController.addListener(_updateFormData);
    _priceController.addListener(_updateFormData);
    _stockController.addListener(_updateFormData);
    _costController.addListener(_updateFormData);
    _skuController.addListener(_updateFormData);
    _supplierNameController.addListener(_updateFormData);
    _supplierContactController.addListener(_updateFormData);
    _supplierLeadTimeController.addListener(_updateFormData);
    _seoTitleController.addListener(_updateFormData);
    _seoDescriptionController.addListener(_updateFormData);
  }

  void _populateInitialData() {
    if (widget.initialData != null) {
      final data = widget.initialData!;
      _nameController.text = data.name;
      _nameArController.text = data.nameAr;
      _descriptionController.text = data.description;
      _descriptionArController.text = data.descriptionAr;
      _priceController.text = data.basePrice.toString();
      _stockController.text = data.inventory.quantity.toString();
      _costController.text = data.cost.toString();
      _skuController.text = data.sku;
      _supplierNameController.text = data.supplier.name;
      _supplierContactController.text = data.supplier.contact;
      _supplierLeadTimeController.text = data.supplier.leadTime.toString();
      _seoTitleController.text = data.seo.title;
      _seoDescriptionController.text = data.seo.description;
      
      _selectedCategory = data.category;
      _isVegan = data.isVegan;
      _isNatural = data.isNatural;
      _showOnHomepage = data.showOnHomepage;
      _trackQuantity = data.inventory.trackQuantity;
      _allowBackorder = data.inventory.allowBackorder;
      _lowStockThreshold = data.inventory.lowStockThreshold;
    }
  }

  void _updateFormData() {
    final formData = ProductFormData(
      id: widget.initialData?.id,
      name: _nameController.text,
      nameAr: _nameArController.text,
      description: _descriptionController.text,
      descriptionAr: _descriptionArController.text,
      category: _selectedCategory,
      sku: _skuController.text,
      basePrice: double.tryParse(_priceController.text) ?? 0.0,
      cost: double.tryParse(_costController.text) ?? 0.0,
      inventory: ProductInventory(
        quantity: int.tryParse(_stockController.text) ?? 0,
        lowStockThreshold: _lowStockThreshold,
        trackQuantity: _trackQuantity,
        allowBackorder: _allowBackorder,
      ),
      supplier: ProductSupplier(
        name: _supplierNameController.text,
        contact: _supplierContactController.text,
        leadTime: int.tryParse(_supplierLeadTimeController.text) ?? 7,
      ),
      seo: ProductSEO(
        title: _seoTitleController.text,
        description: _seoDescriptionController.text,
      ),
      isVegan: _isVegan,
      isNatural: _isNatural,
      showOnHomepage: _showOnHomepage,
    );
    widget.onChanged(formData);
  }

  @override
  void dispose() {
    _nameController.dispose();
    _nameArController.dispose();
    _descriptionController.dispose();
    _descriptionArController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    _costController.dispose();
    _skuController.dispose();
    _supplierNameController.dispose();
    _supplierContactController.dispose();
    _supplierLeadTimeController.dispose();
    _seoTitleController.dispose();
    _seoDescriptionController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: widget.formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Basic Information Section
          _buildSectionHeader('Basic Information'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Product Name (English)',
                    border: OutlineInputBorder(),
                    hintText: 'Enter product name',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Product name is required';
                    }
                    if (value.trim().length < 3) {
                      return 'Name must be at least 3 characters';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _nameArController,
                  decoration: const InputDecoration(
                    labelText: 'Product Name (Arabic)',
                    border: OutlineInputBorder(),
                    hintText: 'أدخل اسم المنتج',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Arabic product name is required';
                    }
                    if (value.trim().length < 3) {
                      return 'Arabic name must be at least 3 characters';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _descriptionController,
                  decoration: const InputDecoration(
                    labelText: 'Description (English)',
                    border: OutlineInputBorder(),
                    hintText: 'Enter product description',
                  ),
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Description is required';
                    }
                    if (value.trim().length < 10) {
                      return 'Description must be at least 10 characters';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _descriptionArController,
                  decoration: const InputDecoration(
                    labelText: 'Description (Arabic)',
                    border: OutlineInputBorder(),
                    hintText: 'أدخل وصف المنتج',
                  ),
                  maxLines: 3,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Arabic description is required';
                    }
                    if (value.trim().length < 10) {
                      return 'Arabic description must be at least 10 characters';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: DropdownButtonFormField<String>(
                  value: _selectedCategory,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(),
                  ),
                  items: _categories.map((category) {
                    return DropdownMenuItem(
                      value: category,
                      child: Text(category),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _selectedCategory = value!;
                    });
                    _updateFormData();
                  },
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Category is required';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _skuController,
                  decoration: const InputDecoration(
                    labelText: 'SKU',
                    border: OutlineInputBorder(),
                    hintText: 'Enter product SKU',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'SKU is required';
                    }
                    if (!RegExp(r'^[a-zA-Z0-9_-]+$').hasMatch(value)) {
                      return 'SKU must contain only letters, numbers, hyphens, and underscores';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Pricing Section
          _buildSectionHeader('Pricing'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _priceController,
                  decoration: const InputDecoration(
                    labelText: 'Price (\$)',
                    border: OutlineInputBorder(),
                    hintText: '0.00',
                    prefixText: '\$',
                  ),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                  ],
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Price is required';
                    }
                    final price = double.tryParse(value);
                    if (price == null || price <= 0) {
                      return 'Price must be greater than 0';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _costController,
                  decoration: const InputDecoration(
                    labelText: 'Cost (\$)',
                    border: OutlineInputBorder(),
                    hintText: '0.00',
                    prefixText: '\$',
                  ),
                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                  inputFormatters: [
                    FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}')),
                  ],
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Cost is required';
                    }
                    final cost = double.tryParse(value);
                    if (cost == null || cost < 0) {
                      return 'Cost must be greater than or equal to 0';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Inventory Section
          _buildSectionHeader('Inventory'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _stockController,
                  decoration: const InputDecoration(
                    labelText: 'Stock Quantity',
                    border: OutlineInputBorder(),
                    hintText: '0',
                  ),
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Stock quantity is required';
                    }
                    final quantity = int.tryParse(value);
                    if (quantity == null || quantity < 0) {
                      return 'Stock quantity must be greater than or equal to 0';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Low Stock Threshold',
                    border: OutlineInputBorder(),
                    hintText: '10',
                  ),
                  keyboardType: TextInputType.number,
                  inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                  initialValue: _lowStockThreshold.toString(),
                  onChanged: (value) {
                    _lowStockThreshold = int.tryParse(value) ?? 10;
                    _updateFormData();
                  },
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Low stock threshold is required';
                    }
                    final threshold = int.tryParse(value);
                    if (threshold == null || threshold < 0) {
                      return 'Threshold must be greater than or equal to 0';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: CheckboxListTile(
                  title: const Text('Track Quantity'),
                  value: _trackQuantity,
                  onChanged: (value) {
                    setState(() {
                      _trackQuantity = value ?? false;
                    });
                    _updateFormData();
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              Expanded(
                child: CheckboxListTile(
                  title: const Text('Allow Backorder'),
                  value: _allowBackorder,
                  onChanged: (value) {
                    setState(() {
                      _allowBackorder = value ?? false;
                    });
                    _updateFormData();
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Product Attributes
          _buildSectionHeader('Product Attributes'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: CheckboxListTile(
                  title: const Text('Vegan'),
                  value: _isVegan,
                  onChanged: (value) {
                    setState(() {
                      _isVegan = value ?? false;
                    });
                    _updateFormData();
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              Expanded(
                child: CheckboxListTile(
                  title: const Text('Natural'),
                  value: _isNatural,
                  onChanged: (value) {
                    setState(() {
                      _isNatural = value ?? false;
                    });
                    _updateFormData();
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              Expanded(
                child: CheckboxListTile(
                  title: const Text('Show on Homepage'),
                  value: _showOnHomepage,
                  onChanged: (value) {
                    setState(() {
                      _showOnHomepage = value ?? false;
                    });
                    _updateFormData();
                  },
                  controlAffinity: ListTileControlAffinity.leading,
                  contentPadding: EdgeInsets.zero,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Supplier Information
          _buildSectionHeader('Supplier Information'),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: TextFormField(
                  controller: _supplierNameController,
                  decoration: const InputDecoration(
                    labelText: 'Supplier Name',
                    border: OutlineInputBorder(),
                    hintText: 'Enter supplier name',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Supplier name is required';
                    }
                    return null;
                  },
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: TextFormField(
                  controller: _supplierContactController,
                  decoration: const InputDecoration(
                    labelText: 'Supplier Contact',
                    border: OutlineInputBorder(),
                    hintText: 'Enter supplier contact',
                  ),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Supplier contact is required';
                    }
                    return null;
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _supplierLeadTimeController,
            decoration: const InputDecoration(
              labelText: 'Lead Time (days)',
              border: OutlineInputBorder(),
              hintText: '7',
            ),
            keyboardType: TextInputType.number,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Lead time is required';
              }
              final leadTime = int.tryParse(value);
              if (leadTime == null || leadTime < 0) {
                return 'Lead time must be greater than or equal to 0';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),

          // SEO Information
          _buildSectionHeader('SEO Information'),
          const SizedBox(height: 16),
          TextFormField(
            controller: _seoTitleController,
            decoration: const InputDecoration(
              labelText: 'SEO Title',
              border: OutlineInputBorder(),
              hintText: 'Enter SEO title',
              helperText: 'Maximum 60 characters recommended',
            ),
            maxLength: 60,
            validator: (value) {
              if (value != null && value.length > 60) {
                return 'SEO title must not exceed 60 characters';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            controller: _seoDescriptionController,
            decoration: const InputDecoration(
              labelText: 'SEO Description',
              border: OutlineInputBorder(),
              hintText: 'Enter SEO description',
              helperText: 'Maximum 160 characters recommended',
            ),
            maxLines: 3,
            maxLength: 160,
            validator: (value) {
              if (value != null && value.length > 160) {
                return 'SEO description must not exceed 160 characters';
              }
              return null;
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title,
        style: Theme.of(context).textTheme.titleLarge?.copyWith(
          fontWeight: FontWeight.bold,
          color: Theme.of(context).primaryColor,
        ),
      ),
    );
  }
}
