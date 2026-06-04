import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BasePage } from '@/components/BasePage';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { useLocale } from '@/core/i18n/useLocale';
import { useAppStore } from '@/stores/useAppStore';
import { AuthRepo } from '@/repos/AuthRepo';
import { sessionStore } from '@/core/network/sessionStore';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: { zh: string; en: string };
  route?: string;
  danger?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'heart-outline', label: { zh: '我的收藏', en: 'Favorites' }, route: '/favorites' },
  { icon: 'time-outline', label: { zh: '浏览历史', en: 'History' }, route: '/history' },
  { icon: 'chatbubble-ellipses-outline', label: { zh: '意见反馈', en: 'Feedback' } },
  { icon: 'settings-outline', label: { zh: '设置', en: 'Settings' }, route: '/settings' },
  { icon: 'log-out-outline', label: { zh: '退出登录', en: 'Logout' }, danger: true },
];

/**
 * 个人中心
 * 对标 Flutter ProfilePage
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { locale, isZh, toggleLocale } = useLocale();
  const session = useAppStore((s) => s.session);
  const clearSession = useAppStore((s) => s.clearSession);

  const handleLogout = async () => {
    try {
      const refreshToken = session?.refreshToken;
      if (refreshToken) {
        await new AuthRepo().logout(refreshToken);
      }
    } catch {
      // ignore server errors during logout
    } finally {
      await sessionStore.clear();
      clearSession();
      router.replace('/(auth)/login');
    }
  };

  return (
    <BasePage>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={32} color={Colors.surface} />
        </View>
        <Text style={styles.name}>
          {session?.displayName ?? (isZh ? '未登录' : 'Not logged in')}
        </Text>
        {session?.identifier && (
          <Text style={styles.identifier}>{session.identifier}</Text>
        )}
      </View>

      {/* Language Toggle */}
      <TouchableOpacity style={styles.langRow} onPress={toggleLocale} activeOpacity={0.7}>
        <Ionicons name="language-outline" size={22} color={Colors.title} />
        <Text style={styles.langLabel}>语言 / Language</Text>
        <Text style={styles.langValue}>{isZh ? '中文' : 'English'}</Text>
      </TouchableOpacity>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              if (item.route) {
                router.push(item.route as any);
              } else if (item.danger) {
                handleLogout();
              }
            }}
            activeOpacity={0.6}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={item.danger ? Colors.danger : Colors.title}
            />
            <Text
              style={[
                styles.menuLabel,
                item.danger && { color: Colors.danger },
              ]}
            >
              {isZh ? item.label.zh : item.label.en}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.border} />
          </TouchableOpacity>
        ))}
      </View>
    </BasePage>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    ...Typography.titleLarge,
  },
  identifier: {
    ...Typography.bodySmall,
    color: Colors.body,
    marginTop: 4,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.card,
    padding: Spacing.xxl,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  langLabel: {
    ...Typography.bodyLarge,
    color: Colors.title,
    flex: 1,
  },
  langValue: {
    ...Typography.bodyMedium,
    color: Colors.primary,
    fontWeight: '600',
  },
  menu: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
    minHeight: MIN_TOUCH_TARGET,
  },
  menuLabel: {
    ...Typography.bodyLarge,
    color: Colors.title,
    flex: 1,
  },
});
