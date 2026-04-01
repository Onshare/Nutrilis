import '../serialization/localized_text.dart';

class BannerCard {
  const BannerCard({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.route,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText subtitle;
  final String route;

  factory BannerCard.fromJson(Map<String, dynamic> json) {
    return BannerCard(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      subtitle: LocalizedText.fromJson((json['subtitle'] as Map).cast<String, dynamic>()),
      route: json['route'] as String? ?? '',
    );
  }
}

class QuickAction {
  const QuickAction({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.route,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText subtitle;
  final String route;

  factory QuickAction.fromJson(Map<String, dynamic> json) {
    return QuickAction(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      subtitle: LocalizedText.fromJson((json['subtitle'] as Map).cast<String, dynamic>()),
      route: json['route'] as String? ?? '',
    );
  }
}

class HomePayload {
  const HomePayload({
    required this.banners,
    required this.quickActions,
    required this.recommendedRecipes,
    required this.disclaimer,
  });

  final List<BannerCard> banners;
  final List<QuickAction> quickActions;
  final List<RecipeSummary> recommendedRecipes;
  final LocalizedText disclaimer;

  factory HomePayload.fromJson(Map<String, dynamic> json) {
    return HomePayload(
      banners: ((json['banners'] as List?) ?? const [])
          .map((item) => BannerCard.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
      quickActions: ((json['quickActions'] as List?) ?? const [])
          .map((item) => QuickAction.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
      recommendedRecipes: ((json['recommendedRecipes'] as List?) ?? const [])
          .map((item) => RecipeSummary.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
      disclaimer: LocalizedText.fromJson((json['disclaimer'] as Map).cast<String, dynamic>()),
    );
  }
}

class RecipeSummary {
  const RecipeSummary({
    required this.id,
    required this.title,
    required this.summary,
    required this.source,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText summary;
  final LocalizedText source;

  factory RecipeSummary.fromJson(Map<String, dynamic> json) {
    return RecipeSummary(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      summary: LocalizedText.fromJson((json['summary'] as Map).cast<String, dynamic>()),
      source: LocalizedText.fromJson((json['source'] as Map).cast<String, dynamic>()),
    );
  }
}

class RecipeDetail {
  const RecipeDetail({
    required this.id,
    required this.title,
    required this.summary,
    required this.effect,
    required this.suitableFor,
    required this.contraindications,
    required this.source,
    required this.tags,
    required this.ingredients,
    required this.steps,
    required this.disclaimer,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText summary;
  final LocalizedText effect;
  final LocalizedText suitableFor;
  final LocalizedText contraindications;
  final LocalizedText source;
  final List<LocalizedText> tags;
  final List<String> ingredients;
  final List<LocalizedText> steps;
  final LocalizedText disclaimer;

  factory RecipeDetail.fromJson(Map<String, dynamic> json) {
    return RecipeDetail(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      summary: LocalizedText.fromJson((json['summary'] as Map).cast<String, dynamic>()),
      effect: LocalizedText.fromJson((json['effect'] as Map).cast<String, dynamic>()),
      suitableFor: LocalizedText.fromJson((json['suitableFor'] as Map).cast<String, dynamic>()),
      contraindications: LocalizedText.fromJson((json['contraindications'] as Map).cast<String, dynamic>()),
      source: LocalizedText.fromJson((json['source'] as Map).cast<String, dynamic>()),
      tags: ((json['tags'] as List?) ?? const [])
          .map((item) => LocalizedText.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
      ingredients: ((json['ingredients'] as List?) ?? const []).map((item) => item.toString()).toList(),
      steps: ((json['steps'] as List?) ?? const [])
          .map((item) => LocalizedText.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
      disclaimer: LocalizedText.fromJson((json['disclaimer'] as Map).cast<String, dynamic>()),
    );
  }
}

class TherapySummary {
  const TherapySummary({
    required this.id,
    required this.title,
    required this.category,
    required this.summary,
    required this.source,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText category;
  final LocalizedText summary;
  final LocalizedText source;

  factory TherapySummary.fromJson(Map<String, dynamic> json) {
    return TherapySummary(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      category: LocalizedText.fromJson((json['category'] as Map).cast<String, dynamic>()),
      summary: LocalizedText.fromJson((json['summary'] as Map).cast<String, dynamic>()),
      source: LocalizedText.fromJson((json['source'] as Map).cast<String, dynamic>()),
    );
  }
}

class TherapyDetail {
  const TherapyDetail({
    required this.id,
    required this.title,
    required this.category,
    required this.principle,
    required this.suitableFor,
    required this.contraindications,
    required this.notes,
    required this.source,
    required this.disclaimer,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText category;
  final LocalizedText principle;
  final LocalizedText suitableFor;
  final LocalizedText contraindications;
  final LocalizedText notes;
  final LocalizedText source;
  final LocalizedText disclaimer;

  factory TherapyDetail.fromJson(Map<String, dynamic> json) {
    return TherapyDetail(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      category: LocalizedText.fromJson((json['category'] as Map).cast<String, dynamic>()),
      principle: LocalizedText.fromJson((json['principle'] as Map).cast<String, dynamic>()),
      suitableFor: LocalizedText.fromJson((json['suitableFor'] as Map).cast<String, dynamic>()),
      contraindications: LocalizedText.fromJson((json['contraindications'] as Map).cast<String, dynamic>()),
      notes: LocalizedText.fromJson((json['notes'] as Map).cast<String, dynamic>()),
      source: LocalizedText.fromJson((json['source'] as Map).cast<String, dynamic>()),
      disclaimer: LocalizedText.fromJson((json['disclaimer'] as Map).cast<String, dynamic>()),
    );
  }
}

class DailyCareTopic {
  const DailyCareTopic({
    required this.id,
    required this.title,
    required this.summary,
  });

  final String id;
  final LocalizedText title;
  final LocalizedText summary;

  factory DailyCareTopic.fromJson(Map<String, dynamic> json) {
    return DailyCareTopic(
      id: json['id'] as String? ?? '',
      title: LocalizedText.fromJson((json['title'] as Map).cast<String, dynamic>()),
      summary: LocalizedText.fromJson((json['summary'] as Map).cast<String, dynamic>()),
    );
  }
}

class QuizQuestion {
  const QuizQuestion({
    required this.id,
    required this.question,
    required this.options,
  });

  final String id;
  final LocalizedText question;
  final List<LocalizedText> options;

  factory QuizQuestion.fromJson(Map<String, dynamic> json) {
    return QuizQuestion(
      id: json['id'] as String? ?? '',
      question: LocalizedText.fromJson((json['question'] as Map).cast<String, dynamic>()),
      options: ((json['options'] as List?) ?? const [])
          .map((item) => LocalizedText.fromJson((item as Map).cast<String, dynamic>()))
          .toList(),
    );
  }
}

class QuizResult {
  const QuizResult({
    required this.result,
    required this.advice,
    required this.disclaimer,
  });

  final LocalizedText result;
  final LocalizedText advice;
  final LocalizedText disclaimer;

  factory QuizResult.fromJson(Map<String, dynamic> json) {
    return QuizResult(
      result: LocalizedText.fromJson((json['result'] as Map).cast<String, dynamic>()),
      advice: LocalizedText.fromJson((json['advice'] as Map).cast<String, dynamic>()),
      disclaimer: LocalizedText.fromJson((json['disclaimer'] as Map).cast<String, dynamic>()),
    );
  }
}
