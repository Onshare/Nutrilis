import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useDailyCareStore } from '@/stores/useDailyCareStore';

/**
 * 日常养护专题页
 * 对标 Flutter DailyCarePage
 */
export default function DailyCareScreen() {
  const { locale, isZh } = useLocale();
  const { status, topics, errorMessage, loadDailyCare } = useDailyCareStore();

  useEffect(() => {
    loadDailyCare();
  }, [locale]);

  return (
    <BasePage
      loading={status === 'idle' || status === 'loading'}
      error={status === 'error' ? errorMessage : null}
      onRetry={loadDailyCare}
    >
      {topics.map((topic) => (
        <NutrilisSurface key={topic.id} margin={14}>
          <Text style={styles.title}>{topic.title}</Text>
          <Text style={styles.summary}>{topic.summary}</Text>
        </NutrilisSurface>
      ))}

      <DisclaimerCard text="本内容仅为养生科普，不替代医疗诊断与治疗方案" />
    </BasePage>
  );
}

const styles = StyleSheet.create({
  title: { ...Typography.titleMedium, marginBottom: Spacing.sm },
  summary: { ...Typography.bodyMedium },
});
