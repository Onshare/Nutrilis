import { useCallback } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import type { AppLocale } from './LocalizedText';
import { LocalizedText } from './LocalizedText';

/**
 * 语言切换 Hook
 */
export function useLocale() {
  const locale = useAppStore((s) => s.locale);
  const toggleLocale = useAppStore((s) => s.toggleLocale);

  const t = useCallback(
    (text: LocalizedText): string => text.resolve(locale),
    [locale],
  );

  const isZh = locale === 'zh';

  return { locale, isZh, toggleLocale, t };
}

export type { AppLocale };
