import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '../constants';
import { ApiException } from './apiException';
import { sessionStore } from './sessionStore';

/**
 * Axios 客户端实例
 * 对标 Flutter DioClient
 */
let _client: AxiosInstance | null = null;

function createApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器：自动附加 Authorization header
  client.interceptors.request.use((config) => {
    const token = sessionStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 响应拦截器：统一错误处理
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        if (data?.error) {
          const errMsg = data.error.message ?? 'Request failed';
          throw new ApiException(errMsg, data.error.code ?? 'UNKNOWN');
        }
      }
      throw error;
    },
  );

  return client;
}

/** 获取 API 客户端单例 */
export function getApiClient(): AxiosInstance {
  if (!_client) {
    _client = createApiClient();
  }
  return _client;
}

/** 重置客户端（如切换环境） */
export function resetApiClient(): void {
  _client = null;
}
