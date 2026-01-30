import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class StorageService {
  static SharedPreferences? _prefs;
  static const FlutterSecureStorage _secureStorage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainAccessibility.first_unlock_this_device,
    ),
  );
  
  // Storage Keys
  static const String _authTokenKey = 'auth_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userDataKey = 'user_data';
  static const String _isLoggedInKey = 'is_logged_in';
  static const String _tokenExpiryKey = 'token_expiry';

  // Initialize the service
  static Future<void> init() async {
    _prefs ??= await SharedPreferences.getInstance();
    
    // Migrate old data from SharedPreferences to SecureStorage
    await _migrateOldData();
  }

  // Migrate old data from SharedPreferences to SecureStorage
  static Future<void> _migrateOldData() async {
    if (_prefs == null) return;
    
    try {
      // Check if migration is needed (token in old storage but not in new)
      final oldToken = _prefs!.getString(_authTokenKey);
      final newToken = await _secureStorage.read(key: _authTokenKey);
      
      if (oldToken != null && newToken == null) {
        // Migrate token to secure storage
        await _secureStorage.write(key: _authTokenKey, value: oldToken);
        await _prefs!.remove(_authTokenKey);
        
        // Migrate user data
        final oldUserData = _prefs!.getString(_userDataKey);
        if (oldUserData != null) {
          await _secureStorage.write(key: _userDataKey, value: oldUserData);
          await _prefs!.remove(_userDataKey);
        }
        
        // Migrate refresh token if exists
        final oldRefreshToken = _prefs!.getString(_refreshTokenKey);
        if (oldRefreshToken != null) {
          await _secureStorage.write(key: _refreshTokenKey, value: oldRefreshToken);
          await _prefs!.remove(_refreshTokenKey);
        }
        
        print('[StorageService] Successfully migrated data to secure storage');
      }
    } catch (e) {
      print('[StorageService] Migration failed: $e');
    }
  }

  // Token Management
  static Future<void> saveToken(String token, {String? refreshToken, DateTime? expiry}) async {
    await _secureStorage.write(key: _authTokenKey, value: token);
    await _prefs?.setBool(_isLoggedInKey, true);
    
    if (refreshToken != null) {
      await _secureStorage.write(key: _refreshTokenKey, value: refreshToken);
    }
    
    if (expiry != null) {
      await _secureStorage.write(key: _tokenExpiryKey, value: expiry.toIso8601String());
    }
  }

  static Future<String?> getToken() async {
    return await _secureStorage.read(key: _authTokenKey);
  }

  static Future<String?> getRefreshToken() async {
    return await _secureStorage.read(key: _refreshTokenKey);
  }

  static Future<DateTime?> getTokenExpiry() async {
    final expiryString = await _secureStorage.read(key: _tokenExpiryKey);
    if (expiryString != null) {
      return DateTime.parse(expiryString);
    }
    return null;
  }

  static Future<void> deleteToken() async {
    await _secureStorage.delete(key: _authTokenKey);
    await _secureStorage.delete(key: _refreshTokenKey);
    await _secureStorage.delete(key: _tokenExpiryKey);
    await _prefs?.setBool(_isLoggedInKey, false);
  }

  static bool isLoggedIn() {
    return _prefs?.getBool(_isLoggedInKey) ?? false;
  }

  // Check if token is expired or expiring soon
  static Future<bool> isTokenExpired() async {
    final expiry = await getTokenExpiry();
    if (expiry == null) return false;
    
    // Consider token expired if it's within 5 minutes of expiry
    final now = DateTime.now();
    final timeToExpiry = expiry.difference(now);
    
    return timeToExpiry.inMinutes <= 5;
  }

  // User Data Management
  static Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _secureStorage.write(key: _userDataKey, value: jsonEncode(userData));
  }

  static Future<Map<String, dynamic>?> getUserData() async {
    final userDataString = await _secureStorage.read(key: _userDataKey);
    if (userDataString != null) {
      return jsonDecode(userDataString);
    }
    return null;
  }

  static Future<void> deleteUserData() async {
    await _secureStorage.delete(key: _userDataKey);
  }

  // Clear all data (for logout)
  static Future<void> clearAll() async {
    await _secureStorage.deleteAll();
    await _prefs?.clear();
  }

  // Helper method to ensure SharedPreferences is initialized
  static SharedPreferences get prefs {
    if (_prefs == null) {
      throw Exception('StorageService not initialized. Call init() first.');
    }
    return _prefs!;
  }

  // Method to check if biometric authentication is available
  static Future<bool> isBiometricAvailable() async {
    try {
      // This would require additional packages like local_auth
      // For now, return false as biometric setup is optional
      return false;
    } catch (e) {
      return false;
    }
  }

  // Method to secure storage with biometric (optional enhancement)
  static Future<void> secureWithBiometric() async {
    // This would require local_auth package implementation
    // Placeholder for future biometric enhancement
    print('[StorageService] Biometric security not implemented yet');
  }
}
