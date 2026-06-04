import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { DailyCareTopicVO } from '@/models/vo/dailyCare.vo';
import { ContentRepo } from '@/repos/ContentRepo';

export class DailyCareUseCase {
  constructor(private readonly repo: ContentRepo) {}

  async getDailyCareTopics(locale: AppLocale): Promise<DailyCareTopicVO[]> {
    const dtos = await this.repo.fetchDailyCare();
    return dtos.map((dto) => ({
      id: dto.id,
      title: dto.title.resolve(locale),
      summary: dto.summary.resolve(locale),
    }));
  }
}
