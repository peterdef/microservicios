export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  username: string;
  roles: string[];
  nombres: string;
  apellidos: string;
  email: string;
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
}

export interface UserRegistrationRequest {
  username: string;
  password: string;
  nombres: string;
  apellidos: string;
  email: string;
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
  roles?: string[];
}

export interface User {
  username: string;
  nombres: string;
  apellidos: string;
  email: string;
  roles: string[];
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
  fotoUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  password: string;
  confirmPassword: string;
  nombres: string;
  apellidos: string;
  email: string;
  afiliacion?: string;
  orcid?: string;
  biografia?: string;
}
