package com.nutrilis.server.content.service

import com.nutrilis.server.content.data.SeedContentRepository
import com.nutrilis.server.content.domain.TherapyDetailView
import com.nutrilis.server.content.domain.TherapyItem
import org.springframework.stereotype.Service

@Service
class TherapyService(
    private val seedContentRepository: SeedContentRepository,
) {
    fun listTherapies(): List<TherapyItem> {
        return seedContentRepository.therapies().map {
            TherapyItem(
                id = it.id,
                title = it.title,
                category = it.category,
                summary = it.principle,
                source = it.source,
            )
        }
    }

    fun getTherapy(id: String): TherapyDetailView {
        val therapy = seedContentRepository.therapy(id)
        return TherapyDetailView(
            id = therapy.id,
            title = therapy.title,
            category = therapy.category,
            principle = therapy.principle,
            suitableFor = therapy.suitableFor,
            contraindications = therapy.contraindications,
            notes = therapy.notes,
            source = therapy.source,
            disclaimer = seedContentRepository.disclaimer,
        )
    }
}
