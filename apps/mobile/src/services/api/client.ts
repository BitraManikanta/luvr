/**
 * Typed HTTP client for the Luvora API.
 * Automatically injects the access token and handles 401 token refresh.
 */

import { useAuthStore } from '../../stores/auth-store';

// This should be set via environment variable in a real deployment.
// For local dev, point to the Docker Compose API service.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  retry = true,
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // Token expired – attempt refresh once
  if (res.status === 401 && retry) {
    const refreshed = await useAuthStore.getState().refreshTokens();
    if (refreshed) {
      return request<T>(method, path, body, false);
    }
    throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Please log in again.');
  }

  const json = (await res.json()) as { data?: T; code?: string; message?: string };

  if (!res.ok) {
    throw new ApiError(res.status, json.code ?? 'UNKNOWN', json.message ?? 'Unknown error');
  }

  return json.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

export { ApiError };
