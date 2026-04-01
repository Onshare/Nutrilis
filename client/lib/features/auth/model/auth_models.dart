import '../../../core/state/app_bloc.dart';

enum AuthChannel { phone, email }

class OtpTicket {
  const OtpTicket({
    required this.requestId,
    required this.maskedTarget,
    required this.target,
    required this.channel,
  });

  final String requestId;
  final String maskedTarget;
  final String target;
  final AuthChannel channel;
}

class AuthVerifyResult {
  const AuthVerifyResult({
    required this.session,
    required this.created,
  });

  final AppSession session;
  final bool created;
}
