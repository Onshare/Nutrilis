/**
 * 全局常量
 */
export const AppConstants = {
  appName: 'Nutrilis',
  appSubtitle: '十全大补 · 养补修',
  defaultDisclaimer: '本内容仅为养生科普，不替代医疗诊断与治疗方案',
} as const;

/** API 基础路径 */
export const API_BASE_URL = __DEV__
  ? 'http://127.0.0.1:8080/api/v1'
  : 'https://api.nutrilis.com/api/v1';
