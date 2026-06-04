import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography, Spacing } from '@/core/theme';
import { AppConstants } from '@/core/constants';

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, compact && styles.iconCompact]}>
        {/* N 字母变形为草本新芽的抽象图形 */}
        <Text style={[styles.iconText, compact && styles.iconTextCompact]}>N</Text>
      </View>
      {!compact && (
        <View style={styles.textGroup}>
          <Text style={styles.appName}>{AppConstants.appName}</Text>
          <Text style={styles.subtitle}>{AppConstants.appSubtitle}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCompact: {
    width: 34,
    height: 34,
    borderRadius: 10,
  },
  iconText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.surface,
  },
  iconTextCompact: {
    fontSize: 17,
  },
  textGroup: {
    marginLeft: Spacing.md,
  },
  appName: {
    ...Typography.titleLarge,
    color: Colors.title,
  },
  subtitle: {
    ...Typography.bodySmall,
    color: Colors.body,
    marginTop: 2,
  },
});
