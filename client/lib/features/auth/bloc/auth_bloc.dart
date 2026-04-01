import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/network/api_exception.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/state/load_status.dart';
import '../model/auth_models.dart';
import '../repository/auth_repository.dart';

class AuthState extends Equatable {
  const AuthState({
    this.channel = AuthChannel.phone,
    this.identifier = '',
    this.otp = '',
    this.sendStatus = LoadStatus.initial,
    this.verifyStatus = LoadStatus.initial,
    this.ticket,
    this.errorMessage,
    this.justSignedIn = false,
  });

  final AuthChannel channel;
  final String identifier;
  final String otp;
  final LoadStatus sendStatus;
  final LoadStatus verifyStatus;
  final OtpTicket? ticket;
  final String? errorMessage;
  final bool justSignedIn;

  bool get canSubmitOtp => ticket != null;

  AuthState copyWith({
    AuthChannel? channel,
    String? identifier,
    String? otp,
    LoadStatus? sendStatus,
    LoadStatus? verifyStatus,
    OtpTicket? ticket,
    bool clearTicket = false,
    String? errorMessage,
    bool clearError = false,
    bool? justSignedIn,
  }) {
    return AuthState(
      channel: channel ?? this.channel,
      identifier: identifier ?? this.identifier,
      otp: otp ?? this.otp,
      sendStatus: sendStatus ?? this.sendStatus,
      verifyStatus: verifyStatus ?? this.verifyStatus,
      ticket: clearTicket ? null : (ticket ?? this.ticket),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      justSignedIn: justSignedIn ?? this.justSignedIn,
    );
  }

  @override
  List<Object?> get props => [
        channel,
        identifier,
        otp,
        sendStatus,
        verifyStatus,
        ticket,
        errorMessage,
        justSignedIn,
      ];
}

sealed class AuthEvent {
  const AuthEvent();
}

class AuthChannelChanged extends AuthEvent {
  const AuthChannelChanged(this.channel);

  final AuthChannel channel;
}

class AuthIdentifierChanged extends AuthEvent {
  const AuthIdentifierChanged(this.identifier);

  final String identifier;
}

class AuthOtpChanged extends AuthEvent {
  const AuthOtpChanged(this.otp);

  final String otp;
}

class AuthOtpRequested extends AuthEvent {
  const AuthOtpRequested();
}

class AuthOtpSubmitted extends AuthEvent {
  const AuthOtpSubmitted();
}

class AuthErrorConsumed extends AuthEvent {
  const AuthErrorConsumed();
}

class AuthNavigationConsumed extends AuthEvent {
  const AuthNavigationConsumed();
}

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  AuthBloc({
    required AuthRepository repository,
    required AppBloc appBloc,
  })  : _repository = repository,
        _appBloc = appBloc,
        super(const AuthState()) {
    on<AuthChannelChanged>((event, emit) {
      emit(
        state.copyWith(
          channel: event.channel,
          otp: '',
          sendStatus: LoadStatus.initial,
          verifyStatus: LoadStatus.initial,
          clearTicket: true,
          clearError: true,
          justSignedIn: false,
        ),
      );
    });
    on<AuthIdentifierChanged>((event, emit) {
      emit(state.copyWith(identifier: event.identifier, clearError: true));
    });
    on<AuthOtpChanged>((event, emit) {
      emit(state.copyWith(otp: event.otp, clearError: true));
    });
    on<AuthOtpRequested>(_onOtpRequested);
    on<AuthOtpSubmitted>(_onOtpSubmitted);
    on<AuthErrorConsumed>((event, emit) {
      emit(state.copyWith(clearError: true));
    });
    on<AuthNavigationConsumed>((event, emit) {
      emit(state.copyWith(justSignedIn: false));
    });
  }

  final AuthRepository _repository;
  final AppBloc _appBloc;

  Future<void> _onOtpRequested(
    AuthOtpRequested event,
    Emitter<AuthState> emit,
  ) async {
    if (state.identifier.trim().isEmpty) {
      emit(state.copyWith(errorMessage: '请输入手机号或邮箱'));
      return;
    }

    emit(
      state.copyWith(
        sendStatus: LoadStatus.loading,
        verifyStatus: LoadStatus.initial,
        clearError: true,
        justSignedIn: false,
      ),
    );

    try {
      final ticket = await _repository.sendOtp(
        channel: state.channel,
        target: state.identifier.trim(),
      );
      emit(
        state.copyWith(
          ticket: ticket,
          sendStatus: LoadStatus.success,
          otp: '',
        ),
      );
    } on ApiException catch (error) {
      emit(state.copyWith(sendStatus: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(sendStatus: LoadStatus.failure, errorMessage: '验证码发送失败'));
    }
  }

  Future<void> _onOtpSubmitted(
    AuthOtpSubmitted event,
    Emitter<AuthState> emit,
  ) async {
    if (state.ticket == null) {
      emit(state.copyWith(errorMessage: '请先发送验证码'));
      return;
    }
    if (state.otp.trim().length != 6) {
      emit(state.copyWith(errorMessage: '请输入 6 位验证码'));
      return;
    }

    emit(state.copyWith(verifyStatus: LoadStatus.loading, clearError: true));

    try {
      final result = await _repository.verifyOtp(
        ticket: state.ticket!,
        code: state.otp.trim(),
      );
      _appBloc.add(AppSessionUpdated(result.session));
      emit(
        state.copyWith(
          verifyStatus: LoadStatus.success,
          justSignedIn: true,
        ),
      );
    } on ApiException catch (error) {
      emit(state.copyWith(verifyStatus: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(verifyStatus: LoadStatus.failure, errorMessage: '验证码校验失败'));
    }
  }
}
