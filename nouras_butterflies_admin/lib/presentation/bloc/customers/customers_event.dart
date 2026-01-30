import 'package:equatable/equatable.dart';
import '../../../data/models/customer.dart';

abstract class CustomersEvent extends Equatable {
  const CustomersEvent();

  @override
  List<Object?> get props => [];
}

class LoadCustomers extends CustomersEvent {}

class FilterCustomersByTier extends CustomersEvent {
  final MembershipTier? tier;

  const FilterCustomersByTier(this.tier);

  @override
  List<Object?> get props => [tier];
}

class SearchCustomers extends CustomersEvent {
  final String query;

  const SearchCustomers(this.query);

  @override
  List<Object?> get props => [query];
}

class SelectCustomer extends CustomersEvent {
  final Customer? customer;

  const SelectCustomer(this.customer);

  @override
  List<Object?> get props => [customer];
}

class UpdateCustomerNotes extends CustomersEvent {
  final String customerId;
  final String notes;

  const UpdateCustomerNotes(this.customerId, this.notes);

  @override
  List<Object?> get props => [customerId, notes];
}

class ClearCustomerFilters extends CustomersEvent {}

class SortCustomers extends CustomersEvent {
  final String column;
  final bool ascending;

  const SortCustomers(this.column, this.ascending);

  @override
  List<Object?> get props => [column, ascending];
}

class RefreshCustomers extends CustomersEvent {}
