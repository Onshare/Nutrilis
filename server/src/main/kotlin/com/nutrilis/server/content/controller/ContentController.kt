package com.nutrilis.server.content.controller

import com.nutrilis.server.common.ApiResponse
import com.nutrilis.server.content.domain.DailyCareTopicView
import com.nutrilis.server.content.domain.HomeView
import com.nutrilis.server.content.domain.QuizQuestionView
import com.nutrilis.server.content.domain.QuizResultView
import com.nutrilis.server.content.domain.RecipeDetailView
import com.nutrilis.server.content.domain.RecipeItem
import com.nutrilis.server.content.domain.TherapyDetailView
import com.nutrilis.server.content.domain.TherapyItem
import com.nutrilis.server.content.service.DailyCareService
import com.nutrilis.server.content.service.HomeService
import com.nutrilis.server.content.service.QuizService
import com.nutrilis.server.content.service.RecipeService
import com.nutrilis.server.content.service.TherapyService
import jakarta.validation.constraints.NotEmpty
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

data class QuizSubmitRequest(
    @field:NotEmpty
    val answers: Map<String, Int>,
)

@RestController
@RequestMapping("/api/v1")
class ContentController(
    private val homeService: HomeService,
    private val recipeService: RecipeService,
    private val therapyService: TherapyService,
    private val dailyCareService: DailyCareService,
    private val quizService: QuizService,
) {
    @GetMapping("/home")
    fun home(): ApiResponse<HomeView> = ApiResponse.success(homeService.getHome())

    @GetMapping("/recipes")
    fun recipes(): ApiResponse<List<RecipeItem>> = ApiResponse.success(recipeService.listRecipes())

    @GetMapping("/recipes/{id}")
    fun recipeDetail(@PathVariable id: String): ApiResponse<RecipeDetailView> {
        return ApiResponse.success(recipeService.getRecipe(id))
    }

    @GetMapping("/therapies")
    fun therapies(): ApiResponse<List<TherapyItem>> = ApiResponse.success(therapyService.listTherapies())

    @GetMapping("/therapies/{id}")
    fun therapyDetail(@PathVariable id: String): ApiResponse<TherapyDetailView> {
        return ApiResponse.success(therapyService.getTherapy(id))
    }

    @GetMapping("/daily-care")
    fun dailyCare(): ApiResponse<List<DailyCareTopicView>> {
        return ApiResponse.success(dailyCareService.listTopics())
    }

    @GetMapping("/quiz")
    fun quiz(): ApiResponse<List<QuizQuestionView>> = ApiResponse.success(quizService.listQuestions())

    @PostMapping("/quiz/submit")
    fun submitQuiz(@RequestBody request: QuizSubmitRequest): ApiResponse<QuizResultView> {
        val score = request.answers.values.sum()
        return ApiResponse.success(
            quizService.score(request.answers),
            meta = mapOf("score" to score),
        )
    }
}
