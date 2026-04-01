package com.nutrilis.server.content.entity

import com.nutrilis.server.content.domain.LocalizedValue

data class SeedRecipeEntity(
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
)

data class SeedTherapyEntity(
    val id: String,
    val title: LocalizedValue,
    val category: LocalizedValue,
    val principle: LocalizedValue,
    val suitableFor: LocalizedValue,
    val contraindications: LocalizedValue,
    val notes: LocalizedValue,
    val source: LocalizedValue,
)

data class SeedDailyCareEntity(
    val id: String,
    val title: LocalizedValue,
    val summary: LocalizedValue,
)

data class SeedQuizQuestionEntity(
    val id: String,
    val question: LocalizedValue,
    val options: List<LocalizedValue>,
)
