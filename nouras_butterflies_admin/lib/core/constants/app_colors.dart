import 'package:flutter/material.dart';

/// نظام الألوان الكامل لتطبيق Noura's Butterflies Admin
/// مطابق لـ file:nouras-butterflies-react/src/styles/theme.ts
class AppColors {
  AppColors._(); // Private constructor to prevent instantiation

  // ========== Brand Colors ==========
  
  /// اللون الأساسي - وردي ناعم (#ffb8c4)
  static const Color primary = Color(0xFFFFB8C4);
  
  /// اللون الذهبي (#D4AF37)
  static const Color gold = Color(0xFFD4AF37);

  // ========== Background Colors ==========
  
  /// خلفية فاتحة - كريمي (#faebe0)
  static const Color backgroundLight = Color(0xFFFAEBE0);
  
  /// خلفية داكنة (#211b18)
  static const Color backgroundDark = Color(0xFF211B18);

  // ========== Accent Colors ==========
  
  /// وردي فاتح للتمييز (#f4e6e8)
  static const Color accentPink = Color(0xFFF4E6E8);

  // ========== Text Colors ==========
  
  /// نص بني ناعم (#5D4037)
  static const Color textSoft = Color(0xFF5D4037);
  
  /// نص داكن (#1d0c0f)
  static const Color textDark = Color(0xFF1D0C0F);
  
  /// نص فاتح للوضع الداكن (#faebe0)
  static const Color textLight = Color(0xFFFAEBE0);
  
  /// نص أساسي للوضع الفاتح (#1d0c0f)
  static const Color textPrimary = textDark;
  
  /// نص أساسي للوضع الداكن (#faebe0)
  static const Color textPrimaryDark = textLight;

  // ========== Border Colors ==========
  
  /// حدود فاتحة (#eacdd2)
  static const Color borderLight = Color(0xFFEACDD2);
  
  /// حدود داكنة (#3d322c)
  static const Color borderDark = Color(0xFF3D322C);

  // ========== Surface Colors ==========
  
  /// سطح أبيض (#ffffff)
  static const Color surfaceLight = Color(0xFFFFFFFF);
  
  /// سطح داكن (#2d2521)
  static const Color surfaceDark = Color(0xFF2D2521);

  // ========== Admin Specific Colors ==========
  
  /// اللون الأساسي للإدارة (#2D2521)
  static const Color adminPrimary = Color(0xFF2D2521);
  
  /// خلفية Sidebar الإدارة (#1A1512)
  static const Color adminSidebar = Color(0xFF1A1512);
  
  /// ذهبي الإدارة (#D4AF37)
  static const Color adminGold = Color(0xFFD4AF37);
  
  /// أخضر حكيم للإدارة (#8B9D83)
  static const Color adminSage = Color(0xFF8B9D83);
  
  /// مرجاني للإدارة (#E8998D)
  static const Color adminCoral = Color(0xFFE8998D);

  // ========== Semantic Colors ==========
  
  /// نجاح - أخضر
  static const Color success = Color(0xFF10B981);
  
  /// خطأ - أحمر
  static const Color error = Color(0xFFEF4444);
  
  /// تحذير - برتقالي
  static const Color warning = Color(0xFFF59E0B);
  
  /// معلومات - أزرق
  static const Color info = Color(0xFF3B82F6);

  // ========== Gray Scale ==========
  
  static const Color gray50 = Color(0xFFFAFAFA);
  static const Color gray100 = Color(0xFFF5F5F5);
  static const Color gray200 = Color(0xFFEEEEEE);
  static const Color gray300 = Color(0xFFE0E0E0);
  static const Color gray400 = Color(0xFFBDBDBD);
  static const Color gray500 = Color(0xFF9E9E9E);
  static const Color gray600 = Color(0xFF757575);
  static const Color gray700 = Color(0xFF616161);
  static const Color gray800 = Color(0xFF424242);
  static const Color gray900 = Color(0xFF212121);

  // ========== Shadow Colors ==========
  
  /// لون الظل العام
  static const Color shadowColor = Color(0x1A000000);
}
