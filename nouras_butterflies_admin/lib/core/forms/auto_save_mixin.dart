import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../data/local/hive_service.dart';

/// Auto-save mixin for complex forms
mixin AutoSaveMixin<T extends StatefulWidget> on State<T> {
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final HiveService _hiveService = HiveService.instance;
  
  Timer? _autoSaveTimer;
  String? _draftKey;
  Map<String, dynamic>? _lastSavedData;
  bool _hasUnsavedChanges = false;
  bool _isAutoSaving = false;
  
  /// Auto-save interval (default: 30 seconds)
  Duration get autoSaveInterval => const Duration(seconds: 30);
  
  /// Get current form data to be saved
  Map<String, dynamic> getFormData();
  
  /// Restore form data from draft
  void restoreFormData(Map<String, dynamic> data);
  
  /// Get unique key for this form draft
  String getDraftKey();
  
  /// Validate form data before auto-save
  bool validateForAutoSave(Map<String, dynamic> data) => true;
  
  /// Called when auto-save starts
  void onAutoSaveStart() {}
  
  /// Called when auto-save completes successfully
  void onAutoSaveSuccess() {}
  
  /// Called when auto-save fails
  void onAutoSaveError(String error) {}
  
  /// Called when draft is restored
  void onDraftRestored(Map<String, dynamic> data) {}
  
  /// Check if form has unsaved changes
  bool get hasUnsavedChanges => _hasUnsavedChanges;
  
  /// Check if auto-save is in progress
  bool get isAutoSaving => _isAutoSaving;

  @override
  void initState() {
    super.initState();
    _draftKey = getDraftKey();
    _checkForDraft();
    _startAutoSaveTimer();
  }

  @override
  void dispose() {
    _autoSaveTimer?.cancel();
    super.dispose();
  }

  /// Start auto-save timer
  void _startAutoSaveTimer() {
    _autoSaveTimer?.cancel();
    _autoSaveTimer = Timer.periodic(autoSaveInterval, (_) {
      _performAutoSave();
    });
  }

  /// Check for existing draft on form initialization
  Future<void> _checkForDraft() async {
    try {
      final draftData = await _loadDraft();
      if (draftData != null) {
        _lastSavedData = draftData;
        restoreFormData(draftData);
        onDraftRestored(draftData);
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Draft restored'),
              action: SnackBarAction(
                label: 'Clear',
                onPressed: () => clearDraft(),
              ),
              duration: const Duration(seconds: 3),
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Failed to check for draft: $e');
    }
  }

  /// Load draft from storage
  Future<Map<String, dynamic>?> _loadDraft() async {
    if (_draftKey == null) return null;

    try {
      // Try secure storage first
      final secureData = await _secureStorage.read(key: _draftKey!);
      if (secureData != null) {
        return jsonDecode(secureData);
      }

      // Fallback to Hive
      final metadata = _hiveService.getDraftMetadata(_draftKey!);
      if (metadata != null) {
        // For simplicity, we'll store draft data in cache metadata
        // In a real implementation, you might want a dedicated draft box
        return jsonDecode(metadata['draftData'] ?? '{}');
      }

      return null;
    } catch (e) {
      debugPrint('Failed to load draft: $e');
      return null;
    }
  }

  /// Save draft to storage
  Future<void> _saveDraft(Map<String, dynamic> data) async {
    if (_draftKey == null) return;

    try {
      final jsonData = jsonEncode(data);
      
      // Save to secure storage
      await _secureStorage.write(key: _draftKey!, value: jsonData);
      
      // Also save to Hive as backup
      await _hiveService.updateDraftMetadata(_draftKey!, {
        'lastUpdated': DateTime.now().toIso8601String(),
        'draftData': jsonData,
      });

      _lastSavedData = data;
      _hasUnsavedChanges = false;
    } catch (e) {
      debugPrint('Failed to save draft: $e');
      rethrow;
    }
  }

  /// Perform auto-save
  Future<void> _performAutoSave() async {
    if (_isAutoSaving) return;

    try {
      final currentData = getFormData();
      
      // Check if data has changed
      if (_lastSavedData != null && _mapEquals(currentData, _lastSavedData!)) {
        return; // No changes to save
      }

      // Validate data before saving
      if (!validateForAutoSave(currentData)) {
        return; // Data validation failed
      }

      _isAutoSaving = true;
      onAutoSaveStart();

      await _saveDraft(currentData);
      onAutoSaveSuccess();

      if (mounted) {
        ScaffoldMessenger.of(context).hideCurrentSnackBar();
      }
    } catch (e) {
      onAutoSaveError(e.toString());
      debugPrint('Auto-save failed: $e');
    } finally {
      _isAutoSaving = false;
    }
  }

  /// Manual save trigger
  Future<void> saveDraft() async {
    await _performAutoSave();
  }

  /// Clear draft
  Future<void> clearDraft() async {
    if (_draftKey == null) return;

    try {
      await _secureStorage.delete(key: _draftKey!);
      _lastSavedData = null;
      _hasUnsavedChanges = false;

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Draft cleared')),
        );
      }
    } catch (e) {
      debugPrint('Failed to clear draft: $e');
    }
  }

  /// Mark form as having unsaved changes
  void markAsChanged() {
    _hasUnsavedChanges = true;
  }

  /// Check if draft exists
  Future<bool> hasDraft() async {
    final draftData = await _loadDraft();
    return draftData != null;
  }

  /// Get draft timestamp
  Future<DateTime?> getDraftTimestamp() async {
    if (_draftKey == null) return null;

    try {
      final metadata = _hiveService.getDraftMetadata(_draftKey!);
      if (metadata != null) {
        return DateTime.parse(metadata['lastUpdated']);
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /// Compare two maps for equality
  bool _mapEquals(Map<String, dynamic> map1, Map<String, dynamic> map2) {
    if (map1.length != map2.length) return false;
    
    for (final key in map1.keys) {
      if (!map2.containsKey(key)) return false;
      if (map1[key] != map2[key]) return false;
    }
    
    return true;
  }
}

/// Draft manager for managing multiple form drafts
class DraftManager {
  static final DraftManager _instance = DraftManager._internal();
  factory DraftManager() => _instance;
  DraftManager._internal();

  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final HiveService _hiveService = HiveService.instance;

  /// Get all drafts
  Future<List<DraftInfo>> getAllDrafts() async {
    final drafts = <DraftInfo>[];
    
    try {
      // Get all keys from secure storage that start with 'draft_'
      final allKeys = await _secureStorage.readAll();
      
      for (final entry in allKeys.entries) {
        if (entry.key.startsWith('draft_')) {
          try {
            final data = jsonDecode(entry.value);
            final timestamp = await _getDraftTimestamp(entry.key);
            
            drafts.add(DraftInfo(
              key: entry.key,
              title: data['title'] ?? 'Untitled Draft',
              timestamp: timestamp,
              data: data,
            ));
          } catch (e) {
            debugPrint('Failed to parse draft ${entry.key}: $e');
          }
        }
      }
    } catch (e) {
      debugPrint('Failed to get all drafts: $e');
    }
    
    // Sort by timestamp (newest first)
    drafts.sort((a, b) => b.timestamp?.compareTo(a.timestamp ?? DateTime(0)) ?? 0);
    
    return drafts;
  }

  /// Delete draft
  Future<void> deleteDraft(String key) async {
    try {
      await _secureStorage.delete(key: key);
    } catch (e) {
      debugPrint('Failed to delete draft $key: $e');
    }
  }

  /// Clear all drafts
  Future<void> clearAllDrafts() async {
    try {
      final allKeys = await _secureStorage.readAll();
      
      for (final key in allKeys.keys) {
        if (key.startsWith('draft_')) {
          await _secureStorage.delete(key: key);
        }
      }
    } catch (e) {
      debugPrint('Failed to clear all drafts: $e');
    }
  }

  /// Get draft timestamp
  Future<DateTime?> _getDraftTimestamp(String key) async {
    try {
      final metadata = _hiveService.getDraftMetadata(key);
      if (metadata != null) {
        return DateTime.parse(metadata['lastUpdated']);
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

/// Draft information
class DraftInfo {
  final String key;
  final String title;
  final DateTime? timestamp;
  final Map<String, dynamic> data;

  const DraftInfo({
    required this.key,
    required this.title,
    this.timestamp,
    required this.data,
  });
}

/// Restore draft dialog
class RestoreDraftDialog extends StatelessWidget {
  final DraftInfo draft;
  final VoidCallback onRestore;
  final VoidCallback onDelete;

  const RestoreDraftDialog({
    Key? key,
    required this.draft,
    required this.onRestore,
    required this.onDelete,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Restore Draft?'),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Title: ${draft.title}'),
          const SizedBox(height: 8),
          Text(
            'Created: ${draft.timestamp?.toString() ?? 'Unknown'}',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 16),
          const Text(
            'Restoring this draft will replace any current unsaved changes.',
            style: TextStyle(fontStyle: FontStyle.italic),
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: const Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            onDelete();
            Navigator.of(context).pop();
          },
          child: const Text('Delete'),
          style: TextButton.styleFrom(foregroundColor: Colors.red),
        ),
        ElevatedButton(
          onPressed: () {
            onRestore();
            Navigator.of(context).pop();
          },
          child: const Text('Restore'),
        ),
      ],
    );
  }
}

/// Auto-save status indicator
class AutoSaveStatusIndicator extends StatelessWidget {
  final bool isAutoSaving;
  final bool hasUnsavedChanges;
  final DateTime? lastSaved;
  final VoidCallback? onSaveNow;

  const AutoSaveStatusIndicator({
    Key? key,
    required this.isAutoSaving,
    required this.hasUnsavedChanges,
    this.lastSaved,
    this.onSaveNow,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isAutoSaving 
            ? Colors.orange.shade50
            : hasUnsavedChanges 
                ? Colors.yellow.shade50
                : Colors.green.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isAutoSaving 
              ? Colors.orange.shade200
              : hasUnsavedChanges 
                  ? Colors.yellow.shade200
                  : Colors.green.shade200,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isAutoSaving) ...[
            SizedBox(
              width: 12,
              height: 12,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.orange.shade600),
              ),
            ),
            const SizedBox(width: 8),
            Text(
              'Saving...',
              style: TextStyle(
                color: Colors.orange.shade800,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ] else if (hasUnsavedChanges) ...[
            Icon(
              Icons.edit,
              size: 12,
              color: Colors.yellow.shade600,
            ),
            const SizedBox(width: 8),
            Text(
              'Unsaved changes',
              style: TextStyle(
                color: Colors.yellow.shade800,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
            if (onSaveNow != null) ...[
              const SizedBox(width: 8),
              InkWell(
                onTap: onSaveNow,
                child: Text(
                  'Save now',
                  style: TextStyle(
                    color: Colors.blue.shade600,
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    decoration: TextDecoration.underline,
                  ),
                ),
              ),
            ],
          ] else ...[
            Icon(
              Icons.check_circle,
              size: 12,
              color: Colors.green.shade600,
            ),
            const SizedBox(width: 8),
            Text(
              'All changes saved',
              style: TextStyle(
                color: Colors.green.shade800,
                fontSize: 12,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
