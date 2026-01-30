import 'package:flutter_bloc/flutter_bloc.dart';
import 'dashboard_event.dart';
import 'dashboard_state.dart';
import '../../../../data/mock/mock_admin_stats.dart';

class DashboardBloc extends Bloc<DashboardEvent, DashboardState> {
  DashboardBloc() : super(DashboardInitial()) {
    on<LoadDashboardData>(_onLoadDashboardData);
    on<RefreshDashboardData>(_onRefreshDashboardData);
    on<ChangePeriod>(_onChangePeriod);
  }
  
  Future<void> _onLoadDashboardData(
    LoadDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    emit(DashboardLoading());
    
    try {
      // محاكاة API call
      await Future.delayed(const Duration(seconds: 1));
      
      // جلب البيانات من Mock
      final data = MockAdminStats.dashboardData;
      
      emit(DashboardLoaded(data: data));
    } catch (e) {
      emit(DashboardError(e.toString()));
    }
  }
  
  Future<void> _onRefreshDashboardData(
    RefreshDashboardData event,
    Emitter<DashboardState> emit,
  ) async {
    // نفس المنطق
    add(LoadDashboardData());
  }
  
  Future<void> _onChangePeriod(
    ChangePeriod event,
    Emitter<DashboardState> emit,
  ) async {
    if (state is DashboardLoaded) {
      final currentState = state as DashboardLoaded;
      emit(DashboardLoaded(
        data: currentState.data,
        selectedPeriod: event.period,
      ));
    }
  }
}
