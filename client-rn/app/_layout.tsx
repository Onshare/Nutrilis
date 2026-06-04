import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { sessionStore } from '@/core/network/sessionStore';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 根布局 — 应用入口 Provider 层
 */
export default function RootLayout() {
  useEffect(() => {
    hydrateSession();
  }, []);

  async function hydrateSession() {
    await sessionStore.restore();
    const accessToken = sessionStore.accessToken;
    const refreshToken = sessionStore.refreshToken;
    if (accessToken && refreshToken) {
      useAppStore.getState().setSession({
        accessToken,
        refreshToken,
        displayName: '',
        identifier: '',
      });
    }
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="recipes/[id]"
          options={{ headerShown: true, title: '食谱详情' }}
        />
        <Stack.Screen
          name="therapy/[id]"
          options={{ headerShown: true, title: '理疗详情' }}
        />
        <Stack.Screen
          name="daily-care"
          options={{ headerShown: true, title: '日常养护' }}
        />
        <Stack.Screen
          name="quiz"
          options={{ headerShown: true, title: '体质自测' }}
        />
        <Stack.Screen
          name="quiz-result"
          options={{ headerShown: true, title: '测评结果' }}
        />
        <Stack.Screen
          name="favorites"
          options={{ headerShown: true, title: '我的收藏' }}
        />
        <Stack.Screen
          name="history"
          options={{ headerShown: true, title: '浏览历史' }}
        />
        <Stack.Screen
          name="settings"
          options={{ headerShown: true, title: '设置' }}
        />
      </Stack>
    </>
  );
}
