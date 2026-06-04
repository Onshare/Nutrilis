import { getApiClient } from '@/core/network/apiClient';
import { ApiException } from '@/core/network/apiException';
import { ApiResponse } from '@/core/network/apiResponse';
import type {
  DailyCareTopicDTO,
  HomePayloadDTO,
  QuizQuestionDTO,
  QuizResultDTO,
  RecipeDetailDTO,
  RecipeSummaryDTO,
  TherapyDetailDTO,
  TherapySummaryDTO,
} from '@/models/dto/content.dto';
import {
  parseDailyCareList,
  parseHomePayload,
  parseQuizQuestions,
  parseQuizResult,
  parseRecipeDetail,
  parseRecipeSummaryList,
  parseTherapyDetail,
  parseTherapySummaryList,
} from '@/models/dto/content.dto';

/**
 * 内容数据仓库 — 只负责 HTTP 请求 + JSON→DTO
 * 对标 Flutter ContentRepository
 */
export class ContentRepo {
  async fetchHome(): Promise<HomePayloadDTO> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>('/home');
    return this.unwrap(response.data, (raw) => parseHomePayload(raw as Record<string, unknown>));
  }

  async fetchRecipes(): Promise<RecipeSummaryDTO[]> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>('/recipes');
    return this.unwrap(response.data, (raw) =>
      parseRecipeSummaryList(raw),
    );
  }

  async fetchRecipeDetail(id: string): Promise<RecipeDetailDTO> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>(`/recipes/${id}`);
    return this.unwrap(response.data, (raw) => parseRecipeDetail(raw as Record<string, unknown>));
  }

  async fetchTherapies(): Promise<TherapySummaryDTO[]> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>('/therapies');
    return this.unwrap(response.data, (raw) =>
      parseTherapySummaryList(raw),
    );
  }

  async fetchTherapyDetail(id: string): Promise<TherapyDetailDTO> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>(`/therapies/${id}`);
    return this.unwrap(response.data, (raw) => parseTherapyDetail(raw as Record<string, unknown>));
  }

  async fetchDailyCare(): Promise<DailyCareTopicDTO[]> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>('/daily-care');
    return this.unwrap(response.data, (raw) =>
      parseDailyCareList(raw),
    );
  }

  async fetchQuiz(): Promise<QuizQuestionDTO[]> {
    const client = getApiClient();
    const response = await client.get<Record<string, unknown>>('/quiz');
    return this.unwrap(response.data, (raw) =>
      parseQuizQuestions(raw),
    );
  }

  async submitQuiz(answers: Record<string, number>): Promise<QuizResultDTO> {
    const client = getApiClient();
    const response = await client.post<Record<string, unknown>>('/quiz/submit', {
      answers,
    });
    return this.unwrap(response.data, (raw) => parseQuizResult(raw as Record<string, unknown>));
  }

  private unwrap<T>(
    json: Record<string, unknown> | undefined,
    mapper: (raw: unknown) => T,
  ): T {
    if (!json) {
      throw new ApiException('Empty response');
    }
    const envelope = ApiResponse.fromJson(json, mapper);
    if (envelope.error) {
      throw new ApiException(envelope.error.message, envelope.error.code);
    }
    if (envelope.data == null) {
      throw new ApiException('Missing data payload');
    }
    return envelope.data;
  }
}
