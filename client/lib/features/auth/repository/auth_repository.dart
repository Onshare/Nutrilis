import '../../../core/network/session_store.dart';
import '../model/auth_models.dart';
import '../service/auth_api_service.dart';

class AuthRepository {
  const AuthRepository(
    this._service,
    this._sessionStore,
  );

  final AuthApiService _service;
  final SessionStore _sessionStore;

  Future<OtpTicket> sendOtp({
    required AuthChannel channel,
    required String target,
  }) {
    return _service.sendOtp(channel: channel, target: target);
  }

  Future<AuthVerifyResult> verifyOtp({
    required OtpTicket ticket,
    required String code,
  }) async {
    final result = await _service.verifyOtp(ticket: ticket, code: code);
    _sessionStore.update(
      access: result.session.accessToken,
      refresh: result.session.refreshToken,
    );
    return result;
  }

  Future<void> logout(String refreshToken) async {
    await _service.logout(refreshToken);
    _sessionStore.clear();
  }

  void clearSession() {
    _sessionStore.clear();
  }
}
