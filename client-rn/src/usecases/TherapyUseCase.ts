import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { TherapyDetailDTO, TherapySummaryDTO } from '@/models/dto/content.dto';
import type { TherapyDetailVO, TherapySummaryVO } from '@/models/vo/therapy.vo';
import { ContentRepo } from '@/repos/ContentRepo';

export class TherapyUseCase {
  constructor(private readonly repo: ContentRepo) {}

  async getTherapyList(
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): Promise<TherapySummaryVO[]> {
    const dtos = await this.repo.fetchTherapies();
    return dtos.map((dto) => this.summaryToVO(dto, locale, favoriteIds));
  }

  async getTherapyDetail(
    id: string,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): Promise<TherapyDetailVO> {
    const dto = await this.repo.fetchTherapyDetail(id);
    return this.detailToVO(dto, locale, favoriteIds);
  }

  private summaryToVO(
    dto: TherapySummaryDTO,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): TherapySummaryVO {
    return {
      id: dto.id,
      title: dto.title.resolve(locale),
      category: dto.category.resolve(locale),
      summary: dto.summary.resolve(locale),
      source: dto.source.resolve(locale),
      isFavorited: favoriteIds.has(dto.id),
    };
  }

  private detailToVO(
    dto: TherapyDetailDTO,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): TherapyDetailVO {
    return {
      id: dto.id,
      title: dto.title.resolve(locale),
      category: dto.category.resolve(locale),
      principle: dto.principle.resolve(locale),
      suitableFor: dto.suitableFor.resolve(locale),
      contraindications: dto.contraindications.resolve(locale),
      notes: dto.notes.resolve(locale),
      source: dto.source.resolve(locale),
      disclaimer: dto.disclaimer.resolve(locale),
      isFavorited: favoriteIds.has(dto.id),
    };
  }
}
