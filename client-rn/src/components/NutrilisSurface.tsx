import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow } from '@/core/theme';

interface NutrilisSurfaceProps {
  children: React.ReactNode;
  margin?: ViewStyle['margin'];
  padding?: number;
}

export function NutrilisSurface({
  children,
  margin = 0,
  padding = 18,
}: NutrilisSurfaceProps) {
  return (
    <View
      style={[
        styles.card,
        { margin, padding },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
});
