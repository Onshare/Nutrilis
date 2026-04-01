class ApiResponse<T> {
  const ApiResponse({
    this.data,
    this.meta = const <String, dynamic>{},
    this.error,
  });

  final T? data;
  final Map<String, dynamic> meta;
  final ApiError? error;

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? raw) fromJson,
  ) {
    return ApiResponse<T>(
      data: json.containsKey('data') ? fromJson(json['data']) : null,
      meta: (json['meta'] as Map?)?.cast<String, dynamic>() ?? const <String, dynamic>{},
      error: json['error'] == null
          ? null
          : ApiError.fromJson((json['error'] as Map).cast<String, dynamic>()),
    );
  }
}

class ApiError {
  const ApiError({
    required this.code,
    required this.message,
  });

  final String code;
  final String message;

  factory ApiError.fromJson(Map<String, dynamic> json) {
    return ApiError(
      code: json['code'] as String? ?? 'UNKNOWN',
      message: json['message'] as String? ?? 'Unknown error',
    );
  }
}
