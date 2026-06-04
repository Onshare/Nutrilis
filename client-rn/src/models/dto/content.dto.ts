import { LocalizedText } from '@/core/i18n/LocalizedText';

// ─── Home ───
export interface BannerCardDTO {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  route: string;
}

export interface QuickActionDTO {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  route: string;
}

export interface RecipeSummaryDTO {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  source: LocalizedText;
}

export interface HomePayloadDTO {
  banners: BannerCardDTO[];
  quickActions: QuickActionDTO[];
  recommendedRecipes: RecipeSummaryDTO[];
  disclaimer: LocalizedText;
}

// ─── Recipe Detail ───
export interface RecipeDetailDTO {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
  effect: LocalizedText;
  suitableFor: LocalizedText;
  contraindications: LocalizedText;
  source: LocalizedText;
  tags: LocalizedText[];
  ingredients: string[];
  steps: LocalizedText[];
  disclaimer: LocalizedText;
}

// ─── Therapy ───
export interface TherapySummaryDTO {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  summary: LocalizedText;
  source: LocalizedText;
}

export interface TherapyDetailDTO {
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  principle: LocalizedText;
  suitableFor: LocalizedText;
  contraindications: LocalizedText;
  notes: LocalizedText;
  source: LocalizedText;
  disclaimer: LocalizedText;
}

// ─── Daily Care ───
export interface DailyCareTopicDTO {
  id: string;
  title: LocalizedText;
  summary: LocalizedText;
}

// ─── Quiz ───
export interface QuizQuestionDTO {
  id: string;
  question: LocalizedText;
  options: LocalizedText[];
}

export interface QuizResultDTO {
  result: LocalizedText;
  advice: LocalizedText;
  disclaimer: LocalizedText;
}

// ─── fromJson parsers ───
function parseLocalized(json: Record<string, unknown>): LocalizedText {
  return LocalizedText.fromJson(json);
}

function parseLocalizedList(raw: unknown): LocalizedText[] {
  return ((raw as unknown[]) ?? []).map((item) =>
    parseLocalized(item as Record<string, unknown>),
  );
}

function parseBannerCard(raw: Record<string, unknown>): BannerCardDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    subtitle: parseLocalized((raw.subtitle as Record<string, unknown>) ?? {}),
    route: (raw.route as string) ?? '',
  };
}

function parseQuickAction(raw: Record<string, unknown>): QuickActionDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    subtitle: parseLocalized((raw.subtitle as Record<string, unknown>) ?? {}),
    route: (raw.route as string) ?? '',
  };
}

function parseRecipeSummary(raw: Record<string, unknown>): RecipeSummaryDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    summary: parseLocalized((raw.summary as Record<string, unknown>) ?? {}),
    source: parseLocalized((raw.source as Record<string, unknown>) ?? {}),
  };
}

function parseTherapySummary(raw: Record<string, unknown>): TherapySummaryDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    category: parseLocalized((raw.category as Record<string, unknown>) ?? {}),
    summary: parseLocalized((raw.summary as Record<string, unknown>) ?? {}),
    source: parseLocalized((raw.source as Record<string, unknown>) ?? {}),
  };
}

// ─── Public parsers ───
export function parseHomePayload(raw: Record<string, unknown>): HomePayloadDTO {
  return {
    banners: ((raw.banners as unknown[]) ?? []).map((item) =>
      parseBannerCard(item as Record<string, unknown>),
    ),
    quickActions: ((raw.quickActions as unknown[]) ?? []).map((item) =>
      parseQuickAction(item as Record<string, unknown>),
    ),
    recommendedRecipes: ((raw.recommendedRecipes as unknown[]) ?? []).map((item) =>
      parseRecipeSummary(item as Record<string, unknown>),
    ),
    disclaimer: parseLocalized((raw.disclaimer as Record<string, unknown>) ?? {}),
  };
}

export function parseRecipeDetail(raw: Record<string, unknown>): RecipeDetailDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    summary: parseLocalized((raw.summary as Record<string, unknown>) ?? {}),
    effect: parseLocalized((raw.effect as Record<string, unknown>) ?? {}),
    suitableFor: parseLocalized((raw.suitableFor as Record<string, unknown>) ?? {}),
    contraindications: parseLocalized((raw.contraindications as Record<string, unknown>) ?? {}),
    source: parseLocalized((raw.source as Record<string, unknown>) ?? {}),
    tags: parseLocalizedList(raw.tags),
    ingredients: ((raw.ingredients as unknown[]) ?? []).map(String),
    steps: parseLocalizedList(raw.steps),
    disclaimer: parseLocalized((raw.disclaimer as Record<string, unknown>) ?? {}),
  };
}

export function parseRecipeSummaryList(raw: unknown): RecipeSummaryDTO[] {
  return ((raw as unknown[]) ?? []).map((item) =>
    parseRecipeSummary(item as Record<string, unknown>),
  );
}

export function parseTherapySummaryList(raw: unknown): TherapySummaryDTO[] {
  return ((raw as unknown[]) ?? []).map((item) =>
    parseTherapySummary(item as Record<string, unknown>),
  );
}

export function parseTherapyDetail(raw: Record<string, unknown>): TherapyDetailDTO {
  return {
    id: (raw.id as string) ?? '',
    title: parseLocalized((raw.title as Record<string, unknown>) ?? {}),
    category: parseLocalized((raw.category as Record<string, unknown>) ?? {}),
    principle: parseLocalized((raw.principle as Record<string, unknown>) ?? {}),
    suitableFor: parseLocalized((raw.suitableFor as Record<string, unknown>) ?? {}),
    contraindications: parseLocalized((raw.contraindications as Record<string, unknown>) ?? {}),
    notes: parseLocalized((raw.notes as Record<string, unknown>) ?? {}),
    source: parseLocalized((raw.source as Record<string, unknown>) ?? {}),
    disclaimer: parseLocalized((raw.disclaimer as Record<string, unknown>) ?? {}),
  };
}

export function parseDailyCareList(raw: unknown): DailyCareTopicDTO[] {
  return ((raw as unknown[]) ?? []).map((item) => {
    const obj = item as Record<string, unknown>;
    return {
      id: (obj.id as string) ?? '',
      title: parseLocalized((obj.title as Record<string, unknown>) ?? {}),
      summary: parseLocalized((obj.summary as Record<string, unknown>) ?? {}),
    };
  });
}

export function parseQuizQuestions(raw: unknown): QuizQuestionDTO[] {
  return ((raw as unknown[]) ?? []).map((item) => {
    const obj = item as Record<string, unknown>;
    return {
      id: (obj.id as string) ?? '',
      question: parseLocalized((obj.question as Record<string, unknown>) ?? {}),
      options: parseLocalizedList(obj.options),
    };
  });
}

export function parseQuizResult(raw: Record<string, unknown>): QuizResultDTO {
  return {
    result: parseLocalized((raw.result as Record<string, unknown>) ?? {}),
    advice: parseLocalized((raw.advice as Record<string, unknown>) ?? {}),
    disclaimer: parseLocalized((raw.disclaimer as Record<string, unknown>) ?? {}),
  };
}
