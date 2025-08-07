'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User, LoginFormData, RegisterFormData } from '../types/auth';
import { authService, tokenUtils } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (passwordData: { currentPassword: string; newPassword: string }) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = async () => {
    try {
      const token = tokenUtils.getToken();
      const user = tokenUtils.getUser();

      if (token && user) {
        const isValid = await authService.validateToken(token);
        if (isValid) {
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Try to refresh token
          try {
            await refreshToken();
          } catch (error) {
            tokenUtils.clearAuth();
            setAuthState({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        }
      } else {
        setAuthState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      tokenUtils.clearAuth();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      
      const user: User = {
        username: response.username,
        nombres: response.nombres,
        apellidos: response.apellidos,
        email: response.email,
        roles: response.roles,
        afiliacion: response.afiliacion,
        orcid: response.orcid,
        biografia: response.biografia,
        fotoUrl: response.fotoUrl,
      };

      tokenUtils.setToken(response.accessToken);
      tokenUtils.setRefreshToken(response.refreshToken);
      tokenUtils.setUser(user);

      setAuthState({
        user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  };

  const login = async (credentials: LoginFormData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authService.login(credentials);
      
      const user: User = {
        username: response.username,
        nombres: response.nombres,
        apellidos: response.apellidos,
        email: response.email,
        roles: response.roles,
        afiliacion: response.afiliacion,
        orcid: response.orcid,
        biografia: response.biografia,
        fotoUrl: response.fotoUrl,
      };

      tokenUtils.setToken(response.accessToken);
      tokenUtils.setRefreshToken(response.refreshToken);
      tokenUtils.setUser(user);

      setAuthState({
        user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Error en el login');
    }
  };

  const register = async (userData: RegisterFormData) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const { confirmPassword, ...registrationData } = userData;
      
      const response = await authService.register(registrationData);
      
      const user: User = {
        username: response.username,
        nombres: response.nombres,
        apellidos: response.apellidos,
        email: response.email,
        roles: response.roles,
        afiliacion: response.afiliacion,
        orcid: response.orcid,
        biografia: response.biografia,
        fotoUrl: response.fotoUrl,
      };

      tokenUtils.setToken(response.accessToken);
      tokenUtils.setRefreshToken(response.refreshToken);
      tokenUtils.setUser(user);

      setAuthState({
        user,
        token: response.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error(error.message || 'Error en el registro');
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      tokenUtils.clearAuth();
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const response = await authService.updateProfile(userData);
      
      const updatedUser: User = {
        ...authState.user!,
        ...response,
      };

      tokenUtils.setUser(updatedUser);
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar perfil');
    }
  };

  const changePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    try {
      await authService.changePassword(passwordData);
    } catch (error: any) {
      throw new Error(error.message || 'Error al cambiar contraseña');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    changePassword,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
