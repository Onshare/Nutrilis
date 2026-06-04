import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { QuizQuestionVO, QuizResultVO } from '@/models/vo/quiz.vo';
import { ContentRepo } from '@/repos/ContentRepo';

export class QuizUseCase {
  constructor(private readonly repo: ContentRepo) {}

  async getQuestions(locale: AppLocale): Promise<QuizQuestionVO[]> {
    const dtos = await this.repo.fetchQuiz();
    return dtos.map((dto) => ({
      id: dto.id,
      question: dto.question.resolve(locale),
      options: dto.options.map((o) => o.resolve(locale)),
    }));
  }

  async submitAnswers(
    answers: Record<string, number>,
    locale: AppLocale,
  ): Promise<QuizResultVO> {
    const dto = await this.repo.submitQuiz(answers);
    return {
      result: dto.result.resolve(locale),
      advice: dto.advice.resolve(locale),
      disclaimer: dto.disclaimer.resolve(locale),
    };
  }
}
