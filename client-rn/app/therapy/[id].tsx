import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useAppStore } from '@/stores/useAppStore';
import { ContentRepo } from '@/repos/ContentRepo';
import { TherapyUseCase } from '@/usecases/TherapyUseCase';
import type { TherapyDetailVO } from '@/models/vo/therapy.vo';

/**
 * 理疗详情页
 * 对标 Flutter TherapyDetailPage
 */
export default function TherapyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLocale();
  const isZh = locale === 'zh';
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addHistory = useAppStore((s) => s.addHistory);

  const [detail, setDetail] = useState<TherapyDetailVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const usecase = new TherapyUseCase(new ContentRepo());
      const vo = await usecase.getTherapyDetail(id, locale, favoriteIds);
      setDetail(vo);
      addHistory({
        id: vo.id,
        title: vo.title,
        subtitle: vo.source,
        route: `/therapy/${vo.id}`,
        iconKey: 'therapy',
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '详情加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [id, locale, favoriteIds]);

  return (
    <BasePage
      loading={loading}
      error={error}
      onRetry={loadDetail}
      showDisclaimer
      disclaimerText={detail?.disclaimer}
    >
      {detail && (
        <View style={styles.content}>
          <Text style={styles.title}>{detail.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{detail.category}</Text>
          </View>
          <Text style={styles.source}>{isZh ? '来源: ' : 'Source: '}{detail.source}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '原理' : 'Principle'}</Text>
            <Text style={styles.body}>{detail.principle}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '适宜情况' : 'Suitable Cases'}</Text>
            <Text style={styles.body}>{detail.suitableFor}</Text>
          </View>

          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>
              <Ionicons name="warning-outline" size={16} color={Colors.danger} />{' '}
              {isZh ? '禁忌人群' : 'Cautions'}
            </Text>
            <Text style={styles.warningBody}>{detail.contraindications}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '注意事项' : 'Notes'}</Text>
            <Text style={styles.body}>{detail.notes}</Text>
          </View>

          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(detail.id, { title: detail.title, subtitle: detail.source, type: 'therapy' })}
            activeOpacity={0.7}
          >
            <Ionicons
              name={detail.isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={detail.isFavorited ? Colors.danger : Colors.secondary}
            />
            <Text style={styles.favText}>
              {detail.isFavorited ? '已收藏' : '收藏'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </BasePage>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  title: { ...Typography.headlineSmall },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accent + '33',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  source: { ...Typography.bodySmall, color: Colors.secondary },
  section: { marginTop: Spacing.lg },
  sectionTitle: { ...Typography.titleMedium, marginBottom: Spacing.sm },
  body: { ...Typography.bodyLarge },
  warningSection: {
    backgroundColor: Colors.danger + '0D',
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  warningTitle: {
    ...Typography.titleMedium,
    color: Colors.danger,
    marginBottom: Spacing.sm,
  },
  warningBody: { ...Typography.bodyMedium, color: Colors.danger },
  favBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xxl,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
  },
  favText: { ...Typography.titleMedium, color: Colors.secondary },
});
