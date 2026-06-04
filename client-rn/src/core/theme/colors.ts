/**
 * Nutrilis 品牌色板
 * 全局所有颜色引用必须从这里获取，禁止在组件中写裸色值
 */
export const Colors = {
  // 品牌色
  primary: '#A1C298',      // 草木绿 — 养生、自然 ("养")
  secondary: '#6B4F4F',    // 温润土棕 — 滋补、厚重 ("补")
  accent: '#D4B996',       // 柔和暖金 — 品质感 ("修")

  // 中性色
  background: '#FAF7F2',   // 极柔和米白 (页面底色)
  surface: '#FFFFFF',      // 卡片底色
  title: '#333333',        // 文字标题
  body: '#666666',         // 文字正文
  danger: '#D9534F',       // 提示/禁忌文字
  border: '#EAEAEA',       // 分割线/边框
  muted: '#F3EFE8',        // 次要背景
} as const;

export type ColorKey = keyof typeof Colors;
