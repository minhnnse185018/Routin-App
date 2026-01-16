# API Documentation for RoutinApp Backend

## Overview
This document outlines the API endpoints that the backend needs to implement for the RoutinApp mobile application.

## Base URL
```
Production: https://api.routinapp.com/api
Development: http://localhost:3000/api
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### 1. POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "firstName": "string (required, min 2 chars)",
  "lastName": "string (required, min 2 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min 8 chars, 1 uppercase, 1 number)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "string (JWT token)",
    "refreshToken": "string (optional)",
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string (optional)",
      "createdAt": "string (ISO date)"
    }
  }
}
```

**Error Response (400/409):**
```json
{
  "success": false,
  "error": "Email already exists"
}
```

---

### 2. POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "string (JWT token)",
    "refreshToken": "string (optional)",
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string (optional)",
      "createdAt": "string (ISO date)"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": "Invalid email or password"
}
```

---

### 3. POST /auth/google
Sign in with Google OAuth token.

**Request Body:**
```json
{
  "token": "string (Google ID token)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Google sign in successful",
  "data": {
    "token": "string (JWT token)",
    "user": {
      "id": "string",
      "email": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string (optional)",
      "createdAt": "string (ISO date)"
    }
  }
}
```

---

### 4. POST /auth/facebook
Sign in with Facebook OAuth token.

**Request Body:**
```json
{
  "token": "string (Facebook access token)"
}
```

**Response:** Same as Google auth

---

### 5. POST /auth/apple
Sign in with Apple OAuth token.

**Request Body:**
```json
{
  "token": "string (Apple identity token)"
}
```

**Response:** Same as Google auth

---

### 6. POST /auth/logout
Logout user and invalidate token.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 7. POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "string (new JWT token)",
    "refreshToken": "string (new refresh token, optional)"
  }
}
```

---

### 8. POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### 9. POST /auth/reset-password
Reset password with token from email.

**Request Body:**
```json
{
  "token": "string (from email link)",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

### 10. POST /auth/verify-email
Verify email address.

**Request Body:**
```json
{
  "token": "string (from verification email)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

## User Endpoints

### 11. GET /user/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "avatar": "string (optional)",
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

### 12. PUT /user/profile
Update user profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "avatar": "string (optional, URL)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "string",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "avatar": "string",
    "updatedAt": "string"
  }
}
```

---

### 13. POST /user/change-password
Change user password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### 14. DELETE /user/account
Delete user account.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Account deleted successfully"
}
```

---

## Habits Endpoints (Future Implementation)

### 15. GET /habits
Get user's habits list.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "habits": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "frequency": "daily|weekly|monthly",
        "isPublic": boolean,
        "createdAt": "string",
        "updatedAt": "string"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

---

### 16. POST /habits
Create a new habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "category": "string (required)",
  "frequency": "daily|weekly|monthly (required)",
  "isPublic": boolean (default: false)
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Habit created successfully",
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "frequency": "string",
    "isPublic": boolean,
    "createdAt": "string"
  }
}
```

---

### 17. GET /habits/:id
Get specific habit details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "frequency": "string",
    "isPublic": boolean,
    "createdAt": "string",
    "updatedAt": "string"
  }
}
```

---

### 18. PUT /habits/:id
Update a habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "category": "string (optional)",
  "frequency": "daily|weekly|monthly (optional)",
  "isPublic": boolean (optional)
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Habit updated successfully",
  "data": {
    // Updated habit object
  }
}
```

---

### 19. DELETE /habits/:id
Delete a habit.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Habit deleted successfully"
}
```

---

### 20. GET /habits/public
Get public habits (discover page).

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `category` (string, optional)
- `search` (string, optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "habits": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "category": "string",
        "frequency": "string",
        "user": {
          "id": "string",
          "firstName": "string",
          "lastName": "string",
          "avatar": "string"
        },
        "createdAt": "string"
      }
    ],
    "pagination": {
      "page": number,
      "limit": number,
      "total": number,
      "totalPages": number
    }
  }
}
```

---

### 21. GET /habits/:id/progress
Get habit progress/tracking data.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (string, ISO date)
- `endDate` (string, ISO date)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "habitId": "string",
    "progress": [
      {
        "id": "string",
        "date": "string (ISO date)",
        "completed": boolean,
        "note": "string (optional)"
      }
    ],
    "stats": {
      "totalDays": number,
      "completedDays": number,
      "streak": number,
      "completionRate": number
    }
  }
}
```

---

### 22. POST /habits/:id/progress
Track habit completion for a specific date.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "date": "string (ISO date)",
  "completed": boolean,
  "note": "string (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Progress updated successfully",
  "data": {
    "id": "string",
    "habitId": "string",
    "date": "string",
    "completed": boolean,
    "note": "string"
  }
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message",
  "details": {
    "field": "error message"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized. Please login."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "You don't have permission to access this resource."
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error. Please try again later."
}
```

---

## Notes for Backend Implementation

1. **JWT Token**: Should expire in 24 hours
2. **Refresh Token**: Should expire in 30 days
3. **Password Hashing**: Use bcrypt with salt rounds >= 10
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Email Verification**: Should be required for sign up
6. **CORS**: Allow requests from mobile app
7. **Input Validation**: Validate all inputs on server side
8. **SQL Injection**: Use parameterized queries
9. **XSS Protection**: Sanitize all user inputs
10. **File Upload**: Implement secure file upload for avatars

---

## Testing Credentials (Mock API)

For development/testing with mock API:
- **Email**: test@example.com
- **Password**: password123

The mock API will accept any other credentials for sign up.
