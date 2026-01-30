import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/customer.dart';
import '../../../data/repositories/customer_repository.dart';
import 'customers_event.dart';
import 'customers_state.dart';

class CustomersBloc extends Bloc<CustomersEvent, CustomersState> {
  final CustomerRepository _customerRepository;

  CustomersBloc({required CustomerRepository customerRepository})
      : _customerRepository = customerRepository,
        super(CustomersInitial()) {
    on<LoadCustomers>(_onLoadCustomers);
    on<FilterCustomersByTier>(_onFilterCustomersByTier);
    on<SearchCustomers>(_onSearchCustomers);
    on<SelectCustomer>(_onSelectCustomer);
    on<UpdateCustomerNotes>(_onUpdateCustomerNotes);
    on<ClearCustomerFilters>(_onClearCustomerFilters);
    on<SortCustomers>(_onSortCustomers);
    on<RefreshCustomers>(_onRefreshCustomers);
  }

  Future<void> _onLoadCustomers(
    LoadCustomers event,
    Emitter<CustomersState> emit,
  ) async {
    emit(CustomersLoading());
    try {
      final customers = await _customerRepository.getCustomers();
      final stats = await _customerRepository.getCustomerStats();
      emit(CustomersLoaded(
        customers: customers,
        filteredCustomers: customers,
        stats: stats,
      ));
    } catch (e) {
      emit(CustomersError('Failed to load customers: ${e.toString()}'));
    }
  }

  Future<void> _onFilterCustomersByTier(
    FilterCustomersByTier event,
    Emitter<CustomersState> emit,
  ) async {
    if (state is CustomersLoaded) {
      final currentState = state as CustomersLoaded;
      List<Customer> filteredCustomers = currentState.customers;

      if (event.tier != null) {
        filteredCustomers = filteredCustomers
            .where((customer) => customer.tier == event.tier)
            .toList();
      }

      // Apply existing search filter if any
      if (currentState.searchQuery != null && currentState.searchQuery!.isNotEmpty) {
        filteredCustomers = _applySearchFilter(filteredCustomers, currentState.searchQuery!);
      }

      emit(currentState.copyWith(
        filteredCustomers: filteredCustomers,
        tierFilter: event.tier,
      ));
    }
  }

  Future<void> _onSearchCustomers(
    SearchCustomers event,
    Emitter<CustomersState> emit,
  ) async {
    if (state is CustomersLoaded) {
      final currentState = state as CustomersLoaded;
      List<Customer> filteredCustomers = currentState.customers;

      // Apply tier filter if any
      if (currentState.tierFilter != null) {
        filteredCustomers = filteredCustomers
            .where((customer) => customer.tier == currentState.tierFilter)
            .toList();
      }

      // Apply search filter
      if (event.query.isEmpty) {
        // If search is empty, just apply tier filter
      } else {
        filteredCustomers = _applySearchFilter(filteredCustomers, event.query);
      }

      emit(currentState.copyWith(
        filteredCustomers: filteredCustomers,
        searchQuery: event.query.isEmpty ? null : event.query,
      ));
    }
  }

  Future<void> _onSelectCustomer(
    SelectCustomer event,
    Emitter<CustomersState> emit,
  ) async {
    if (state is CustomersLoaded) {
      final currentState = state as CustomersLoaded;
      emit(currentState.copyWith(selectedCustomer: event.customer));
    }
  }

  Future<void> _onUpdateCustomerNotes(
    UpdateCustomerNotes event,
    Emitter<CustomersState> emit,
  ) async {
    try {
      final updatedCustomer = await _customerRepository.updateCustomerNotes(
        event.customerId,
        event.notes,
      );

      if (state is CustomersLoaded) {
        final currentState = state as CustomersLoaded;
        final updatedCustomers = currentState.customers.map((customer) {
          return customer.id == event.customerId ? updatedCustomer : customer;
        }).toList();

        final updatedFilteredCustomers = currentState.filteredCustomers.map((customer) {
          return customer.id == event.customerId ? updatedCustomer : customer;
        }).toList();

        emit(currentState.copyWith(
          customers: updatedCustomers,
          filteredCustomers: updatedFilteredCustomers,
          selectedCustomer: currentState.selectedCustomer?.id == event.customerId
              ? updatedCustomer
              : currentState.selectedCustomer,
        ));
      }
    } catch (e) {
      emit(CustomersError('Failed to update customer notes: ${e.toString()}'));
    }
  }

  Future<void> _onClearCustomerFilters(
    ClearCustomerFilters event,
    Emitter<CustomersState> emit,
  ) async {
    if (state is CustomersLoaded) {
      final currentState = state as CustomersLoaded;
      emit(currentState.copyWith(
        filteredCustomers: currentState.customers,
        tierFilter: null,
        searchQuery: null,
      ));
    }
  }

  Future<void> _onSortCustomers(
    SortCustomers event,
    Emitter<CustomersState> emit,
  ) async {
    if (state is CustomersLoaded) {
      final currentState = state as CustomersLoaded;
      List<Customer> sortedCustomers = List.from(currentState.filteredCustomers);
      
      switch (event.column) {
        case 'fullName':
          sortedCustomers.sort((a, b) => event.ascending 
            ? a.fullName.compareTo(b.fullName)
            : b.fullName.compareTo(a.fullName));
          break;
        case 'tier':
          sortedCustomers.sort((a, b) => event.ascending 
            ? a.tier.index.compareTo(b.tier.index)
            : b.tier.index.compareTo(a.tier.index));
          break;
        case 'totalOrders':
          sortedCustomers.sort((a, b) => event.ascending 
            ? a.totalOrders.compareTo(b.totalOrders)
            : b.totalOrders.compareTo(a.totalOrders));
          break;
        case 'totalSpent':
          sortedCustomers.sort((a, b) => event.ascending 
            ? a.totalSpent.compareTo(b.totalSpent)
            : b.totalSpent.compareTo(a.totalSpent));
          break;
        case 'lastOrderDate':
          sortedCustomers.sort((a, b) {
            if (a.lastOrderDate == null && b.lastOrderDate == null) return 0;
            if (a.lastOrderDate == null) return event.ascending ? 1 : -1;
            if (b.lastOrderDate == null) return event.ascending ? -1 : 1;
            return event.ascending 
              ? a.lastOrderDate!.compareTo(b.lastOrderDate!)
              : b.lastOrderDate!.compareTo(a.lastOrderDate!);
          });
          break;
        default:
          break;
      }
      
      emit(currentState.copyWith(filteredCustomers: sortedCustomers));
    }
  }

  Future<void> _onRefreshCustomers(
    RefreshCustomers event,
    Emitter<CustomersState> emit,
  ) async {
    add(LoadCustomers());
  }

  List<Customer> _applySearchFilter(List<Customer> customers, String query) {
    final lowerQuery = query.toLowerCase();
    return customers.where((customer) {
      return customer.firstName.toLowerCase().contains(lowerQuery) ||
          customer.lastName.toLowerCase().contains(lowerQuery) ||
          customer.email.toLowerCase().contains(lowerQuery) ||
          customer.fullName.toLowerCase().contains(lowerQuery);
    }).toList();
  }
}
