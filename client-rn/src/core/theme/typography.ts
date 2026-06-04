import { TextStyle } from 'react-native';
import { Colors } from './colors';

/**
 * Nutrilis 字体样式 Token
 * 对标 Flutter ThemeData.textTheme
 */
export const Typography = {
  headlineMedium: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.title,
    lineHeight: 36,
  } as TextStyle,

  headlineSmall: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.title,
    lineHeight: 30,
  } as TextStyle,

  titleLarge: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.title,
    lineHeight: 28,
  } as TextStyle,

  titleMedium: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.title,
    lineHeight: 24,
  } as TextStyle,

  bodyLarge: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.body,
    lineHeight: 23,
  } as TextStyle,

  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.body,
    lineHeight: 21,
  } as TextStyle,

  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.body,
    lineHeight: 17,
  } as TextStyle,

  labelLarge: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.title,
    lineHeight: 22,
  } as TextStyle,
} as const;
