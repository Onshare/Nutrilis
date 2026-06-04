/**
 * 双语文本模型
 * 对标 Flutter LocalizedText
 */
export type AppLocale = 'zh' | 'en';

export interface LocalizedTextJson {
  zh: string;
  en: string;
}

export class LocalizedText {
  constructor(
    public readonly zh: string,
    public readonly en: string,
  ) {}

  /** 根据 locale 决议为单语言字符串 */
  resolve(locale: AppLocale): string {
    return locale === 'zh' ? this.zh : this.en;
  }

  /** 从 JSON 反序列化 */
  static fromJson(json: Record<string, unknown>): LocalizedText {
    return new LocalizedText(
      (json.zh as string) ?? '',
      (json.en as string) ?? '',
    );
  }
}
