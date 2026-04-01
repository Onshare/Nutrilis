import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/app_bottom_nav.dart';
import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/base/base_bloc_page.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/state/load_status.dart';
import '../../../core/style/app_colors.dart';
import '../bloc/recipes_bloc.dart';

class RecipesPage extends BaseBlocPage<RecipesBloc, RecipesState> {
  const RecipesPage({
    super.key,
    this.showBottomNav = true,
  });

  final bool showBottomNav;

  @override
  RecipesBloc createBloc(BuildContext context) {
    return RecipesBloc(context.read<ContentRepository>());
  }

  @override
  void initBloc(BuildContext context, RecipesBloc bloc) {
    bloc.add(const RecipesLoaded());
  }

  @override
  Widget buildPage(BuildContext context) {
    return _RecipesView(showBottomNav: showBottomNav);
  }
}

class _RecipesView extends StatelessWidget {
  const _RecipesView({
    required this.showBottomNav,
  });

  final bool showBottomNav;

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '食谱滋补' : 'Recipe Nourishment'),
      ),
      body: BlocBuilder<RecipesBloc, RecipesState>(
        builder: (context, state) {
          if (state.status == LoadStatus.loading || state.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.status == LoadStatus.failure) {
            return Center(child: Text(state.errorMessage ?? '食谱加载失败'));
          }
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            children: [
              TextField(
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search),
                  hintText: locale == AppLocale.zh
                      ? '搜索食谱、体质、场景'
                      : 'Search recipes, constitutions, or scenarios',
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  '体质',
                  '季节',
                  '场景',
                  '功效',
                ].map((item) => Chip(label: Text(locale == AppLocale.zh ? item : _enTag(item)))).toList(),
              ),
              const SizedBox(height: 18),
              ...state.items.map(
                (recipe) => GestureDetector(
                  onTap: () => Navigator.of(context).pushNamed(
                    AppRoutes.recipeDetail,
                    arguments: recipe.id,
                  ),
                  child: NutrilisSurface(
                    margin: const EdgeInsets.only(bottom: 14),
                    child: Row(
                      children: [
                        Container(
                          width: 72,
                          height: 72,
                          decoration: BoxDecoration(
                            color: AppColors.background,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(Icons.ramen_dining_outlined, color: AppColors.secondary),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(recipe.title.resolve(locale), style: Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 4),
                              Text(recipe.summary.resolve(locale), maxLines: 2, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 6),
                              Text(
                                recipe.source.resolve(locale),
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.secondary),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
            ],
          );
        },
      ),
      bottomNavigationBar: showBottomNav
          ? AppBottomNav(
              selectedIndex: 1,
              onDestinationSelected: (_) {},
              homeLabel: locale == AppLocale.zh ? '养' : 'Home',
              recipesLabel: locale == AppLocale.zh ? '补' : 'Diet',
              therapyLabel: locale == AppLocale.zh ? '修' : 'Therapy',
              profileLabel: locale == AppLocale.zh ? '我的' : 'Profile',
            )
          : null,
    );
  }

  String _enTag(String zh) {
    return switch (zh) {
      '体质' => 'Constitution',
      '季节' => 'Season',
      '场景' => 'Scene',
      '功效' => 'Effect',
      _ => zh,
    };
  }
}
