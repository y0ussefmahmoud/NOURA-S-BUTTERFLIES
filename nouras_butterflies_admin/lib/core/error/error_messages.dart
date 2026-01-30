/// User-friendly error messages in Arabic and English
/// Provides clear, actionable error messages for different error types

class ErrorMessages {
  static const Map<String, Map<String, String>> _messages = {
    // Network Errors
    'network_timeout': {
      'en': 'Connection timeout. Please check your internet connection.',
      'ar': 'انتهت مهلة الاتصال. يرجى التحقق من اتصال الإنترنت.',
    },
    'no_internet': {
      'en': 'No internet connection. Please check your network settings.',
      'ar': 'لا يوجد اتصال بالإنترنت. يرجى التحقق من إعدادات الشبكة.',
    },
    'network_error': {
      'en': 'Network error occurred. Please try again.',
      'ar': 'حدث خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
    },
    'server_unreachable': {
      'en': 'Server is unreachable. Please try again later.',
      'ar': 'الخادم غير متاح. يرجى المحاولة مرة أخرى لاحقاً.',
    },

    // Authentication Errors
    'unauthorized': {
      'en': 'Authentication failed. Please log in again.',
      'ar': 'فشل المصادقة. يرجى تسجيل الدخول مرة أخرى.',
    },
    'access_denied': {
      'en': 'Access denied. You don\'t have permission to perform this action.',
      'ar': 'تم رفض الوصول. ليس لديك الإذن لتنفيذ هذا الإجراء.',
    },
    'session_expired': {
      'en': 'Your session has expired. Please log in again.',
      'ar': 'انتهت جلستك. يرجى تسجيل الدخول مرة أخرى.',
    },
    'invalid_credentials': {
      'en': 'Invalid email or password.',
      'ar': 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    },

    // Validation Errors
    'invalid_input': {
      'en': 'Invalid data provided. Please check your input.',
      'ar': 'بيانات غير صالحة. يرجى التحقق من المدخلات.',
    },
    'required_field': {
      'en': 'This field is required.',
      'ar': 'هذا الحقل مطلوب.',
    },
    'invalid_email': {
      'en': 'Please enter a valid email address.',
      'ar': 'يرجى إدخال عنوان بريد إلكتروني صحيح.',
    },
    'invalid_phone': {
      'en': 'Please enter a valid phone number.',
      'ar': 'يرجى إدخال رقم هاتف صحيح.',
    },
    'password_too_short': {
      'en': 'Password must be at least 8 characters long.',
      'ar': 'يجب أن تكون كلمة المرور 8 أحرف على الأقل.',
    },
    'passwords_not_match': {
      'en': 'Passwords do not match.',
      'ar': 'كلمات المرور غير متطابقة.',
    },
    'duplicate_sku': {
      'en': 'A product with this SKU already exists.',
      'ar': 'يوجد منتج بهذا الرمز بالفعل.',
    },
    'invalid_price': {
      'en': 'Please enter a valid price.',
      'ar': 'يرجى إدخال سعر صحيح.',
    },
    'invalid_quantity': {
      'en': 'Please enter a valid quantity.',
      'ar': 'يرجى إدخال كمية صحيحة.',
    },

    // Server Errors
    'server_error': {
      'en': 'Server error occurred. Please try again later.',
      'ar': 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
    },
    'service_unavailable': {
      'en': 'Service temporarily unavailable. Please try again later.',
      'ar': 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة مرة أخرى لاحقاً.',
    },
    'maintenance_mode': {
      'en': 'System is under maintenance. Please try again later.',
      'ar': 'النظام تحت الصيانة. يرجى المحاولة مرة أخرى لاحقاً.',
    },
    'rate_limit_exceeded': {
      'en': 'Too many requests. Please wait and try again.',
      'ar': 'طلبات كثيرة جداً. يرجى الانتظار والمحاولة مرة أخرى.',
    },

    // Storage Errors
    'storage_error': {
      'en': 'Storage error occurred. Please try again.',
      'ar': 'حدث خطأ في التخزين. يرجى المحاولة مرة أخرى.',
    },
    'cache_error': {
      'en': 'Cache error occurred. Please clear cache and try again.',
      'ar': 'حدث خطأ في التخزين المؤقت. يرجى مسح التخزين المؤقت والمحاولة مرة أخرى.',
    },
    'insufficient_storage': {
      'en': 'Insufficient storage space.',
      'ar': 'مساحة تخزين غير كافية.',
    },

    // File/Image Errors
    'file_too_large': {
      'en': 'File size is too large. Maximum size is 5MB.',
      'ar': 'حجم الملف كبير جداً. الحد الأقصى هو 5 ميجابايت.',
    },
    'invalid_file_type': {
      'en': 'Invalid file type. Please upload a valid image file.',
      'ar': 'نوع الملف غير صالح. يرجى رفع ملف صورة صحيح.',
    },
    'upload_failed': {
      'en': 'File upload failed. Please try again.',
      'ar': 'فشل رفع الملف. يرجى المحاولة مرة أخرى.',
    },

    // Business Logic Errors
    'product_not_found': {
      'en': 'Product not found.',
      'ar': 'المنتج غير موجود.',
    },
    'order_not_found': {
      'en': 'Order not found.',
      'ar': 'الطلب غير موجود.',
    },
    'customer_not_found': {
      'en': 'Customer not found.',
      'ar': 'العميل غير موجود.',
    },
    'insufficient_stock': {
      'en': 'Insufficient stock for this product.',
      'ar': 'المخزون غير كافٍ لهذا المنتج.',
    },
    'order_cannot_be_cancelled': {
      'en': 'This order cannot be cancelled.',
      'ar': 'لا يمكن إلغاء هذا الطلب.',
    },
    'invalid_order_status': {
      'en': 'Invalid order status for this operation.',
      'ar': 'حالة الطلب غير صالحة لهذه العملية.',
    },

    // Generic Errors
    'unknown_error': {
      'en': 'An unexpected error occurred. Please try again.',
      'ar': 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
    },
    'operation_failed': {
      'en': 'Operation failed. Please try again.',
      'ar': 'فشلت العملية. يرجى المحاولة مرة أخرى.',
    },
    'something_went_wrong': {
      'en': 'Something went wrong. Please try again.',
      'ar': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    },

    // Success Messages
    'operation_successful': {
      'en': 'Operation completed successfully.',
      'ar': 'تمت العملية بنجاح.',
    },
    'saved_successfully': {
      'en': 'Saved successfully.',
      'ar': 'تم الحفظ بنجاح.',
    },
    'updated_successfully': {
      'en': 'Updated successfully.',
      'ar': 'تم التحديث بنجاح.',
    },
    'deleted_successfully': {
      'en': 'Deleted successfully.',
      'ar': 'تم الحذف بنجاح.',
    },
    'uploaded_successfully': {
      'en': 'Uploaded successfully.',
      'ar': 'تم الرفع بنجاح.',
    },
  };

  static String getMessage(String key, {String language = 'en'}) {
    final messageMap = _messages[key];
    if (messageMap == null) {
      return _messages['unknown_error']![language] ?? 'Unknown error occurred.';
    }
    
    return messageMap[language] ?? messageMap['en'] ?? 'Error occurred.';
  }

  static String getErrorMessage(int? statusCode, {String language = 'en'}) {
    switch (statusCode) {
      case 400:
        return getMessage('invalid_input', language: language);
      case 401:
        return getMessage('unauthorized', language: language);
      case 403:
        return getMessage('access_denied', language: language);
      case 404:
        return getMessage('not_found', language: language);
      case 422:
        return getMessage('invalid_input', language: language);
      case 429:
        return getMessage('rate_limit_exceeded', language: language);
      case 500:
        return getMessage('server_error', language: language);
      case 502:
        return getMessage('server_unreachable', language: language);
      case 503:
        return getMessage('service_unavailable', language: language);
      default:
        return getMessage('unknown_error', language: language);
    }
  }

  static String getSuccessMessage(String operation, {String language = 'en'}) {
    final key = '${operation}_successful';
    return getMessage(key, language: language);
  }

  static String getFieldErrorMessage(String fieldType, {String language = 'en'}) {
    switch (fieldType) {
      case 'email':
        return getMessage('invalid_email', language: language);
      case 'phone':
        return getMessage('invalid_phone', language: language);
      case 'password':
        return getMessage('password_too_short', language: language);
      case 'price':
        return getMessage('invalid_price', language: language);
      case 'quantity':
        return getMessage('invalid_quantity', language: language);
      case 'sku':
        return getMessage('duplicate_sku', language: language);
      default:
        return getMessage('invalid_input', language: language);
    }
  }

  static List<String> getSuggestions(String errorType, {String language = 'en'}) {
    switch (errorType) {
      case 'network':
        return language == 'en'
            ? [
                'Check your internet connection',
                'Try switching between Wi-Fi and mobile data',
                'Restart your router',
                'Try again in a few minutes',
              ]
            : [
                'تحقق من اتصال الإنترنت',
                'جرب التبديل بين Wi-Fi وبيانات الجوال',
                'أعد تشغيل جهاز التوجيه',
                'جرب المحاولة مرة أخرى بعد بضع دقائق',
              ];

      case 'authentication':
        return language == 'en'
            ? [
                'Check your email and password',
                'Clear app cache and try again',
                'Contact support if the problem persists',
              ]
            : [
                'تحقق من بريدك الإلكتروني وكلمة المرور',
                'امسح ذاكرة التخزين المؤقت للتطبيق وجرب مرة أخرى',
                'اتصل بالدعم إذا استمرت المشكلة',
              ];

      case 'validation':
        return language == 'en'
            ? [
                'Check all required fields',
                'Ensure data format is correct',
                'Review error messages for specific issues',
              ]
            : [
                'تحقق من جميع الحقول المطلوبة',
                'تأكد من صحة تنسيق البيانات',
                'راجع رسائل الخطأ للمشاكل المحددة',
              ];

      case 'server':
        return language == 'en'
            ? [
                'Try again in a few minutes',
                'Check if the service is down for maintenance',
                'Contact support if the problem persists',
              ]
            : [
                'جرب المحاولة مرة أخرى بعد بضع دقائق',
                'تحقق مما إذا كانت الخدمة متوقفة للصيانة',
                'اتصل بالدعم إذا استمرت المشكلة',
              ];

      default:
        return language == 'en'
            ? [
                'Try again',
                'Restart the app',
                'Contact support if the problem persists',
              ]
            : [
                'جرب المحاولة مرة أخرى',
                'أعد تشغيل التطبيق',
                'اتصل بالدعم إذا استمرت المشكلة',
              ];
    }
  }
}
