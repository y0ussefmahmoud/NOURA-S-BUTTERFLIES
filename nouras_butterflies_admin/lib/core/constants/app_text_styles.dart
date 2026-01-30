import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// أنماط النصوص الكاملة للتطبيق
/// مطابق لـ Typography في React theme
class AppTextStyles {
  AppTextStyles._();

  // ========== Font Families ==========
  
  /// خط العناوين - Noto Serif
  static String get displayFont => GoogleFonts.notoSerif().fontFamily!;
  
  /// خط النصوص - Plus Jakarta Sans
  static String get bodyFont => GoogleFonts.plusJakartaSans().fontFamily!;

  // ========== Display Styles (للعناوين الكبيرة) ==========
  
  /// Display Large - 72px
  static TextStyle displayLarge = GoogleFonts.notoSerif(
    fontSize: 72,
    fontWeight: FontWeight.w600,
    height: 1.1,
    color: AppColors.textDark,
  );

  /// Display Medium - 60px
  static TextStyle displayMedium = GoogleFonts.notoSerif(
    fontSize: 60,
    fontWeight: FontWeight.w600,
    height: 1.1,
    color: AppColors.textDark,
  );

  /// Display Small - 48px
  static TextStyle displaySmall = GoogleFonts.notoSerif(
    fontSize: 48,
    fontWeight: FontWeight.w600,
    height: 1.1,
    color: AppColors.textDark,
  );

  // ========== Headline Styles ==========
  
  /// Headline Large - 36px
  static TextStyle headlineLarge = GoogleFonts.notoSerif(
    fontSize: 36,
    fontWeight: FontWeight.w600,
    height: 1.2,
    color: AppColors.textDark,
  );

  /// Headline Medium - 30px
  static TextStyle headlineMedium = GoogleFonts.notoSerif(
    fontSize: 30,
    fontWeight: FontWeight.w600,
    height: 1.2,
    color: AppColors.textDark,
  );

  /// Headline Small - 24px
  static TextStyle headlineSmall = GoogleFonts.notoSerif(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    height: 1.2,
    color: AppColors.textDark,
  );

  // ========== Title Styles ==========
  
  /// Title Large - 20px
  static TextStyle titleLarge = GoogleFonts.plusJakartaSans(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: AppColors.textDark,
  );

  /// Title Medium - 18px
  static TextStyle titleMedium = GoogleFonts.plusJakartaSans(
    fontSize: 18,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: AppColors.textDark,
  );

  /// Title Small - 16px
  static TextStyle titleSmall = GoogleFonts.plusJakartaSans(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    height: 1.5,
    color: AppColors.textDark,
  );

  // ========== Body Styles ==========
  
  /// Body Large - 16px
  static TextStyle bodyLarge = GoogleFonts.plusJakartaSans(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSoft,
  );

  /// Body Medium - 14px
  static TextStyle bodyMedium = GoogleFonts.plusJakartaSans(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSoft,
  );

  /// Body Small - 12px
  static TextStyle bodySmall = GoogleFonts.plusJakartaSans(
    fontSize: 12,
    fontWeight: FontWeight.w400,
    height: 1.5,
    color: AppColors.textSoft,
  );

  // ========== Label Styles ==========
  
  /// Label Large - 14px
  static TextStyle labelLarge = GoogleFonts.plusJakartaSans(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textDark,
  );

  /// Label Medium - 12px
  static TextStyle labelMedium = GoogleFonts.plusJakartaSans(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textDark,
  );

  /// Label Small - 10px
  static TextStyle labelSmall = GoogleFonts.plusJakartaSans(
    fontSize: 10,
    fontWeight: FontWeight.w500,
    height: 1.5,
    color: AppColors.textDark,
  );
}
