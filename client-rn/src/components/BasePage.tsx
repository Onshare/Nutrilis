import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Spacing, Radius, MIN_TOUCH_TARGET } from '@/core/theme';
import { Typography } from '@/core/theme/typography';
import { AppConstants } from '@/core/constants';

/**
 * BasePage — 所有页面的可编程第一个节点
 *
 * 封装通用页面能力:
 * - SafeAreaView + ScrollView 包裹
 * - 统一 Loading / Error (含重试) / Empty 三态
 * - 底部免责声明 (详情页)
 */
export interface BasePageProps {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  scrollable?: boolean;
  showDisclaimer?: boolean;
  disclaimerText?: string;
  safeArea?: boolean;
  children: React.ReactNode;
}

export function BasePage({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = '暂无内容',
  onRetry,
  scrollable = true,
  showDisclaimer = false,
  disclaimerText = AppConstants.defaultDisclaimer,
  safeArea = true,
  children,
}: BasePageProps) {
  const content = renderContent();

  function renderContent() {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          {onRetry && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={onRetry}
              activeOpacity={0.7}
            >
              <Text style={styles.retryText}>重试</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (empty) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      );
    }

    const inner = (
      <>
        {children}
        {showDisclaimer && (
          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>{disclaimerText}</Text>
          </View>
        )}
      </>
    );

    if (scrollable) {
      return (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {inner}
        </ScrollView>
      );
    }

    return <View style={styles.staticContent}>{inner}</View>;
  }

  if (safeArea) {
    return <SafeAreaView style={styles.safeArea}>{content}</SafeAreaView>;
  }

  return <View style={styles.safeArea}>{content}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  staticContent: {
    flex: 1,
    padding: Spacing.xl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  errorText: {
    ...Typography.bodyLarge,
    color: Colors.danger,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  retryText: {
    color: Colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
  emptyText: {
    ...Typography.bodyLarge,
    color: Colors.body,
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: Spacing.xxl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  disclaimerText: {
    ...Typography.bodySmall,
    color: Colors.body,
    textAlign: 'center',
    lineHeight: 18,
  },
});
