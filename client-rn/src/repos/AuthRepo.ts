import { getApiClient } from '@/core/network/apiClient';
import { ApiException } from '@/core/network/apiException';
import { ApiResponse } from '@/core/network/apiResponse';
import { sessionStore } from '@/core/network/sessionStore';
import type { AuthChannel, AuthVerifyResultDTO, OtpTicketDTO } from '@/models/dto/auth.dto';
import { parseAuthVerifyResult, parseOtpTicket } from '@/models/dto/auth.dto';

/**
 * 认证数据仓库 — 只负责 HTTP 请求 + JSON→DTO
 * 对标 Flutter AuthApiService
 */
export class AuthRepo {
  /** 发送 OTP 验证码 */
  async sendOtp(channel: AuthChannel, target: string): Promise<OtpTicketDTO> {
    const client = getApiClient();
    const response = await client.post<Record<string, unknown>>('/auth/otp/send', {
      channel,
      target,
    });
    return this.unwrap(response.data, parseOtpTicket);
  }

  /** 验证 OTP 并登录 */
  async verifyOtp(
    ticket: OtpTicketDTO,
    code: string,
  ): Promise<AuthVerifyResultDTO> {
    const client = getApiClient();
    const response = await client.post<Record<string, unknown>>('/auth/otp/verify', {
      requestId: ticket.requestId,
      channel: ticket.channel,
      target: ticket.target,
      code,
    });

    const result = this.unwrap(response.data, parseAuthVerifyResult);

    // 持久化 token
    await sessionStore.update(result.accessToken, result.refreshToken);

    return result;
  }

  /** 注销 */
  async logout(refreshToken: string): Promise<void> {
    const client = getApiClient();
    await client.post('/auth/logout', { refreshToken });
    await sessionStore.clear();
  }

  /** 统一解包 ApiResponse */
  private unwrap<T>(
    json: Record<string, unknown> | undefined,
    mapper: (raw: Record<string, unknown>) => T,
  ): T {
    if (!json) {
      throw new ApiException('Empty response');
    }
    const envelope = ApiResponse.fromJson(json, (raw) =>
      mapper(raw as Record<string, unknown>),
    );
    if (envelope.error) {
      throw new ApiException(envelope.error.message, envelope.error.code);
    }
    if (envelope.data == null) {
      throw new ApiException('Missing data payload');
    }
    return envelope.data;
  }
}
