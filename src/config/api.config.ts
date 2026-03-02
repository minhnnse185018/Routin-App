// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/Auth/login',
    REGISTER: '/api/Auth/register',
    SEND_OTP: '/api/Auth/register/otp/send',
    VERIFY_OTP: '/api/Auth/register/otp/verify',
    LOGOUT: '/api/Auth/logout',
    REFRESH_TOKEN: '/api/Auth/refresh',
    GOOGLE_AUTH: '/api/Auth/google',
    FACEBOOK_AUTH: '/api/Auth/facebook',
    APPLE_AUTH: '/api/Auth/apple',
    FORGOT_PASSWORD: '/api/Auth/forgot-password',
    RESET_PASSWORD: '/api/Auth/reset-password',
    VERIFY_EMAIL: '/api/Auth/verify-email',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    CHANGE_PASSWORD: '/api/user/change-password',
    DELETE_ACCOUNT: '/api/user/account',
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
