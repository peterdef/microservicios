import { AuthRequest, AuthResponse, UserRegistrationRequest } from '../types/auth';
import { mockDataService } from './mockDataService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Extender la interfaz de usuario para incluir campos adicionales
interface ExtendedUser {
  id: number;
  email: string;
  password: string;
  nombres: string;
  apellidos: string;
  roles: string[];
  activo: boolean;
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
  fechaRegistro?: string;
}

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
    console.log('Login attempt with:', credentials.email);
    
    // Buscar usuario en datos mock
    const allUsers: ExtendedUser[] = mockDataService.getUsers();
    console.log('Available users:', allUsers.map((u: ExtendedUser) => ({ email: u.email, roles: u.roles })));
    
    const user = allUsers.find((u: ExtendedUser) => 
      u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      console.log('User not found or invalid credentials');
      throw new Error('Credenciales inválidas');
    }

    console.log('User found:', user);

    // Generar token simulado
    const token = `mock_token_${user.id}_${Date.now()}`;
    const refreshToken = `refresh_token_${user.id}_${Date.now()}`;

    // Guardar en localStorage
    this.tokenUtils.setToken(token);
    this.tokenUtils.setRefreshToken(refreshToken);
    this.tokenUtils.setUser(user);

    const response = {
      token,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        nombres: user.nombres,
        apellidos: user.apellidos,
        roles: user.roles,
        activo: user.activo,
        afiliacion: user.afiliacion || '',
        orcid: user.orcid || '',
        biografia: user.biografia || '',
        fotoUrl: user.fotoUrl || '',
        fechaRegistro: user.fechaRegistro || ''
      }
    };

    console.log('Login response:', response);
    return response;
  }

  async register(userData: UserRegistrationRequest): Promise<AuthResponse> {
    // Verificar que el email no exista
    const allUsers: ExtendedUser[] = mockDataService.getUsers();
    const existingUser = allUsers.find((u: ExtendedUser) => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Crear nuevo usuario usando el servicio mock
    const newUser = mockDataService.addUser({
      email: userData.email,
      password: userData.password,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      roles: userData.roles || ['ROLE_AUTOR'],
      afiliacion: userData.afiliacion || '',
      orcid: userData.orcid || '',
      biografia: userData.biografia || '',
      fotoUrl: userData.fotoUrl || ''
    });

    // Generar token simulado
    const token = `mock_token_${newUser.id}_${Date.now()}`;
    const refreshToken = `refresh_token_${newUser.id}_${Date.now()}`;

    // Guardar en localStorage
    this.tokenUtils.setToken(token);
    this.tokenUtils.setRefreshToken(refreshToken);
    this.tokenUtils.setUser(newUser);

    return {
      token,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombres: newUser.nombres,
        apellidos: newUser.apellidos,
        roles: newUser.roles,
        activo: newUser.activo,
        afiliacion: newUser.afiliacion || '',
        orcid: newUser.orcid || '',
        biografia: newUser.biografia || '',
        fotoUrl: newUser.fotoUrl || '',
        fechaRegistro: newUser.fechaRegistro || ''
      }
    };
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.tokenUtils.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Simular refresh de token
    const user = this.tokenUtils.getUser();
    if (!user) {
      throw new Error('No user found');
    }

    const newToken = `mock_token_${user.id}_${Date.now()}`;
    const newRefreshToken = `refresh_token_${user.id}_${Date.now()}`;

    this.tokenUtils.setToken(newToken);
    this.tokenUtils.setRefreshToken(newRefreshToken);

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      user
    };
  }

  async getCurrentUser(): Promise<any> {
    const user = this.tokenUtils.getUser();
    if (!user) {
      throw new Error('No user found');
    }
    return user;
  }

  // Método para obtener todos los usuarios (para admin)
  async getAllUsers(): Promise<any[]> {
    return mockDataService.getUsers();
  }

  // Método para actualizar usuario
  async updateUser(id: number, userData: any): Promise<any> {
    return mockDataService.updateUser(id, userData);
  }

  // Método para eliminar usuario
  async deleteUser(id: number): Promise<void> {
    mockDataService.deleteUser(id);
  }

  // Método para limpiar datos mock
  async clearMockData(): Promise<void> {
    mockDataService.clearAllData();
  }

  // Método para resetear a datos por defecto
  async resetToDefaults(): Promise<void> {
    mockDataService.resetToDefaults();
  }

  // Método para exportar datos
  async exportData(): Promise<any> {
    return mockDataService.exportData();
  }

  // Método para importar datos
  async importData(data: any): Promise<void> {
    mockDataService.importData(data);
  }
}

export const authService = new AuthService();
export const tokenUtils = new TokenUtils();
