import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../components/app_bottom_nav.dart';
import '../core/serialization/localized_text.dart';
import '../core/state/app_bloc.dart';
import '../features/home/page/home_page.dart';
import '../features/profile/page/profile_page.dart';
import '../features/recipes/page/recipes_page.dart';
import '../features/therapy/page/therapy_page.dart';

class MainShellPage extends StatefulWidget {
  const MainShellPage({
    super.key,
    required this.initialIndex,
  });

  final int initialIndex;

  @override
  State<MainShellPage> createState() => _MainShellPageState();
}

class _MainShellPageState extends State<MainShellPage> {
  late int _currentIndex = widget.initialIndex;

  late final List<Widget> _pages = const [
    HomePage(showBottomNav: false),
    RecipesPage(showBottomNav: false),
    TherapyPage(showBottomNav: false),
    ProfilePage(showBottomNav: false),
  ];

  @override
  void didUpdateWidget(covariant MainShellPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialIndex != widget.initialIndex) {
      _currentIndex = widget.initialIndex;
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _pages,
      ),
      bottomNavigationBar: AppBottomNav(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          if (index == _currentIndex) {
            return;
          }
          setState(() {
            _currentIndex = index;
          });
        },
        homeLabel: locale == AppLocale.zh ? '养' : 'Home',
        recipesLabel: locale == AppLocale.zh ? '补' : 'Diet',
        therapyLabel: locale == AppLocale.zh ? '修' : 'Therapy',
        profileLabel: locale == AppLocale.zh ? '我的' : 'Profile',
      ),
    );
  }
}
