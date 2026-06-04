import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '@/components/BrandLogo';
import { NutrilisSurface } from '@/components/NutrilisSurface';
import { Colors, Typography, Radius, Spacing, MIN_TOUCH_TARGET } from '@/core/theme';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * OTP 登录/注册页面 (手机号 + 邮箱, 单页流程)
 * 对标 Flutter AuthPage
 */
export default function LoginScreen() {
  const router = useRouter();
  const {
    channel,
    identifier,
    otp,
    sendStatus,
    verifyStatus,
    ticket,
    errorMessage,
    justSignedIn,
    canSubmitOtp,
    setChannel,
    setIdentifier,
    setOtp,
    sendOtp,
    verifyOtp,
    consumeError,
    consumeNavigation,
  } = useAuthStore();

  const isPhone = channel === 'phone';

  // 登录成功跳转
  useEffect(() => {
    if (justSignedIn) {
      router.replace('/(tabs)');
      consumeNavigation();
    }
  }, [justSignedIn, router, consumeNavigation]);

  // 登录页
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.scroll}>
        <View style={styles.logoWrap}>
          <BrandLogo />
        </View>

        <Text style={styles.title}>登录 / 注册</Text>
        <Text style={styles.subtitle}>
          仅支持手机号或邮箱验证码登录，首次登录自动创建账号。
        </Text>

        {/* Error banner */}
        {errorMessage ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={consumeError} hitSlop={8}>
              <Ionicons name="close" size={18} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        ) : null}

        <NutrilisSurface>
          {/* 渠道切换 */}
          <View style={styles.channelTabs}>
            <TouchableOpacity
              style={[styles.channelTab, isPhone && styles.channelTabActive]}
              onPress={() => setChannel('phone')}
              activeOpacity={0.7}
            >
              <Text style={[styles.channelText, isPhone && styles.channelTextActive]}>
                手机号
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.channelTab, !isPhone && styles.channelTabActive]}
              onPress={() => setChannel('email')}
              activeOpacity={0.7}
            >
              <Text style={[styles.channelText, !isPhone && styles.channelTextActive]}>
                邮箱
              </Text>
            </TouchableOpacity>
          </View>

          {/* 手机号/邮箱输入 */}
          <TextInput
            style={styles.input}
            placeholder={isPhone ? '请输入手机号' : '请输入邮箱'}
            placeholderTextColor={Colors.body}
            keyboardType={isPhone ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />

          {/* 发送验证码 */}
          <TouchableOpacity
            style={[styles.button, sendStatus === 'loading' && styles.buttonDisabled]}
            onPress={sendOtp}
            disabled={sendStatus === 'loading'}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>
              {sendStatus === 'loading'
                ? '发送中...'
                : canSubmitOtp()
                  ? '重新发送验证码'
                  : '发送验证码'}
            </Text>
          </TouchableOpacity>

          {/* OTP 输入区 */}
          {canSubmitOtp() && (
            <>
              <View style={styles.sentNotice}>
                <Text style={styles.sentText}>
                  验证码已发送至 {ticket?.maskedTarget}
                </Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="请输入 6 位验证码"
                placeholderTextColor={Colors.body}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />

              <TouchableOpacity
                style={[styles.button, verifyStatus === 'loading' && styles.buttonDisabled]}
                onPress={verifyOtp}
                disabled={verifyStatus === 'loading'}
                activeOpacity={0.7}
              >
                <Text style={styles.buttonText}>
                  {verifyStatus === 'loading' ? '登录中...' : '登录并进入首页'}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </NutrilisSurface>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.headlineMedium,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.bodyLarge,
    marginBottom: Spacing.xxl,
  },
  channelTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.muted,
    borderRadius: Radius.xxl,
    padding: 4,
    marginBottom: Spacing.xxl,
  },
  channelTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  channelTabActive: {
    backgroundColor: Colors.surface,
  },
  channelText: {
    ...Typography.titleMedium,
    color: Colors.body,
  },
  channelTextActive: {
    color: Colors.title,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    fontSize: 15,
    color: Colors.title,
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.xxl,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  sentNotice: {
    backgroundColor: Colors.background,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sentText: {
    ...Typography.bodyMedium,
    color: Colors.secondary,
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.danger + '14',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.danger,
    flex: 1,
  },
});
