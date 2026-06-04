import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { AppConstants } from '@/core/constants';
import { useLocale } from '@/core/i18n/useLocale';

/**
 * 设置页
 * 对标 Flutter SettingsPage
 */
export default function SettingsScreen() {
  const { isZh, toggleLocale } = useLocale();

  return (
    <BasePage>
      {/* Language */}
      <TouchableOpacity style={styles.row} onPress={toggleLocale} activeOpacity={0.7}>
        <Ionicons name="language-outline" size={22} color={Colors.title} />
        <Text style={styles.label}>{isZh ? '语言' : 'Language'}</Text>
        <Text style={styles.value}>
          {isZh ? '简体中文 / English' : 'English / 简体中文'}
        </Text>
      </TouchableOpacity>

      {/* Version */}
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={22} color={Colors.title} />
        <Text style={styles.label}>{isZh ? '版本信息' : 'Version'}</Text>
        <Text style={styles.value}>Nutrilis 1.0.0</Text>
      </View>

      {/* Policies & Disclaimer */}
      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <Ionicons name="shield-checkmark-outline" size={22} color={Colors.title} />
        <View style={styles.infoCol}>
          <Text style={styles.label}>
            {isZh ? '协议与免责声明' : 'Policies & Disclaimer'}
          </Text>
          <Text style={styles.subtitle}>
            {isZh
              ? '登录即代表同意平台协议与隐私说明。'
              : 'Signing in means you agree to the platform policies.'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.border} />
      </TouchableOpacity>

      {/* Disclaimer */}
      <View style={styles.disclaimerWrap}>
        <DisclaimerCard text={AppConstants.defaultDisclaimer} />
      </View>
    </BasePage>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.xxl,
    marginBottom: Spacing.md,
    gap: Spacing.md,
    minHeight: MIN_TOUCH_TARGET,
  },
  label: {
    ...Typography.bodyLarge,
    color: Colors.title,
    flex: 1,
  },
  value: {
    ...Typography.bodyMedium,
    color: Colors.body,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.body,
    marginTop: 2,
  },
  infoCol: {
    flex: 1,
  },
  disclaimerWrap: {
    marginTop: Spacing.xxl,
  },
});
