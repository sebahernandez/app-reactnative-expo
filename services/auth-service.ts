import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  error?: string;
  userData?: {
    id?: string;
    email?: string;
    name?: string;
    userId?: string;
  };
}

interface LoginResponse {
  success?: boolean;
  data?: {
    token?: string;
    user?: {
      id?: string;
      email?: string;
      name?: string;
      createdAt?: string;
      updatedAt?: string;
    };
  };
  error?: string;
}

interface AuthService {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  getToken: () => Promise<string | null>;
}

function createApiClient(): AxiosInstance {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://todo-list.dobleb.cl';

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor: Add token to requests
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptor: Handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('[API Error]:', error.response?.data?.error || error.message);
      return Promise.reject(error);
    }
  );

  return api;
}

export function getAuthService(): AuthService {
  const api = createApiClient();
  const LOGIN_ENDPOINT = '/auth/login';

  return {

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      try {
        const { data } = await api.post<LoginResponse>(LOGIN_ENDPOINT, credentials);

        console.log('[Auth] Login Response:', JSON.stringify(data, null, 2));

        const token = data.data?.token;
        const userFromApi = data.data?.user;

        // Solo guardar token si existe
        if (token) {
          await AsyncStorage.setItem('authToken', token);
          console.log('[Auth] Token guardado exitosamente');
        }

        // Extraer datos del usuario de la respuesta del login
        // La respuesta tiene estructura: { data: { user: {...}, token: "..." } }
        const userData = {
          id: userFromApi?.id,
          email: userFromApi?.email || credentials.email,
          name: userFromApi?.name,
        };

        console.log('[Auth] Datos del usuario extraídos:', JSON.stringify(userData, null, 2));

        // Guardar información del usuario
        if (userData.id && userData.email) {
          await AsyncStorage.setItem('authUser', JSON.stringify(userData));
          console.log('[Auth] Datos de usuario guardados en AsyncStorage');
        } else {
          console.warn('[Auth] Advertencia: Datos de usuario incompletos', userData);
        }

        // Si llegó a este punto sin error, el login fue exitoso
        return { success: true, userData };
      } catch (error: any) {
        console.error('[Login Error]:', error.message);
        console.error('[Login Error Response]:', error.response?.data);
        return { success: false, error: error.response?.data?.error || 'Login ha fallado' };
      }
    },
    async logout(): Promise<void> {
      await AsyncStorage.removeItem('authToken');
    },

    async isAuthenticated(): Promise<boolean> {
      const token = await AsyncStorage.getItem('authToken');
      return !!token;
    },

    async getToken(): Promise<string | null> {
      return await AsyncStorage.getItem('authToken');
    },
  };
}

export default getAuthService;
