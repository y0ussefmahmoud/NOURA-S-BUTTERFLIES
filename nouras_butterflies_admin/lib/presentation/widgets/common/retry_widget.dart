import 'package:flutter/material.dart';

/// Retry widget with countdown timer and progress indicator
class RetryWidget extends StatefulWidget {
  final VoidCallback onRetry;
  final int maxRetries;
  final Duration initialDelay;
  final String? operationName;
  final bool autoRetry;

  const RetryWidget({
    Key? key,
    required this.onRetry,
    this.maxRetries = 3,
    this.initialDelay = const Duration(seconds: 3),
    this.operationName,
    this.autoRetry = true,
  }) : super(key: key);

  @override
  State<RetryWidget> createState() => _RetryWidgetState();
}

class _RetryWidgetState extends State<RetryWidget>
    with TickerProviderStateMixin {
  int _currentAttempt = 0;
  int _countdown = 0;
  Timer? _countdownTimer;
  late AnimationController _progressController;
  late AnimationController _pulseController;
  late Animation<double> _progressAnimation;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _progressController = AnimationController(
      duration: widget.initialDelay,
      vsync: this,
    );
    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );

    _progressAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _progressController,
      curve: Curves.linear,
    ));

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));

    if (widget.autoRetry) {
      _startRetrySequence();
    }

    _pulseController.repeat(reverse: true);
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    _progressController.dispose();
    _pulseController.dispose();
    super.dispose();
  }

  void _startRetrySequence() {
    if (_currentAttempt >= widget.maxRetries) return;

    setState(() {
      _countdown = widget.initialDelay.inSeconds;
    });

    _progressController.forward(from: 0.0);

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _countdown--;
      });

      if (_countdown <= 0) {
        timer.cancel();
        _performRetry();
      }
    });
  }

  void _performRetry() async {
    setState(() {
      _currentAttempt++;
    });

    try {
      await widget.onRetry();
      
      // If retry was successful, reset the state
      if (mounted) {
        setState(() {
          _currentAttempt = 0;
          _countdown = 0;
        });
      }
    } catch (e) {
      // If retry failed and we have more attempts, continue retrying
      if (_currentAttempt < widget.maxRetries && mounted) {
        _startRetrySequence();
      }
    }
  }

  void _manualRetry() {
    _countdownTimer?.cancel();
    _progressController.reset();
    setState(() {
      _currentAttempt = 0;
      _countdown = 0;
    });
    _startRetrySequence();
  }

  @override
  Widget build(BuildContext context) {
    final isMaxRetriesReached = _currentAttempt >= widget.maxRetries;
    final isRetrying = _countdown > 0;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (isMaxRetriesReached) ...[
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: Icon(
                    Icons.error_outline,
                    color: Colors.red.shade600,
                    size: 48,
                  ),
                );
              },
            ),
            const SizedBox(height: 16),
            Text(
              'Maximum retry attempts reached',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.red.shade600,
                fontWeight: FontWeight.w600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Please check your connection and try again manually',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                OutlinedButton.icon(
                  onPressed: _manualRetry,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Reset & Retry'),
                ),
                ElevatedButton.icon(
                  onPressed: () => Navigator.of(context).pop(),
                  icon: const Icon(Icons.close),
                  label: const Text('Close'),
                ),
              ],
            ),
          ] else if (isRetrying) ...[
            Stack(
              alignment: Alignment.center,
              children: [
                SizedBox(
                  width: 60,
                  height: 60,
                  child: AnimatedBuilder(
                    animation: _progressAnimation,
                    builder: (context, child) {
                      return CircularProgressIndicator(
                        value: _progressAnimation.value,
                        strokeWidth: 4,
                        backgroundColor: Colors.grey.shade300,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          Colors.orange.shade600,
                        ),
                      );
                    },
                  ),
                ),
                Text(
                  '$_countdown',
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Colors.orange.shade600,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              'Retrying in $_countdown seconds...',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.orange.shade600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Attempt $_currentAttempt of ${widget.maxRetries}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade600,
              ),
            ),
            if (widget.operationName != null) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Text(
                  widget.operationName!,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey.shade700,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
            const SizedBox(height: 12),
            OutlinedButton.icon(
              onPressed: _manualRetry,
              icon: const Icon(Icons.refresh, size: 16),
              label: const Text('Retry Now'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.orange.shade600,
                side: BorderSide(color: Colors.orange.shade600),
              ),
            ),
          ] else ...[
            AnimatedBuilder(
              animation: _pulseAnimation,
              builder: (context, child) {
                return Transform.scale(
                  scale: _pulseAnimation.value,
                  child: const CircularProgressIndicator(),
                );
              },
            ),
            const SizedBox(height: 16),
            Text(
              'Retrying...',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                color: Colors.blue.shade600,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              'Attempt $_currentAttempt of ${widget.maxRetries}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                color: Colors.grey.shade600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Compact retry widget for inline usage
class CompactRetryWidget extends StatefulWidget {
  final VoidCallback onRetry;
  final int maxRetries;
  final String? operationName;

  const CompactRetryWidget({
    Key? key,
    required this.onRetry,
    this.maxRetries = 3,
    this.operationName,
  }) : super(key: key);

  @override
  State<CompactRetryWidget> createState() => _CompactRetryWidgetState();
}

class _CompactRetryWidgetState extends State<CompactRetryWidget> {
  int _currentAttempt = 0;
  bool _isRetrying = false;

  Future<void> _performRetry() async {
    if (_isRetrying || _currentAttempt >= widget.maxRetries) return;

    setState(() {
      _isRetrying = true;
      _currentAttempt++;
    });

    try {
      await widget.onRetry();
    } catch (e) {
      // Handle retry failure
    } finally {
      if (mounted) {
        setState(() {
          _isRetrying = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isMaxRetriesReached = _currentAttempt >= widget.maxRetries;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isMaxRetriesReached ? Colors.red.shade50 : Colors.orange.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: isMaxRetriesReached ? Colors.red.shade200 : Colors.orange.shade200,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (_isRetrying)
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                valueColor: AlwaysStoppedAnimation<Color>(
                  Colors.orange.shade600,
                ),
              ),
            )
          else
            Icon(
              isMaxRetriesReached ? Icons.error_outline : Icons.refresh,
              size: 16,
              color: isMaxRetriesReached ? Colors.red.shade600 : Colors.orange.shade600,
            ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                isMaxRetriesReached
                    ? 'Max retries reached'
                    : _isRetrying
                        ? 'Retrying...'
                        : 'Retry failed',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                  color: isMaxRetriesReached ? Colors.red.shade800 : Colors.orange.shade800,
                ),
              ),
              if (widget.operationName != null)
                Text(
                  widget.operationName!,
                  style: TextStyle(
                    fontSize: 10,
                    color: Colors.grey.shade600,
                  ),
                ),
            ],
          ),
          if (!isMaxRetriesReached && !_isRetrying) ...[
            const SizedBox(width: 8),
            InkWell(
              onTap: _performRetry,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange.shade600,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'Retry',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
