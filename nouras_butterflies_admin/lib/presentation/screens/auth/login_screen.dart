import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../bloc/auth/auth_bloc.dart';
import '../../bloc/auth/auth_event.dart';
import '../../bloc/auth/auth_state.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/constants/app_text_styles.dart';
import '../../../core/routes/app_routes.dart';
import '../../widgets/common/app_button.dart';
import '../../widgets/common/app_text_field.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _rememberMe = false;
  
  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) => AuthBloc(),
      child: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            Navigator.pushReplacementNamed(
              context, 
              AppRoutes.adminDashboard,
            );
          } else if (state is AuthError) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(state.message)),
            );
          }
        },
        builder: (context, state) {
          return Scaffold(
            body: Row(
              children: [
                // Left Hero Section (Desktop only)
                if (MediaQuery.of(context).size.width >= 1024)
                  _buildHeroSection(),
                
                // Right Form Section
                Expanded(
                  child: _buildFormSection(context, state),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
  
  Widget _buildHeroSection() {
    return Expanded(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primary.withOpacity(0.2),
              Colors.purple.withOpacity(0.2),
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.flutter_dash,
                size: 96,
                color: AppColors.primary,
              ),
              const SizedBox(height: 32),
              Text(
                "Welcome to Noura's Butterflies",
                style: AppTextStyles.h1.copyWith(fontSize: 36),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              // Stats grid
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 48),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildStatItem('500+', 'Products'),
                    _buildStatItem('10K+', 'Customers'),
                    _buildStatItem('4.8★', 'Rating'),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildStatItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: AppTextStyles.h2.copyWith(
            color: AppColors.primary,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: AppTextStyles.body.copyWith(
            color: AppColors.textSoft,
          ),
        ),
      ],
    );
  }
  
  Widget _buildFormSection(BuildContext context, AuthState state) {
    final isLoading = state is AuthLoading;
    
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 400),
          child: Form(
            key: _formKey,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Logo
                Icon(
                  Icons.flutter_dash, 
                  size: 48, 
                  color: AppColors.primary,
                ),
                const SizedBox(height: 24),
                
                // Title
                Text(
                  'Welcome Back', 
                  style: AppTextStyles.h2,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 8),
                Text(
                  'Sign in to your admin account',
                  style: AppTextStyles.body.copyWith(
                    color: AppColors.textSoft,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                
                // Email Field
                AppTextField(
                  controller: _emailController,
                  label: 'Email Address',
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Email is required';
                    }
                    if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(value!)) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Password Field
                AppTextField(
                  controller: _passwordController,
                  label: 'Password',
                  obscureText: true,
                  validator: (value) {
                    if (value?.isEmpty ?? true) {
                      return 'Password is required';
                    }
                    if (value!.length < 6) {
                      return 'Password must be at least 6 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Remember Me & Forgot Password
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          onChanged: (value) {
                            setState(() => _rememberMe = value ?? false);
                          },
                          activeColor: AppColors.primary,
                        ),
                        Text(
                          'Remember me',
                          style: AppTextStyles.body,
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        // TODO: Implement forgot password
                      },
                      child: Text(
                        'Forgot password?',
                        style: AppTextStyles.body.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Login Button
                AppButton(
                  text: 'Sign In',
                  onPressed: isLoading ? null : _handleLogin,
                  isLoading: isLoading,
                  buttonType: ButtonType.primary,
                ),
                const SizedBox(height: 24),
                
                // Divider
                Row(
                  children: [
                    const Expanded(child: Divider()),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(
                        'Or continue with',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSoft,
                        ),
                      ),
                    ),
                    const Expanded(child: Divider()),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Social Login Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // TODO: Implement Google login
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: BorderSide(color: Colors.grey[300]!),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.g_mobiledata, size: 20),
                            const SizedBox(width: 8),
                            Text('Google', style: AppTextStyles.body),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // TODO: Implement Apple login
                        },
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          side: BorderSide(color: Colors.grey[300]!),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.apple, size: 20),
                            const SizedBox(width: 8),
                            Text('Apple', style: AppTextStyles.body),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                
                const SizedBox(height: 32),
                
                // Demo credentials hint
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppColors.primary.withOpacity(0.3),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Demo Credentials:',
                        style: AppTextStyles.caption.copyWith(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Email: admin@nourasbutterflies.com\nPassword: admin123',
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSoft,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
  
  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      context.read<AuthBloc>().add(
        LoginRequested(
          email: _emailController.text,
          password: _passwordController.text,
          rememberMe: _rememberMe,
        ),
      );
    }
  }
  
  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
