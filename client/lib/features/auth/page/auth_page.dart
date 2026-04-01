import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../app/routes.dart';
import '../../../components/brand_logo.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/base/base_bloc_page.dart';
import '../../../core/state/load_status.dart';
import '../../../core/style/app_colors.dart';
import '../bloc/auth_bloc.dart';
import '../model/auth_models.dart';
import '../repository/auth_repository.dart';

class AuthPage extends BaseBlocPage<AuthBloc, AuthState> {
  const AuthPage({super.key});

  @override
  AuthBloc createBloc(BuildContext context) {
    return AuthBloc(
      repository: context.read<AuthRepository>(),
      appBloc: context.read(),
    );
  }

  @override
  Widget buildPage(BuildContext context) {
    return const _AuthView();
  }
}

class _AuthView extends StatefulWidget {
  const _AuthView();

  @override
  State<_AuthView> createState() => _AuthViewState();
}

class _AuthViewState extends State<_AuthView> {
  late final TextEditingController _identifierController;
  late final TextEditingController _otpController;

  @override
  void initState() {
    super.initState();
    _identifierController = TextEditingController();
    _otpController = TextEditingController();
  }

  @override
  void dispose() {
    _identifierController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return BlocConsumer<AuthBloc, AuthState>(
      listener: (context, state) {
        if (state.errorMessage != null && state.errorMessage!.isNotEmpty) {
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(SnackBar(content: Text(state.errorMessage!)));
          context.read<AuthBloc>().add(const AuthErrorConsumed());
        }

        if (state.justSignedIn) {
          Navigator.of(context).pushNamedAndRemoveUntil(
            AppRoutes.home,
            (route) => false,
          );
          context.read<AuthBloc>().add(const AuthNavigationConsumed());
        }
      },
      builder: (context, state) {
        final isPhone = state.channel == AuthChannel.phone;
        return Scaffold(
          body: SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(24, 28, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Center(child: BrandLogo()),
                  const SizedBox(height: 28),
                  Text(
                    '登录 / 注册',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '仅支持手机号或邮箱验证码登录，首次登录自动创建账号。',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 24),
                  NutrilisSurface(
                    child: Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppColors.muted,
                            borderRadius: BorderRadius.circular(18),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: _AuthChannelTab(
                                  label: '手机号',
                                  selected: isPhone,
                                  onTap: () => context.read<AuthBloc>().add(
                                        const AuthChannelChanged(AuthChannel.phone),
                                      ),
                                ),
                              ),
                              Expanded(
                                child: _AuthChannelTab(
                                  label: '邮箱',
                                  selected: !isPhone,
                                  onTap: () => context.read<AuthBloc>().add(
                                        const AuthChannelChanged(AuthChannel.email),
                                      ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18),
                        TextField(
                          controller: _identifierController,
                          keyboardType:
                              isPhone ? TextInputType.phone : TextInputType.emailAddress,
                          onChanged: (value) => context.read<AuthBloc>().add(
                                AuthIdentifierChanged(value),
                              ),
                          decoration: InputDecoration(
                            labelText: isPhone ? '手机号' : '邮箱地址',
                            hintText: isPhone ? '请输入手机号' : '请输入邮箱',
                            prefixIcon: Icon(
                              isPhone ? Icons.phone_iphone_outlined : Icons.mail_outline,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: state.sendStatus == LoadStatus.loading
                                ? null
                                : () {
                                    context.read<AuthBloc>().add(const AuthOtpRequested());
                                  },
                            child: Text(
                              state.sendStatus == LoadStatus.loading
                                  ? '发送中...'
                                  : (state.canSubmitOtp ? '重新发送验证码' : '发送验证码'),
                            ),
                          ),
                        ),
                        if (state.canSubmitOtp) ...[
                          const SizedBox(height: 18),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: AppColors.background,
                              borderRadius: BorderRadius.circular(18),
                            ),
                            child: Text(
                              '验证码已发送至 ${state.ticket!.maskedTarget}',
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppColors.secondary,
                                  ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            controller: _otpController,
                            maxLength: 6,
                            keyboardType: TextInputType.number,
                            onChanged: (value) => context.read<AuthBloc>().add(
                                  AuthOtpChanged(value),
                                ),
                            decoration: const InputDecoration(
                              labelText: '验证码',
                              hintText: '请输入 6 位验证码',
                              prefixIcon: Icon(Icons.lock_outline),
                              counterText: '',
                            ),
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: state.verifyStatus == LoadStatus.loading
                                  ? null
                                  : () {
                                      context.read<AuthBloc>().add(const AuthOtpSubmitted());
                                    },
                              child: Text(
                                state.verifyStatus == LoadStatus.loading
                                    ? '登录中...'
                                    : '登录并进入首页',
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _AuthChannelTab extends StatelessWidget {
  const _AuthChannelTab({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 160),
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: selected ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Center(
          child: Text(
            label,
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: selected ? AppColors.title : AppColors.body,
                ),
          ),
        ),
      ),
    );
  }
}
