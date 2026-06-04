import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 浏览历史
 * 对标 Flutter HistoryPage
 */
export default function HistoryScreen() {
  const router = useRouter();
  const history = useAppStore((s) => s.history);
  const isEmpty = history.length === 0;

  return (
    <BasePage empty={isEmpty} emptyMessage="暂无浏览记录">
      {history.map((entry) => (
        <TouchableOpacity
          key={entry.id}
          onPress={() => router.push(entry.route as any)}
          activeOpacity={0.7}
        >
          <NutrilisSurface margin={14}>
            <View style={styles.row}>
            <View style={styles.iconWrap}>
            <Ionicons
                name={entry.iconKey === 'therapy' ? 'fitness-outline' : 'restaurant-outline'}
                  size={20}
                  color={entry.iconKey === 'therapy' ? '#5AC8FA' : Colors.accent}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.entryTitle}>{entry.title}</Text>
                <Text style={styles.entrySubtitle}>{entry.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.border} />
            </View>
          </NutrilisSurface>
        </TouchableOpacity>
      ))}
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
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: { flex: 1 },
  entryTitle: { ...Typography.titleMedium },
  entrySubtitle: { ...Typography.bodySmall, marginTop: 2 },
});
