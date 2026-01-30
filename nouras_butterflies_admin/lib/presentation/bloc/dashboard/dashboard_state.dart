import 'package:equatable/equatable.dart';
import '../../../../data/models/admin_dashboard_data.dart';

abstract class DashboardState extends Equatable {
  const DashboardState();
  
  @override
  List<Object?> get props => [];
}

class DashboardInitial extends DashboardState {}

class DashboardLoading extends DashboardState {}

class DashboardLoaded extends DashboardState {
  final AdminDashboardData data;
  final String selectedPeriod;
  
  const DashboardLoaded({
    required this.data,
    this.selectedPeriod = '6months',
  });
  
  @override
  List<Object?> get props => [data, selectedPeriod];
}

class DashboardError extends DashboardState {
  final String message;
  
  const DashboardError(this.message);
  
  @override
  List<Object?> get props => [message];
}
