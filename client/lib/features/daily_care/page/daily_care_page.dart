import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/base/base_bloc_page.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/state/load_status.dart';
import '../../../core/style/app_colors.dart';
import '../bloc/daily_care_bloc.dart';

class DailyCarePage extends BaseBlocPage<DailyCareBloc, DailyCareState> {
  const DailyCarePage({super.key});

  @override
  DailyCareBloc createBloc(BuildContext context) {
    return DailyCareBloc(context.read<ContentRepository>());
  }

  @override
  void initBloc(BuildContext context, DailyCareBloc bloc) {
    bloc.add(const DailyCareLoaded());
  }

  @override
  Widget buildPage(BuildContext context) {
    return const _DailyCareView();
  }
}

class _DailyCareView extends StatelessWidget {
  const _DailyCareView();

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '日常养护' : 'Daily Care'),
      ),
      body: BlocBuilder<DailyCareBloc, DailyCareState>(
        builder: (context, state) {
          if (state.status == LoadStatus.loading || state.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.status == LoadStatus.failure) {
            return Center(child: Text(state.errorMessage ?? '日常养护加载失败'));
          }
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            children: [
              ...state.items.map(
                (item) => NutrilisSurface(
                  margin: const EdgeInsets.only(bottom: 14),
                  child: Row(
                    children: [
                      Container(
                        width: 58,
                        height: 58,
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: const Icon(Icons.wb_sunny_outlined, color: AppColors.primary),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item.title.resolve(locale), style: Theme.of(context).textTheme.titleMedium),
                            const SizedBox(height: 4),
                            Text(item.summary.resolve(locale)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
            ],
          );
        },
      ),
    );
  }
}
