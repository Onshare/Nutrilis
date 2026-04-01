import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/state/load_status.dart';

class TherapyState extends Equatable {
  const TherapyState({
    this.status = LoadStatus.initial,
    this.items = const <TherapySummary>[],
    this.errorMessage,
  });

  final LoadStatus status;
  final List<TherapySummary> items;
  final String? errorMessage;

  TherapyState copyWith({
    LoadStatus? status,
    List<TherapySummary>? items,
    String? errorMessage,
    bool clearError = false,
  }) {
    return TherapyState(
      status: status ?? this.status,
      items: items ?? this.items,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }

  @override
  List<Object?> get props => [status, items, errorMessage];
}

sealed class TherapyEvent {
  const TherapyEvent();
}

class TherapyLoaded extends TherapyEvent {
  const TherapyLoaded();
}

class TherapyBloc extends Bloc<TherapyEvent, TherapyState> {
  TherapyBloc(this._repository) : super(const TherapyState()) {
    on<TherapyLoaded>(_onLoaded);
  }

  final ContentRepository _repository;

  Future<void> _onLoaded(
    TherapyLoaded event,
    Emitter<TherapyState> emit,
  ) async {
    emit(state.copyWith(status: LoadStatus.loading, clearError: true));
    try {
      final therapies = await _repository.fetchTherapies();
      emit(state.copyWith(status: LoadStatus.success, items: therapies));
    } on ApiException catch (error) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: '理疗内容加载失败'));
    }
  }
}
