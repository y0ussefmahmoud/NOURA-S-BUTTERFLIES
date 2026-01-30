import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../data/models/order.dart';
import '../../../data/repositories/order_repository.dart';
import 'orders_event.dart';
import 'orders_state.dart';

class OrdersBloc extends Bloc<OrdersEvent, OrdersState> {
  final OrderRepository _orderRepository;

  OrdersBloc({required OrderRepository orderRepository})
      : _orderRepository = orderRepository,
        super(OrdersInitial()) {
    on<LoadOrders>(_onLoadOrders);
    on<FilterOrdersByStatus>(_onFilterOrdersByStatus);
    on<SearchOrders>(_onSearchOrders);
    on<UpdateOrderStatus>(_onUpdateOrderStatus);
    on<SelectOrder>(_onSelectOrder);
    on<FilterOrdersByDateRange>(_onFilterOrdersByDateRange);
    on<ClearOrderFilters>(_onClearOrderFilters);
    on<SortOrders>(_onSortOrders);
    on<ChangeOrdersPage>(_onChangeOrdersPage);
    on<RefreshOrders>(_onRefreshOrders);
  }

  Future<void> _onLoadOrders(
    LoadOrders event,
    Emitter<OrdersState> emit,
  ) async {
    emit(OrdersLoading());
    try {
      final orders = await _orderRepository.getOrders();
      emit(OrdersLoaded(
        orders: orders,
        filteredOrders: orders,
      ));
    } catch (e) {
      emit(OrdersError('Failed to load orders: ${e.toString()}'));
    }
  }

  Future<void> _onFilterOrdersByStatus(
    FilterOrdersByStatus event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      List<Order> filteredOrders = currentState.orders;

      if (event.status != null) {
        filteredOrders = filteredOrders
            .where((order) => order.status == event.status)
            .toList();
      }

      // Apply existing search filter if any
      if (currentState.searchQuery != null && currentState.searchQuery!.isNotEmpty) {
        filteredOrders = _applySearchFilter(filteredOrders, currentState.searchQuery!);
      }

      // Apply existing date filter if any
      if (currentState.startDateFilter != null || currentState.endDateFilter != null) {
        filteredOrders = _applyDateFilter(
          filteredOrders,
          currentState.startDateFilter,
          currentState.endDateFilter,
        );
      }

      emit(currentState.copyWith(
        filteredOrders: filteredOrders,
        statusFilter: event.status,
      ));
    }
  }

  Future<void> _onSearchOrders(
    SearchOrders event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      List<Order> filteredOrders = currentState.orders;

      // Apply status filter if any
      if (currentState.statusFilter != null) {
        filteredOrders = filteredOrders
            .where((order) => order.status == currentState.statusFilter)
            .toList();
      }

      // Apply search filter
      if (event.query.isEmpty) {
        // If search is empty, just apply other filters
        if (currentState.startDateFilter != null || currentState.endDateFilter != null) {
          filteredOrders = _applyDateFilter(
            filteredOrders,
            currentState.startDateFilter,
            currentState.endDateFilter,
          );
        }
      } else {
        filteredOrders = _applySearchFilter(filteredOrders, event.query);

        // Apply date filter if any
        if (currentState.startDateFilter != null || currentState.endDateFilter != null) {
          filteredOrders = _applyDateFilter(
            filteredOrders,
            currentState.startDateFilter,
            currentState.endDateFilter,
          );
        }
      }

      emit(currentState.copyWith(
        filteredOrders: filteredOrders,
        searchQuery: event.query.isEmpty ? null : event.query,
      ));
    }
  }

  Future<void> _onUpdateOrderStatus(
    UpdateOrderStatus event,
    Emitter<OrdersState> emit,
  ) async {
    try {
      final updatedOrder = await _orderRepository.updateOrderStatus(
        event.orderId,
        event.status,
      );

      if (state is OrdersLoaded) {
        final currentState = state as OrdersLoaded;
        final updatedOrders = currentState.orders.map((order) {
          return order.id == event.orderId ? updatedOrder : order;
        }).toList();

        final updatedFilteredOrders = currentState.filteredOrders.map((order) {
          return order.id == event.orderId ? updatedOrder : order;
        }).toList();

        emit(currentState.copyWith(
          orders: updatedOrders,
          filteredOrders: updatedFilteredOrders,
          selectedOrder: currentState.selectedOrder?.id == event.orderId
              ? updatedOrder
              : currentState.selectedOrder,
        ));
      }
    } catch (e) {
      emit(OrdersError(e.toString()));
    }
  }

  Future<void> _onSelectOrder(
    SelectOrder event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      emit(currentState.copyWith(selectedOrder: event.order));
    }
  }

  Future<void> _onFilterOrdersByDateRange(
    FilterOrdersByDateRange event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      List<Order> filteredOrders = currentState.orders;

      // Apply status filter if any
      if (currentState.statusFilter != null) {
        filteredOrders = filteredOrders
            .where((order) => order.status == currentState.statusFilter)
            .toList();
      }

      // Apply search filter if any
      if (currentState.searchQuery != null && currentState.searchQuery!.isNotEmpty) {
        filteredOrders = _applySearchFilter(filteredOrders, currentState.searchQuery!);
      }

      // Apply date filter
      if (event.startDate != null || event.endDate != null) {
        filteredOrders = _applyDateFilter(filteredOrders, event.startDate, event.endDate);
      }

      emit(currentState.copyWith(
        filteredOrders: filteredOrders,
        startDateFilter: event.startDate,
        endDateFilter: event.endDate,
      ));
    }
  }

  Future<void> _onClearOrderFilters(
    ClearOrderFilters event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      emit(currentState.copyWith(
        filteredOrders: currentState.orders,
        statusFilter: null,
        searchQuery: null,
        startDateFilter: null,
        endDateFilter: null,
      ));
    }
  }

  Future<void> _onSortOrders(
    SortOrders event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      List<Order> sortedOrders = List.from(currentState.filteredOrders);
      
      switch (event.column) {
        case 'id':
          sortedOrders.sort((a, b) => event.ascending 
            ? a.id.compareTo(b.id)
            : b.id.compareTo(a.id));
          break;
        case 'customerName':
          sortedOrders.sort((a, b) => event.ascending 
            ? a.customerName.compareTo(b.customerName)
            : b.customerName.compareTo(a.customerName));
          break;
        case 'total':
          sortedOrders.sort((a, b) => event.ascending 
            ? a.total.compareTo(b.total)
            : b.total.compareTo(a.total));
          break;
        case 'status':
          sortedOrders.sort((a, b) => event.ascending 
            ? a.status.index.compareTo(b.status.index)
            : b.status.index.compareTo(a.status.index));
          break;
        case 'createdAt':
          sortedOrders.sort((a, b) => event.ascending 
            ? a.createdAt.compareTo(b.createdAt)
            : b.createdAt.compareTo(a.createdAt));
          break;
        default:
          break;
      }
      
      emit(currentState.copyWith(filteredOrders: sortedOrders));
    }
  }

  Future<void> _onChangeOrdersPage(
    ChangeOrdersPage event,
    Emitter<OrdersState> emit,
  ) async {
    if (state is OrdersLoaded) {
      final currentState = state as OrdersLoaded;
      emit(currentState.copyWith(
        currentPage: event.page,
        pageSize: event.pageSize,
      ));
    }
  }

  Future<void> _onRefreshOrders(
    RefreshOrders event,
    Emitter<OrdersState> emit,
  ) async {
    add(LoadOrders());
  }

  List<Order> _applySearchFilter(List<Order> orders, String query) {
    final lowerQuery = query.toLowerCase();
    return orders.where((order) {
      return order.id.toLowerCase().contains(lowerQuery) ||
          order.customerName.toLowerCase().contains(lowerQuery) ||
          order.customerEmail.toLowerCase().contains(lowerQuery);
    }).toList();
  }

  List<Order> _applyDateFilter(
    List<Order> orders,
    DateTime? startDate,
    DateTime? endDate,
  ) {
    return orders.where((order) {
      if (startDate != null && order.createdAt.isBefore(startDate)) {
        return false;
      }
      if (endDate != null && order.createdAt.isAfter(endDate.add(const Duration(days: 1)))) {
        return false;
      }
      return true;
    }).toList();
  }
}
