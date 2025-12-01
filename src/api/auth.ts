import { apiClient } from './client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from './types';

export const authApi = {
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  getGoogleAuthUrl: (): string => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/';
    return `${baseUrl}/oauth2/authorization/google`;
  },
};
