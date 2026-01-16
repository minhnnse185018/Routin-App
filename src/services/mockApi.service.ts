import { AuthResponse, LoginRequest, SignUpRequest, User } from '../types/api.types';

// Mock database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    avatar: 'https://via.placeholder.com/150',
    createdAt: new Date().toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockApiService {
  private isLoggedIn = false;
  private currentUser: User | null = null;

  // Mock Login
  async login(data: LoginRequest): Promise<AuthResponse> {
    await delay(800); // Simulate network delay

    // Check credentials
    const user = mockUsers.find(u => u.email === data.email);
    
    if (!user || data.password !== 'password123') {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    this.isLoggedIn = true;
    this.currentUser = user;

    return {
      success: true,
      message: 'Login successful',
      data: {
        token: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        user,
      },
    };
  }

  // Mock Sign Up
  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    // Check if email already exists
    if (mockUsers.find(u => u.email === data.email)) {
      return {
        success: false,
        error: 'Email already exists',
      };
    }

    // Create new user
    const newUser: User = {
      id: `${mockUsers.length + 1}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    this.isLoggedIn = true;
    this.currentUser = newUser;

    return {
      success: true,
      message: 'Account created successfully',
      data: {
        token: `mock_token_${Date.now()}`,
        refreshToken: `mock_refresh_${Date.now()}`,
        user: newUser,
      },
    };
  }

  // Mock Google Sign In
  async googleSignIn(): Promise<AuthResponse> {
    await delay(1200);

    const user: User = {
      id: '999',
      email: 'google.user@gmail.com',
      firstName: 'Google',
      lastName: 'User',
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
    };

    this.isLoggedIn = true;
    this.currentUser = user;

    return {
      success: true,
      message: 'Google sign in successful',
      data: {
        token: `mock_google_token_${Date.now()}`,
        user,
      },
    };
  }

  // Mock Facebook Sign In
  async facebookSignIn(): Promise<AuthResponse> {
    await delay(1200);

    const user: User = {
      id: '998',
      email: 'facebook.user@fb.com',
      firstName: 'Facebook',
      lastName: 'User',
      avatar: 'https://via.placeholder.com/150',
      createdAt: new Date().toISOString(),
    };

    this.isLoggedIn = true;
    this.currentUser = user;

    return {
      success: true,
      message: 'Facebook sign in successful',
      data: {
        token: `mock_facebook_token_${Date.now()}`,
        user,
      },
    };
  }

  // Mock Apple Sign In
  async appleSignIn(): Promise<AuthResponse> {
    await delay(1200);

    const user: User = {
      id: '997',
      email: 'apple.user@icloud.com',
      firstName: 'Apple',
      lastName: 'User',
      createdAt: new Date().toISOString(),
    };

    this.isLoggedIn = true;
    this.currentUser = user;

    return {
      success: true,
      message: 'Apple sign in successful',
      data: {
        token: `mock_apple_token_${Date.now()}`,
        user,
      },
    };
  }

  // Mock Logout
  async logout(): Promise<{ success: boolean; data: void }> {
    await delay(300);
    this.isLoggedIn = false;
    this.currentUser = null;
    return { success: true, data: undefined };
  }

  // Check authentication status
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export default new MockApiService();
