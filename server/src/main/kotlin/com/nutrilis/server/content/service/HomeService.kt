package com.nutrilis.server.content.service

import com.nutrilis.server.content.data.SeedContentRepository
import com.nutrilis.server.content.domain.ContentCard
import com.nutrilis.server.content.domain.HomeView
import com.nutrilis.server.content.domain.RecipeItem
import org.springframework.stereotype.Service

@Service
class HomeService(
    private val seedContentRepository: SeedContentRepository,
) {
    fun getHome(): HomeView {
        return HomeView(
            banners = listOf(
                ContentCard(
                    id = "spring",
                    title = com.nutrilis.server.content.domain.LocalizedValue("春季祛湿指南", "Spring Detox Guide"),
                    subtitle = com.nutrilis.server.content.domain.LocalizedValue("从节气、饮食与起居三个维度做春养。", "Nourish yourself through seasonal routines, diet, and rest."),
                    route = "/daily-care",
                ),
                ContentCard(
                    id = "quiz",
                    title = com.nutrilis.server.content.domain.LocalizedValue("体质自测", "Constitution Quiz"),
                    subtitle = com.nutrilis.server.content.domain.LocalizedValue("8 题快速识别当前体质倾向。", "Identify your current constitution trend in 8 quick questions."),
                    route = "/quiz",
                ),
            ),
            quickActions = listOf(
                ContentCard("daily-care", com.nutrilis.server.content.domain.LocalizedValue("日常养护", "Daily Care"), com.nutrilis.server.content.domain.LocalizedValue("起居与四季调理", "Seasonal routines"), "/daily-care"),
                ContentCard("recipes", com.nutrilis.server.content.domain.LocalizedValue("食谱滋补", "Recipes"), com.nutrilis.server.content.domain.LocalizedValue("食养即补", "Food-based nourishment"), "/recipes"),
                ContentCard("therapy", com.nutrilis.server.content.domain.LocalizedValue("理疗修复", "Therapy"), com.nutrilis.server.content.domain.LocalizedValue("理疗与修护", "Therapy and recovery"), "/therapy"),
                ContentCard("quiz", com.nutrilis.server.content.domain.LocalizedValue("体质调理", "Quiz"), com.nutrilis.server.content.domain.LocalizedValue("快速测评", "Quick assessment"), "/quiz"),
            ),
            recommendedRecipes = seedContentRepository.recipes().map {
                RecipeItem(it.id, it.title, it.summary, it.source)
            },
            disclaimer = seedContentRepository.disclaimer,
        )
    }
}
