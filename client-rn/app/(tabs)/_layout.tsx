import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/core/theme';
import { useAppStore } from '@/stores/useAppStore';

/**
 * 主 Tab 导航布局
 * 对标 Flutter MainShellPage
 */
export default function TabLayout() {
  const locale = useAppStore((s) => s.locale);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#BFC4CC',
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: '#F0F0F0',
          height: 82,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: locale === 'zh' ? '养' : 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarLabel: locale === 'zh' ? '补' : 'Diet',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="therapy"
        options={{
          tabBarLabel: locale === 'zh' ? '修' : 'Therapy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="fitness-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: locale === 'zh' ? '我的' : 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
