import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/state/load_status.dart';

class DailyCareState extends Equatable {
  const DailyCareState({
    this.status = LoadStatus.initial,
    this.items = const <DailyCareTopic>[],
    this.errorMessage,
  });

  final LoadStatus status;
  final List<DailyCareTopic> items;
  final String? errorMessage;

  DailyCareState copyWith({
    LoadStatus? status,
    List<DailyCareTopic>? items,
    String? errorMessage,
    bool clearError = false,
  }) {
    return DailyCareState(
      status: status ?? this.status,
      items: items ?? this.items,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }

  @override
  List<Object?> get props => [status, items, errorMessage];
}

sealed class DailyCareEvent {
  const DailyCareEvent();
}

class DailyCareLoaded extends DailyCareEvent {
  const DailyCareLoaded();
}

class DailyCareBloc extends Bloc<DailyCareEvent, DailyCareState> {
  DailyCareBloc(this._repository) : super(const DailyCareState()) {
    on<DailyCareLoaded>(_onLoaded);
  }

  final ContentRepository _repository;

  Future<void> _onLoaded(
    DailyCareLoaded event,
    Emitter<DailyCareState> emit,
  ) async {
    emit(state.copyWith(status: LoadStatus.loading, clearError: true));
    try {
      final topics = await _repository.fetchDailyCare();
      emit(state.copyWith(status: LoadStatus.success, items: topics));
    } on ApiException catch (error) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: '日常养护加载失败'));
    }
  }
}
