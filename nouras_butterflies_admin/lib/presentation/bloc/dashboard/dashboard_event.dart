import 'package:equatable/equatable.dart';

abstract class DashboardEvent extends Equatable {
  const DashboardEvent();
  
  @override
  List<Object?> get props => [];
}

class LoadDashboardData extends DashboardEvent {}

class RefreshDashboardData extends DashboardEvent {}

class ChangePeriod extends DashboardEvent {
  final String period;
  
  const ChangePeriod(this.period);
  
  @override
  List<Object?> get props => [period];
}
