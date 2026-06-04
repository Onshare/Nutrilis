import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useQuizStore } from '@/stores/useQuizStore';
import { useLocale } from '@/core/i18n/useLocale';

/**
 * 测评结果页
 * 对标 Flutter QuizResultPage
 */
export default function QuizResultScreen() {
  const router = useRouter();
  const { isZh } = useLocale();
  const result = useQuizStore((s) => s.result);
  const resultStatus = useQuizStore((s) => s.resultStatus);

  return (
    <BasePage
      loading={resultStatus === 'loading'}
      showDisclaimer
      disclaimerText={result?.disclaimer}
    >
      {result && (
        <View style={styles.content}>
          {/* Icon */}
          <Ionicons
            name="checkmark-circle"
            size={68}
            color={Colors.primary}
            style={styles.icon}
          />

          <Text style={styles.label}>{isZh ? '你的体质类型' : 'Your Constitution Type'}</Text>
          <Text style={styles.resultText}>{result.result}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>{isZh ? '养生建议' : 'Health Advice'}</Text>
          <Text style={styles.advice}>{result.advice}</Text>

          {/* Navigation buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/(tabs)/recipes')}
              activeOpacity={0.7}
            >
              <Ionicons name="restaurant-outline" size={20} color={Colors.surface} />
              <Text style={styles.primaryBtnText}>{isZh ? '查看食谱推荐' : 'View Recipes'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/(tabs)/therapy')}
              activeOpacity={0.7}
            >
              <Ionicons name="fitness-outline" size={20} color={Colors.secondary} />
              <Text style={styles.secondaryBtnText}>{isZh ? '查看理疗方案' : 'View Therapy'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </BasePage>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: Spacing.xxl,
  },
  icon: {
    alignSelf: 'center',
    marginBottom: Spacing.xxl,
  },
  label: {
    ...Typography.bodyLarge,
    color: Colors.body,
    marginBottom: Spacing.sm,
  },
  resultText: {
    ...Typography.headlineMedium,
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xxl,
  },
  advice: {
    ...Typography.bodyLarge,
    lineHeight: 24,
  },
  buttons: {
    marginTop: Spacing.xxxl,
    gap: Spacing.md,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  primaryBtnText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  secondaryBtnText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '700',
  },
});
