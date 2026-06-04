import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '@/core/theme';

interface EmptyPlaceholderProps {
  icon?: keyof typeof Ionicons.glyphMap;
  message?: string;
}

export function EmptyPlaceholder({
  icon = 'leaf-outline',
  message = '暂无内容',
}: EmptyPlaceholderProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={48} color={Colors.border} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  message: {
    ...Typography.bodyLarge,
    color: Colors.body,
    textAlign: 'center',
  },
});
