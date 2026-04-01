package com.nutrilis.server.content.service

import com.nutrilis.server.content.data.SeedContentRepository
import com.nutrilis.server.content.domain.QuizQuestionView
import com.nutrilis.server.content.domain.QuizResultView
import org.springframework.stereotype.Service

@Service
class QuizService(
    private val seedContentRepository: SeedContentRepository,
) {
    fun listQuestions(): List<QuizQuestionView> {
        return seedContentRepository.quizQuestions().map {
            QuizQuestionView(
                id = it.id,
                question = it.question,
                options = it.options,
            )
        }
    }

    fun score(answers: Map<String, Int>): QuizResultView {
        val score = answers.values.sum()
        return if (score >= 4) {
            QuizResultView(
                result = com.nutrilis.server.content.domain.LocalizedValue("阳虚质（偏向）", "Yang Deficiency Tendency"),
                advice = com.nutrilis.server.content.domain.LocalizedValue("建议加强保暖、规律作息，并优先选择温养型食谱与轻量艾灸科普。", "Focus on warmth, regular rest, and gentle warming recipes or moxibustion education."),
                disclaimer = seedContentRepository.disclaimer,
            )
        } else {
            QuizResultView(
                result = com.nutrilis.server.content.domain.LocalizedValue("平和质（偏向）", "Balanced Constitution Tendency"),
                advice = com.nutrilis.server.content.domain.LocalizedValue("继续保持稳定作息与清润饮食，按季节做轻量调理即可。", "Keep a steady routine and light seasonal nourishment."),
                disclaimer = seedContentRepository.disclaimer,
            )
        }
    }
}
