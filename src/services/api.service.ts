import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, LoginRequest, SignUpRequest, ApiResponse } from '../types/api.types';
import mockApiService from './mockApi.service';
import Constants from 'expo-constants';

// Check if we should use mock API
const USE_MOCK_API = Constants.expoConfig?.extra?.useMockApi ?? true; // Default to true for development
const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(Constants.expoConfig?.extra?.apiTimeout || '30000', 10);

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || data.error || 'Something went wrong',
          statusCode: response.status,
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please try again.',
        };
      }

      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.',
      };
    }
  }

  // Auth Methods
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      return mockApiService.login(data);
    }

    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      return mockApiService.signUp(data);
    }

    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async googleSignIn(token: string): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      return mockApiService.googleSignIn();
    }

    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async facebookSignIn(token: string): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      return mockApiService.facebookSignIn();
    }

    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.FACEBOOK_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async appleSignIn(token: string): Promise<AuthResponse> {
    if (USE_MOCK_API) {
      return mockApiService.appleSignIn();
    }

    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.APPLE_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout(token: string): Promise<ApiResponse<void>> {
    if (USE_MOCK_API) {
      const result = await mockApiService.logout();
      return { success: true, data: result.data };
    }

    return this.request<void>(API_ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    }, token);
  }

  // Generic request methods
  async get<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, token);
  }

  async post<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, token);
  }

  async put<T>(endpoint: string, body: any, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }, token);
  }

  async delete<T>(endpoint: string, token?: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, token);
  }
}

export default new ApiService();
