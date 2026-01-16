# RoutinApp - Setup & Configuration Guide

## 📋 Tổng quan dự án

RoutinApp là ứng dụng React Native sử dụng Expo Router để quản lý thói quen và habits. Dự án đã được cấu hình với:

- ✅ Environment variables (.env)
- ✅ Mock API cho testing
- ✅ Authentication flow (Login/SignUp)
- ✅ Form validation
- ✅ Local storage với AsyncStorage
- ✅ TypeScript types
- ✅ API service architecture

---

## 🚀 Bắt đầu

### 1. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 2. Cấu hình Environment Variables

File `.env` đã được tạo với cấu hình mặc định:

```env
# API Configuration
API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=30000

# Mock Mode (set to true to use mock API)
USE_MOCK_API=true

# Environment
NODE_ENV=development
```

**Chú ý:**
- `USE_MOCK_API=true`: Sử dụng mock API (không cần backend)
- `USE_MOCK_API=false`: Kết nối với backend thật

### 3. Chạy ứng dụng

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

---

## 📁 Cấu trúc thư mục mới

```
RoutinApp/
├── .env                          # Environment variables
├── .env.example                  # Template cho .env
├── API_DOCUMENTATION.md          # API docs cho backend team
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── (auth)/
│       ├── _layout.tsx
│       ├── login.tsx            # ✅ Updated với API integration
│       └── signup.tsx           # ✅ Updated với API integration
└── src/
    ├── config/
    │   └── api.config.ts        # API endpoints configuration
    ├── services/
    │   ├── api.service.ts       # Main API service
    │   └── mockApi.service.ts   # Mock API implementation
    ├── types/
    │   └── api.types.ts         # TypeScript type definitions
    └── utils/
        ├── validation.ts        # Form validation functions
        └── storage.ts           # AsyncStorage utilities
```

---

## 🔑 Các field API đã định nghĩa

### Authentication Fields

#### Login Request
```typescript
{
  email: string,      // Required, valid email format
  password: string    // Required, min 8 characters
}
```

#### SignUp Request
```typescript
{
  firstName: string,  // Required, min 2 characters
  lastName: string,   // Required, min 2 characters
  email: string,      // Required, valid email format
  password: string    // Required, min 8 chars, 1 uppercase, 1 number
}
```

#### Auth Response
```typescript
{
  success: boolean,
  message?: string,
  data?: {
    token: string,
    refreshToken?: string,
    user: {
      id: string,
      email: string,
      firstName: string,
      lastName: string,
      avatar?: string,
      createdAt: string
    }
  },
  error?: string
}
```

---

## 🎯 Mock API - Credentials để test

### Login
- **Email**: `test@example.com`
- **Password**: `password123`

### Sign Up
- Chấp nhận bất kỳ email/password hợp lệ nào
- Password phải có ít nhất 8 ký tự, 1 chữ hoa, 1 số

### Social Login (Google/Facebook/Apple)
- Tất cả đều hoạt động với mock API
- Không cần thực sự OAuth tokens

---

## 🔌 API Endpoints

Chi tiết đầy đủ xem trong file `API_DOCUMENTATION.md`

### Auth Endpoints
- `POST /auth/login` - Login with email/password
- `POST /auth/signup` - Create new account
- `POST /auth/google` - Google OAuth
- `POST /auth/facebook` - Facebook OAuth
- `POST /auth/apple` - Apple OAuth
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/verify-email` - Verify email

### User Endpoints
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update profile
- `POST /user/change-password` - Change password
- `DELETE /user/account` - Delete account

### Habits Endpoints (Future)
- `GET /habits` - List user habits
- `POST /habits` - Create habit
- `GET /habits/:id` - Get habit details
- `PUT /habits/:id` - Update habit
- `DELETE /habits/:id` - Delete habit
- `GET /habits/public` - Discover public habits
- `GET /habits/:id/progress` - Get progress
- `POST /habits/:id/progress` - Track progress

---

## 💻 Sử dụng trong Code

### Import API Service
```typescript
import apiService from '../../src/services/api.service';
import { StorageService } from '../../src/utils/storage';
import { validateLoginForm } from '../../src/utils/validation';
```

### Login Example
```typescript
const response = await apiService.login({
  email: 'test@example.com',
  password: 'password123'
});

if (response.success && response.data) {
  await StorageService.saveToken(response.data.token);
  await StorageService.saveUser(response.data.user);
  // Navigate to home
}
```

### SignUp Example
```typescript
const response = await apiService.signUp({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'Password123'
});

if (response.success && response.data) {
  await StorageService.saveToken(response.data.token);
  await StorageService.saveUser(response.data.user);
  // Navigate to home
}
```

### Validation Example
```typescript
const validation = validateLoginForm(email, password);
if (!validation.isValid) {
  // Show errors
  validation.errors.forEach(error => {
    console.log(error.field, error.message);
  });
}
```

---

## 🔄 Chuyển từ Mock sang Real Backend

Khi backend đã sẵn sàng:

1. **Cập nhật .env file:**
```env
USE_MOCK_API=false
API_BASE_URL=https://your-api-domain.com/api
```

2. **Đảm bảo backend implement đúng API contract** như trong `API_DOCUMENTATION.md`

3. **Test từng endpoint** để đảm bảo response format giống mock API

---

## ✅ Validation Rules

### Email
- Format: `something@domain.com`
- Required

### Password (Login)
- Min 8 characters
- Required

### Password (SignUp)
- Min 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Required

### Name (First/Last)
- Min 2 characters
- Required

---

## 🛠 Troubleshooting

### Lỗi: "Module not found: @react-native-async-storage/async-storage"
```bash
npx expo install @react-native-async-storage/async-storage
```

### Lỗi: "Module not found: expo-constants"
```bash
npx expo install expo-constants
```

### Mock API không hoạt động
- Kiểm tra `.env` file có `USE_MOCK_API=true`
- Restart metro bundler: `npm start --clear`

### Form validation không chạy
- Kiểm tra import đúng functions từ `src/utils/validation.ts`
- Log ra validation result để debug

---

## 📝 Next Steps

1. **Create main app screens** (Home, Profile, Habits, etc.)
2. **Implement habits management**
3. **Add habit tracking features**
4. **Connect to real backend**
5. **Implement real OAuth (Google/Facebook/Apple)**
6. **Add push notifications**
7. **Implement offline mode**

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)

---

## 🤝 Team Communication

### Cho Backend Developer:
- Xem chi tiết API specs trong `API_DOCUMENTATION.md`
- Response format phải match với TypeScript types trong `src/types/api.types.ts`
- Test credentials: `test@example.com` / `password123`

### Cho Frontend Developer:
- Tất cả API calls đều qua `src/services/api.service.ts`
- Sử dụng `StorageService` để lưu token/user data
- Validation functions có sẵn trong `src/utils/validation.ts`

---

**Happy Coding! 🚀**
