import 'package:flutter_bloc/flutter_bloc.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import '../../../../data/models/user.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc() : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
  }
  
  Future<void> _onLoginRequested(
    LoginRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthLoading());
    
    try {
      // محاكاة API call
      await Future.delayed(const Duration(seconds: 1));
      
      // التحقق من البيانات (mock validation)
      if (event.email == 'admin@nourasbutterflies.com' && 
          event.password == 'admin123') {
        final user = User(
          id: 'admin1',
          name: 'Admin User',
          email: event.email,
          membershipTier: 'platinum',
          points: 5000,
          createdAt: DateTime.now().toString(),
          updatedAt: DateTime.now().toString(),
        );
        
        emit(AuthAuthenticated(user));
      } else {
        emit(const AuthError('Invalid email or password'));
      }
    } catch (e) {
      emit(AuthError(e.toString()));
    }
  }
  
  Future<void> _onLogoutRequested(
    LogoutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(AuthUnauthenticated());
  }
  
  Future<void> _onCheckAuthStatus(
    CheckAuthStatus event,
    Emitter<AuthState> emit,
  ) async {
    // سيتم التحقق من SharedPreferences لاحقاً
    emit(AuthUnauthenticated());
  }
}
