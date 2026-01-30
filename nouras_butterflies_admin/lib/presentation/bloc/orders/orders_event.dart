import 'package:equatable/equatable.dart';
import '../../../data/models/order.dart';

abstract class OrdersEvent extends Equatable {
  const OrdersEvent();

  @override
  List<Object?> get props => [];
}

class LoadOrders extends OrdersEvent {}

class FilterOrdersByStatus extends OrdersEvent {
  final OrderStatus? status;

  const FilterOrdersByStatus(this.status);

  @override
  List<Object?> get props => [status];
}

class SearchOrders extends OrdersEvent {
  final String query;

  const SearchOrders(this.query);

  @override
  List<Object?> get props => [query];
}

class UpdateOrderStatus extends OrdersEvent {
  final String orderId;
  final OrderStatus status;

  const UpdateOrderStatus(this.orderId, this.status);

  @override
  List<Object?> get props => [orderId, status];
}

class SelectOrder extends OrdersEvent {
  final Order? order;

  const SelectOrder(this.order);

  @override
  List<Object?> get props => [order];
}

class FilterOrdersByDateRange extends OrdersEvent {
  final DateTime? startDate;
  final DateTime? endDate;

  const FilterOrdersByDateRange(this.startDate, this.endDate);

  @override
  List<Object?> get props => [startDate, endDate];
}

class ClearOrderFilters extends OrdersEvent {}

class SortOrders extends OrdersEvent {
  final String column;
  final bool ascending;

  const SortOrders(this.column, this.ascending);

  @override
  List<Object?> get props => [column, ascending];
}

class RefreshOrders extends OrdersEvent {}

class ChangeOrdersPage extends OrdersEvent {
  final int page;
  final int pageSize;

  const ChangeOrdersPage(this.page, this.pageSize);

  @override
  List<Object?> get props => [page, pageSize];
}
