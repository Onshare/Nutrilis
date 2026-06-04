import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { DisclaimerCard } from '@/components/DisclaimerCard';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useRecipesStore } from '@/stores/useRecipesStore';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 食谱列表页 (补)
 * 对标 Flutter RecipesPage
 */
export default function RecipesScreen() {
  const router = useRouter();
  const { locale, isZh, t } = useLocale();
  const { status, items, errorMessage, loadRecipes } = useRecipesStore();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const favoriteIds = useAppStore((s) => s.favoriteIds);

  useEffect(() => {
    loadRecipes();
  }, [locale, favoriteIds]);

  const tags = ['体质', '季节', '场景', '功效'];
  const enTags = ['Constitution', 'Season', 'Scene', 'Effect'];

  return (
    <BasePage
      loading={status === 'idle' || status === 'loading'}
      error={status === 'error' ? errorMessage : null}
      onRetry={loadRecipes}
    >
      {/* Search */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={Colors.body} />
        <TextInput
          style={styles.searchInput}
          placeholder={isZh ? '搜索食谱、体质、场景' : 'Search recipes, constitutions, or scenarios'}
          placeholderTextColor={Colors.body}
        />
      </View>

      {/* Tags */}
      <View style={styles.tags}>
        {tags.map((tag, i) => (
          <View key={tag} style={styles.chip}>
            <Text style={styles.chipText}>{isZh ? tag : enTags[i]}</Text>
          </View>
        ))}
      </View>

      {/* Recipe List */}
      {items.map((recipe) => (
        <TouchableOpacity
          key={recipe.id}
          onPress={() => router.push(`/recipes/${recipe.id}`)}
          activeOpacity={0.7}
        >
          <NutrilisSurface margin={14}>
            <View style={styles.recipeRow}>
              <View style={styles.recipeThumb}>
                <Ionicons name="restaurant-outline" size={28} color={Colors.secondary} />
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeSummary} numberOfLines={2}>
                  {recipe.summary}
                </Text>
                <Text style={styles.recipeSource}>{recipe.source}</Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleFavorite(recipe.id)}
                hitSlop={12}
              >
                <Ionicons
                  name={recipe.isFavorited ? 'heart' : 'heart-outline'}
                  size={22}
                  color={recipe.isFavorited ? Colors.danger : Colors.border}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.xxl,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: 15,
    color: Colors.title,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  chip: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: 10,
    paddingVertical: Spacing.sm,
  },
  chipText: {
    ...Typography.bodySmall,
    color: Colors.body,
    fontWeight: '600',
  },
  recipeRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    alignItems: 'center',
  },
  recipeThumb: {
    width: 72,
    height: 72,
    borderRadius: Spacing.xl,
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
