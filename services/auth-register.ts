import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

interface RegisterCredentials {
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  error?: string;
}

interface RegisterApiResponse {
  success: boolean;
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

interface RegisterService {
  register: (credentials: RegisterCredentials) => Promise<RegisterResponse>;
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

export function getRegisterService(): RegisterService {
  const api = createApiClient();
  const REGISTER_ENDPOINT = '/auth/register';

  return {

    async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
      try {
        const { data } = await api.post<RegisterApiResponse>(REGISTER_ENDPOINT, credentials);

        console.log('[Register] Respuesta del servidor:', JSON.stringify(data, null, 2));

        // Verificar la estructura de respuesta
        if (!data.success) {
          return { success: false, error: data.error || 'Error al registrar' };
        }

        // El registro fue exitoso, extraer el token
        const token = data.data?.token;
        const userFromApi = data.data?.user;

        // Solo guardar token si existe
        if (token) {
          await AsyncStorage.setItem('authToken', token);
          console.log('[Register] Token guardado exitosamente');
        }

        // Guardar información del usuario si existe
        if (userFromApi && userFromApi.id && userFromApi.email) {
          const userData = {
            id: userFromApi.id,
            email: userFromApi.email,
            name: userFromApi.name,
          };
          await AsyncStorage.setItem('authUser', JSON.stringify(userData));
          console.log('[Register] Datos de usuario guardados:', userData);
        }

        // Retornar éxito
        return { success: true };
      } catch (error: any) {
        console.error('[Register Error]:', error.message);
        console.error('[Register Error Response]:', error.response?.data);
        return { success: false, error: error.response?.data?.error || 'El registro ha fallado' };
      }
    },
  };
}

export default getRegisterService;
