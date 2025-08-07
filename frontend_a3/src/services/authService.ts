import { AuthRequest, AuthResponse, UserRegistrationRequest } from '../types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class TokenUtils {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }
}

class AuthService {
  private tokenUtils = new TokenUtils();

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = this.tokenUtils.getToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  }

  async register(userData: UserRegistrationRequest): Promise<AuthResponse> {
    const response = await this.makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.tokenUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.makeRequest('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    return response;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      await this.makeRequest('/api/auth/validate', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.tokenUtils.clearAuth();
    }
  }

  async getCurrentUser(): Promise<any> {
    return await this.makeRequest('/api/auth/me');
  }

  async updateProfile(userData: Partial<UserRegistrationRequest>): Promise<any> {
    return await this.makeRequest('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.makeRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }
}

export const authService = new AuthService();
export const tokenUtils = new TokenUtils();
