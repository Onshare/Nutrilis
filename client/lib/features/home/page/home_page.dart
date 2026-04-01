import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/app_bottom_nav.dart';
import '../../../components/app_disclaimer_card.dart';
import '../../../components/brand_logo.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/base/base_bloc_page.dart';
import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/state/load_status.dart';
import '../../../core/style/app_colors.dart';
import '../bloc/home_bloc.dart';

class HomePage extends BaseBlocPage<HomeBloc, HomeState> {
  const HomePage({
    super.key,
    this.showBottomNav = true,
  });

  final bool showBottomNav;

  @override
  HomeBloc createBloc(BuildContext context) {
    return HomeBloc(context.read<ContentRepository>());
  }

  @override
  void initBloc(BuildContext context, HomeBloc bloc) {
    bloc.add(const HomeLoaded());
  }

  @override
  Widget buildPage(BuildContext context) {
    return _HomeView(showBottomNav: showBottomNav);
  }
}

class _HomeView extends StatelessWidget {
  const _HomeView({
    required this.showBottomNav,
  });

  final bool showBottomNav;

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return Scaffold(
      appBar: AppBar(
        title: const BrandLogo(compact: true),
        actions: [
          TextButton(
            onPressed: () => context.read<AppBloc>().add(const AppLocaleToggled()),
            child: Text(locale == AppLocale.zh ? 'EN' : '中文'),
          ),
        ],
      ),
      body: BlocBuilder<HomeBloc, HomeState>(
        builder: (context, state) {
          if (state.status == LoadStatus.loading || state.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.status == LoadStatus.failure || state.payload == null) {
            return Center(
              child: Text(state.errorMessage ?? '首页内容加载失败'),
            );
          }

          final payload = state.payload!;
          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            children: [
              TextField(
                decoration: InputDecoration(
                  prefixIcon: const Icon(Icons.search),
                  hintText: locale == AppLocale.zh
                      ? '搜索食材、功效、节气养生'
                      : 'Search recipes, effects, and seasonal care',
                ),
              ),
              const SizedBox(height: 22),
              SizedBox(
                height: 164,
                child: ListView.separated(
                  scrollDirection: Axis.horizontal,
                  itemCount: payload.banners.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 16),
                  itemBuilder: (context, index) {
                    final banner = payload.banners[index];
                    return _BannerCard(
                      banner: banner,
                      locale: locale,
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: payload.quickActions.length,
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.3,
                ),
                itemBuilder: (context, index) {
                  final action = payload.quickActions[index];
                  return GestureDetector(
                    onTap: () => Navigator.of(context).pushNamed(action.route),
                    child: NutrilisSurface(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 42,
                            height: 42,
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.12),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.eco_outlined, color: AppColors.primary),
                          ),
                          const Spacer(),
                          Text(
                            action.title.resolve(locale),
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            action.subtitle.resolve(locale),
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 28),
              Text(
                locale == AppLocale.zh ? '推荐内容' : 'Recommended',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 14),
              ...payload.recommendedRecipes.map(
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
                          width: 68,
                          height: 68,
                          decoration: BoxDecoration(
                            color: AppColors.background,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: const Icon(
                            Icons.soup_kitchen_outlined,
                            color: AppColors.secondary,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                recipe.title.resolve(locale),
                                style: Theme.of(context).textTheme.titleMedium,
                              ),
                              const SizedBox(height: 4),
                              Text(
                                recipe.summary.resolve(locale),
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 6),
                              Text(
                                recipe.source.resolve(locale),
                                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                      color: AppColors.secondary,
                                    ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              AppDisclaimerCard(text: payload.disclaimer.resolve(locale)),
            ],
          );
        },
      ),
      bottomNavigationBar: showBottomNav
          ? AppBottomNav(
              selectedIndex: 0,
              onDestinationSelected: (_) {},
              homeLabel: locale == AppLocale.zh ? '养' : 'Home',
              recipesLabel: locale == AppLocale.zh ? '补' : 'Diet',
              therapyLabel: locale == AppLocale.zh ? '修' : 'Therapy',
              profileLabel: locale == AppLocale.zh ? '我的' : 'Profile',
            )
          : null,
    );
  }
}

class _BannerCard extends StatelessWidget {
  const _BannerCard({
    required this.banner,
    required this.locale,
  });

  final BannerCard banner;
  final AppLocale locale;

  @override
  Widget build(BuildContext context) {
    final colors = banner.id == 'quiz'
        ? [AppColors.secondary, const Color(0xFF8C6C6C)]
        : [AppColors.primary, const Color(0xFFBED7B6)];

    return GestureDetector(
      onTap: () => Navigator.of(context).pushNamed(banner.route),
      child: Container(
        width: 300,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(colors: colors),
          borderRadius: BorderRadius.circular(28),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(
              banner.id == 'quiz' ? Icons.monitor_heart_outlined : Icons.eco_outlined,
              color: Colors.white,
            ),
            const Spacer(),
            Text(
              banner.title.resolve(locale),
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: 6),
            Text(
              banner.subtitle.resolve(locale),
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.white.withOpacity(0.92),
                  ),
            ),
          ],
        ),
      ),
    );
  }
}
