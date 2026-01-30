import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/app_colors.dart';
import '../constants/app_text_styles.dart';
import '../constants/app_dimensions.dart';

/// نظام الـ Theme الكامل للتطبيق
/// يدعم Light Mode و Dark Mode
class AppTheme {
  AppTheme._();

  // ========== Light Theme ==========
  
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      
      // Color Scheme
      colorScheme: ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.gold,
        surface: AppColors.surfaceLight,
        background: AppColors.backgroundLight,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textDark,
        onBackground: AppColors.textDark,
        onError: Colors.white,
      ),
      
      // Scaffold
      scaffoldBackgroundColor: AppColors.backgroundLight,
      
      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surfaceLight,
        foregroundColor: AppColors.textDark,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: AppTextStyles.titleLarge,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
      ),
      
      // Card
      cardTheme: CardTheme(
        color: AppColors.surfaceLight,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          side: BorderSide(color: AppColors.borderLight, width: 1),
        ),
      ),
      
      // Text Theme
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayLarge,
        displayMedium: AppTextStyles.displayMedium,
        displaySmall: AppTextStyles.displaySmall,
        headlineLarge: AppTextStyles.headlineLarge,
        headlineMedium: AppTextStyles.headlineMedium,
        headlineSmall: AppTextStyles.headlineSmall,
        titleLarge: AppTextStyles.titleLarge,
        titleMedium: AppTextStyles.titleMedium,
        titleSmall: AppTextStyles.titleSmall,
        bodyLarge: AppTextStyles.bodyLarge,
        bodyMedium: AppTextStyles.bodyMedium,
        bodySmall: AppTextStyles.bodySmall,
        labelLarge: AppTextStyles.labelLarge,
        labelMedium: AppTextStyles.labelMedium,
        labelSmall: AppTextStyles.labelSmall,
      ),
      
      // Input Decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceLight,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.error),
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: AppDimensions.spacing4,
          vertical: AppDimensions.spacing3,
        ),
      ),
      
      // Elevated Button
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing6,
            vertical: AppDimensions.spacing3,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      // Outlined Button
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: BorderSide(color: AppColors.primary),
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing6,
            vertical: AppDimensions.spacing3,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      // Text Button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing4,
            vertical: AppDimensions.spacing2,
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      // Divider
      dividerTheme: DividerThemeData(
        color: AppColors.borderLight,
        thickness: 1,
        space: AppDimensions.spacing4,
      ),
    );
  }

  // ========== Dark Theme ==========
  
  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      
      // Color Scheme
      colorScheme: ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.gold,
        surface: AppColors.surfaceDark,
        background: AppColors.backgroundDark,
        error: AppColors.error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textLight,
        onBackground: AppColors.textLight,
        onError: Colors.white,
      ),
      
      // Scaffold
      scaffoldBackgroundColor: AppColors.backgroundDark,
      
      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.surfaceDark,
        foregroundColor: AppColors.textLight,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: AppTextStyles.titleLarge.copyWith(
          color: AppColors.textLight,
        ),
        systemOverlayStyle: SystemUiOverlayStyle.light,
      ),
      
      // Card
      cardTheme: CardTheme(
        color: AppColors.surfaceDark,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          side: BorderSide(color: AppColors.borderDark, width: 1),
        ),
      ),
      
      // Text Theme (نفس Light Theme لكن مع ألوان داكنة)
      textTheme: TextTheme(
        displayLarge: AppTextStyles.displayLarge.copyWith(color: AppColors.textLight),
        displayMedium: AppTextStyles.displayMedium.copyWith(color: AppColors.textLight),
        displaySmall: AppTextStyles.displaySmall.copyWith(color: AppColors.textLight),
        headlineLarge: AppTextStyles.headlineLarge.copyWith(color: AppColors.textLight),
        headlineMedium: AppTextStyles.headlineMedium.copyWith(color: AppColors.textLight),
        headlineSmall: AppTextStyles.headlineSmall.copyWith(color: AppColors.textLight),
        titleLarge: AppTextStyles.titleLarge.copyWith(color: AppColors.textLight),
        titleMedium: AppTextStyles.titleMedium.copyWith(color: AppColors.textLight),
        titleSmall: AppTextStyles.titleSmall.copyWith(color: AppColors.textLight),
        bodyLarge: AppTextStyles.bodyLarge.copyWith(color: AppColors.textLight),
        bodyMedium: AppTextStyles.bodyMedium.copyWith(color: AppColors.textLight),
        bodySmall: AppTextStyles.bodySmall.copyWith(color: AppColors.textLight),
        labelLarge: AppTextStyles.labelLarge.copyWith(color: AppColors.textLight),
        labelMedium: AppTextStyles.labelMedium.copyWith(color: AppColors.textLight),
        labelSmall: AppTextStyles.labelSmall.copyWith(color: AppColors.textLight),
      ),
      
      // Input Decoration
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surfaceDark,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderDark),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.borderDark),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          borderSide: BorderSide(color: AppColors.error),
        ),
        contentPadding: EdgeInsets.symmetric(
          horizontal: AppDimensions.spacing4,
          vertical: AppDimensions.spacing3,
        ),
      ),
      
      // Buttons (نفس Light Theme)
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing6,
            vertical: AppDimensions.spacing3,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: BorderSide(color: AppColors.primary),
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing6,
            vertical: AppDimensions.spacing3,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppDimensions.radiusDefault),
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: AppColors.primary,
          padding: EdgeInsets.symmetric(
            horizontal: AppDimensions.spacing4,
            vertical: AppDimensions.spacing2,
          ),
          textStyle: AppTextStyles.labelLarge,
        ),
      ),
      
      // Divider
      dividerTheme: DividerThemeData(
        color: AppColors.borderDark,
        thickness: 1,
        space: AppDimensions.spacing4,
      ),
    );
  }
}
