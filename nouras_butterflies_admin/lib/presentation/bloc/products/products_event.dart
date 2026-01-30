import 'package:equatable/equatable.dart';
import '../../../data/models/admin_product.dart';
import '../../../../data/models/product_form_data.dart';

abstract class ProductsEvent extends Equatable {
  const ProductsEvent();

  @override
  List<Object?> get props => [];
}

class LoadProducts extends ProductsEvent {}

class SearchProducts extends ProductsEvent {
  final String query;

  const SearchProducts(this.query);

  @override
  List<Object?> get props => [query];
}

class FilterProducts extends ProductsEvent {
  final String? category;
  final String? status;
  final double? minPrice;
  final double? maxPrice;

  const FilterProducts({
    this.category,
    this.status,
    this.minPrice,
    this.maxPrice,
  });

  @override
  List<Object?> get props => [category, status, minPrice, maxPrice];
}

class SortProducts extends ProductsEvent {
  final String sortBy;
  final bool ascending;

  const SortProducts(this.sortBy, this.ascending);

  @override
  List<Object?> get props => [sortBy, ascending];
}

class ChangePage extends ProductsEvent {
  final int page;

  const ChangePage(this.page);

  @override
  List<Object?> get props => [page];
}

class DeleteProduct extends ProductsEvent {
  final String id;

  const DeleteProduct(this.id);

  @override
  List<Object?> get props => [id];
}

class DuplicateProduct extends ProductsEvent {
  final String id;

  const DuplicateProduct(this.id);

  @override
  List<Object?> get props => [id];
}

class RefreshProducts extends ProductsEvent {}

class ClearFilters extends ProductsEvent {}

class BulkDeleteProducts extends ProductsEvent {
  final List<String> ids;

  const BulkDeleteProducts(this.ids);

  @override
  List<Object?> get props => [ids];
}

class ExportProducts extends ProductsEvent {
  final List<String> productIds;

  const ExportProducts(this.productIds);

  @override
  List<Object?> get props => [productIds];
}

class CreateProduct extends ProductsEvent {
  final ProductFormData productData;

  const CreateProduct(this.productData);

  @override
  List<Object?> get props => [productData];
}

class UpdateProduct extends ProductsEvent {
  final ProductFormData productData;

  const UpdateProduct(this.productData);

  @override
  List<Object?> get props => [productData];
}

class SaveProductDraft extends ProductsEvent {
  final ProductFormData productData;

  const SaveProductDraft(this.productData);

  @override
  List<Object?> get props => [productData];
}
