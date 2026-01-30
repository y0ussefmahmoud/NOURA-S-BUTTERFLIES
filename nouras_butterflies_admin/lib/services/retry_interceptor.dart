import 'package:dio/dio.dart';

class RetryInterceptor extends Interceptor {
  static const int _maxRetries = 3;
  static const List<int> _retryDelays = [1000, 2000, 4000]; // 1s, 2s, 4s (exponential backoff)

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final extra = err.requestOptions.extra;
    final retryCount = extra['retryCount'] as int? ?? 0;
    
    // Check if we should retry
    if (_shouldRetry(err, retryCount)) {
      // Calculate delay for this retry attempt
      final delay = _retryDelays[retryCount.clamp(0, _retryDelays.length - 1)];
      
      // Wait before retrying
      await Future.delayed(Duration(milliseconds: delay));
      
      // Update retry count
      extra['retryCount'] = retryCount + 1;
      
      // Clone the request with updated options
      final retryOptions = err.requestOptions.copyWith(extra: extra);
      
      try {
        // Retry the request
        final response = await err.requestOptions.httpClientAdapter.fetch(
          retryOptions,
        );
        
        // Create a new response object
        final retryResponse = Response(
          requestOptions: retryOptions,
          data: response.data,
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          headers: response.headers,
        );
        
        handler.resolve(retryResponse);
        return;
      } catch (e) {
        // If retry fails, continue with original error
        handler.next(err);
        return;
      }
    }
    
    // Don't retry, continue with original error
    handler.next(err);
  }

  bool _shouldRetry(DioException err, int retryCount) {
    // Don't retry if we've reached max retries
    if (retryCount >= _maxRetries) {
      return false;
    }
    
    // Don't retry if explicitly disabled in request options
    if (err.requestOptions.extra['disableRetry'] == true) {
      return false;
    }
    
    // Retry on network errors
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.connectionError:
        return true;
      
      case DioExceptionType.badResponse:
        final statusCode = err.response?.statusCode;
        
        // Retry on 5xx server errors
        if (statusCode != null && statusCode >= 500 && statusCode < 600) {
          return true;
        }
        
        // Retry on 408 Request Timeout
        if (statusCode == 408) {
          return true;
        }
        
        // Retry on 429 Too Many Requests (with rate limiting)
        if (statusCode == 429) {
          return true;
        }
        
        // Don't retry on 4xx client errors (except 408 and 429)
        return false;
      
      case DioExceptionType.cancel:
      case DioExceptionType.unknown:
      default:
        // For unknown errors, check if it's a network issue
        return err.message?.contains('SocketException') == true ||
               err.message?.contains('NetworkException') == true ||
               err.message?.contains('Connection refused') == true;
    }
  }
}

/// Extension to add retry options to RequestOptions
extension RequestOptionsRetry on RequestOptions {
  RequestOptions copyWith({
    String? method,
    String? baseUrl,
    String? path,
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? extra,
    Map<String, dynamic>? headers,
    dynamic data,
    dynamic cancelToken,
    ConnectTimeout? connectTimeout,
    SendTimeout? sendTimeout,
    ReceiveTimeout? receiveTimeout,
    HttpTransformer? httpTransformer,
    ResponseType? responseType,
    ContentType? contentType,
    ValidateStatus? validateStatus,
    bool? receiveDataWhenStatusError,
    bool? followRedirects,
    int? maxRedirects,
    RequestEncoder? requestEncoder,
    ResponseDecoder? responseDecoder,
    ListFormat? listFormat,
    bool? setRequestContentTypeWhenNoRequestBody,
  }) {
    return RequestOptions(
      method: method ?? this.method,
      baseUrl: baseUrl ?? this.baseUrl,
      path: path ?? this.path,
      queryParameters: queryParameters ?? this.queryParameters,
      extra: extra ?? this.extra,
      headers: headers ?? this.headers,
      data: data ?? this.data,
      cancelToken: cancelToken ?? this.cancelToken,
      connectTimeout: connectTimeout ?? this.connectTimeout,
      sendTimeout: sendTimeout ?? this.sendTimeout,
      receiveTimeout: receiveTimeout ?? this.receiveTimeout,
      httpTransformer: httpTransformer ?? this.httpTransformer,
      responseType: responseType ?? this.responseType,
      contentType: contentType ?? this.contentType,
      validateStatus: validateStatus ?? this.validateStatus,
      receiveDataWhenStatusError: receiveDataWhenStatusError ?? this.receiveDataWhenStatusError,
      followRedirects: followRedirects ?? this.followRedirects,
      maxRedirects: maxRedirects ?? this.maxRedirects,
      requestEncoder: requestEncoder ?? this.requestEncoder,
      responseDecoder: responseDecoder ?? this.responseDecoder,
      listFormat: listFormat ?? this.listFormat,
      setRequestContentTypeWhenNoRequestBody: setRequestContentTypeWhenNoRequestBody ?? this.setRequestContentTypeWhenNoRequestBody,
    );
  }
}
