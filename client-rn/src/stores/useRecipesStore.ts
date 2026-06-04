import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { RecipeSummaryVO } from '@/models/vo/recipe.vo';
import { ContentRepo } from '@/repos/ContentRepo';
import { RecipesUseCase } from '@/usecases/RecipesUseCase';
import { useAppStore } from './useAppStore';

interface RecipesState {
  status: LoadStatus;
  items: RecipeSummaryVO[];
  errorMessage: string | null;

  loadRecipes: () => Promise<void>;
  reset: () => void;
}

const contentRepo = new ContentRepo();
const recipesUseCase = new RecipesUseCase(contentRepo);

export const useRecipesStore = create<RecipesState>((set) => ({
  status: 'idle',
  items: [],
  errorMessage: null,

  loadRecipes: async () => {
    const { locale, favoriteIds } = useAppStore.getState();
    set({ status: 'loading', errorMessage: null });
    try {
      const items = await recipesUseCase.getRecipeList(locale, favoriteIds);
      set({ items, status: 'success' });
    } catch (e: unknown) {
      set({
        status: 'error',
        errorMessage: e instanceof Error ? e.message : '食谱加载失败',
      });
    }
  },

  reset: () => set({ status: 'idle', items: [], errorMessage: null }),
}));
