import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Spacing } from '@/core/theme';

interface DisclaimerCardProps {
  text: string;
}

export function DisclaimerCard({ text }: DisclaimerCardProps) {
  return (
    <View style={styles.card}>
      <Ionicons name="information-circle-outline" size={18} color={Colors.danger} />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.danger + '0D',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  text: {
    ...Typography.bodySmall,
    color: Colors.danger,
    flex: 1,
    lineHeight: 18,
  },
});
