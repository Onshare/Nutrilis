import { LocalizedText } from '@/core/i18n/LocalizedText';

// ─── AuthChannel ───
export type AuthChannel = 'phone' | 'email';

// ─── OTP Ticket ───
export interface OtpTicketDTO {
  requestId: string;
  maskedTarget: string;
  target: string;
  channel: AuthChannel;
}

// ─── Auth Verify Result ───
export interface AuthVerifyResultDTO {
  accessToken: string;
  refreshToken: string;
  created: boolean;
  user: {
    displayName: string;
    identifier: string;
  };
}

// ─── Raw API response helpers ───
export function parseOtpTicket(raw: Record<string, unknown>): OtpTicketDTO {
  return {
    requestId: (raw.requestId as string) ?? '',
    maskedTarget: (raw.maskedTarget as string) ?? '',
    target: (raw.target as string) ?? '',
    channel: (raw.channel as AuthChannel) ?? 'phone',
  };
}

export function parseAuthVerifyResult(raw: Record<string, unknown>): AuthVerifyResultDTO {
  const user = (raw.user as Record<string, unknown>) ?? {};
  return {
    accessToken: (raw.accessToken as string) ?? '',
    refreshToken: (raw.refreshToken as string) ?? '',
    created: (raw.created as boolean) ?? false,
    user: {
      displayName: (user.displayName as string) ?? 'Nutrilis User',
      identifier: (user.identifier as string) ?? '',
    },
  };
}
