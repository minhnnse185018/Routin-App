// API Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
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
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    refreshToken?: string;
    user: User;
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
