import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { BrandLogo } from '@/components/BrandLogo';
import { Colors } from '@/core/theme';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 启动页
 * 对标 Flutter SplashPage
 * - 展示品牌 Logo
 * - 1.4s 后根据登录态跳转
 */
export default function SplashScreen() {
  const router = useRouter();
  const session = useAppStore((s) => s.session);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }, 1400);

    return () => clearTimeout(timer);
  }, [session, router]);

  return (
    <View style={styles.container}>
      <BrandLogo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
