# Flutter Wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.**  { *; }
-keep class io.flutter.util.**  { *; }
-keep class io.flutter.view.**  { *; }
-keep class io.flutter.**  { *; }
-keep class io.flutter.plugins.**  { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**

# Hive
-keep class hive.** { *; }
-keep class * extends hive.HiveObject
-dontwarn hive.**

# Dio
-keep class dio.** { *; }
-dontwarn dio.**

# BLoC
-keep class * extends org.apache.xmlbeans.** { *; }
-dontwarn org.apache.xmlbeans.**

# Charts (fl_chart)
-keep class fl_chart.** { *; }
-dontwarn fl_chart.**

# Image Picker
-keep class com.fluttercandies.photo_manager.** { *; }
-dontwarn com.fluttercandies.photo_manager.**

# Secure Storage
-keep class com.it_nomads.fluttersecurestorage.** { *; }
-dontwarn com.it_nomads.fluttersecurestorage.**

# Performance optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-allowaccessmodification
-mergeinterfacesaggressively

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Keep model classes
-keep class com.example.nouras_butterflies_admin.** { *; }

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep custom views
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(...);
    *** get*();
}
