import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_dimensions.dart';
import '../../../data/models/admin_product.dart';
import '../../../data/repositories/admin_product_repository.dart';
import '../../bloc/products/products_bloc.dart';
import '../../bloc/products/products_event.dart';
import '../../bloc/products/products_state.dart';
import '../../widgets/admin/admin_layout.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/error_widget.dart';
import '../../widgets/products/product_form_fields.dart';
import '../../widgets/products/product_image_picker.dart';
import '../../widgets/products/product_form_footer.dart';
import '../../../../data/models/product_form_data.dart';

class ProductFormScreen extends StatelessWidget {
  final String? productId;

  const ProductFormScreen({
    Key? key,
    this.productId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => ProductsBloc(
        AdminProductRepositoryImpl(useMockData: true),
      )..add(LoadProducts()),
      child: ProductFormView(productId: productId),
    );
  }
}

class ProductFormView extends StatefulWidget {
  final String? productId;

  const ProductFormView({
    Key? key,
    this.productId,
  }) : super(key: key);

  @override
  State<ProductFormView> createState() => _ProductFormViewState();
}

class _ProductFormViewState extends State<ProductFormView> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  ProductFormData? _initialData;
  ProductFormData _currentFormData = ProductFormData(
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    category: 'Lip Gloss',
    sku: '',
    basePrice: 0.0,
    cost: 0.0,
    inventory: const ProductInventory(),
    supplier: const ProductSupplier(),
    seo: const ProductSEO(),
  );
  List<String> _images = [];
  bool _hasUnsavedChanges = false;

  @override
  void initState() {
    super.initState();
    if (widget.productId != null) {
      _loadProductData();
    }
  }

  Future<void> _loadProductData() async {
    if (widget.productId == null) return;

    try {
      final repository = AdminProductRepositoryImpl(useMockData: true);
      final product = await repository.getProductById(widget.productId!);
      
      if (product != null) {
        setState(() {
          _initialData = ProductFormData(
            id: product.id,
            name: product.name,
            nameAr: product.nameAr,
            description: product.description,
            descriptionAr: product.descriptionAr,
            category: product.category,
            sku: product.sku,
            basePrice: product.price,
            cost: product.cost,
            images: product.images,
            inventory: product.inventory,
            supplier: product.supplier,
            seo: product.seo,
            createdAt: product.lastModified,
            updatedAt: product.lastModified,
          );
          _currentFormData = _initialData!;
          _images = List.from(product.images);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to load product: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _onFormDataChanged(ProductFormData formData) {
    setState(() {
      _currentFormData = formData;
      _hasUnsavedChanges = true;
    });
  }

  void _onImagesChanged(List<String> images) {
    setState(() {
      _images = images;
      _hasUnsavedChanges = true;
    });
  }

  Future<void> _onSave() async {
    if (!_formKey.currentState!.validate()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fix validation errors before saving'),
          backgroundColor: Colors.orange,
        ),
      );
      return;
    }

    final updatedFormData = _currentFormData.copyWith(images: _images);
    
    if (widget.productId == null) {
      // Create new product
      context.read<ProductsBloc>().add(CreateProduct(updatedFormData));
    } else {
      // Update existing product
      context.read<ProductsBloc>().add(UpdateProduct(updatedFormData));
    }
  }

  Future<void> _onSaveDraft() async {
    final draftFormData = _currentFormData.copyWith(images: _images);
    context.read<ProductsBloc>().add(SaveProductDraft(draftFormData));
  }

  Future<bool> _onWillPop() async {
    if (!_hasUnsavedChanges) return true;

    final shouldLeave = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Unsaved Changes'),
        content: const Text('You have unsaved changes. Are you sure you want to leave?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Stay'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Leave'),
          ),
        ],
      ),
    );

    return shouldLeave ?? false;
  }

  void _onCancel() {
    if (_hasUnsavedChanges) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Unsaved Changes'),
          content: const Text('You have unsaved changes. Are you sure you want to cancel?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Stay'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                context.go('/products');
              },
              child: const Text('Cancel'),
            ),
          ],
        ),
      );
    } else {
      context.go('/products');
    }
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: _onWillPop,
      child: AdminLayout(
        currentRoute: widget.productId == null ? '/products/add' : '/products/edit/${widget.productId}',
        child: BlocListener<ProductsBloc, ProductsState>(
          listener: (context, state) {
            if (state is ProductSaved) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(widget.productId == null 
                      ? 'Product created successfully' 
                      : 'Product updated successfully'),
                  backgroundColor: Colors.green,
                ),
              );
              setState(() {
                _hasUnsavedChanges = false;
              });
              context.go('/products');
            } else if (state is ProductSaveDrafted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Draft saved successfully'),
                  backgroundColor: Colors.blue,
                ),
              );
              setState(() {
                _hasUnsavedChanges = false;
              });
            } else if (state is ProductSaveError) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(state.message),
                  backgroundColor: Colors.red,
                ),
              );
            }
          },
          child: BlocBuilder<ProductsBloc, ProductsState>(
            builder: (context, state) {
              final isLoading = state is ProductSaving || 
                               state is ProductOperationInProgress;
              
              return Scaffold(
                appBar: AppBar(
                  title: Text(
                    widget.productId == null ? 'Add Product' : 'Edit Product',
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  backgroundColor: AppColors.primary,
                  elevation: 0,
                  leading: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: _onCancel,
                  ),
                  actions: [
                    if (_hasUnsavedChanges)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        margin: const EdgeInsets.only(right: 16),
                        decoration: BoxDecoration(
                          color: Colors.orange,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'Unsaved',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                  ],
                ),
                body: Column(
                  children: [
                    // Progress indicator for loading states
                    if (isLoading)
                      LinearProgressIndicator(
                        backgroundColor: Colors.grey[200],
                        valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
                      ),
                    
                    // Main content
                    Expanded(
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.all(16),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Product Images Section
                              ProductImagePicker(
                                initialImages: _images,
                                onImagesChanged: _onImagesChanged,
                              ),
                              const SizedBox(height: 24),
                              
                              // Form Fields Section
                              Card(
                                elevation: 2,
                                child: Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: ProductFormFields(
                                    initialData: _initialData,
                                    formKey: _formKey,
                                    onChanged: _onFormDataChanged,
                                  ),
                                ),
                              ),
                              const SizedBox(height: 100), // Space for footer
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                bottomNavigationBar: ProductFormFooter(
                  formData: _currentFormData.copyWith(images: _images),
                  isLoading: isLoading,
                  onSave: _onSave,
                  onSaveDraft: _onSaveDraft,
                  onCancel: _onCancel,
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}
