import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/state/load_status.dart';

class RecipesState extends Equatable {
  const RecipesState({
    this.status = LoadStatus.initial,
    this.items = const <RecipeSummary>[],
    this.errorMessage,
  });

  final LoadStatus status;
  final List<RecipeSummary> items;
  final String? errorMessage;

  RecipesState copyWith({
    LoadStatus? status,
    List<RecipeSummary>? items,
    String? errorMessage,
    bool clearError = false,
  }) {
    return RecipesState(
      status: status ?? this.status,
      items: items ?? this.items,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }

  @override
  List<Object?> get props => [status, items, errorMessage];
}

sealed class RecipesEvent {
  const RecipesEvent();
}

class RecipesLoaded extends RecipesEvent {
  const RecipesLoaded();
}

class RecipesBloc extends Bloc<RecipesEvent, RecipesState> {
  RecipesBloc(this._repository) : super(const RecipesState()) {
    on<RecipesLoaded>(_onLoaded);
  }

  final ContentRepository _repository;

  Future<void> _onLoaded(
    RecipesLoaded event,
    Emitter<RecipesState> emit,
  ) async {
    emit(state.copyWith(status: LoadStatus.loading, clearError: true));
    try {
      final recipes = await _repository.fetchRecipes();
      emit(state.copyWith(status: LoadStatus.success, items: recipes));
    } on ApiException catch (error) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(status: LoadStatus.failure, errorMessage: '食谱加载失败'));
    }
  }
}
