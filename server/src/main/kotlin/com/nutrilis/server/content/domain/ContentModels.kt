package com.nutrilis.server.content.domain

data class LocalizedValue(
    val zh: String,
    val en: String,
)

data class ContentCard(
    val id: String,
    val title: LocalizedValue,
    val subtitle: LocalizedValue,
    val route: String,
)

data class HomeView(
    val banners: List<ContentCard>,
    val quickActions: List<ContentCard>,
    val recommendedRecipes: List<RecipeItem>,
    val disclaimer: LocalizedValue,
)

data class RecipeItem(
    val id: String,
    val title: LocalizedValue,
    val summary: LocalizedValue,
    val source: LocalizedValue,
)

data class RecipeDetailView(
    val id: String,
    val title: LocalizedValue,
    val summary: LocalizedValue,
    val effect: LocalizedValue,
    val suitableFor: LocalizedValue,
    val contraindications: LocalizedValue,
    val source: LocalizedValue,
    val tags: List<LocalizedValue>,
    val ingredients: List<String>,
    val steps: List<LocalizedValue>,
    val disclaimer: LocalizedValue,
)

data class TherapyItem(
    val id: String,
    val title: LocalizedValue,
    val category: LocalizedValue,
    val summary: LocalizedValue,
    val source: LocalizedValue,
)

data class TherapyDetailView(
    val id: String,
    val title: LocalizedValue,
    val category: LocalizedValue,
    val principle: LocalizedValue,
    val suitableFor: LocalizedValue,
    val contraindications: LocalizedValue,
    val notes: LocalizedValue,
    val source: LocalizedValue,
    val disclaimer: LocalizedValue,
)

data class DailyCareTopicView(
    val id: String,
    val title: LocalizedValue,
    val summary: LocalizedValue,
)

data class QuizQuestionView(
    val id: String,
    val question: LocalizedValue,
    val options: List<LocalizedValue>,
)

data class QuizResultView(
    val result: LocalizedValue,
    val advice: LocalizedValue,
    val disclaimer: LocalizedValue,
)
