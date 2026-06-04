import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { DailyCareTopicVO } from '@/models/vo/dailyCare.vo';
import { ContentRepo } from '@/repos/ContentRepo';
import { DailyCareUseCase } from '@/usecases/DailyCareUseCase';
import { useAppStore } from './useAppStore';

interface DailyCareState {
  status: LoadStatus;
  topics: DailyCareTopicVO[];
  errorMessage: string | null;

  loadDailyCare: () => Promise<void>;
  reset: () => void;
}

const contentRepo = new ContentRepo();
const dailyCareUseCase = new DailyCareUseCase(contentRepo);

export const useDailyCareStore = create<DailyCareState>((set) => ({
  status: 'idle',
  topics: [],
  errorMessage: null,

  loadDailyCare: async () => {
    const locale = useAppStore.getState().locale;
    set({ status: 'loading', errorMessage: null });
    try {
      const topics = await dailyCareUseCase.getDailyCareTopics(locale);
      set({ topics, status: 'success' });
    } catch (e: unknown) {
      set({
        status: 'error',
        errorMessage: e instanceof Error ? e.message : '日常养护加载失败',
      });
    }
  },

  reset: () => set({ status: 'idle', topics: [], errorMessage: null }),
}));
