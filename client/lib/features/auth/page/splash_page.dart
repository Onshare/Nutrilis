import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/brand_logo.dart';
import '../../../core/style/app_colors.dart';
import '../../../core/state/app_bloc.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({super.key});

  @override
  State<SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<SplashPage> {
  @override
  void initState() {
    super.initState();
    unawaited(
      Future<void>.delayed(const Duration(milliseconds: 1400), () {
        if (!mounted) {
          return;
        }
        final session = context.read<AppBloc>().state.session;
        Navigator.of(context).pushReplacementNamed(
          session == null ? AppRoutes.auth : AppRoutes.home,
        );
      }),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [AppColors.background, Color(0xFFE8F1E3)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: const Center(
          child: BrandLogo(),
        ),
      ),
    );
  }
}
