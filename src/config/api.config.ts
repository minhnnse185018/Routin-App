// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh',
    GOOGLE_AUTH: '/auth/google',
    FACEBOOK_AUTH: '/auth/facebook',
    APPLE_AUTH: '/auth/apple',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // User endpoints
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    DELETE_ACCOUNT: '/user/account',
  },
  
  // Habits endpoints (for future)
  HABITS: {
    LIST: '/habits',
    CREATE: '/habits',
    GET: (id: string) => `/habits/${id}`,
    UPDATE: (id: string) => `/habits/${id}`,
    DELETE: (id: string) => `/habits/${id}`,
    PUBLIC: '/habits/public',
    PROGRESS: (id: string) => `/habits/${id}/progress`,
  },
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};
