import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

interface User {
  id?: string;
  email: string;
  name?: string;
  userId?: string;
}

interface UserResponse {
  success: boolean;
  data?: User;
  error?: string;
}

interface UserService {
  getMe: () => Promise<UserResponse>;
  saveUser: (user: User) => Promise<void>;
  getStoredUser: () => Promise<User | null>;
  clearUser: () => Promise<void>;
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

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('[API Error]:', error.response?.data?.error || error.message);
      return Promise.reject(error);
    }
  );

  return api;
}


export function getUserService(): UserService {
  const api = createApiClient();
  const ME_ENDPOINT = '/users/me';
  const USER_STORAGE_KEY = 'authUser';

  return {

    async getMe(): Promise<UserResponse> {
      try {
        console.log('[UserService] Obteniendo información del usuario desde:', ME_ENDPOINT);
        const token = await AsyncStorage.getItem('authToken');
        console.log('[UserService] Token disponible:', token ? 'Si' : 'No');

        const { data } = await api.get<{ data?: User }>(ME_ENDPOINT);

        console.log('[UserService] Respuesta de /users/me:', JSON.stringify(data, null, 2));

        if (data.data) {
          // Guardar user en storage para acceso offline
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.data));
          console.log('[UserService] Usuario guardado en almacenamiento:', data.data);
          return { success: true, data: data.data };
        }

        console.log('[UserService] No se recibieron datos del usuario');
        return { success: false, error: 'No user data received' };
      } catch (error: any) {
        console.error('[Get User Error]:', error);
        console.error('[Get User Error Response]:', error.response?.data);
        console.error('[Get User Error Status]:', error.response?.status);
        return { success: false, error: error.response?.data?.error || 'Error al obtener usuario' };
      }
    },

    /**
     * Save user to local storage
     */
    async saveUser(user: User): Promise<void> {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    },

    async getStoredUser(): Promise<User | null> {
      try {
        const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
        console.log('[UserService] Usuario almacenado:', userData ? 'Encontrado' : 'No encontrado');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('[UserService] Usuario parseado:', parsedUser);
          return parsedUser;
        }
        return null;
      } catch (error) {
        console.error('[Get Stored User Error]:', error);
        return null;
      }
    },

    async clearUser(): Promise<void> {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    },
  };
}

export default getUserService;
