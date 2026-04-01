package com.nutrilis.server.content.service

import com.nutrilis.server.content.data.SeedContentRepository
import com.nutrilis.server.content.domain.RecipeDetailView
import com.nutrilis.server.content.domain.RecipeItem
import org.springframework.stereotype.Service

@Service
class RecipeService(
    private val seedContentRepository: SeedContentRepository,
) {
    fun listRecipes(): List<RecipeItem> {
        return seedContentRepository.recipes().map {
            RecipeItem(it.id, it.title, it.summary, it.source)
        }
    }

    fun getRecipe(id: String): RecipeDetailView {
        val recipe = seedContentRepository.recipe(id)
        return RecipeDetailView(
            id = recipe.id,
            title = recipe.title,
            summary = recipe.summary,
            effect = recipe.effect,
            suitableFor = recipe.suitableFor,
            contraindications = recipe.contraindications,
            source = recipe.source,
            tags = recipe.tags,
            ingredients = recipe.ingredients,
            steps = recipe.steps,
            disclaimer = seedContentRepository.disclaimer,
        )
    }
}
