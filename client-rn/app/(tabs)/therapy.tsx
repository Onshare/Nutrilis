import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useTherapyStore } from '@/stores/useTherapyStore';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 理疗列表页 (修)
 * 对标 Flutter TherapyPage
 */
export default function TherapyScreen() {
  const router = useRouter();
  const { locale, isZh } = useLocale();
  const { status, items, errorMessage, loadTherapies } = useTherapyStore();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  useEffect(() => {
    loadTherapies();
  }, [locale, favoriteIds]);

  return (
    <BasePage
      loading={status === 'idle' || status === 'loading'}
      error={status === 'error' ? errorMessage : null}
      onRetry={loadTherapies}
    >
      {items.map((therapy) => (
        <TouchableOpacity
          key={therapy.id}
          onPress={() => router.push(`/therapy/${therapy.id}`)}
          activeOpacity={0.7}
        >
          <NutrilisSurface margin={14}>
            <View style={styles.row}>
              <View style={styles.thumb}>
                <Ionicons name="fitness-outline" size={28} color={Colors.secondary} />
              </View>
              <View style={styles.info}>
                <View style={styles.topRow}>
                  <Text style={styles.title}>{therapy.title}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{therapy.category}</Text>
                  </View>
                </View>
                <Text style={styles.summary} numberOfLines={2}>
                  {therapy.summary}
                </Text>
                <Text style={styles.source}>{therapy.source}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(therapy.id)}
                hitSlop={12}
              >
                <Ionicons
                  name={therapy.isFavorited ? 'heart' : 'heart-outline'}
                  size={22}
                  color={therapy.isFavorited ? Colors.danger : Colors.border}
                />
              </TouchableOpacity>
            </View>
          </NutrilisSurface>
        </TouchableOpacity>
      ))}

      <DisclaimerCard text="本内容仅为养生科普，不替代医疗诊断与治疗方案" />
    </BasePage>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: Spacing.xl,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  title: {
    ...Typography.titleMedium,
  },
  categoryBadge: {
    backgroundColor: Colors.accent + '33',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  summary: {
    ...Typography.bodyMedium,
    marginTop: 4,
  },
  source: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    marginTop: 6,
  },
});
