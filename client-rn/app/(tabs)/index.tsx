import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { BrandLogo } from '@/components/BrandLogo';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useAppStore } from '@/stores/useAppStore';
import { useHomeStore } from '@/stores/useHomeStore';
import type { BannerCardVO } from '@/models/vo/home.vo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 64;

/**
 * 首页 (养)
 * 对标 Flutter HomePage
 */
export default function HomeScreen() {
  const router = useRouter();
  const { locale, isZh, toggleLocale, t } = useLocale();
  const { status, payload, errorMessage, loadHome } = useHomeStore();
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  useEffect(() => {
    loadHome();
  }, [locale]);

  return (
    <BasePage
      loading={status === 'idle' || status === 'loading'}
      error={status === 'error' ? errorMessage : null}
      onRetry={loadHome}
    >
      {/* Header */}
      <View style={styles.header}>
        <BrandLogo compact />
        <TouchableOpacity onPress={toggleLocale} style={styles.langBtn}>
          <Text style={styles.langText}>{isZh ? 'EN' : '中文'}</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.body} />
        <TextInput
          style={styles.searchInput}
          placeholder={isZh ? '搜索食材、功效、节气养生' : 'Search recipes, effects, and seasonal care'}
          placeholderTextColor={Colors.body}
        />
      </View>

      {payload && (
        <>
          {/* Banners */}
          <View style={styles.section}>
            <View style={styles.bannerScroll}>
              {payload.banners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  onPress={() => router.push(banner.route as any)}
                />
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {payload.quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.7}
              >
                <NutrilisSurface padding={Spacing.xxl}>
                  <View style={styles.qaIcon}>
                    <Ionicons name="leaf-outline" size={22} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.qaTitle}>{action.title}</Text>
                    <Text style={styles.qaSubtitle}>{action.subtitle}</Text>
                  </View>
                </NutrilisSurface>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recommended */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isZh ? '推荐内容' : 'Recommended'}
            </Text>
            {payload.recommendedRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                onPress={() => router.push(`/recipes/${recipe.id}`)}
                activeOpacity={0.7}
              >
                <NutrilisSurface margin={14}>
                  <View style={styles.recipeRow}>
                    <View style={styles.recipeThumb}>
                      <Ionicons
                        name="restaurant-outline"
                        size={28}
                        color={Colors.secondary}
                      />
                    </View>
                    <View style={styles.recipeInfo}>
                      <Text style={styles.recipeTitle}>{recipe.title}</Text>
                      <Text style={styles.recipeSummary} numberOfLines={2}>
                        {recipe.summary}
                      </Text>
                      <Text style={styles.recipeSource}>{recipe.source}</Text>
                    </View>
                  </View>
                </NutrilisSurface>
              </TouchableOpacity>
            ))}
          </View>

          <DisclaimerCard text={payload.disclaimer} />
        </>
      )}
    </BasePage>
  );
}

function BannerCard({
  banner,
  onPress,
}: {
  banner: BannerCardVO;
  onPress: () => void;
}) {
  const colors =
    banner.id === 'quiz'
      ? [Colors.secondary, '#8C6C6C']
      : [Colors.primary, '#BED7B6'];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.bannerCard, { backgroundColor: colors[0] }]}>
        <Ionicons
          name={banner.id === 'quiz' ? 'heart-outline' : 'leaf-outline'}
          size={24}
          color="#fff"
        />
        <Text style={styles.bannerTitle}>{banner.title}</Text>
        <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  langBtn: {
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  langText: {
    ...Typography.titleMedium,
    color: Colors.secondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: 15,
    color: Colors.title,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    ...Typography.titleLarge,
    marginBottom: Spacing.lg,
  },
  bannerScroll: {
    gap: Spacing.lg,
  },
  bannerCard: {
    width: BANNER_WIDTH,
    padding: Spacing.xl,
    borderRadius: Radius.banner,
    marginBottom: Spacing.md,
  },
  bannerTitle: {
    ...Typography.headlineSmall,
    color: '#fff',
    fontWeight: '800',
    marginTop: Spacing.xl,
  },
  bannerSubtitle: {
    ...Typography.bodyMedium,
    color: '#ffffffeb',
    marginTop: 6,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  quickActionCard: {
    width: (SCREEN_WIDTH - 56) / 2,
  },
  qaIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  qaTitle: {
    ...Typography.titleMedium,
  },
  qaSubtitle: {
    ...Typography.bodySmall,
    marginTop: 4,
  },
  recipeRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  recipeThumb: {
    width: 68,
    height: 68,
    borderRadius: Radius.xxl,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    ...Typography.titleMedium,
  },
  recipeSummary: {
    ...Typography.bodyMedium,
    marginTop: 4,
  },
  recipeSource: {
    ...Typography.bodySmall,
    color: Colors.secondary,
    marginTop: 6,
  },
});
