import 'package:equatable/equatable.dart';
import '../../../data/models/order.dart';

abstract class OrdersState extends Equatable {
  const OrdersState();

  @override
  List<Object?> get props => [];
}

class OrdersInitial extends OrdersState {}

class OrdersLoading extends OrdersState {}

class OrdersLoaded extends OrdersState {
  final List<Order> orders;
  final List<Order> filteredOrders;
  final OrderStatus? statusFilter;
  final String? searchQuery;
  final DateTime? startDateFilter;
  final DateTime? endDateFilter;
  final Order? selectedOrder;
  final int currentPage;
  final int pageSize;
  final int totalItems;

  const OrdersLoaded({
    required this.orders,
    required this.filteredOrders,
    this.statusFilter,
    this.searchQuery,
    this.startDateFilter,
    this.endDateFilter,
    this.selectedOrder,
    this.currentPage = 1,
    this.pageSize = 10,
    this.totalItems = 0,
  });

  @override
  List<Object?> get props => [
        orders,
        filteredOrders,
        statusFilter,
        searchQuery,
        startDateFilter,
        endDateFilter,
        selectedOrder,
        currentPage,
        pageSize,
        totalItems,
      ];

  OrdersLoaded copyWith({
    List<Order>? orders,
    List<Order>? filteredOrders,
    OrderStatus? statusFilter,
    String? searchQuery,
    DateTime? startDateFilter,
    DateTime? endDateFilter,
    Order? selectedOrder,
    int? currentPage,
    int? pageSize,
    int? totalItems,
  }) {
    return OrdersLoaded(
      orders: orders ?? this.orders,
      filteredOrders: filteredOrders ?? this.filteredOrders,
      statusFilter: statusFilter ?? this.statusFilter,
      searchQuery: searchQuery ?? this.searchQuery,
      startDateFilter: startDateFilter ?? this.startDateFilter,
      endDateFilter: endDateFilter ?? this.endDateFilter,
      selectedOrder: selectedOrder ?? this.selectedOrder,
      currentPage: currentPage ?? this.currentPage,
      pageSize: pageSize ?? this.pageSize,
      totalItems: totalItems ?? this.totalItems,
    );
  }
}

class OrdersError extends OrdersState {
  final String message;

  const OrdersError(this.message);

  @override
  List<Object?> get props => [message];
}

class OrderStatusUpdated extends OrdersState {
  final Order updatedOrder;

  const OrderStatusUpdated(this.updatedOrder);

  @override
  List<Object?> get props => [updatedOrder];
}
