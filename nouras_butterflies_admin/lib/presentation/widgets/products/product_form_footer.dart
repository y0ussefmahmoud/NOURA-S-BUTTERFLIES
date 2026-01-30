import 'package:flutter/material.dart';
import '../../../../data/models/product_form_data.dart';

class ProductFormFooter extends StatelessWidget {
  final ProductFormData formData;
  final bool isLoading;
  final VoidCallback onSave;
  final VoidCallback onSaveDraft;
  final VoidCallback onCancel;

  const ProductFormFooter({
    Key? key,
    required this.formData,
    required this.isLoading,
    required this.onSave,
    required this.onSaveDraft,
    required this.onCancel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Validation Summary
          if (_hasValidationErrors())
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.only(bottom: 16),
              decoration: BoxDecoration(
                color: Colors.red[50],
                border: Border.all(color: Colors.red[200]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.warning, color: Colors.red[600], size: 20),
                      const SizedBox(width: 8),
                      Text(
                        'Validation Issues',
                        style: TextStyle(
                          color: Colors.red[600],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getValidationSummary(),
                    style: TextStyle(color: Colors.red[600]),
                  ),
                ],
              ),
            ),
          
          // Action Buttons
          Row(
            children: [
              // Cancel Button
              OutlinedButton(
                onPressed: isLoading ? null : onCancel,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
                child: const Text('Cancel'),
              ),
              const SizedBox(width: 12),
              
              // Save Draft Button
              OutlinedButton.icon(
                onPressed: isLoading ? null : onSaveDraft,
                icon: const Icon(Icons.drafts),
                label: const Text('Save Draft'),
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                ),
              ),
              const Spacer(),
              
              // Save Button
              ElevatedButton.icon(
                onPressed: (isLoading || _hasValidationErrors()) ? null : onSave,
                icon: isLoading
                    ? const SizedBox(
                        width: 16,
                        height: 16,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.save),
                label: Text(isLoading ? 'Saving...' : 'Save Product'),
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  backgroundColor: Theme.of(context).primaryColor,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
          
          // Form Status
          const SizedBox(height: 12),
          Row(
            children: [
              Icon(
                Icons.info_outline,
                size: 16,
                color: Colors.grey[600],
              ),
              const SizedBox(width: 4),
              Text(
                _getFormStatus(),
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
              const Spacer(),
              if (formData.id != null)
                Text(
                  'ID: ${formData.id}',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
            ],
          ),
        ],
      ),
    );
  }

  bool _hasValidationErrors() {
    final validationError = formData.validate();
    return validationError.isNotEmpty;
  }

  String _getValidationSummary() {
    final validationError = formData.validate();
    final lines = validationError.split('\n');
    if (lines.length <= 3) {
      return validationError;
    }
    return '${lines.take(3).join('\n')}\n... and ${lines.length - 3} more issues';
  }

  String _getFormStatus() {
    if (formData.id == null) {
      return 'Creating new product';
    } else {
      return 'Editing existing product';
    }
  }
}
