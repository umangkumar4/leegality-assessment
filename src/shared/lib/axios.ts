import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@/shared/config/constants';

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      (error.code === 'ECONNABORTED' ? 'The request timed out.' : undefined) ??
      (error.response
        ? `Request failed (${status}).`
        : 'Network error. Check your connection.');
    return Promise.reject(new ApiError(message, status));
  }
);
