import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { QuizQuestionVO, QuizResultVO } from '@/models/vo/quiz.vo';
import { ContentRepo } from '@/repos/ContentRepo';
import { QuizUseCase } from '@/usecases/QuizUseCase';
import { useAppStore } from './useAppStore';

interface QuizState {
  questions: QuizQuestionVO[];
  loadStatus: LoadStatus;
  errorMessage: string | null;

  currentIndex: number;
  answers: Record<string, number>;

  result: QuizResultVO | null;
  resultStatus: LoadStatus;

  loadQuestions: () => Promise<void>;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitAnswers: () => Promise<void>;
  reset: () => void;
}

const contentRepo = new ContentRepo();
const quizUseCase = new QuizUseCase(contentRepo);

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  loadStatus: 'idle',
  errorMessage: null,

  currentIndex: 0,
  answers: {},

  result: null,
  resultStatus: 'idle',

  loadQuestions: async () => {
    const locale = useAppStore.getState().locale;
    set({ loadStatus: 'loading', errorMessage: null });
    try {
      const questions = await quizUseCase.getQuestions(locale);
      set({ questions, loadStatus: 'success' });
    } catch (e: unknown) {
      set({
        loadStatus: 'error',
        errorMessage: e instanceof Error ? e.message : '问卷加载失败',
      });
    }
  },

  selectAnswer: (questionId, optionIndex) => {
    set((s) => ({
      answers: { ...s.answers, [questionId]: optionIndex },
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  submitAnswers: async () => {
    const locale = useAppStore.getState().locale;
    const { answers } = get();
    set({ resultStatus: 'loading' });
    try {
      const result = await quizUseCase.submitAnswers(answers, locale);
      set({ result, resultStatus: 'success' });
    } catch (e: unknown) {
      set({
        resultStatus: 'error',
        errorMessage: e instanceof Error ? e.message : '问卷提交失败',
      });
    }
  },

  reset: () =>
    set({
      questions: [],
      loadStatus: 'idle',
      errorMessage: null,
      currentIndex: 0,
      answers: {},
      result: null,
      resultStatus: 'idle',
    }),
}));
