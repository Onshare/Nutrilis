import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../components/app_disclaimer_card.dart';
import '../../../components/nutrilis_surface.dart';
import '../../../core/serialization/localized_text.dart';
import '../../../core/state/app_bloc.dart';

class SettingsPage extends StatelessWidget {
  const SettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    final state = context.select((AppBloc bloc) => bloc.state);
    final locale = state.locale;

    return Scaffold(
      appBar: AppBar(
        title: Text(locale == AppLocale.zh ? '设置' : 'Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 24),
        children: [
          NutrilisSurface(
            padding: EdgeInsets.zero,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              onTap: () => context.read<AppBloc>().add(const AppLocaleToggled()),
              leading: const Icon(Icons.language_outlined),
              title: Text(locale == AppLocale.zh ? '语言切换' : 'Language'),
              subtitle: Text(locale == AppLocale.zh ? '简体中文 / English' : 'English / 简体中文'),
              trailing: const Icon(Icons.chevron_right),
            ),
          ),
          NutrilisSurface(
            padding: EdgeInsets.zero,
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: const Icon(Icons.info_outline),
              title: Text(locale == AppLocale.zh ? '版本信息' : 'Version'),
              subtitle: const Text('Nutrilis 1.0.0'),
            ),
          ),
          NutrilisSurface(
            padding: EdgeInsets.zero,
            margin: const EdgeInsets.only(bottom: 16),
            child: ListTile(
              leading: const Icon(Icons.verified_user_outlined),
              title: Text(locale == AppLocale.zh ? '协议与免责声明' : 'Policies & Disclaimer'),
              subtitle: Text(
                locale == AppLocale.zh
                    ? '登录即代表同意平台协议与隐私说明。'
                    : 'Signing in means you agree to the platform policies.',
              ),
            ),
          ),
          const AppDisclaimerCard(text: '本内容仅为养生科普，不替代医疗诊断与治疗方案'),
        ],
      ),
    );
  }
}
