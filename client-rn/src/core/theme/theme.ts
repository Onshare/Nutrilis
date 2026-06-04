/**
 * Nutrilis 全局主题 Token
 * 间距、圆角、阴影等设计常量
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
  card: 24,
  banner: 28,
} as const;

export const Shadow = {
  none: {},
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;

/** 点击热区最小高度 */
export const MIN_TOUCH_TARGET = 44;
