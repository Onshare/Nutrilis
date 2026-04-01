import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/state/load_status.dart';

class HomeState extends Equatable {
  const HomeState({
    this.status = LoadStatus.initial,
    this.payload,
    this.errorMessage,
  });

  final LoadStatus status;
  final HomePayload? payload;
  final String? errorMessage;

  HomeState copyWith({
    LoadStatus? status,
    HomePayload? payload,
    String? errorMessage,
    bool clearError = false,
  }) {
    return HomeState(
      status: status ?? this.status,
      payload: payload ?? this.payload,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }

  @override
  List<Object?> get props => [status, payload, errorMessage];
}

sealed class HomeEvent {
  const HomeEvent();
}

class HomeLoaded extends HomeEvent {
  const HomeLoaded();
}

class HomeBloc extends Bloc<HomeEvent, HomeState> {
  HomeBloc(this._repository) : super(const HomeState()) {
    on<HomeLoaded>(_onLoaded);
  }

  final ContentRepository _repository;

  Future<void> _onLoaded(
    HomeLoaded event,
    Emitter<HomeState> emit,
  ) async {
    emit(state.copyWith(status: LoadStatus.loading, clearError: true));
    try {
      final payload = await _repository.fetchHome();
      emit(state.copyWith(status: LoadStatus.success, payload: payload));
    } on ApiException catch (error) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: '首页内容加载失败'));
    }
  }
}
