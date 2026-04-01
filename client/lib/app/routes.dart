import 'package:flutter/material.dart';

import 'main_shell_page.dart';
import '../features/auth/page/auth_page.dart';
import '../features/auth/page/splash_page.dart';
import '../features/daily_care/page/daily_care_page.dart';
import '../features/favorites/page/favorites_page.dart';
import '../features/history/page/history_page.dart';
import '../features/quiz/page/quiz_page.dart';
import '../features/quiz/page/quiz_result_page.dart';
import '../features/recipes/page/recipe_detail_page.dart';
import '../features/settings/page/settings_page.dart';
import '../features/therapy/page/therapy_detail_page.dart';
import '../core/data/content_models.dart';

class AppRoutes {
  static const splash = '/splash';
  static const auth = '/auth';
  static const home = '/home';
  static const recipes = '/recipes';
  static const recipeDetail = '/recipe-detail';
  static const therapy = '/therapy';
  static const therapyDetail = '/therapy-detail';
  static const dailyCare = '/daily-care';
  static const quiz = '/quiz';
  static const quizResult = '/quiz-result';
  static const profile = '/profile';
  static const favorites = '/favorites';
  static const history = '/history';
  static const settings = '/settings';

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case splash:
        return MaterialPageRoute(builder: (_) => const SplashPage(), settings: routeSettings);
      case auth:
        return MaterialPageRoute(builder: (_) => const AuthPage(), settings: routeSettings);
      case home:
        return MaterialPageRoute(
          builder: (_) => const MainShellPage(initialIndex: 0),
          settings: routeSettings,
        );
      case recipes:
        return MaterialPageRoute(
          builder: (_) => const MainShellPage(initialIndex: 1),
          settings: routeSettings,
        );
      case recipeDetail:
        final recipeId = routeSettings.arguments as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => RecipeDetailPage(recipeId: recipeId),
          settings: routeSettings,
        );
      case therapy:
        return MaterialPageRoute(
          builder: (_) => const MainShellPage(initialIndex: 2),
          settings: routeSettings,
        );
      case therapyDetail:
        final therapyId = routeSettings.arguments as String? ?? '';
        return MaterialPageRoute(
          builder: (_) => TherapyDetailPage(therapyId: therapyId),
          settings: routeSettings,
        );
      case dailyCare:
        return MaterialPageRoute(builder: (_) => const DailyCarePage(), settings: routeSettings);
      case quiz:
        return MaterialPageRoute(builder: (_) => const QuizPage(), settings: routeSettings);
      case quizResult:
        final result = routeSettings.arguments! as QuizResult;
        return MaterialPageRoute(
          builder: (_) => QuizResultPage(result: result),
          settings: routeSettings,
        );
      case profile:
        return MaterialPageRoute(
          builder: (_) => const MainShellPage(initialIndex: 3),
          settings: routeSettings,
        );
      case favorites:
        return MaterialPageRoute(builder: (_) => const FavoritesPage(), settings: routeSettings);
      case history:
        return MaterialPageRoute(builder: (_) => const HistoryPage(), settings: routeSettings);
      case AppRoutes.settings:
        return MaterialPageRoute(builder: (_) => const SettingsPage(), settings: routeSettings);
      default:
        return MaterialPageRoute(builder: (_) => const SplashPage(), settings: routeSettings);
    }
  }
}
