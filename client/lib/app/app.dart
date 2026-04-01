import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../core/data/content_repository.dart';
import '../core/network/dio_client.dart';
import '../core/network/session_store.dart';
import '../core/state/app_bloc.dart';
import '../core/style/app_theme.dart';
import '../features/auth/repository/auth_repository.dart';
import '../features/auth/service/auth_api_service.dart';
import 'routes.dart';

class NutrilisApp extends StatelessWidget {
  const NutrilisApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiRepositoryProvider(
      providers: [
        RepositoryProvider(create: (_) => SessionStore()),
        RepositoryProvider(
          create: (context) => DioClient(context.read<SessionStore>()),
        ),
        RepositoryProvider(
          create: (context) => ContentRepository(context.read<DioClient>()),
        ),
        RepositoryProvider(
          create: (context) => AuthApiService(context.read<DioClient>()),
        ),
        RepositoryProvider(
          create: (context) => AuthRepository(
            context.read<AuthApiService>(),
            context.read<SessionStore>(),
          ),
        ),
      ],
      child: BlocProvider(
        create: (_) => AppBloc(),
        child: MaterialApp(
          debugShowCheckedModeBanner: false,
          title: 'Nutrilis',
          theme: buildAppTheme(),
          initialRoute: AppRoutes.splash,
          onGenerateRoute: AppRoutes.onGenerateRoute,
        ),
      ),
    );
  }
}
