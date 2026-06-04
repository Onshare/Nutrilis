import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { HomePayloadDTO } from '@/models/dto/content.dto';
import type { BannerCardVO, HomePageVO, QuickActionVO, RecommendedRecipeVO } from '@/models/vo/home.vo';
import { ContentRepo } from '@/repos/ContentRepo';

export class HomeUseCase {
  constructor(private readonly repo: ContentRepo) {}

  async getHomePage(locale: AppLocale): Promise<HomePageVO> {
    const dto = await this.repo.fetchHome();
    return this.transformToVO(dto, locale);
  }

  private transformToVO(dto: HomePayloadDTO, locale: AppLocale): HomePageVO {
    return {
      banners: this.transformBanners(dto, locale),
      quickActions: this.transformQuickActions(dto, locale),
      recommendedRecipes: this.transformRecipes(dto, locale),
      disclaimer: dto.disclaimer.resolve(locale),
    };
  }

  private transformBanners(dto: HomePayloadDTO, locale: AppLocale): BannerCardVO[] {
    return dto.banners
      .filter((b) => b.id && b.title.resolve(locale))
      .map((b) => ({
        id: b.id,
        title: b.title.resolve(locale),
        subtitle: b.subtitle.resolve(locale),
        route: b.route,
      }));
  }

  private transformQuickActions(dto: HomePayloadDTO, locale: AppLocale): QuickActionVO[] {
    return dto.quickActions.map((a) => ({
      id: a.id,
      title: a.title.resolve(locale),
      subtitle: a.subtitle.resolve(locale),
      route: a.route,
    }));
  }

  private transformRecipes(dto: HomePayloadDTO, locale: AppLocale): RecommendedRecipeVO[] {
    return dto.recommendedRecipes.slice(0, 6).map((r) => ({
      id: r.id,
      title: r.title.resolve(locale),
      summary: r.summary.resolve(locale),
      source: r.source.resolve(locale),
    }));
  }
}
