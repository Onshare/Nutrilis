import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/app_bottom_nav.dart';
import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../features/auth/repository/auth_repository.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({
    super.key,
    this.showBottomNav = true,
  });

  final bool showBottomNav;

  @override
  Widget build(BuildContext context) {
    final state = context.select((AppBloc bloc) => bloc.state);
    final locale = state.locale;
    final session = state.session;

    return Scaffold(
      body: SafeArea(
        bottom: false,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(8, 12, 8, 24),
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(4, 4, 4, 14),
              child: Text(
                locale == AppLocale.zh ? '我的' : 'Profile',
                style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      fontWeight: FontWeight.w900,
                    ),
              ),
            ),
            NutrilisSurface(
              padding: const EdgeInsets.all(18),
              child: Row(
                children: [
                  Container(
                    width: 78,
                    height: 78,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFAF7F2),
                      borderRadius: BorderRadius.circular(22),
                    ),
                    child: const Icon(Icons.account_circle_rounded, size: 42, color: Color(0xFF2D2D2D)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          session?.displayName ?? 'Nutrilis 5345',
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                                fontWeight: FontWeight.w900,
                                color: const Color(0xFF3B4250),
                              ),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          session?.identifier ?? '15545435345',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                color: const Color(0xFF8D96A5),
                              ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            _ProfileItem(
              title: locale == AppLocale.zh ? '我的收藏' : 'Favorites',
              icon: Icons.favorite_outline_rounded,
              onTap: () => Navigator.of(context).pushNamed(AppRoutes.favorites),
            ),
            _ProfileItem(
              title: locale == AppLocale.zh ? '浏览历史' : 'History',
              icon: Icons.history_rounded,
              onTap: () => Navigator.of(context).pushNamed(AppRoutes.history),
            ),
            _ProfileItem(
              title: locale == AppLocale.zh ? '设置' : 'Settings',
              icon: Icons.settings_rounded,
              onTap: () => Navigator.of(context).pushNamed(AppRoutes.settings),
            ),
            const SizedBox(height: 18),
            SizedBox(
              height: 48,
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: Color(0xFFF0E7DE)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                  foregroundColor: const Color(0xFF7C504C),
                ),
                onPressed: () async {
                  final refreshToken = session?.refreshToken;
                  if (refreshToken != null && refreshToken.isNotEmpty) {
                    await context.read<AuthRepository>().logout(refreshToken);
                  } else {
                    context.read<AuthRepository>().clearSession();
                  }
                  if (!context.mounted) {
                    return;
                  }
                  context.read<AppBloc>().add(const AppSignedOut());
                  Navigator.of(context).pushNamedAndRemoveUntil(
                    AppRoutes.auth,
                    (route) => false,
                  );
                },
                child: Text(
                  locale == AppLocale.zh ? '退出登录' : 'Sign Out',
                  style: const TextStyle(fontWeight: FontWeight.w800),
                ),
              ),
            ),
            const SizedBox(height: 16),
            const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
          ],
        ),
      ),
      bottomNavigationBar: showBottomNav
          ? AppBottomNav(
              selectedIndex: 3,
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

class _ProfileItem extends StatelessWidget {
  const _ProfileItem({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final IconData icon;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return NutrilisSurface(
      margin: const EdgeInsets.only(bottom: 12),
      padding: EdgeInsets.zero,
      child: ListTile(
        onTap: onTap,
        minTileHeight: 76,
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 2),
        leading: Icon(icon, size: 24, color: const Color(0xFF3F444D)),
        title: Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: Color(0xFF434957),
          ),
        ),
        trailing: const Icon(Icons.chevron_right_rounded, color: Color(0xFF3F444D)),
      ),
    );
  }
}
