/** 首页 Banner 卡片 VO */
export interface BannerCardVO {
  id: string;
  title: string;
  subtitle: string;
  route: string;
}

/** 快捷入口 VO */
export interface QuickActionVO {
  id: string;
  title: string;
  subtitle: string;
  route: string;
}

/** 推荐食谱摘要 VO */
export interface RecommendedRecipeVO {
  id: string;
  title: string;
  summary: string;
  source: string;
}

/** 首页聚合 VO */
export interface HomePageVO {
  banners: BannerCardVO[];
  quickActions: QuickActionVO[];
  recommendedRecipes: RecommendedRecipeVO[];
  disclaimer: string;
}
