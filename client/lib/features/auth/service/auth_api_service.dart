import '../../../core/network/api_exception.dart';
import '../../../core/network/api_response.dart';
import '../../../core/network/dio_client.dart';
import '../../../core/state/app_bloc.dart';
import '../model/auth_models.dart';

class AuthApiService {
  const AuthApiService(this._client);

  final DioClient _client;

  Future<OtpTicket> sendOtp({
    required AuthChannel channel,
    required String target,
  }) async {
    final response = await _client.dio.post<Map<String, dynamic>>(
      '/auth/otp/send',
      data: {
        'channel': channel.name,
        'target': target,
      },
    );

    return _unwrap(response.data, (raw) {
      final data = (raw as Map).cast<String, dynamic>();
      return OtpTicket(
        requestId: data['requestId'] as String? ?? '',
        maskedTarget: data['maskedTarget'] as String? ?? target,
        target: target,
        channel: channel,
      );
    });
  }

  Future<AuthVerifyResult> verifyOtp({
    required OtpTicket ticket,
    required String code,
  }) async {
    final response = await _client.dio.post<Map<String, dynamic>>(
      '/auth/otp/verify',
      data: {
        'requestId': ticket.requestId,
        'channel': ticket.channel.name,
        'target': ticket.target,
        'code': code,
      },
    );

    return _unwrap(response.data, (raw) {
      final data = (raw as Map).cast<String, dynamic>();
      final user = (data['user'] as Map?)?.cast<String, dynamic>() ?? {};
      final session = AppSession(
        accessToken: data['accessToken'] as String? ?? '',
        refreshToken: data['refreshToken'] as String? ?? '',
        displayName: user['displayName'] as String? ?? 'Nutrilis User',
        identifier: user['identifier'] as String? ?? ticket.target,
      );
      return AuthVerifyResult(
        session: session,
        created: data['created'] as bool? ?? false,
      );
    });
  }

  Future<void> logout(String refreshToken) async {
    await _client.dio.post<Map<String, dynamic>>(
      '/auth/logout',
      data: {'refreshToken': refreshToken},
    );
  }

  T _unwrap<T>(
    Map<String, dynamic>? json,
    T Function(Object? raw) mapper,
  ) {
    if (json == null) {
      throw const ApiException('Empty response');
    }
    final envelope = ApiResponse<T>.fromJson(json, mapper);
    if (envelope.error != null) {
      throw ApiException(envelope.error!.message);
    }
    if (envelope.data == null) {
      throw const ApiException('Missing data payload');
    }
    return envelope.data as T;
  }
}
