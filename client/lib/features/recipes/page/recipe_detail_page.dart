import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/style/app_colors.dart';

class RecipeDetailPage extends StatefulWidget {
  const RecipeDetailPage({
    super.key,
    required this.recipeId,
  });

  final String recipeId;

  @override
  State<RecipeDetailPage> createState() => _RecipeDetailPageState();
}

class _RecipeDetailPageState extends State<RecipeDetailPage> {
  late Future<RecipeDetail> _future;

  @override
  void initState() {
    super.initState();
    _future = context.read<ContentRepository>().fetchRecipeDetail(widget.recipeId);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);
    final favorites = context.select((AppBloc bloc) => bloc.state.favoriteIds);

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '食谱详情' : 'Recipe Detail'),
        actions: [
          IconButton(
            onPressed: () => context.read<AppBloc>().add(AppFavoriteToggled(widget.recipeId)),
            icon: Icon(
              favorites.contains(widget.recipeId) ? Icons.favorite : Icons.favorite_border,
              color: favorites.contains(widget.recipeId) ? AppColors.danger : null,
            ),
          ),
        ],
      ),
      body: FutureBuilder<RecipeDetail>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            if (snapshot.hasError) {
              return Center(child: Text(snapshot.error.toString()));
            }
            return const Center(child: CircularProgressIndicator());
          }

          final recipe = snapshot.data!;
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!mounted) {
              return;
            }
            context.read<AppBloc>().add(
                  AppHistoryRecorded(
                    HistoryEntry(
                      id: recipe.id,
                      title: recipe.title,
                      subtitle: recipe.summary,
                      route: '/recipe-detail',
                      iconKey: 'recipe',
                    ),
                  ),
                );
          });

          return ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
            children: [
              Container(
                height: 220,
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(28),
                ),
                child: const Center(
                  child: Icon(Icons.soup_kitchen_outlined, size: 76, color: AppColors.secondary),
                ),
              ),
              const SizedBox(height: 18),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: recipe.tags
                    .map((tag) => Chip(label: Text(tag.resolve(locale))))
                    .toList(),
              ),
              const SizedBox(height: 10),
              Text(recipe.title.resolve(locale), style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 8),
              Text(recipe.source.resolve(locale), style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.secondary)),
              const SizedBox(height: 16),
              _SectionCard(
                title: locale == AppLocale.zh ? '功效' : 'Benefits',
                body: recipe.effect.resolve(locale),
              ),
              _SectionCard(
                title: locale == AppLocale.zh ? '适用体质' : 'Suitable For',
                body: recipe.suitableFor.resolve(locale),
              ),
              _WarningCard(
                title: locale == AppLocale.zh ? '禁忌提示' : 'Contraindications',
                body: recipe.contraindications.resolve(locale),
              ),
              _ListCard(
                title: locale == AppLocale.zh ? '食材清单' : 'Ingredients',
                items: recipe.ingredients,
              ),
              _ListCard(
                title: locale == AppLocale.zh ? '步骤' : 'Steps',
                items: recipe.steps.map((step) => step.resolve(locale)).toList(),
              ),
              const SizedBox(height: 10),
              AppDisclaimerCard(text: recipe.disclaimer.resolve(locale)),
            ],
          );
        },
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return NutrilisSurface(
      margin: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          Text(body),
        ],
      ),
    );
  }
}

class _WarningCard extends StatelessWidget {
  const _WarningCard({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF7F7),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFF0D9D8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppColors.danger),
          ),
          const SizedBox(height: 8),
          Text(
            body,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.danger),
          ),
        ],
      ),
    );
  }
}

class _ListCard extends StatelessWidget {
  const _ListCard({
    required this.title,
    required this.items,
  });

  final String title;
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return NutrilisSurface(
      margin: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 10),
          ...items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 8, right: 10),
                    child: CircleAvatar(radius: 2, backgroundColor: AppColors.primary),
                  ),
                  Expanded(child: Text(item)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
