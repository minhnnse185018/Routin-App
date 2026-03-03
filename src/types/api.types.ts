// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SendOTPRequest {
  email: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
  fullName: string;
  password: string;
}

export interface SocialAuthRequest {
  token: string;
  provider: 'google' | 'facebook' | 'apple';
}

// API Response Types
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  authProvider: number;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: string;
    user: User;
    roles?: string[];
  };
  error?: string;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode?: number;
  details?: any;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Habit Types (for future use)
export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  note?: string;
}
