import { create } from 'zustand';
import type { AppLocale } from '@/core/i18n/LocalizedText';

interface AppSession {
  accessToken: string;
  refreshToken: string;
  displayName: string;
  identifier: string;
}

interface HistoryEntry {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  iconKey: string;
}

interface FavoriteItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'recipe' | 'therapy';
}

interface AppState {
  locale: AppLocale;
  session: AppSession | null;
  favoriteIds: Set<string>;
  favoriteItems: Map<string, FavoriteItem>;
  history: HistoryEntry[];

  toggleLocale: () => void;
  setSession: (session: AppSession) => void;
  clearSession: () => void;
  toggleFavorite: (id: string, meta?: { title: string; subtitle: string; type: 'recipe' | 'therapy' }) => void;
  isFavorite: (id: string) => boolean;
  addHistory: (entry: HistoryEntry) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  locale: 'zh',
  session: null,
  favoriteIds: new Set<string>(),
  favoriteItems: new Map(),
  history: [],

  toggleLocale: () => {
    set((s) => ({ locale: s.locale === 'zh' ? 'en' : 'zh' }));
  },

  setSession: (session) => set({ session }),

  clearSession: () => set({ session: null }),

  toggleFavorite: (id, meta) => {
    set((s) => {
      const nextIds = new Set(s.favoriteIds);
      const nextItems = new Map(s.favoriteItems);
      if (nextIds.has(id)) {
        nextIds.delete(id);
        nextItems.delete(id);
      } else {
        nextIds.add(id);
        if (meta) {
          nextItems.set(id, { id, title: meta.title, subtitle: meta.subtitle, type: meta.type });
        }
      }
      return { favoriteIds: nextIds, favoriteItems: nextItems };
    });
  },

  isFavorite: (id) => get().favoriteIds.has(id),

  addHistory: (entry) => {
    set((s) => {
      const filtered = s.history.filter((item) => item.id !== entry.id);
      return { history: [entry, ...filtered].slice(0, 20) };
    });
  },
}));
