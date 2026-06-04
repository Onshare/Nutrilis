import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 我的收藏
 * 对标 Flutter FavoritesPage
 */
export default function FavoritesScreen() {
  const router = useRouter();
  const { isZh } = useLocale();
  const favoriteItems = useAppStore((s) => s.favoriteItems);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const items = Array.from(favoriteItems.values());
  const isEmpty = items.length === 0;

  return (
    <BasePage
      empty={isEmpty}
      emptyMessage={isZh ? '还没有收藏内容，去首页看看吧' : 'No favorites yet. Go explore!'}
    >
      {items.map((item) => {
        const isRecipe = item.type === 'recipe';
        const route = isRecipe ? `/recipes/${item.id}` : `/therapy/${item.id}`;
        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(route as any)}
            activeOpacity={0.7}
          >
            <NutrilisSurface margin={14}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Ionicons
                    name={isRecipe ? 'restaurant-outline' : 'fitness-outline'}
                    size={24}
                    color={isRecipe ? Colors.accent : '#5AC8FA'}
                  />
                </View>
                <View style={styles.info}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemSubtitle} numberOfLines={1}>
                    {isRecipe
                      ? (isZh ? '食谱收藏' : 'Saved recipe')
                      : (isZh ? '理疗收藏' : 'Saved therapy')}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleFavorite(item.id)}
                  hitSlop={12}
                >
                  <Ionicons name="heart" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </NutrilisSurface>
          </TouchableOpacity>
        );
      })}
    </BasePage>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.titleMedium,
  },
  itemSubtitle: {
    ...Typography.bodySmall,
    color: Colors.body,
    marginTop: 2,
  },
});
