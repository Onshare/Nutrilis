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
import '../bloc/therapy_bloc.dart';

class TherapyPage extends BaseBlocPage<TherapyBloc, TherapyState> {
  const TherapyPage({
    super.key,
    this.showBottomNav = true,
  });

  final bool showBottomNav;

  @override
  TherapyBloc createBloc(BuildContext context) {
    return TherapyBloc(context.read<ContentRepository>());
  }

  @override
  void initBloc(BuildContext context, TherapyBloc bloc) {
    bloc.add(const TherapyLoaded());
  }

  @override
  Widget buildPage(BuildContext context) {
    return _TherapyView(showBottomNav: showBottomNav);
  }
}

class _TherapyView extends StatelessWidget {
  const _TherapyView({
    required this.showBottomNav,
  });

  final bool showBottomNav;

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return Scaffold(
      body: BlocBuilder<TherapyBloc, TherapyState>(
        builder: (context, state) {
          if (state.status == LoadStatus.loading || state.status == LoadStatus.initial) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.status == LoadStatus.failure) {
            return Center(child: Text(state.errorMessage ?? '理疗内容加载失败'));
          }
          final hero = state.items.isNotEmpty ? state.items.first : null;

          return SafeArea(
            bottom: false,
            child: ListView(
              padding: const EdgeInsets.fromLTRB(12, 8, 12, 24),
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(0, 8, 0, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        locale == AppLocale.zh ? '身心修护' : 'Mind & Body',
                        style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                              fontWeight: FontWeight.w900,
                              color: const Color(0xFF2E3440),
                            ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        locale == AppLocale.zh ? 'MIND & BODY RECOVERY' : 'MIND & BODY RECOVERY',
                        style: Theme.of(context).textTheme.labelMedium?.copyWith(
                              letterSpacing: 1.8,
                              color: const Color(0xFF9EA4AF),
                              fontWeight: FontWeight.w800,
                            ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 18),
                SizedBox(
                  height: 40,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _TherapyCategoryChip(label: locale == AppLocale.zh ? '全部' : 'All', selected: true),
                      _TherapyCategoryChip(label: locale == AppLocale.zh ? '拔罐' : 'Cupping'),
                      _TherapyCategoryChip(label: locale == AppLocale.zh ? '艾灸' : 'Moxa'),
                      _TherapyCategoryChip(label: locale == AppLocale.zh ? '刮痧' : 'Gua Sha'),
                      _TherapyCategoryChip(label: locale == AppLocale.zh ? '推拿' : 'Tuina'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                if (hero != null)
                  GestureDetector(
                    onTap: () => Navigator.of(context).pushNamed(
                      AppRoutes.therapyDetail,
                      arguments: hero.id,
                    ),
                    child: _TherapyHeroCard(
                      title: locale == AppLocale.zh ? '正念冥想：春季静心' : 'Mindfulness: Spring',
                      cta: locale == AppLocale.zh ? '立即开始 · 15min' : 'Start Now · 15min',
                    ),
                  ),
                const SizedBox(height: 20),
                _SectionTitle(
                  label: locale == AppLocale.zh ? '修复部位' : 'Focus Areas',
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: _FocusAreaCard(
                        title: locale == AppLocale.zh ? '眼部舒缓' : 'Eye Comfort',
                        subtitle: locale == AppLocale.zh ? '缓解视疲劳' : 'Relieve Eye Strain',
                        icon: Icons.remove_red_eye_rounded,
                        background: const Color(0xFFEAF3FF),
                        iconColor: const Color(0xFF5A8FF7),
                        onTap: hero == null
                            ? null
                            : () => Navigator.of(context).pushNamed(
                                  AppRoutes.therapyDetail,
                                  arguments: hero.id,
                                ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: _FocusAreaCard(
                        title: locale == AppLocale.zh ? '颈椎呵护' : 'Neck Care',
                        subtitle: locale == AppLocale.zh ? '松懈肌肉' : 'Relax Muscles',
                        icon: Icons.accessibility_rounded,
                        background: const Color(0xFFF2E8FF),
                        iconColor: const Color(0xFFAF6EF7),
                        onTap: state.items.length > 1
                            ? () => Navigator.of(context).pushNamed(
                                  AppRoutes.therapyDetail,
                                  arguments: state.items[1].id,
                                )
                            : null,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 22),
                _SectionTitle(
                  label: locale == AppLocale.zh ? '推荐方案' : 'Recommended',
                ),
                const SizedBox(height: 12),
                ...state.items.map(
                  (therapy) => GestureDetector(
                    onTap: () => Navigator.of(context).pushNamed(
                      AppRoutes.therapyDetail,
                      arguments: therapy.id,
                    ),
                    child: _TherapyPlanCard(
                      title: therapy.title.resolve(locale),
                      subtitle: therapy.summary.resolve(locale),
                      tag: locale == AppLocale.zh ? '难度: 初级' : 'Beginner',
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: showBottomNav
          ? AppBottomNav(
              selectedIndex: 2,
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

class _TherapyCategoryChip extends StatelessWidget {
  const _TherapyCategoryChip({
    required this.label,
    this.selected = false,
  });

  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
      decoration: BoxDecoration(
        color: selected ? const Color(0xFF5AC8FA) : const Color(0xFFF7F8FB),
        borderRadius: BorderRadius.circular(14),
        boxShadow: selected
            ? const [
                BoxShadow(
                  color: Color(0x335AC8FA),
                  blurRadius: 12,
                  offset: Offset(0, 4),
                ),
              ]
            : null,
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w800,
          color: selected ? Colors.white : const Color(0xFFA3A9B4),
        ),
      ),
    );
  }
}

class _TherapyHeroCard extends StatelessWidget {
  const _TherapyHeroCard({
    required this.title,
    required this.cta,
  });

  final String title;
  final String cta;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 160,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        gradient: const LinearGradient(
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
          colors: [Color(0xFF4E5A60), Color(0xFFB28F73), Color(0xFFE5C79D)],
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 18,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Stack(
          children: [
            Positioned(
              right: -12,
              top: 18,
              child: Container(
                width: 150,
                height: 150,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  shape: BoxShape.circle,
                ),
              ),
            ),
            Positioned(
              right: 18,
              bottom: 12,
              child: Icon(
                Icons.self_improvement,
                size: 110,
                color: Colors.white.withOpacity(0.50),
              ),
            ),
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                    colors: [
                      Colors.black.withOpacity(0.58),
                      Colors.transparent,
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'FEATURED',
                    style: TextStyle(
                      color: Color(0xFF5AC8FA),
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 2.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w900,
                        ),
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Container(
                        width: 34,
                        height: 34,
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.18),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.play_arrow_rounded, color: Colors.white),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        cta,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({
    required this.label,
  });

  final String label;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
            color: const Color(0xFF8D97A6),
            fontWeight: FontWeight.w900,
          ),
    );
  }
}

class _FocusAreaCard extends StatelessWidget {
  const _FocusAreaCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.background,
    required this.iconColor,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final IconData icon;
  final Color background;
  final Color iconColor;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(28),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xFFFDFDFD),
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFFF0F0F0)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: background,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(height: 18),
            Text(
              title,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: const Color(0xFF3B4250),
                    fontWeight: FontWeight.w800,
                  ),
            ),
            const SizedBox(height: 6),
            Text(
              subtitle,
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: const Color(0xFF9CA3AF),
                  ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TherapyPlanCard extends StatelessWidget {
  const _TherapyPlanCard({
    required this.title,
    required this.subtitle,
    required this.tag,
  });

  final String title;
  final String subtitle;
  final String tag;

  @override
  Widget build(BuildContext context) {
    return NutrilisSurface(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(14),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFF6FBFF), Color(0xFFE7EEF9)],
              ),
            ),
            child: const Icon(
              Icons.front_hand_rounded,
              color: Color(0xFFD99190),
              size: 42,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF394150),
                      ),
                ),
                const SizedBox(height: 6),
                Text(
                  subtitle,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: const Color(0xFF9AA2AE),
                        fontStyle: FontStyle.italic,
                      ),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF8FF),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    tag,
                    style: const TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF5AC8FA),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
