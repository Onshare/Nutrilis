import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/empty_placeholder.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';

class FavoritesPage extends StatelessWidget {
  const FavoritesPage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.select((AppBloc bloc) => bloc.state);
    final locale = state.locale;
    final favorites = state.favoriteIds.toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '收藏' : 'Favorites'),
      ),
      body: favorites.isEmpty
          ? EmptyPlaceholder(
              title: locale == AppLocale.zh ? '还没有收藏内容' : 'No favorites yet',
              subtitle: locale == AppLocale.zh
                  ? '在食谱或理疗详情页点击收藏后，这里会自动汇总。'
                  : 'Favorite recipes or therapies and they will appear here.',
            )
          : ListView(
              padding: const EdgeInsets.all(20),
              children: favorites
                  .map(
                    (id) => NutrilisSurface(
                      margin: const EdgeInsets.only(bottom: 12),
                      padding: EdgeInsets.zero,
                      child: ListTile(
                        onTap: () {
                          Navigator.of(context).pushNamed(
                            id.startsWith('therapy')
                                ? AppRoutes.therapyDetail
                                : AppRoutes.recipeDetail,
                            arguments: id,
                          );
                        },
                        leading: Icon(
                          id.startsWith('therapy')
                              ? Icons.spa_outlined
                              : Icons.ramen_dining_outlined,
                        ),
                        title: Text(_titleFor(id, locale)),
                        subtitle: Text(
                          id.startsWith('therapy')
                              ? (locale == AppLocale.zh ? '理疗收藏' : 'Saved therapy')
                              : (locale == AppLocale.zh ? '食谱收藏' : 'Saved recipe'),
                        ),
                        trailing: const Icon(Icons.chevron_right),
                      ),
                    ),
                  )
                  .toList(),
            ),
    );
  }

  String _titleFor(String id, AppLocale locale) {
    const names = <String, (String, String)>{
      'recipe-lily': ('百合马蹄羹', 'Lily Bulb Water Chestnut Soup'),
      'recipe-angelica': ('当归补血汤', 'Angelica Blood Nourishing Soup'),
      'therapy-hegu': ('合谷穴：春季排毒按摩', 'Hegu Acupressure for Spring Relief'),
      'therapy-moxa': ('艾灸调理：脾胃温养', 'Moxibustion for Warming the Spleen & Stomach'),
    };
    final match = names[id];
    if (match == null) {
      return id;
    }
    return locale == AppLocale.zh ? match.$1 : match.$2;
  }
}
