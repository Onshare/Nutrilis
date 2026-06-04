/**
 * 统一 API 响应包装
 * 与后端约定的 data + meta + error 格式一致
 */
export interface ApiErrorShape {
  code: string;
  message: string;
}

export class ApiResponse<T> {
  constructor(
    public readonly data: T | null,
    public readonly meta: Record<string, unknown> = {},
    public readonly error: ApiErrorShape | null = null,
  ) {}

  static fromJson<T>(
    json: Record<string, unknown>,
    mapper: (raw: unknown) => T,
  ): ApiResponse<T> {
    return new ApiResponse<T>(
      json.data != null ? mapper(json.data) : null,
      (json.meta as Record<string, unknown>) ?? {},
      json.error != null
        ? {
            code: (json.error as Record<string, unknown>).code as string ?? 'UNKNOWN',
            message: (json.error as Record<string, unknown>).message as string ?? 'Unknown error',
          }
        : null,
    );
  }
}
