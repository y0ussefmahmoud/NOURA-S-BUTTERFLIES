import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../core/network/connectivity_service.dart';
import '../../core/error/error_messages.dart';
import '../../data/cache/cache_manager.dart';

/// Offline banner widget for displaying connection status
class OfflineBanner extends StatefulWidget {
  final bool showSyncButton;
  final VoidCallback? onSyncPressed;
  final bool autoHide;

  const OfflineBanner({
    Key? key,
    this.showSyncButton = true,
    this.onSyncPressed,
    this.autoHide = true,
  }) : super(key: key);

  @override
  State<OfflineBanner> createState() => _OfflineBannerState();
}

class _OfflineBannerState extends State<OfflineBanner>
    with TickerProviderStateMixin {
  final ConnectivityService _connectivityService = ConnectivityService.instance;
  final SyncManager _syncManager = SyncManager.instance;
  
  bool _isVisible = false;
  bool _isConnected = true;
  int _pendingOperations = 0;
  bool _isSyncing = false;
  
  late AnimationController _slideController;
  late AnimationController _pulseController;
  late Animation<Offset> _slideAnimation;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    
    _slideController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, -1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _slideController,
      curve: Curves.easeInOut,
    ));

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));

    _initializeConnectivity();
  }

  @override
  void dispose() {
    _slideController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _initializeConnectivity() {
    // Get initial connectivity status
    _isConnected = _connectivityService.isConnected;
    _updateVisibility();

    // Listen to connectivity changes
    _connectivityService.connectivityStream.listen((status) {
      setState(() {
        _isConnected = status == ConnectivityStatus.connected;
        _updateVisibility();
      });
    });

    // Listen to sync status
    _syncManager.syncStream.listen((status) {
      setState(() {
        _isSyncing = status == SyncStatus.syncing;
      });
    });

    // Update pending operations count
    _updatePendingOperations();
  }

  void _updateVisibility() {
    final shouldShow = !_isConnected || _pendingOperations > 0;
    
    if (shouldShow && !_isVisible) {
      _isVisible = true;
      _slideController.forward();
      _pulseController.repeat(reverse: true);
    } else if (!shouldShow && _isVisible && widget.autoHide) {
      _isVisible = false;
      _slideController.reverse();
      _pulseController.stop();
    }
  }

  void _updatePendingOperations() {
    setState(() {
      _pendingOperations = _syncManager.pendingOperationsCount;
    });
    _updateVisibility();
  }

  Future<void> _handleSync() async {
    if (widget.onSyncPressed != null) {
      widget.onSyncPressed!();
    } else {
      setState(() {
        _isSyncing = true;
      });

      try {
        final result = await _syncManager.syncPendingOperations();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(result.message),
              backgroundColor: result.success ? Colors.green : Colors.red,
            ),
          );
        }
        
        _updatePendingOperations();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Sync failed: $e'),
              backgroundColor: Colors.red,
            ),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isSyncing = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isVisible && widget.autoHide) {
      return const SizedBox.shrink();
    }

    return SlideTransition(
      position: _slideAnimation,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: _isConnected 
              ? (_pendingOperations > 0 ? Colors.orange.shade50 : Colors.green.shade50)
              : Colors.red.shade50,
          border: Border(
            bottom: BorderSide(
              color: _isConnected 
                  ? (_pendingOperations > 0 ? Colors.orange.shade200 : Colors.green.shade200)
                  : Colors.red.shade200,
              width: 1,
            ),
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Row(
            children: [
              AnimatedBuilder(
                animation: _pulseAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _isSyncing ? _pulseAnimation.value : 1.0,
                    child: Icon(
                      _isConnected 
                          ? (_pendingOperations > 0 ? Icons.sync_problem : Icons.wifi)
                          : Icons.wifi_off,
                      size: 20,
                      color: _isConnected 
                          ? (_pendingOperations > 0 ? Colors.orange.shade600 : Colors.green.shade600)
                          : Colors.red.shade600,
                    ),
                  );
                },
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _isConnected 
                          ? (_pendingOperations > 0 
                              ? 'Pending operations'
                              : 'Connected')
                          : 'No internet connection',
                      style: TextStyle(
                        color: _isConnected 
                            ? (_pendingOperations > 0 ? Colors.orange.shade800 : Colors.green.shade800)
                            : Colors.red.shade800,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    if (_pendingOperations > 0) ...[
                      const SizedBox(height: 2),
                      Text(
                        '$_pendingOperations operation${_pendingOperations > 1 ? 's' : ''} pending sync',
                        style: TextStyle(
                          color: _isConnected ? Colors.orange.shade600 : Colors.red.shade600,
                          fontSize: 12,
                        ),
                      ),
                    ] else if (!_isConnected) ...[
                      const SizedBox(height: 2),
                      Text(
                        'Working in offline mode',
                        style: TextStyle(
                          color: Colors.red.shade600,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (widget.showSyncButton && (_pendingOperations > 0 || !_isConnected)) ...[
                _isSyncing
                    ? SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(
                            _isConnected ? Colors.orange.shade600 : Colors.red.shade600,
                          ),
                        ),
                      )
                    : ElevatedButton.icon(
                        onPressed: _isConnected ? _handleSync : null,
                        icon: const Icon(Icons.sync, size: 16),
                        label: Text(
                          _isConnected ? 'Sync' : 'Offline',
                          style: const TextStyle(fontSize: 12),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isConnected 
                              ? Colors.orange.shade600 
                              : Colors.grey.shade400,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          minimumSize: Size.zero,
                        ),
                      ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Network status widget for inline display
class NetworkStatusWidget extends StatelessWidget {
  final bool showText;
  final bool showIcon;
  final Color? connectedColor;
  final Color? disconnectedColor;

  const NetworkStatusWidget({
    Key? key,
    this.showText = true,
    this.showIcon = true,
    this.connectedColor,
    this.disconnectedColor,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ConnectivityStatus>(
      stream: ConnectivityService.instance.connectivityStream,
      initialData: ConnectivityService.instance.currentStatus,
      builder: (context, snapshot) {
        final isConnected = snapshot.data == ConnectivityStatus.connected;
        
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (showIcon)
              Icon(
                isConnected ? Icons.wifi : Icons.wifi_off,
                size: 16,
                color: isConnected 
                    ? (connectedColor ?? Colors.green)
                    : (disconnectedColor ?? Colors.red),
              ),
            if (showText && showIcon) const SizedBox(width: 4),
            if (showText)
              Text(
                isConnected ? 'Online' : 'Offline',
                style: TextStyle(
                  fontSize: 12,
                  color: isConnected 
                      ? (connectedColor ?? Colors.green)
                      : (disconnectedColor ?? Colors.red),
                  fontWeight: FontWeight.w500,
                ),
              ),
          ],
        );
      },
    );
  }
}

/// Offline indicator for specific features
class OfflineIndicator extends StatelessWidget {
  final String feature;
  final bool isAvailable;
  final Widget child;

  const OfflineIndicator({
    Key? key,
    required this.feature,
    required this.isAvailable,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ConnectivityStatus>(
      stream: ConnectivityService.instance.connectivityStream,
      initialData: ConnectivityService.instance.currentStatus,
      builder: (context, snapshot) {
        final isConnected = snapshot.data == ConnectivityStatus.connected;
        
        if (!isConnected && !isAvailable) {
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.cloud_off,
                  size: 48,
                  color: Colors.grey.shade400,
                ),
                const SizedBox(height: 8),
                Text(
                  '$feature unavailable offline',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Please connect to the internet to use this feature',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey.shade500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          );
        }

        return child;
      },
    );
  }
}
