import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/base/base_bloc_page.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/state/load_status.dart';
import '../bloc/quiz_bloc.dart';

class QuizPage extends BaseBlocPage<QuizBloc, QuizState> {
  const QuizPage({super.key});

  @override
  QuizBloc createBloc(BuildContext context) {
    return QuizBloc(context.read<ContentRepository>());
  }

  @override
  void initBloc(BuildContext context, QuizBloc bloc) {
    bloc.add(const QuizLoaded());
  }

  @override
  Widget buildPage(BuildContext context) {
    return const _QuizView();
  }
}

class _QuizView extends StatelessWidget {
  const _QuizView();

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return BlocConsumer<QuizBloc, QuizState>(
      listener: (context, state) {
        if (state.submitStatus == LoadStatus.success && state.result != null) {
          Navigator.of(context).pushNamed(
            AppRoutes.quizResult,
            arguments: state.result,
          );
        }
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(SnackBar(content: Text(state.errorMessage!)));
        }
      },
      builder: (context, state) {
        return Scaffold(
          appBar: AppBar(
            title: Text(locale == AppLocale.zh ? '体质自测' : 'Constitution Quiz'),
          ),
          body: Builder(
            builder: (context) {
              if (state.loadStatus == LoadStatus.loading || state.loadStatus == LoadStatus.initial) {
                return const Center(child: CircularProgressIndicator());
              }
              if (state.loadStatus == LoadStatus.failure) {
                return Center(child: Text(state.errorMessage ?? '测评加载失败'));
              }
              return ListView(
                padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
                children: [
                  Text(
                    locale == AppLocale.zh
                        ? '请根据最近两周的状态完成 8-10 题体质自测。'
                        : 'Answer the questionnaire based on your recent two weeks.',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 18),
                  ...state.questions.map(
                    (question) => NutrilisSurface(
                      margin: const EdgeInsets.only(bottom: 14),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            question.question.resolve(locale),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: List.generate(question.options.length, (index) {
                              final selected = state.answers[question.id] == index;
                              return ChoiceChip(
                                label: Text(question.options[index].resolve(locale)),
                                selected: selected,
                                onSelected: (_) {
                                  context.read<QuizBloc>().add(
                                        QuizAnswerSelected(
                                          questionId: question.id,
                                          optionIndex: index,
                                        ),
                                      );
                                },
                              );
                            }),
                          ),
                        ],
                      ),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: state.submitStatus == LoadStatus.loading
                        ? null
                        : () => context.read<QuizBloc>().add(const QuizSubmitted()),
                    child: Text(
                      state.submitStatus == LoadStatus.loading
                          ? (locale == AppLocale.zh ? '提交中...' : 'Submitting...')
                          : (locale == AppLocale.zh ? '查看结果' : 'View Result'),
                    ),
                  ),
                  const SizedBox(height: 14),
                  const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
                ],
              );
            },
          ),
        );
      },
    );
  }
}
