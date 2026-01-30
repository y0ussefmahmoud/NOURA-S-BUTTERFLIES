import 'dart:collection';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';

/// Chart data cache for memoization and performance optimization
class ChartDataCache {
  static final ChartDataCache _instance = ChartDataCache._internal();
  factory ChartDataCache() => _instance;
  ChartDataCache._internal();

  final LRUCache<String, Widget> _cache = LRUCache<String, Widget>(50);
  final Map<String, DateTime> _timestamps = {};
  final Duration _defaultTtl = const Duration(minutes: 5);

  /// Get cached widget
  Widget? get(String key) {
    final timestamp = _timestamps[key];
    if (timestamp != null) {
      final age = DateTime.now().difference(timestamp);
      if (age > _defaultTtl) {
        _cache.remove(key);
        _timestamps.remove(key);
        return null;
      }
    }
    return _cache[key];
  }

  /// Put widget in cache
  void put(String key, Widget widget) {
    _cache[key] = widget;
    _timestamps[key] = DateTime.now();
  }

  /// Clear cache
  void clear() {
    _cache.clear();
    _timestamps.clear();
  }

  /// Remove specific key from cache
  void remove(String key) {
    _cache.remove(key);
    _timestamps.remove(key);
  }

  /// Get cache statistics
  Map<String, dynamic> getStats() {
    return {
      'size': _cache.length,
      'capacity': _cache.capacity,
      'keys': _cache.keys.toList(),
    };
  }
}

/// LRU Cache implementation for chart widgets
class LRUCache<K, V> {
  final int capacity;
  final LinkedHashMap<K, V> _cache = LinkedHashMap();

  LRUCache(this.capacity);

  V? get(K key) {
    if (_cache.containsKey(key)) {
      // Move to end (most recently used)
      final value = _cache.remove(key);
      _cache[key] = value!;
      return value;
    }
    return null;
  }

  void put(K key, V value) {
    if (_cache.containsKey(key)) {
      _cache.remove(key);
    } else if (_cache.length >= capacity) {
      // Remove least recently used (first item)
      final firstKey = _cache.keys.first;
      _cache.remove(firstKey);
    }
    _cache[key] = value;
  }

  V? remove(K key) {
    return _cache.remove(key);
  }

  void clear() {
    _cache.clear();
  }

  int get length => _cache.length;
  List<K> get keys => _cache.keys.toList();
}

/// Chart performance monitoring
class ChartPerformanceMonitor {
  static final ChartPerformanceMonitor _instance = ChartPerformanceMonitor._internal();
  factory ChartPerformanceMonitor() => _instance;
  ChartPerformanceMonitor._internal();

  final Map<String, List<Duration>> _renderTimes = {};
  final Map<String, DateTime> _lastRender = {};

  /// Record chart render time
  void recordRenderTime(String chartType, Duration renderTime) {
    _renderTimes.putIfAbsent(chartType, () => []).add(renderTime);
    _lastRender[chartType] = DateTime.now();

    // Keep only last 100 measurements per chart type
    if (_renderTimes[chartType]!.length > 100) {
      _renderTimes[chartType]!.removeAt(0);
    }
  }

  /// Get average render time for chart type
  Duration? getAverageRenderTime(String chartType) {
    final times = _renderTimes[chartType];
    if (times == null || times.isEmpty) return null;

    final totalMs = times.fold<int>(0, (sum, time) => sum + time.inMilliseconds);
    return Duration(milliseconds: totalMs ~/ times.length);
  }

  /// Get performance statistics
  Map<String, dynamic> getStats() {
    final stats = <String, dynamic>{};
    
    for (final chartType in _renderTimes.keys) {
      final times = _renderTimes[chartType]!;
      final avgMs = times.fold<int>(0, (sum, time) => sum + time.inMilliseconds) ~/ times.length;
      final maxMs = times.map((t) => t.inMilliseconds).reduce((a, b) => a > b ? a : b);
      final minMs = times.map((t) => t.inMilliseconds).reduce((a, b) => a < b ? a : b);
      
      stats[chartType] = {
        'averageRenderTime': avgMs,
        'maxRenderTime': maxMs,
        'minRenderTime': minMs,
        'sampleCount': times.length,
        'lastRender': _lastRender[chartType]?.toIso8601String(),
      };
    }
    
    return stats;
  }

  /// Clear performance data
  void clear() {
    _renderTimes.clear();
    _lastRender.clear();
  }
}

/// Hook for monitoring chart performance
T useChartPerformance<T>(
  String chartType,
  T Function() builder, {
  bool enableMonitoring = true,
}) {
  if (!enableMonitoring) {
    return builder();
  }

  final monitor = ChartPerformanceMonitor();
  final stopwatch = Stopwatch()..start();

  final result = builder();

  stopwatch.stop();
  monitor.recordRenderTime(chartType, stopwatch.elapsed);

  return result;
}

/// Progressive chart rendering for large datasets
class ProgressiveChartRenderer {
  static Future<List<ChartDataPoint>> renderProgressively(
    List<ChartDataPoint> data, {
    int batchSize = 50,
    Duration delay = const Duration(milliseconds: 16),
  }) async {
    if (data.length <= batchSize) return data;

    final result = <ChartDataPoint>[];
    
    for (int i = 0; i < data.length; i += batchSize) {
      final end = (i + batchSize).clamp(0, data.length);
      result.addAll(data.sublist(i, end));
      
      // Allow UI to breathe between batches
      if (i + batchSize < data.length) {
        await Future.delayed(delay);
      }
    }
    
    return result;
  }
}

/// Chart data sampler for performance optimization
class ChartDataSampler {
  /// Sample data using uniform sampling
  static List<ChartDataPoint> uniformSample(
    List<ChartDataPoint> data,
    int targetSize,
  ) {
    if (data.length <= targetSize) return data;

    final step = (data.length / targetSize).ceil();
    final sampled = <ChartDataPoint>[];
    
    for (int i = 0; i < data.length; i += step) {
      sampled.add(data[i]);
    }
    
    // Always include the last point
    if (sampled.last != data.last) {
      sampled.add(data.last);
    }
    
    return sampled;
  }

  /// Sample data using largest triangle three buckets (LTTB) algorithm
  static List<ChartDataPoint> lttbSample(
    List<ChartDataPoint> data,
    int targetSize,
  ) {
    if (data.length <= targetSize) return data;

    final sampled = <ChartDataPoint>[];
    final bucketSize = (data.length - 2) / (targetSize - 2);
    
    // Always include first and last points
    sampled.add(data.first);
    
    int a = 0;
    for (int i = 0; i < targetSize - 2; i++) {
      // Calculate bucket range
      final avgRangeStart = (i * bucketSize) + 1;
      final avgRangeEnd = (i + 1) * bucketSize;
      final avgRangeEndFloor = avgRangeEnd.floor();
      
      if (avgRangeEndFloor >= data.length - 1) break;
      
      // Calculate next bucket
      int nextBucketStart = avgRangeEndFloor + 1;
      int nextBucketEnd = ((i + 2) * bucketSize).floor();
      nextBucketEnd = nextBucketEnd.clamp(0, data.length - 1);
      
      // Find average of next bucket
      double avgX = 0;
      double avgY = 0;
      for (int j = nextBucketStart; j <= nextBucketEnd; j++) {
        avgX += j.toDouble();
        avgY += data[j].value;
      }
      avgX /= (nextBucketEnd - nextBucketStart + 1);
      avgY /= (nextBucketEnd - nextBucketStart + 1);
      
      // Find point with maximum area
      double maxArea = -1;
      int maxAreaIndex = a;
      
      for (int j = avgRangeStart.floor(); j < avgRangeEndFloor; j++) {
        final area = _triangleArea(
          a.toDouble(),
          data[a].value,
          avgX,
          avgY,
          j.toDouble(),
          data[j].value,
        );
        
        if (area > maxArea) {
          maxArea = area;
          maxAreaIndex = j;
        }
      }
      
      sampled.add(data[maxAreaIndex]);
      a = maxAreaIndex;
    }
    
    sampled.add(data.last);
    return sampled;
  }

  /// Calculate triangle area
  static double _triangleArea(
    double x1, double y1,
    double x2, double y2,
    double x3, double y3,
  ) {
    return ((x1 - x2) * (y3 - y2) - (x3 - x2) * (y1 - y2)).abs() / 2;
  }
}

/// Chart data point model
class ChartDataPoint {
  final String label;
  final double value;
  final DateTime? timestamp;
  final Map<String, dynamic>? metadata;

  const ChartDataPoint({
    required this.label,
    required this.value,
    this.timestamp,
    this.metadata,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ChartDataPoint &&
          runtimeType == other.runtimeType &&
          label == other.label &&
          value == other.value;

  @override
  int get hashCode => label.hashCode ^ value.hashCode;

  @override
  String toString() => 'ChartDataPoint(label: $label, value: $value)';
}
