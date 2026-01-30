import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';

/// Network connectivity status
enum ConnectivityStatus {
  connected,
  disconnected,
  connecting,
}

/// Connectivity service for monitoring network status
class ConnectivityService {
  static ConnectivityService? _instance;
  static ConnectivityService get instance => _instance ??= ConnectivityService._();
  
  ConnectivityService._();

  final Connectivity _connectivity = Connectivity();
  final StreamController<ConnectivityStatus> _statusController = 
      StreamController<ConnectivityStatus>.broadcast();
  
  ConnectivityStatus _currentStatus = ConnectivityStatus.disconnected;
  Timer? _debounceTimer;

  /// Stream of connectivity status changes
  Stream<ConnectivityStatus> get connectivityStream => _statusController.stream;

  /// Current connectivity status
  ConnectivityStatus get currentStatus => _currentStatus;

  /// Check if device is connected to internet
  bool get isConnected => _currentStatus == ConnectivityStatus.connected;

  /// Initialize connectivity monitoring
  Future<void> initialize() async {
    try {
      // Get initial connectivity status
      final result = await _connectivity.checkConnectivity();
      _updateConnectivityStatus(result);

      // Listen for connectivity changes
      _connectivity.onConnectivityChanged.listen(_onConnectivityChanged);
      
      print('ConnectivityService initialized');
    } catch (e) {
      print('Failed to initialize ConnectivityService: $e');
    }
  }

  /// Handle connectivity changes
  void _onConnectivityChanged(ConnectivityResult result) {
    // Debounce rapid connectivity changes
    _debounceTimer?.cancel();
    _debounceTimer = Timer(const Duration(milliseconds: 500), () {
      _updateConnectivityStatus(result);
    });
  }

  /// Update connectivity status based on ConnectivityResult
  void _updateConnectivityStatus(ConnectivityResult result) {
    final oldStatus = _currentStatus;
    
    switch (result) {
      case ConnectivityResult.none:
        _currentStatus = ConnectivityStatus.disconnected;
        break;
      case ConnectivityResult.wifi:
      case ConnectivityResult.ethernet:
      case ConnectivityResult.mobile:
      case ConnectivityResult.vpn:
      case ConnectivityResult.other:
        _currentStatus = ConnectivityStatus.connected;
        break;
    }

    if (oldStatus != _currentStatus) {
      _statusController.add(_currentStatus);
      print('Connectivity status changed: $oldStatus -> $_currentStatus');
    }
  }

  /// Check current connectivity status
  Future<ConnectivityStatus> checkConnectivity() async {
    try {
      final result = await _connectivity.checkConnectivity();
      _updateConnectivityStatus(result);
      return _currentStatus;
    } catch (e) {
      print('Failed to check connectivity: $e');
      return ConnectivityStatus.disconnected;
    }
  }

  /// Wait for connectivity to be restored
  Future<ConnectivityStatus> waitForConnectivity({
    Duration timeout = const Duration(seconds: 30),
  }) async {
    if (isConnected) {
      return _currentStatus;
    }

    final completer = Completer<ConnectivityStatus>();
    late StreamSubscription subscription;

    subscription = connectivityStream.listen((status) {
      if (status == ConnectivityStatus.connected) {
        subscription.cancel();
        if (!completer.isCompleted) {
          completer.complete(status);
        }
      }
    });

    // Set timeout
    Timer(timeout, () {
      subscription.cancel();
      if (!completer.isCompleted) {
        completer.complete(_currentStatus);
      }
    });

    return completer.future;
  }

  /// Get detailed connectivity information
  Future<Map<String, dynamic>> getConnectivityInfo() async {
    try {
      final results = await _connectivity.checkConnectivity();
      
      return {
        'status': _currentStatus.toString(),
        'results': results.map((r) => r.toString()).toList(),
        'isConnected': isConnected,
        'timestamp': DateTime.now().toIso8601String(),
      };
    } catch (e) {
      return {
        'status': _currentStatus.toString(),
        'error': e.toString(),
        'isConnected': isConnected,
        'timestamp': DateTime.now().toIso8601String(),
      };
    }
  }

  /// Dispose resources
  void dispose() {
    _debounceTimer?.cancel();
    _statusController.close();
  }
}
