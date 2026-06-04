import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { TherapySummaryVO } from '@/models/vo/therapy.vo';
import { ContentRepo } from '@/repos/ContentRepo';
import { TherapyUseCase } from '@/usecases/TherapyUseCase';
import { useAppStore } from './useAppStore';

interface TherapyState {
  status: LoadStatus;
  items: TherapySummaryVO[];
  errorMessage: string | null;

  loadTherapies: () => Promise<void>;
  reset: () => void;
}

const contentRepo = new ContentRepo();
const therapyUseCase = new TherapyUseCase(contentRepo);

export const useTherapyStore = create<TherapyState>((set) => ({
  status: 'idle',
  items: [],
  errorMessage: null,

  loadTherapies: async () => {
    const { locale, favoriteIds } = useAppStore.getState();
    set({ status: 'loading', errorMessage: null });
    try {
      const items = await therapyUseCase.getTherapyList(locale, favoriteIds);
      set({ items, status: 'success' });
    } catch (e: unknown) {
      set({
        status: 'error',
        errorMessage: e instanceof Error ? e.message : '理疗列表加载失败',
      });
    }
  },

  reset: () => set({ status: 'idle', items: [], errorMessage: null }),
}));
