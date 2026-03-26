import { apiClient } from '../apiClient';

// Retained for UI quick-fill buttons
export const MOCK_CREDENTIALS = {
  admin: {
    email: 'admin@dsa.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Super Admin',
  },
  dsa: {
    email: 'dsa@prime.com',
    password: 'dsa123',
    role: 'DSA',
    name: 'Prime DSA Owner',
  },
  agent: {
    email: 'agent@prime.com',
    password: 'agent123',
    role: 'AGENT',
    name: 'Field Agent Kumar',
  },
};

export interface LoginRequest {
  email: string;
  password: string;
  role: 'ADMIN' | 'DSA' | 'AGENT';
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  message?: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials, { skipAuth: true });

    if (response.success) {
      localStorage.setItem('dsa_auth_token', response.token);
      localStorage.setItem('dsa_user', JSON.stringify(response.user));
    }

    return response;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('dsa_auth_token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('dsa_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem('dsa_auth_token');
    localStorage.removeItem('dsa_user');
  },
};
