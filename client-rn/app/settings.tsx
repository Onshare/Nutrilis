import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
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
        <Text style={styles.label}>语言 / Language</Text>
        <Text style={styles.value}>{isZh ? '中文' : 'English'}</Text>
      </TouchableOpacity>

      {/* Version */}
      <View style={styles.row}>
        <Ionicons name="information-circle-outline" size={22} color={Colors.title} />
        <Text style={styles.label}>版本</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      {/* Disclaimer */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>免责声明</Text>
        <Text style={styles.body}>{AppConstants.defaultDisclaimer}</Text>
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
  section: {
    marginTop: Spacing.xxl,
    padding: Spacing.xxl,
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.bodyMedium,
    lineHeight: 20,
  },
});
