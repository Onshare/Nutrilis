import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useAppStore } from '@/stores/useAppStore';
import { ContentRepo } from '@/repos/ContentRepo';
import { RecipesUseCase } from '@/usecases/RecipesUseCase';
import type { RecipeDetailVO } from '@/models/vo/recipe.vo';

/**
 * 食谱详情页
 * 对标 Flutter RecipeDetailPage
 */
export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { locale } = useLocale();
  const isZh = locale === 'zh';
  const favoriteIds = useAppStore((s) => s.favoriteIds);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addHistory = useAppStore((s) => s.addHistory);

  const [detail, setDetail] = useState<RecipeDetailVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const usecase = new RecipesUseCase(new ContentRepo());
      const vo = await usecase.getRecipeDetail(id, locale, favoriteIds);
      setDetail(vo);
      addHistory({
        id: vo.id,
        title: vo.title,
        subtitle: vo.source,
        route: `/recipes/${vo.id}`,
        iconKey: 'recipe',
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
          {/* Title */}
          <Text style={styles.title}>{detail.title}</Text>

          {/* Tags */}
          <View style={styles.tags}>
            {detail.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Source */}
          <Text style={styles.source}>{isZh ? '来源: ' : 'Source: '}{detail.source}</Text>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '概述' : 'Summary'}</Text>
            <Text style={styles.body}>{detail.summary}</Text>
          </View>

          {/* Effect */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '功效' : 'Effect'}</Text>
            <Text style={styles.body}>{detail.effect}</Text>
          </View>

          {/* Suitable For */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '适用体质' : 'Suitable For'}</Text>
            <Text style={styles.body}>{detail.suitableFor}</Text>
          </View>

          {/* Contraindications */}
          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>
              <Ionicons name="warning-outline" size={16} color={Colors.danger} />{' '}
              {isZh ? '禁忌' : 'Contraindications'}
            </Text>
            <Text style={styles.warningBody}>{detail.contraindications}</Text>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '食材清单' : 'Ingredients'}</Text>
            {detail.ingredients.map((ing, i) => (
              <Text key={i} style={styles.ingredient}>• {ing}</Text>
            ))}
          </View>

          {/* Steps */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{isZh ? '制作步骤' : 'Steps'}</Text>
            {detail.steps.map((step, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepNum}>
                  <Text style={styles.stepNumText}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Favorite */}
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => toggleFavorite(detail.id, { title: detail.title, subtitle: detail.source, type: 'recipe' })}
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
  content: {
    gap: Spacing.md,
  },
  title: {
    ...Typography.headlineSmall,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.primary + '1F',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  tagText: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
  source: {
    ...Typography.bodySmall,
    color: Colors.secondary,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.titleMedium,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.bodyLarge,
  },
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
  warningBody: {
    ...Typography.bodyMedium,
    color: Colors.danger,
  },
  ingredient: {
    ...Typography.bodyMedium,
    marginBottom: 4,
    paddingLeft: Spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: Colors.surface,
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    ...Typography.bodyMedium,
    flex: 1,
  },
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
  favText: {
    ...Typography.titleMedium,
    color: Colors.secondary,
  },
});
