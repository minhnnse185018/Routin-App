// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    SEND_OTP: '/api/auth/register/otp/send',
    VERIFY_OTP: '/api/auth/register/otp/verify',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    GOOGLE_AUTH: '/api/auth/google',
    FACEBOOK_AUTH: '/api/auth/facebook',
    APPLE_AUTH: '/api/auth/apple',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/users/me',
    UPDATE_PROFILE: '/api/users/me',
    CHANGE_PASSWORD: '/api/users/me/password',
    DELETE_ACCOUNT: '/api/users/me',
  },
  
  // Habits endpoints (for future)
  HABITS: {
    LIST: '/api/habits',
    CREATE: '/api/habits',
    GET: (id: string) => `/api/habits/${id}`,
    UPDATE: (id: string) => `/api/habits/${id}`,
    DELETE: (id: string) => `/api/habits/${id}`,
    PUBLIC: '/api/habits/public',
    PROGRESS: (id: string) => `/api/habits/${id}/progress`,
  },
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};
