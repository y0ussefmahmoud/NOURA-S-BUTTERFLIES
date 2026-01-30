import 'dart:async';
import 'package:flutter/material.dart';

/// Form validation result
class ValidationResult {
  final bool isValid;
  final Map<String, String> errors;
  final List<String> globalErrors;

  const ValidationResult({
    required this.isValid,
    required this.errors,
    this.globalErrors = const [],
  });

  factory ValidationResult.success() {
    return const ValidationResult(isValid: true, errors: {});
  }

  factory ValidationResult.failure(Map<String, String> errors, [List<String>? globalErrors]) {
    return ValidationResult(
      isValid: false,
      errors: errors,
      globalErrors: globalErrors ?? [],
    );
  }

  /// Get error for specific field
  String? getFieldError(String fieldName) {
    return errors[fieldName];
  }

  /// Check if field has error
  bool hasFieldError(String fieldName) {
    return errors.containsKey(fieldName);
  }

  /// Get first global error
  String? get firstGlobalError {
    return globalErrors.isNotEmpty ? globalErrors.first : null;
  }
}

/// Async validation result
class AsyncValidationResult<T> {
  final bool isValid;
  final T? value;
  final String? error;

  const AsyncValidationResult({
    required this.isValid,
    this.value,
    this.error,
  });

  factory AsyncValidationResult.success(T value) {
    return AsyncValidationResult(isValid: true, value: value);
  }

  factory AsyncValidationResult.failure(String error) {
    return AsyncValidationResult(isValid: false, error: error);
  }
}

/// Form validator interface
abstract class FieldValidator<T> {
  const FieldValidator();
  
  ValidationResult validate(T value, {Map<String, dynamic>? context});
  String get errorMessage;
}

/// Required field validator
class RequiredValidator<T> extends FieldValidator<T> {
  final String? customMessage;
  
  const RequiredValidator({this.customMessage});

  @override
  ValidationResult validate(T value, {Map<String, dynamic>? context}) {
    final isEmpty = value == null || 
                   (value is String && value.trim().isEmpty) ||
                   (value is List && value.isEmpty) ||
                   (value is Map && value.isEmpty);

    if (isEmpty) {
      return ValidationResult.failure({
        'value': customMessage ?? 'This field is required',
      });
    }

    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'This field is required';
}

/// Email validator
class EmailValidator extends FieldValidator<String> {
  final String? customMessage;
  
  const EmailValidator({this.customMessage});

  @override
  ValidationResult validate(String value, {Map<String, dynamic>? context}) {
    if (value.isEmpty) return ValidationResult.success();

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!emailRegex.hasMatch(value)) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Please enter a valid email address',
      });
    }

    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'Please enter a valid email address';
}

/// Phone validator
class PhoneValidator extends FieldValidator<String> {
  final String? customMessage;
  final String? countryCode;
  
  const PhoneValidator({this.customMessage, this.countryCode});

  @override
  ValidationResult validate(String value, {Map<String, dynamic>? context}) {
    if (value.isEmpty) return ValidationResult.success();

    // Remove all non-digit characters
    final cleanPhone = value.replaceAll(RegExp(r'[^\d]'), '');
    
    // Basic phone validation (10-15 digits)
    if (cleanPhone.length < 10 || cleanPhone.length > 15) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Please enter a valid phone number',
      });
    }

    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'Please enter a valid phone number';
}

/// Numeric validator
class NumericValidator extends FieldValidator<String> {
  final double? min;
  final double? max;
  final bool allowDecimals;
  final String? customMessage;
  
  const NumericValidator({
    this.min,
    this.max,
    this.allowDecimals = true,
    this.customMessage,
  });

  @override
  ValidationResult validate(String value, {Map<String, dynamic>? context}) {
    if (value.isEmpty) return ValidationResult.success();

    final numericRegex = allowDecimals 
        ? RegExp(r'^-?\d*\.?\d+$')
        : RegExp(r'^-?\d+$');

    if (!numericRegex.hasMatch(value)) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Please enter a valid number',
      });
    }

    final number = double.tryParse(value);
    if (number == null) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Please enter a valid number',
      });
    }

    if (min != null && number < min!) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Value must be at least $min',
      });
    }

    if (max != null && number > max!) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Value must be at most $max',
      });
    }

    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'Please enter a valid number';
}

/// Length validator
class LengthValidator extends FieldValidator<String> {
  final int? minLength;
  final int? maxLength;
  final String? customMessage;
  
  const LengthValidator({
    this.minLength,
    this.maxLength,
    this.customMessage,
  });

  @override
  ValidationResult validate(String value, {Map<String, dynamic>? context}) {
    if (value.isEmpty) return ValidationResult.success();

    if (minLength != null && value.length < minLength!) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Must be at least $minLength characters',
      });
    }

    if (maxLength != null && value.length > maxLength!) {
      return ValidationResult.failure({
        'value': customMessage ?? 'Must be at most $maxLength characters',
      });
    }

    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'Invalid length';
}

/// SKU uniqueness validator (async)
class SkuUniquenessValidator extends FieldValidator<String> {
  final Future<bool> Function(String sku) checkUniqueness;
  final String? customMessage;
  
  const SkuUniquenessValidator({
    required this.checkUniqueness,
    this.customMessage,
  });

  @override
  ValidationResult validate(String value, {Map<String, dynamic>? context}) {
    // This validator needs async validation, so we return success here
    // and handle the async validation separately
    return ValidationResult.success();
  }

  @override
  String get errorMessage => customMessage ?? 'SKU already exists';

  /// Async validation method
  Future<AsyncValidationResult<String>> validateAsync(String value) async {
    if (value.isEmpty) {
      return AsyncValidationResult.success(value);
    }

    try {
      final isUnique = await checkUniqueness(value);
      if (isUnique) {
        return AsyncValidationResult.success(value);
      } else {
        return AsyncValidationResult.failure(errorMessage);
      }
    } catch (e) {
      return AsyncValidationResult.failure('Failed to validate SKU uniqueness');
    }
  }
}

/// Composite validator that combines multiple validators
class CompositeValidator<T> extends FieldValidator<T> {
  final List<FieldValidator<T>> validators;
  final ValidationMode mode;
  
  const CompositeValidator(
    this.validators, {
    this.mode = ValidationMode.all,
  });

  @override
  ValidationResult validate(T value, {Map<String, dynamic>? context}) {
    final errors = <String, String>{};
    final globalErrors = <String>[];

    for (final validator in validators) {
      final result = validator.validate(value, context: context);
      
      if (!result.isValid) {
        errors.addAll(result.errors);
        globalErrors.addAll(result.globalErrors);
        
        if (mode == ValidationMode.stopOnFirstError) {
          break;
        }
      }
    }

    return errors.isEmpty 
        ? ValidationResult.success()
        : ValidationResult.failure(errors, globalErrors);
  }

  @override
  String get errorMessage {
    return validators.map((v) => v.errorMessage).join(', ');
  }
}

/// Validation mode for composite validators
enum ValidationMode {
  all,
  stopOnFirstError,
}

/// Form validator for entire forms
class FormValidator {
  final Map<String, List<FieldValidator>> fieldValidators;
  final Map<String, Future<AsyncValidationResult> Function(String)>? asyncValidators;
  
  FormValidator(this.fieldValidators, {this.asyncValidators});

  /// Validate all fields
  ValidationResult validateAll(Map<String, dynamic> formData) {
    final allErrors = <String, String>{};
    final allGlobalErrors = <String>[];

    for (final entry in fieldValidators.entries) {
      final fieldName = entry.key;
      final validators = entry.value;
      final fieldValue = formData[fieldName];

      for (final validator in validators) {
        final result = validator.validate(fieldValue, context: formData);
        
        if (!result.isValid) {
          allErrors.addAll(result.errors);
          allGlobalErrors.addAll(result.globalErrors);
        }
      }
    }

    return allErrors.isEmpty 
        ? ValidationResult.success()
        : ValidationResult.failure(allErrors, allGlobalErrors);
  }

  /// Validate specific field
  ValidationResult validateField(String fieldName, dynamic value, {Map<String, dynamic>? context}) {
    final validators = fieldValidators[fieldName];
    if (validators == null || validators.isEmpty) {
      return ValidationResult.success();
    }

    final allErrors = <String, String>{};
    final allGlobalErrors = <String>[];

    for (final validator in validators) {
      final result = validator.validate(value, context: context);
      
      if (!result.isValid) {
        allErrors.addAll(result.errors);
        allGlobalErrors.addAll(result.globalErrors);
      }
    }

    return allErrors.isEmpty 
        ? ValidationResult.success()
        : ValidationResult.failure(allErrors, allGlobalErrors);
  }

  /// Validate field asynchronously
  Future<AsyncValidationResult> validateFieldAsync(String fieldName, dynamic value) async {
    final asyncValidator = asyncValidators?[fieldName];
    if (asyncValidator == null) {
      return AsyncValidationResult.success(value);
    }

    try {
      return await asyncValidator(value.toString());
    } catch (e) {
      return AsyncValidationResult.failure('Validation failed: $e');
    }
  }

  /// Check if field has validators
  bool hasValidators(String fieldName) {
    return fieldValidators.containsKey(fieldName) && 
           fieldValidators[fieldName]!.isNotEmpty;
  }
}

/// Async validation queue to prevent multiple simultaneous requests
class AsyncValidationQueue {
  final Map<String, Completer<AsyncValidationResult>> _pendingValidations = {};
  final Duration _debounceTime;

  AsyncValidationQueue({Duration? debounceTime})
      : _debounceTime = debounceTime ?? const Duration(milliseconds: 500);

  /// Queue validation with debouncing
  Future<AsyncValidationResult> queueValidation(
    String key,
    Future<AsyncValidationResult> Function() validationFunction,
  ) async {
    // Cancel existing validation for this key
    if (_pendingValidations.containsKey(key)) {
      _pendingValidations[key]!.complete(
        AsyncValidationResult.failure('Validation cancelled'),
      );
    }

    // Create new completer
    final completer = Completer<AsyncValidationResult>();
    _pendingValidations[key] = completer;

    // Debounce the validation
    await Future.delayed(_debounceTime);

    try {
      final result = await validationFunction();
      completer.complete(result);
      return result;
    } catch (e) {
      completer.complete(AsyncValidationResult.failure('Validation error: $e'));
      rethrow;
    } finally {
      _pendingValidations.remove(key);
    }
  }

  /// Cancel pending validation for a key
  void cancelValidation(String key) {
    if (_pendingValidations.containsKey(key)) {
      _pendingValidations[key]!.complete(
        AsyncValidationResult.failure('Validation cancelled'),
      );
      _pendingValidations.remove(key);
    }
  }

  /// Cancel all pending validations
  void cancelAll() {
    for (final completer in _pendingValidations.values) {
      completer.complete(AsyncValidationResult.failure('Validation cancelled'));
    }
    _pendingValidations.clear();
  }
}

/// Real-time validation controller
class RealTimeValidationController {
  final FormValidator formValidator;
  final AsyncValidationQueue asyncQueue;
  final Map<String, dynamic> formData;
  final Map<String, String> fieldErrors = {};
  final Map<String, bool> fieldValidationStates = {};
  
  final StreamController<Map<String, String>> _errorsController = 
      StreamController<Map<String, String>>.broadcast();
  final StreamController<Map<String, bool>> _validationStatesController = 
      StreamController<Map<String, bool>>.broadcast();

  RealTimeValidationController({
    required this.formValidator,
    required this.formData,
    AsyncValidationQueue? asyncQueue,
  }) : asyncQueue = asyncQueue ?? AsyncValidationQueue();

  /// Stream of field errors
  Stream<Map<String, String>> get errorsStream => _errorsController.stream;

  /// Stream of validation states (validating: true/false)
  Stream<Map<String, bool>> get validationStatesStream => _validationStatesController.stream;

  /// Validate field in real-time
  Future<void> validateField(String fieldName, dynamic value) async {
    // Update form data
    formData[fieldName] = value;

    // Mark as validating
    fieldValidationStates[fieldName] = true;
    _validationStatesController.add(Map.from(fieldValidationStates));

    // Perform sync validation
    final syncResult = formValidator.validateField(fieldName, value, context: formData);
    
    if (!syncResult.isValid) {
      fieldErrors.addAll(syncResult.errors);
    } else {
      fieldErrors.remove(fieldName);
    }

    _errorsController.add(Map.from(fieldErrors));

    // Perform async validation if available
    if (formValidator.asyncValidators?.containsKey(fieldName) == true) {
      try {
        final asyncResult = await asyncQueue.queueValidation(
          fieldName,
          () => formValidator.validateFieldAsync(fieldName, value),
        );

        if (!asyncResult.isValid) {
          fieldErrors[fieldName] = asyncResult.error ?? 'Validation failed';
        } else {
          fieldErrors.remove(fieldName);
        }

        _errorsController.add(Map.from(fieldErrors));
      } catch (e) {
        fieldErrors[fieldName] = 'Validation error';
        _errorsController.add(Map.from(fieldErrors));
      }
    }

    // Mark as not validating
    fieldValidationStates[fieldName] = false;
    _validationStatesController.add(Map.from(fieldValidationStates));
  }

  /// Validate all fields
  ValidationResult validateAll() {
    return formValidator.validateAll(formData);
  }

  /// Get error for specific field
  String? getFieldError(String fieldName) {
    return fieldErrors[fieldName];
  }

  /// Check if field is currently validating
  bool isValidatingField(String fieldName) {
    return fieldValidationStates[fieldName] ?? false;
  }

  /// Clear all errors
  void clearErrors() {
    fieldErrors.clear();
    _errorsController.add({});
  }

  /// Clear error for specific field
  void clearFieldError(String fieldName) {
    fieldErrors.remove(fieldName);
    _errorsController.add(Map.from(fieldErrors));
  }

  /// Dispose resources
  void dispose() {
    _errorsController.close();
    _validationStatesController.close();
    asyncQueue.cancelAll();
  }
}
