import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/core/theme';

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selectedIcon: keyof typeof Ionicons.glyphMap;
  selectedColor: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '养',
    icon: 'home-outline',
    selectedIcon: 'home',
    selectedColor: Colors.primary,
  },
  {
    label: '补',
    icon: 'restaurant-outline',
    selectedIcon: 'restaurant',
    selectedColor: Colors.accent,
  },
  {
    label: '修',
    icon: 'fitness-outline',
    selectedIcon: 'fitness',
    selectedColor: '#5AC8FA',
  },
  {
    label: '我的',
    icon: 'person-circle-outline',
    selectedIcon: 'person-circle',
    selectedColor: '#4CD964',
  },
];

interface BottomNavProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
  labels?: string[];
}

export function BottomNav({
  selectedIndex,
  onSelect,
  labels,
}: BottomNavProps) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item, index) => {
        const selected = selectedIndex === index;
        const color = selected ? item.selectedColor : '#BFC4CC';
        const label = labels?.[index] ?? item.label;

        return (
          <TouchableOpacity
            key={index}
            style={styles.navItem}
            onPress={() => onSelect(index)}
            activeOpacity={0.6}
          >
            <View
              style={[
                styles.iconWrapper,
                selected && { backgroundColor: item.selectedColor + '1A' },
              ]}
            >
              <Ionicons
                name={selected ? item.selectedIcon : item.icon}
                size={22}
                color={color}
              />
              <Text
                style={[
                  styles.label,
                  { color },
                  selected && styles.labelSelected,
                ]}
              >
                {label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.sm,
    paddingBottom: 10,
    paddingHorizontal: Spacing.md,
    height: 82,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
  },
  label: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '500',
  },
  labelSelected: {
    fontWeight: '700',
  },
});
