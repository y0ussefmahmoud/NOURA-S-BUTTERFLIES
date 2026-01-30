import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../core/error/error_handler.dart';
import '../../../core/error/error_messages.dart';
import '../../bloc/products/products_bloc.dart';
import '../../bloc/products/products_state.dart';

/// Enhanced error widget with different display modes and recovery actions
class EnhancedErrorWidget extends StatelessWidget {
  final String message;
  final String? technicalMessage;
  final VoidCallback? onRetry;
  final List<ErrorRecoveryAction>? recoveryActions;
  final ErrorDisplayMode displayMode;
  final bool showTechnicalDetails;

  const EnhancedErrorWidget({
    Key? key,
    required this.message,
    this.technicalMessage,
    this.onRetry,
    this.recoveryActions,
    this.displayMode = ErrorDisplayMode.inline,
    this.showTechnicalDetails = false,
  }) : super(key: key);

  factory EnhancedErrorWidget.fromState(
    ProductsState state, {
    ErrorDisplayMode displayMode = ErrorDisplayMode.inline,
    bool showTechnicalDetails = false,
    VoidCallback? onRetry,
  }) {
    if (state is ProductsError) {
      return EnhancedErrorWidget(
        message: state.message,
        technicalMessage: state.technicalMessage,
        onRetry: onRetry,
        displayMode: displayMode,
        showTechnicalDetails: showTechnicalDetails,
      );
    } else if (state is ProductsPartialError) {
      return EnhancedErrorWidget(
        message: state.message,
        technicalMessage: state.technicalMessage,
        onRetry: state.canRetry ? onRetry : null,
        displayMode: displayMode,
        showTechnicalDetails: showTechnicalDetails,
      );
    }

    return const EnhancedErrorWidget(
      message: 'Unknown error occurred',
      displayMode: ErrorDisplayMode.inline,
    );
  }

  @override
  Widget build(BuildContext context) {
    switch (displayMode) {
      case ErrorDisplayMode.inline:
        return _buildInlineError(context);
      case ErrorDisplayMode.modal:
        return _buildModalError(context);
      case ErrorDisplayMode.snackbar:
        return _buildSnackbarError(context);
      case ErrorDisplayMode.fullscreen:
        return _buildFullscreenError(context);
    }
  }

  Widget _buildInlineError(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Icon(
                Icons.error_outline,
                color: Colors.red.shade600,
                size: 20,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  message,
                  style: TextStyle(
                    color: Colors.red.shade800,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
          if (technicalMessage != null && showTechnicalDetails) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red.shade100,
                borderRadius: BorderRadius.circular(4),
              ),
              child: Text(
                technicalMessage!,
                style: TextStyle(
                  color: Colors.red.shade700,
                  fontSize: 12,
                  fontFamily: 'monospace',
                ),
              ),
            ),
          ],
          if (onRetry != null || (recoveryActions?.isNotEmpty ?? false)) ...[
            const SizedBox(height: 12),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (onRetry != null)
                  ErrorActionButton(
                    label: 'Retry',
                    onPressed: onRetry!,
                    isPrimary: true,
                  ),
                if (recoveryActions?.isNotEmpty ?? false) ...[
                  const SizedBox(width: 8),
                  ...recoveryActions!.map(
                    (action) => Padding(
                      padding: const EdgeInsets.only(left: 8),
                      child: ErrorActionButton(
                        label: action.label,
                        onPressed: action.onPressed ?? () {},
                        isPrimary: action.isPrimary,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildModalError(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.error_outline,
              color: Colors.red.shade600,
              size: 48,
            ),
            const SizedBox(height: 16),
            Text(
              'Error',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            if (technicalMessage != null && showTechnicalDetails) ...[
              const SizedBox(height: 16),
              ExpansionTile(
                title: const Text('Technical Details'),
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      technicalMessage!,
                      style: const TextStyle(
                        fontFamily: 'monospace',
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ],
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: const Text('Close'),
                ),
                if (onRetry != null) ...[
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.of(context).pop();
                      onRetry!();
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSnackbarError(BuildContext context) {
    return SnackBar(
      content: Row(
        children: [
          const Icon(Icons.error_outline, color: Colors.white),
          const SizedBox(width: 8),
          Expanded(child: Text(message)),
        ],
      ),
      backgroundColor: Colors.red.shade600,
      action: onRetry != null
          ? SnackBarAction(
              label: 'Retry',
              onPressed: onRetry!,
            )
          : null,
      behavior: SnackBarBehavior.floating,
    );
  }

  Widget _buildFullscreenError(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                color: Colors.red.shade600,
                size: 64,
              ),
              const SizedBox(height: 16),
              Text(
                'Something went wrong',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.bodyLarge,
              ),
              if (technicalMessage != null && showTechnicalDetails) ...[
                const SizedBox(height: 16),
                ExpansionTile(
                  title: const Text('Technical Details'),
                  children: [
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.grey.shade100,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        technicalMessage!,
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 24),
              if (onRetry != null)
                ElevatedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh),
                  label: const Text('Try Again'),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

enum ErrorDisplayMode {
  inline,
  modal,
  snackbar,
  fullscreen,
}

class ErrorActionButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isPrimary;

  const ErrorActionButton({
    Key? key,
    required this.label,
    required this.onPressed,
    this.isPrimary = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (isPrimary) {
      return ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: Colors.red.shade600,
          foregroundColor: Colors.white,
        ),
        child: Text(label),
      );
    }

    return OutlinedButton(
      onPressed: onPressed,
      style: OutlinedButton.styleFrom(
        foregroundColor: Colors.red.shade600,
        side: BorderSide(color: Colors.red.shade600),
      ),
      child: Text(label),
    );
  }
}

/// Retry widget with countdown and progress indicator
class RetryWidget extends StatefulWidget {
  final VoidCallback onRetry;
  final int maxRetries;
  final Duration delay;
  final String? operationName;

  const RetryWidget({
    Key? key,
    required this.onRetry,
    this.maxRetries = 3,
    this.delay = const Duration(seconds: 3),
    this.operationName,
  }) : super(key: key);

  @override
  State<RetryWidget> createState() => _RetryWidgetState();
}

class _RetryWidgetState extends State<RetryWidget> {
  int _currentRetry = 0;
  int _countdown = 0;
  Timer? _countdownTimer;

  @override
  void initState() {
    super.initState();
    _startRetry();
  }

  @override
  void dispose() {
    _countdownTimer?.cancel();
    super.dispose();
  }

  void _startRetry() {
    if (_currentRetry >= widget.maxRetries) return;

    setState(() {
      _countdown = widget.delay.inSeconds;
    });

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

  void _performRetry() {
    setState(() {
      _currentRetry++;
    });

    widget.onRetry();
  }

  @override
  Widget build(BuildContext context) {
    if (_currentRetry >= widget.maxRetries) {
      return Column(
        children: [
          const Text(
            'Maximum retry attempts reached',
            style: TextStyle(color: Colors.red),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _currentRetry = 0;
              });
              _startRetry();
            },
            child: const Text('Reset and Retry'),
          ),
        ],
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (_countdown > 0) ...[
          CircularProgressIndicator(
            value: 1 - (_countdown / widget.delay.inSeconds),
            color: Colors.orange,
          ),
          const SizedBox(height: 8),
          Text(
            'Retrying in $_countdown seconds... ($_currentRetry/${widget.maxRetries})',
            style: const TextStyle(color: Colors.orange),
          ),
        ] else ...[
          const CircularProgressIndicator(),
          const SizedBox(height: 8),
          Text(
            'Retrying... ($_currentRetry/${widget.maxRetries})',
            style: const TextStyle(color: Colors.blue),
          ),
        ],
        if (widget.operationName != null) ...[
          const SizedBox(height: 4),
          Text(
            'Operation: ${widget.operationName}',
            style: const TextStyle(fontSize: 12, color: Colors.grey),
          ),
        ],
      ],
    );
  }
}
