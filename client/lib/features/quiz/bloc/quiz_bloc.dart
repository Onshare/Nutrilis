import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/network/api_exception.dart';
import '../../../core/state/load_status.dart';

class QuizState extends Equatable {
  const QuizState({
    this.loadStatus = LoadStatus.initial,
    this.submitStatus = LoadStatus.initial,
    this.questions = const <QuizQuestion>[],
    this.answers = const <String, int>{},
    this.result,
    this.errorMessage,
  });

  final LoadStatus loadStatus;
  final LoadStatus submitStatus;
  final List<QuizQuestion> questions;
  final Map<String, int> answers;
  final QuizResult? result;
  final String? errorMessage;

  bool get readyToSubmit => questions.isNotEmpty && answers.length == questions.length;

  QuizState copyWith({
    LoadStatus? loadStatus,
    LoadStatus? submitStatus,
    List<QuizQuestion>? questions,
    Map<String, int>? answers,
    QuizResult? result,
    String? errorMessage,
    bool clearError = false,
  }) {
    return QuizState(
      loadStatus: loadStatus ?? this.loadStatus,
      submitStatus: submitStatus ?? this.submitStatus,
      questions: questions ?? this.questions,
      answers: answers ?? this.answers,
      result: result ?? this.result,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
    );
  }

  @override
  List<Object?> get props => [
        loadStatus,
        submitStatus,
        questions,
        answers,
        result,
        errorMessage,
      ];
}

sealed class QuizEvent {
  const QuizEvent();
}

class QuizLoaded extends QuizEvent {
  const QuizLoaded();
}

class QuizAnswerSelected extends QuizEvent {
  const QuizAnswerSelected({
    required this.questionId,
    required this.optionIndex,
  });

  final String questionId;
  final int optionIndex;
}

class QuizSubmitted extends QuizEvent {
  const QuizSubmitted();
}

class QuizBloc extends Bloc<QuizEvent, QuizState> {
  QuizBloc(this._repository) : super(const QuizState()) {
    on<QuizLoaded>(_onLoaded);
    on<QuizAnswerSelected>(_onAnswerSelected);
    on<QuizSubmitted>(_onSubmitted);
  }

  final ContentRepository _repository;

  Future<void> _onLoaded(
    QuizLoaded event,
    Emitter<QuizState> emit,
  ) async {
    emit(state.copyWith(loadStatus: LoadStatus.loading, clearError: true));
    try {
      final questions = await _repository.fetchQuiz();
      emit(state.copyWith(loadStatus: LoadStatus.success, questions: questions));
    } on ApiException catch (error) {
      emit(state.copyWith(loadStatus: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(loadStatus: LoadStatus.failure, errorMessage: '测评题目加载失败'));
    }
  }

  void _onAnswerSelected(
    QuizAnswerSelected event,
    Emitter<QuizState> emit,
  ) {
    final nextAnswers = {...state.answers, event.questionId: event.optionIndex};
    emit(state.copyWith(answers: nextAnswers, clearError: true));
  }

  Future<void> _onSubmitted(
    QuizSubmitted event,
    Emitter<QuizState> emit,
  ) async {
    if (!state.readyToSubmit) {
      emit(state.copyWith(errorMessage: '请完成全部题目'));
      return;
    }
    emit(state.copyWith(submitStatus: LoadStatus.loading, clearError: true));
    try {
      final result = await _repository.submitQuiz(state.answers);
      emit(state.copyWith(submitStatus: LoadStatus.success, result: result));
    } on ApiException catch (error) {
      emit(state.copyWith(submitStatus: LoadStatus.failure, errorMessage: error.message));
    } catch (_) {
      emit(state.copyWith(submitStatus: LoadStatus.failure, errorMessage: '测评提交失败'));
    }
  }
}
