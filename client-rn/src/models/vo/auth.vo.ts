import type { AuthChannel } from '@/models/dto/auth.dto';

/** 认证页视图数据 */
export interface AuthVO {
  channel: AuthChannel;
  identifier: string;
  otp: string;
  canSubmitOtp: boolean;
  maskedTarget: string;
}
