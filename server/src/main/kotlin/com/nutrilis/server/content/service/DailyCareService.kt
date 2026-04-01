package com.nutrilis.server.content.service

import com.nutrilis.server.content.data.SeedContentRepository
import com.nutrilis.server.content.domain.DailyCareTopicView
import org.springframework.stereotype.Service

@Service
class DailyCareService(
    private val seedContentRepository: SeedContentRepository,
) {
    fun listTopics(): List<DailyCareTopicView> {
        return seedContentRepository.dailyCare().map {
            DailyCareTopicView(
                id = it.id,
                title = it.title,
                summary = it.summary,
            )
        }
    }
}
