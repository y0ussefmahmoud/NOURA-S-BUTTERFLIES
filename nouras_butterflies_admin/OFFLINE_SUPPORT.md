# Offline Support Guide

This document explains the offline functionality implemented in Noura's Butterflies Admin Flutter application.

## Overview

The offline support system allows users to continue working when internet connectivity is lost and automatically syncs data when connection is restored.

## Table of Contents

1. [Architecture](#architecture)
2. [Local Storage](#local-storage)
3. [Cache Management](#cache-management)
4. [Connectivity Monitoring](#connectivity-monitoring)
5. [Offline Queue](#offline-queue)
6. [Sync Mechanisms](#sync-mechanisms)
7. [User Interface](#user-interface)
8. [Usage Examples](#usage-examples)

---

## Architecture

### Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │  Business Logic │    │   Data Layer    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ OfflineBanner   │◄──►│ CacheManager    │◄──►│  HiveService    │
│ NetworkStatus   │    │ SyncManager     │    │  Connectivity  │
│ SyncIndicator   │    │ ErrorHandler    │    │  OfflineQueue   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Online Mode**: Data flows from API → Cache → UI
2. **Offline Mode**: Data flows from Local Storage → UI
3. **Sync Mode**: Data flows from Offline Queue → API → Local Storage

---

## Local Storage

### Hive Integration

**File**: `lib/data/local/hive_service.dart`

Hive is used as the primary local storage solution with the following features:

- ✅ **Type-safe storage** with custom TypeAdapters
- ✅ **Fast performance** with in-memory caching
- ✅ **Cross-platform** support
- ✅ **Encryption** support for sensitive data

### Data Models Stored

| Data Type | Box Name | Purpose |
|-----------|----------|---------|
| Products | `products` | Product catalog and inventory |
| Orders | `orders` | Order history and status |
| Customers | `customers` | Customer information |
| Dashboard | `dashboard` | Analytics and metrics |
| Cache Metadata | `cache_metadata` | Cache timestamps and policies |
| Offline Queue | `offline_queue` | Pending operations |

### Type Adapters

**Directory**: `lib/data/local/adapters/`

Each data model has a dedicated TypeAdapter for efficient serialization:

```dart
// Example: Product Adapter
class AdminProductAdapter extends TypeAdapter<AdminProduct> {
  @override
  final int typeId = 0;
  
  @override
  AdminProduct read(BinaryReader reader) {
    // Efficient binary deserialization
  }
  
  @override
  void write(BinaryWriter writer, AdminProduct obj) {
    // Efficient binary serialization
  }
}
```

---

## Cache Management

### Cache Strategies

**File**: `lib/data/cache/cache_manager.dart`

Four cache strategies are implemented:

#### 1. NetworkFirst
- Always try network first
- Fall back to cache on network failure
- Best for: Real-time data that can be stale

#### 2. CacheFirst
- Try cache first for instant response
- Update in background if cache is stale
- Best for: Frequently accessed data

#### 3. NetworkOnly
- Always fetch from network
- No caching
- Best for: Sensitive or real-time data

#### 4. CacheOnly
- Only use cached data
- No network requests
- Best for: Offline mode or static data

### Cache Policies

```dart
class CachePolicy {
  final Duration ttl;           // Time to live
  final bool forceRefresh;      // Force refresh on next request
  final bool allowStale;        // Use stale data if network fails
  final int maxRetries;         // Maximum retry attempts
}
```

### Cache Invalidation

- ✅ **TTL-based**: Automatic expiration after time limit
- ✅ **Manual**: Explicit cache clearing
- ✅ **Version-based**: Invalidate on data version changes
- ✅ **Event-based**: Invalidate on specific events

---

## Connectivity Monitoring

### Connectivity Service

**File**: `lib/core/network/connectivity_service.dart`

Real-time network monitoring with:

- ✅ **Connection status tracking**: Connected, Disconnected, Connecting
- ✅ **Multiple network types**: WiFi, Mobile, Ethernet, VPN
- ✅ **Debounced updates**: Prevents rapid status changes
- ✅ **Stream-based updates**: Reactive UI updates

### Status Types

```dart
enum ConnectivityStatus {
  connected,      // Internet available
  disconnected,   // No internet
  connecting,     // Connection in progress
}
```

### Usage Example

```dart
final connectivityService = ConnectivityService.instance;

// Listen to connectivity changes
connectivityService.connectivityStream.listen((status) {
  if (status == ConnectivityStatus.connected) {
    // Start sync process
    syncManager.syncPendingOperations();
  }
});

// Check current status
final isConnected = connectivityService.isConnected;
```

---

## Offline Queue

### Operation Queueing

**File**: `lib/data/cache/cache_manager.dart`

Operations are queued when offline and processed when online:

```dart
class OfflineQueue {
  Future<void> queueOperation({
    required String type,        // 'create_product', 'update_order', etc.
    required Map<String, dynamic> data,
    String? entityId,          // Optional entity identifier
    int priority = 0,          // Priority for ordering
  });
}
```

### Operation Types

| Operation Type | Description | Priority |
|---------------|-------------|----------|
| `create_product` | Create new product | High |
| `update_product` | Update existing product | High |
| `delete_product` | Delete product | High |
| `update_order_status` | Update order status | Medium |
| `create_customer` | Create new customer | Medium |
| `update_customer` | Update customer | Low |

### Priority System

Operations are processed in priority order:
1. **High Priority**: Critical business operations
2. **Medium Priority**: Important but not critical
3. **Low Priority**: Nice-to-have operations

---

## Sync Mechanisms

### Sync Manager

**File**: `lib/data/cache/cache_manager.dart`

Handles automatic synchronization:

```dart
class SyncManager {
  Future<SyncResult> syncPendingOperations();
  Future<void> startAutoSync();
  int get pendingOperationsCount;
}
```

### Sync Process

1. **Connection Detection**: Monitor for network restoration
2. **Queue Processing**: Process operations in priority order
3. **API Communication**: Send queued operations to server
4. **Conflict Resolution**: Handle server conflicts
5. **Local Updates**: Update local storage with server response
6. **Cleanup**: Remove completed operations from queue

### Conflict Resolution

- ✅ **Last Write Wins**: Most recent change takes precedence
- ✅ **Manual Resolution**: Prompt user for critical conflicts
- ✅ **Merge Strategy**: Combine changes when possible
- ✅ **Rollback**: Revert changes if sync fails

### Auto-Sync Features

- ✅ **Automatic**: Starts when connection is restored
- ✅ **Background**: Runs in background without UI interruption
- ✅ **Retry Logic**: Exponential backoff for failed operations
- ✅ **Progress Tracking**: Show sync progress to users

---

## User Interface

### Offline Banner

**File**: `lib/presentation/widgets/common/offline_banner.dart`

Displays connection status and sync information:

```dart
OfflineBanner(
  showSyncButton: true,
  onSyncPressed: () => syncManager.syncPendingOperations(),
  autoHide: true,
)
```

#### Features

- ✅ **Animated transitions**: Smooth show/hide animations
- ✅ **Status indicators**: Visual connection status
- ✅ **Sync button**: Manual sync trigger
- ✅ **Progress display**: Shows pending operations count
- ✅ **Auto-hide**: Hides when online and no pending operations

### Network Status Widget

Compact widget for inline status display:

```dart
NetworkStatusWidget(
  showText: true,
  showIcon: true,
  connectedColor: Colors.green,
  disconnectedColor: Colors.red,
)
```

### Offline Indicator

Shows when features are unavailable offline:

```dart
OfflineIndicator(
  feature: 'Product Management',
  isAvailable: false,
  child: ProductManagementScreen(),
)
```

---

## Usage Examples

### Basic Caching

```dart
// Get products with cache-first strategy
final result = await cacheManager.getData(
  'products',
  () => apiService.getProducts(),
  strategy: CacheStrategy.cacheFirst,
  policy: CachePolicy(ttl: Duration(minutes: 30)),
);

if (result.hasData) {
  // Use cached or fresh data
  final products = result.data;
} else if (result.hasError) {
  // Handle error
  print('Error: ${result.error}');
}
```

### Offline Operations

```dart
// Queue operation when offline
await offlineQueue.queueOperation(
  type: 'create_product',
  data: {
    'name': 'New Product',
    'price': 29.99,
    'category': 'Electronics',
  },
  priority: 1,
);

// Check pending operations
final pendingCount = syncManager.pendingOperationsCount;
print('Pending operations: $pendingCount');
```

### Connectivity Monitoring

```dart
class ProductScreen extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return StreamBuilder<ConnectivityStatus>(
      stream: ConnectivityService.instance.connectivityStream,
      builder: (context, snapshot) {
        final isConnected = snapshot.data == ConnectivityStatus.connected;
        
        return Column(
          children: [
            OfflineBanner(),
            if (isConnected)
              ProductTable()
            else
              OfflineProductTable(),
          ],
        );
      },
    );
  }
}
```

### Auto-Save Integration

```dart
class ProductFormScreen extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ProductForm(),
        AutoSaveStatusIndicator(
          isAutoSaving: _isAutoSaving,
          hasUnsavedChanges: _hasChanges,
          lastSaved: _lastSaved,
          onSaveNow: () => _saveDraft(),
        ),
      ],
    );
  }
}
```

---

## Performance Considerations

### Storage Optimization

- ✅ **Efficient Serialization**: Binary format with TypeAdapters
- ✅ **Lazy Loading**: Load data only when needed
- ✅ **Memory Management**: Dispose unused resources
- ✅ **Compression**: Compress large data when possible

### Network Optimization

- ✅ **Request Batching**: Combine multiple operations
- ✅ **Delta Sync**: Only sync changed data
- ✅ **Compression**: Compress network requests
- ✅ **Caching**: Cache API responses

### UI Performance

- ✅ **Skeleton Screens**: Show loading states immediately
- ✅ **Progressive Loading**: Load data in chunks
- ✅ **Virtual Scrolling**: Handle large datasets efficiently
- ✅ **Debounced Updates**: Prevent excessive UI updates

---

## Testing Offline Functionality

### Test Scenarios

1. **Connection Loss**: Test behavior when connection drops
2. **Data Sync**: Verify data syncs correctly when online
3. **Queue Processing**: Test offline queue processing
4. **Cache Expiration**: Verify cache invalidation works
5. **Conflict Resolution**: Test conflict handling

### Test Tools

```bash
# Run offline functionality tests
flutter test test/offline/

# Test with network simulation
flutter test --dart-define=NETWORK_DISABLED=true
```

### Mock Services

```dart
class MockConnectivityService extends ConnectivityService {
  @override
  Stream<ConnectivityStatus> get connectivityStream {
    return Stream.value(ConnectivityStatus.disconnected);
  }
}
```

---

## Troubleshooting

### Common Issues

#### Sync Failures

**Problem**: Operations not syncing when online

**Solution**:
1. Check network connectivity
2. Verify API endpoints are accessible
3. Review offline queue for stuck operations
4. Check authentication tokens

#### Cache Issues

**Problem**: Stale data being displayed

**Solution**:
1. Check cache TTL settings
2. Verify cache invalidation logic
3. Force cache refresh if needed
4. Review cache policies

#### Performance Issues

**Problem**: Slow offline performance

**Solution**:
1. Check database size and optimize
2. Review query performance
3. Implement data pagination
4. Add memory monitoring

### Debug Tools

```dart
// Enable debug logging
CacheManager.instance.setLogLevel(LogLevel.debug);

// Check cache statistics
final stats = CacheManager.instance.getCacheStats();
print('Cache stats: $stats');

// Monitor sync progress
syncManager.syncStream.listen((status) {
  print('Sync status: $status');
});
```

---

## Best Practices

### Development

1. **Always handle offline scenarios** in your UI
2. **Use appropriate cache strategies** for different data types
3. **Test offline functionality** thoroughly
4. **Monitor performance** of local operations
5. **Handle conflicts** gracefully

### Production

1. **Monitor sync success rates**
2. **Track offline usage patterns**
3. **Optimize cache sizes** based on usage
4. **Set appropriate TTL values**
5. **Regular maintenance** of offline queue

---

## Future Enhancements

### Planned Features

1. **Predictive Caching**: ML-based cache warming
2. **Delta Sync**: More efficient sync algorithms
3. **Background Sync**: Native background sync support
4. **Conflict Resolution UI**: Better conflict handling UI
5. **Offline Analytics**: Offline usage analytics

### Performance Improvements

1. **Database Optimization**: Consider SQLite for complex queries
2. **Compression**: Better data compression
3. **Indexing**: Database indexing for faster queries
4. **Memory Management**: Advanced memory optimization
5. **Batch Operations**: Larger batch sizes for efficiency

---

## Conclusion

The offline support system provides a robust foundation for:

- **Seamless offline experience** with automatic sync
- **Data integrity** with conflict resolution
- **Performance optimization** with efficient caching
- **User-friendly interface** with clear status indicators
- **Developer-friendly APIs** for easy integration

The system ensures users can continue working regardless of network conditions while maintaining data consistency and providing excellent user experience.
