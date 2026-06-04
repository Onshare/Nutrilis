/**
 * 自定义 API 异常
 */
export class ApiException extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNKNOWN',
  ) {
    super(message);
    this.name = 'ApiException';
  }
}
