import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/empty_placeholder.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';

class HistoryPage extends StatelessWidget {
  const HistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.select((AppBloc bloc) => bloc.state);
    final locale = state.locale;

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '浏览历史' : 'History'),
      ),
      body: state.history.isEmpty
          ? EmptyPlaceholder(
              title: locale == AppLocale.zh ? '暂无浏览历史' : 'No history yet',
              subtitle: locale == AppLocale.zh
                  ? '查看食谱或理疗后会自动记录在这里。'
                  : 'Viewed recipes and therapies will appear here.',
            )
          : ListView(
              padding: const EdgeInsets.all(20),
              children: state.history
                  .map(
                    (entry) => NutrilisSurface(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: EdgeInsets.zero,
                      child: ListTile(
                        onTap: () {
                          Navigator.of(context).pushNamed(
                            entry.iconKey == 'therapy'
                                ? AppRoutes.therapyDetail
                                : AppRoutes.recipeDetail,
                            arguments: entry.id,
                          );
                        },
                        leading: Icon(
                          entry.iconKey == 'therapy'
                              ? Icons.spa_outlined
                              : Icons.ramen_dining_outlined,
                        ),
                        title: Text(entry.title.resolve(locale)),
                        subtitle: Text(entry.subtitle.resolve(locale)),
                        trailing: const Icon(Icons.chevron_right),
                      ),
                    ),
                  )
                  .toList(),
            ),
    );
  }
}
