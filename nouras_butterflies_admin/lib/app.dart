import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'core/theme/app_theme.dart';
import 'core/routes/app_routes.dart';
import 'presentation/bloc/auth/auth_bloc.dart';

class NourasButterfliesAdminApp extends StatelessWidget {
  const NourasButterfliesAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(
          create: (context) => AuthBloc()..add(CheckAuthStatus()),
        ),
      ],
      child: MaterialApp(
        title: "Noura's Butterflies Admin",
        debugShowCheckedModeBanner: false,
        
        // Theme
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.light, // سيتم التحكم به لاحقاً عبر Settings
        
        // Routes
        initialRoute: AppRoutes.login,
        onGenerateRoute: RouteGenerator.generateRoute,
      ),
    );
  }
}
