import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';

import 'api_exception.dart';
import 'session_store.dart';

class DioClient {
  DioClient(this._sessionStore)
      : dio = Dio(
          BaseOptions(
            baseUrl: _resolveBaseUrl(),
            connectTimeout: const Duration(seconds: 10),
            receiveTimeout: const Duration(seconds: 10),
          ),
        ) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final accessToken = _sessionStore.accessToken;
          if (accessToken != null && accessToken.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $accessToken';
          }
          handler.next(options);
        },
        onError: (error, handler) {
          final data = error.response?.data;
          if (data is Map<String, dynamic>) {
            final errorMap = data['error'];
            if (errorMap is Map<String, dynamic>) {
              handler.reject(
                DioException(
                  requestOptions: error.requestOptions,
                  error: ApiException(errorMap['message'] as String? ?? 'Request failed'),
                  response: error.response,
                  type: error.type,
                ),
              );
              return;
            }
          }

          handler.next(error);
        },
      ),
    );
  }

  final Dio dio;
  final SessionStore _sessionStore;

  static String _resolveBaseUrl() {
    if (kIsWeb) {
      return 'http://127.0.0.1:8080/api/v1';
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return 'http://10.0.2.2:8080/api/v1';
      case TargetPlatform.iOS:
      case TargetPlatform.macOS:
      case TargetPlatform.windows:
      case TargetPlatform.linux:
      case TargetPlatform.fuchsia:
        return 'http://127.0.0.1:8080/api/v1';
    }
  }
}
