import type { AppLocale } from '@/core/i18n/LocalizedText';
import type { AuthChannel, OtpTicketDTO } from '@/models/dto/auth.dto';
import { AuthRepo } from '@/repos/AuthRepo';

export class AuthUseCase {
  constructor(private readonly repo: AuthRepo) {}

  /** 发送 OTP */
  async sendOtp(channel: AuthChannel, target: string): Promise<OtpTicketDTO> {
    return this.repo.sendOtp(channel, target.trim());
  }

  /** 验证 OTP，返回用户显示名 */
  async verifyOtp(
    ticket: OtpTicketDTO,
    code: string,
  ): Promise<{
    displayName: string;
    identifier: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const result = await this.repo.verifyOtp(ticket, code.trim());
    return {
      displayName: result.user.displayName,
      identifier: result.user.identifier,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  /** 注销 */
  async logout(refreshToken: string): Promise<void> {
    await this.repo.logout(refreshToken);
  }

  /** 校验手机号 / 邮箱格式（客户端校验） */
  validateIdentifier(value: string, channel: AuthChannel): string | null {
    const trimmed = value.trim();
    if (!trimmed) {
      return channel === 'phone' ? '请输入手机号' : '请输入邮箱地址';
    }
    if (channel === 'phone') {
      if (!/^\d{11}$/.test(trimmed)) {
        return '请输入正确的 11 位手机号';
      }
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return '请输入正确的邮箱地址';
      }
    }
    return null;
  }
}
