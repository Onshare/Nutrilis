enum AppLocale { zh, en }

class LocalizedText {
  const LocalizedText({
    required this.zh,
    required this.en,
  });

  final String zh;
  final String en;

  String resolve(AppLocale locale) {
    return locale == AppLocale.zh ? zh : en;
  }

  factory LocalizedText.fromJson(Map<String, dynamic> json) {
    return LocalizedText(
      zh: json['zh'] as String? ?? '',
      en: json['en'] as String? ?? '',
    );
  }
}
