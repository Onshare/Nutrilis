import { create } from 'zustand';
import type { LoadStatus } from '@/models/common';
import type { AuthChannel, OtpTicketDTO } from '@/models/dto/auth.dto';
import { AuthRepo } from '@/repos/AuthRepo';
import { AuthUseCase } from '@/usecases/AuthUseCase';
import { useAppStore } from './useAppStore';

interface AuthState {
  channel: AuthChannel;
  identifier: string;
  otp: string;
  sendStatus: LoadStatus;
  verifyStatus: LoadStatus;
  ticket: OtpTicketDTO | null;
  errorMessage: string | null;
  justSignedIn: boolean;

  // computed
  canSubmitOtp: () => boolean;

  // actions
  setChannel: (channel: AuthChannel) => void;
  setIdentifier: (value: string) => void;
  setOtp: (value: string) => void;
  sendOtp: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  consumeError: () => void;
  consumeNavigation: () => void;
  reset: () => void;
}

const authRepo = new AuthRepo();
const authUseCase = new AuthUseCase(authRepo);

export const useAuthStore = create<AuthState>((set, get) => ({
  channel: 'phone',
  identifier: '',
  otp: '',
  sendStatus: 'idle',
  verifyStatus: 'idle',
  ticket: null,
  errorMessage: null,
  justSignedIn: false,

  canSubmitOtp: () => get().ticket != null,

  setChannel: (channel) =>
    set({
      channel,
      otp: '',
      sendStatus: 'idle',
      verifyStatus: 'idle',
      ticket: null,
      errorMessage: null,
      justSignedIn: false,
    }),

  setIdentifier: (value) => set({ identifier: value, errorMessage: null }),

  setOtp: (value) => set({ otp: value, errorMessage: null }),

  sendOtp: async () => {
    const { channel, identifier } = get();
    const validationError = authUseCase.validateIdentifier(identifier, channel);
    if (validationError) {
      set({ errorMessage: validationError });
      return;
    }

    set({ sendStatus: 'loading', errorMessage: null, verifyStatus: 'idle', justSignedIn: false });

    try {
      const ticket = await authUseCase.sendOtp(channel, identifier);
      set({ ticket, sendStatus: 'success', otp: '' });
    } catch (e: unknown) {
      set({
        sendStatus: 'error',
        errorMessage: e instanceof Error ? e.message : '验证码发送失败',
      });
    }
  },

  verifyOtp: async () => {
    const { ticket, otp } = get();
    if (!ticket) {
      set({ errorMessage: '请先发送验证码' });
      return;
    }
    if (otp.trim().length !== 6) {
      set({ errorMessage: '请输入 6 位验证码' });
      return;
    }

    set({ verifyStatus: 'loading', errorMessage: null });

    try {
      const result = await authUseCase.verifyOtp(ticket, otp);
      useAppStore.getState().setSession({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        displayName: result.displayName,
        identifier: result.identifier,
      });
      set({ verifyStatus: 'success', justSignedIn: true });
    } catch (e: unknown) {
      set({
        verifyStatus: 'error',
        errorMessage: e instanceof Error ? e.message : '验证码校验失败',
      });
    }
  },

  consumeError: () => set({ errorMessage: null }),
  consumeNavigation: () => set({ justSignedIn: false }),

  reset: () =>
    set({
      channel: 'phone',
      identifier: '',
      otp: '',
      sendStatus: 'idle',
      verifyStatus: 'idle',
      ticket: null,
      errorMessage: null,
      justSignedIn: false,
    }),
}));
