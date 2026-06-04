import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'nutrilis_access_token';
const REFRESH_TOKEN_KEY = 'nutrilis_refresh_token';

/**
 * Token 持久化存储
 * 对标 Flutter SessionStore
 */
export class SessionStore {
  private _accessToken: string | null = null;
  private _refreshToken: string | null = null;

  get accessToken(): string | null {
    return this._accessToken;
  }

  get refreshToken(): string | null {
    return this._refreshToken;
  }

  /** 从安全存储恢复 token */
  async restore(): Promise<void> {
    try {
      const [access, refresh] = await Promise.all([
        SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
        SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
      ]);
      this._accessToken = access;
      this._refreshToken = refresh;
    } catch {
      // 首次启动无 token 是正常情况
    }
  }

  /** 更新 token 并持久化 */
  async update(access: string, refresh: string): Promise<void> {
    this._accessToken = access;
    this._refreshToken = refresh;
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh),
    ]);
  }

  /** 清除 token */
  async clear(): Promise<void> {
    this._accessToken = null;
    this._refreshToken = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
    ]);
  }
}

/** 全局单例 */
export const sessionStore = new SessionStore();
