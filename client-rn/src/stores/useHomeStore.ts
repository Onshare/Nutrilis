import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { HomePageVO } from '@/models/vo/home.vo';
import { ContentRepo } from '@/repos/ContentRepo';
import { HomeUseCase } from '@/usecases/HomeUseCase';
import { useAppStore } from './useAppStore';

interface HomeState {
  status: LoadStatus;
  payload: HomePageVO | null;
  errorMessage: string | null;

  loadHome: () => Promise<void>;
  reset: () => void;
}

const contentRepo = new ContentRepo();
const homeUseCase = new HomeUseCase(contentRepo);

export const useHomeStore = create<HomeState>((set) => ({
  status: 'idle',
  payload: null,
  errorMessage: null,

  loadHome: async () => {
    const locale = useAppStore.getState().locale;
    set({ status: 'loading', errorMessage: null });
    try {
      const vo = await homeUseCase.getHomePage(locale);
      set({ payload: vo, status: 'success' });
    } catch (e: unknown) {
      set({
        status: 'error',
        errorMessage: e instanceof Error ? e.message : '首页内容加载失败',
      });
    }
  },

  reset: () => set({ status: 'idle', payload: null, errorMessage: null }),
}));
