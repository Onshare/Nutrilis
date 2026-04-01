import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/data/content_models.dart';
import '../../../core/data/content_repository.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/style/app_colors.dart';

class TherapyDetailPage extends StatefulWidget {
  const TherapyDetailPage({
    super.key,
    required this.therapyId,
  });

  final String therapyId;

  @override
  State<TherapyDetailPage> createState() => _TherapyDetailPageState();
}

class _TherapyDetailPageState extends State<TherapyDetailPage> {
  late Future<TherapyDetail> _future;

  @override
  void initState() {
    super.initState();
    _future = context.read<ContentRepository>().fetchTherapyDetail(widget.therapyId);
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);
    final favorites = context.select((AppBloc bloc) => bloc.state.favoriteIds);

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '理疗详情' : 'Therapy Detail'),
        actions: [
          IconButton(
            onPressed: () => context.read<AppBloc>().add(AppFavoriteToggled(widget.therapyId)),
            icon: Icon(
              favorites.contains(widget.therapyId) ? Icons.favorite : Icons.favorite_border,
              color: favorites.contains(widget.therapyId) ? AppColors.danger : null,
            ),
          ),
        ],
      ),
      body: FutureBuilder<TherapyDetail>(
        future: _future,
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            if (snapshot.hasError) {
              return Center(child: Text(snapshot.error.toString()));
            }
            return const Center(child: CircularProgressIndicator());
          }

          final therapy = snapshot.data!;
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (!mounted) {
              return;
            }
            context.read<AppBloc>().add(
                  AppHistoryRecorded(
                    HistoryEntry(
                      id: therapy.id,
                      title: therapy.title,
                      subtitle: therapy.category,
                      route: '/therapy-detail',
                      iconKey: 'therapy',
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
                  gradient: LinearGradient(
                    colors: [
                      AppColors.background,
                      AppColors.primary.withOpacity(0.16),
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.circular(28),
                ),
                child: const Center(
                  child: Icon(Icons.spa_outlined, size: 76, color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                therapy.category.resolve(locale),
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: AppColors.secondary),
              ),
              const SizedBox(height: 8),
              Text(therapy.title.resolve(locale), style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 16),
              _SectionCard(
                title: locale == AppLocale.zh ? '原理' : 'Principle',
                body: therapy.principle.resolve(locale),
              ),
              _SectionCard(
                title: locale == AppLocale.zh ? '适宜情况' : 'Suitable Cases',
                body: therapy.suitableFor.resolve(locale),
              ),
              _WarningCard(
                title: locale == AppLocale.zh ? '禁忌人群' : 'Cautions',
                body: therapy.contraindications.resolve(locale),
              ),
              _SectionCard(
                title: locale == AppLocale.zh ? '注意事项' : 'Notes',
                body: therapy.notes.resolve(locale),
              ),
              _SectionCard(
                title: locale == AppLocale.zh ? '科普来源' : 'Source',
                body: therapy.source.resolve(locale),
              ),
              AppDisclaimerCard(text: therapy.disclaimer.resolve(locale)),
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
