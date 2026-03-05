import { API_ENDPOINTS } from '../config/api.config';
import { AuthResponse, LoginRequest, SignUpRequest, ApiResponse } from '../types/api.types';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl || 'https://routin.onrender.com';
const API_TIMEOUT = parseInt(Constants.expoConfig?.extra?.apiTimeout || '30000', 10);

class ApiService {
  private baseURL: string;
  private timeout: number;
  private maxRetries: number;
  private retryDelay: number;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.maxRetries = 2; // Reduced from 3 to be more reasonable
    this.retryDelay = 1000; // 1 second delay between retries
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<ApiResponse<T>> {
    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const url = `${this.baseURL}${endpoint}`;
      console.log(`🌐 API Request (attempt ${attempt + 1}/${this.maxRetries + 1}):`, {
        url,
        method: options.method || 'GET',
        hasBody: !!options.body,
        baseURL: this.baseURL,
        endpoint,
      });

      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('📥 API Response Status:', response.status, response.statusText);

        const data = await response.json();
        console.log('📦 API Response Data:', data);

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

        console.error(`❌ API Error (attempt ${attempt + 1}):`, error);
        lastError = error;

        // Only retry on AbortError (timeout) or network errors
        if (error.name === 'AbortError' || error.message?.includes('Network request failed')) {
          if (attempt < this.maxRetries) {
            console.log(`⏳ Retrying in ${this.retryDelay}ms... (${attempt + 1}/${this.maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            continue;
          }
        }

        // For non-timeout errors, don't retry
        break;
      }
    }

    // Handle final error
    if (lastError.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout. The server may be waking up from sleep. Please try again.',
      };
    }

    return {
      success: false,
      error: lastError.message || 'Network error. Please check your connection.',
    };
  }

  // Auth Methods
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async googleSignIn(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.GOOGLE_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async facebookSignIn(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.FACEBOOK_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async appleSignIn(token: string): Promise<AuthResponse> {
    return this.request<AuthResponse['data']>(API_ENDPOINTS.AUTH.APPLE_AUTH, {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async logout(token: string): Promise<ApiResponse<void>> {
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
