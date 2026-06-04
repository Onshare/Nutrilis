/** 食谱摘要 VO (列表页) */
export interface RecipeSummaryVO {
  id: string;
  title: string;
  summary: string;
  source: string;
  isFavorited: boolean;
}

/** 食谱详情 VO */
export interface RecipeDetailVO {
  id: string;
  title: string;
  summary: string;
  effect: string;
  suitableFor: string;
  contraindications: string;
  source: string;
  tags: string[];
  ingredients: string[];
  steps: string[];
  disclaimer: string;
  isFavorited: boolean;
}
