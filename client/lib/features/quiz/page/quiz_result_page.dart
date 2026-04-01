import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/data/content_models.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';
import '../../../core/style/app_colors.dart';

class QuizResultPage extends StatelessWidget {
  const QuizResultPage({
    super.key,
    required this.result,
  });

  final QuizResult result;

  @override
  Widget build(BuildContext context) {
    final locale = context.select((AppBloc bloc) => bloc.state.locale);
    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '测评结果' : 'Quiz Result'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            NutrilisSurface(
              child: Column(
                children: [
                  const Icon(Icons.check_circle_rounded, size: 68, color: AppColors.primary),
                  const SizedBox(height: 16),
                  Text(
                    result.result.resolve(locale),
                    style: Theme.of(context).textTheme.headlineSmall,
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    result.advice.resolve(locale),
                    style: Theme.of(context).textTheme.bodyLarge,
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () => Navigator.of(context).pushNamed(
                AppRoutes.recipes,
              ),
              child: Text(locale == AppLocale.zh ? '查看食谱' : 'View Recipes'),
            ),
            const SizedBox(height: 10),
            OutlinedButton(
              onPressed: () => Navigator.of(context).pushNamed(
                AppRoutes.therapy,
              ),
              child: Text(locale == AppLocale.zh ? '查看理疗' : 'View Therapy'),
            ),
            const Spacer(),
            AppDisclaimerCard(text: result.disclaimer.resolve(locale)),
          ],
        ),
      ),
    );
  }
}
