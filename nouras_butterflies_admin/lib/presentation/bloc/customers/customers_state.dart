import 'package:equatable/equatable.dart';
import '../../../data/models/customer.dart';
import '../../../data/repositories/customer_repository.dart';

abstract class CustomersState extends Equatable {
  const CustomersState();

  @override
  List<Object?> get props => [];
}

class CustomersInitial extends CustomersState {}

class CustomersLoading extends CustomersState {}

class CustomersLoaded extends CustomersState {
  final List<Customer> customers;
  final List<Customer> filteredCustomers;
  final MembershipTier? tierFilter;
  final String? searchQuery;
  final Customer? selectedCustomer;
  final CustomerStats? stats;

  const CustomersLoaded({
    required this.customers,
    required this.filteredCustomers,
    this.tierFilter,
    this.searchQuery,
    this.selectedCustomer,
    this.stats,
  });

  @override
  List<Object?> get props => [
        customers,
        filteredCustomers,
        tierFilter,
        searchQuery,
        selectedCustomer,
        stats,
      ];

  CustomersLoaded copyWith({
    List<Customer>? customers,
    List<Customer>? filteredCustomers,
    MembershipTier? tierFilter,
    String? searchQuery,
    Customer? selectedCustomer,
    CustomerStats? stats,
  }) {
    return CustomersLoaded(
      customers: customers ?? this.customers,
      filteredCustomers: filteredCustomers ?? this.filteredCustomers,
      tierFilter: tierFilter ?? this.tierFilter,
      searchQuery: searchQuery ?? this.searchQuery,
      selectedCustomer: selectedCustomer ?? this.selectedCustomer,
      stats: stats ?? this.stats,
    );
  }
}

class CustomersError extends CustomersState {
  final String message;

  const CustomersError(this.message);

  @override
  List<Object?> get props => [message];
}

class CustomerNotesUpdated extends CustomersState {
  final Customer updatedCustomer;

  const CustomerNotesUpdated(this.updatedCustomer);

  @override
  List<Object?> get props => [updatedCustomer];
}
