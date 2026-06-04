import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { RecipeDetailDTO, RecipeSummaryDTO } from '@/models/dto/content.dto';
import type { RecipeDetailVO, RecipeSummaryVO } from '@/models/vo/recipe.vo';
import { ContentRepo } from '@/repos/ContentRepo';

export class RecipesUseCase {
  constructor(private readonly repo: ContentRepo) {}

  async getRecipeList(
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): Promise<RecipeSummaryVO[]> {
    const dtos = await this.repo.fetchRecipes();
    return dtos.map((dto) => this.summaryToVO(dto, locale, favoriteIds));
  }

  async getRecipeDetail(
    id: string,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): Promise<RecipeDetailVO> {
    const dto = await this.repo.fetchRecipeDetail(id);
    return this.detailToVO(dto, locale, favoriteIds);
  }

  private summaryToVO(
    dto: RecipeSummaryDTO,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): RecipeSummaryVO {
    return {
      id: dto.id,
      title: dto.title.resolve(locale),
      summary: dto.summary.resolve(locale),
      source: dto.source.resolve(locale),
      isFavorited: favoriteIds.has(dto.id),
    };
  }

  private detailToVO(
    dto: RecipeDetailDTO,
    locale: AppLocale,
    favoriteIds: Set<string>,
  ): RecipeDetailVO {
    return {
      id: dto.id,
      title: dto.title.resolve(locale),
      summary: dto.summary.resolve(locale),
      effect: dto.effect.resolve(locale),
      suitableFor: dto.suitableFor.resolve(locale),
      contraindications: dto.contraindications.resolve(locale),
      source: dto.source.resolve(locale),
      tags: dto.tags.map((t) => t.resolve(locale)),
      ingredients: dto.ingredients,
      steps: dto.steps.map((s) => s.resolve(locale)),
      disclaimer: dto.disclaimer.resolve(locale),
      isFavorited: favoriteIds.has(dto.id),
    };
  }
}
