const env = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env;
const API_BASE_URL = (env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
const USE_DEMO_DATA = String(env.VITE_USE_DEMO_DATA).toLowerCase() === 'true';

const buildUrl = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (USE_DEMO_DATA) {
    return normalized;
  }

  if (API_BASE_URL.endsWith('/api/v1')) {
    return `${API_BASE_URL}${normalized}`;
  }

  if (normalized.startsWith('/api/')) {
    return `${API_BASE_URL}${normalized}`;
  }

  return `${API_BASE_URL}/api/v1${normalized}`;
};

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

export const apiClient = {
  isDemoMode: USE_DEMO_DATA,

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('dsa_auth_token');
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (!options.skipAuth && token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(buildUrl(path), {
      ...options,
      headers,
    });

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const errorData = await response.json();
        message = errorData.message || errorData.error || message;
      } catch {
        // ignore JSON parse errors for non-JSON responses
      }
      throw new Error(message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  },

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  },

  post<T>(path: string, body?: unknown, options: Omit<RequestOptions, 'method' | 'body'> = {}): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, {
      method: 'PUT',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  delete(path: string): Promise<void> {
    return this.request<void>(path, { method: 'DELETE' });
  },
};
