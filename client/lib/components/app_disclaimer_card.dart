import 'package:flutter/material.dart';

import '../core/constants/app_constants.dart';
import '../core/style/app_colors.dart';

class AppDisclaimerCard extends StatelessWidget {
  const AppDisclaimerCard({
    super.key,
    required this.text,
  });

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Text(
        text.isEmpty ? AppConstants.defaultDisclaimer : text,
        textAlign: TextAlign.center,
        style: Theme.of(context).textTheme.bodySmall,
      ),
    );
  }
}
