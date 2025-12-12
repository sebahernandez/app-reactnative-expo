import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { getAuthService } from '../services/auth-service';
import { getUserService } from '../services/user-service';

interface User {
  id?: string;
  email: string;
  name?: string;
  userId?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Check if token exists on app start
  useEffect(() => {
    const checkToken = async () => {
      try {
        console.log('[AuthContext] Verificando autenticación al iniciar...');
        const authService = getAuthService();
        const isAuth = await authService.isAuthenticated();
        setIsAuthenticated(isAuth);

        // Si está autenticado, intentar cargar el usuario almacenado
        if (isAuth) {
          console.log('[AuthContext] Usuario autenticado, cargando datos...');
          const userService = getUserService();
          const storedUser = await userService.getStoredUser();
          if (storedUser) {
            console.log('[AuthContext] Usuario cargado desde almacenamiento:', storedUser);
            setUser(storedUser);
          } else {
            console.log('[AuthContext] No hay datos de usuario en almacenamiento');
          }
        } else {
          console.log('[AuthContext] Usuario no autenticado');
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  const fetchUser = useCallback(async () => {
    const authService = getAuthService();
    const isAuth = await authService.isAuthenticated();

    if (!isAuth) {
      console.log('[AuthContext] Usuario no autenticado, limpiando datos');
      setUser(null);
      return;
    }

    console.log('[AuthContext] Cargando usuario desde almacenamiento local...');
    const userService = getUserService();

    // Cargar usuario desde el almacenamiento local (única fuente de datos)
    const storedUser = await userService.getStoredUser();
    if (storedUser) {
      console.log('[AuthContext] Usuario cargado exitosamente:', storedUser);
      setUser(storedUser);
    } else {
      console.warn('[AuthContext] No hay datos de usuario almacenados');
      setUser(null);
    }
  }, []); // Sin dependencias porque no usa estado interno

  const login = useCallback(async (email: string, password: string) => {
    const authService = getAuthService();
    const result = await authService.login({ email, password });

    if (result.success) {
      setIsAuthenticated(true);

      // Usar los datos que vienen del login (única fuente de datos)
      if (result.userData && result.userData.email) {
        console.log('[AuthContext] Estableciendo usuario desde login:', result.userData);
        setUser(result.userData as User);
      } else {
        console.warn('[AuthContext] No se recibieron datos de usuario en el login');
      }
    }

    return result;
  }, []); // Sin dependencias porque no usa estado interno

  const logout = useCallback(async () => {
    const authService = getAuthService();
    const userService = getUserService();
    await authService.logout();
    await userService.clearUser();
    setIsAuthenticated(false);
    setUser(null);
  }, []); // Sin dependencias porque no usa estado interno

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
