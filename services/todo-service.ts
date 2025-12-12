import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

/**
 * Estructura de ubicación de un TODO
 */
export interface TodoLocation {
  latitude: number;
  longitude: number;
}

/**
 * Estructura de un TODO
 */
export interface Todo {
  id: string;
  userId: string;
  title: string;
  completed: boolean;
  location?: TodoLocation;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Datos para crear un TODO
 */
export interface CreateTodoData {
  title: string;
  completed?: boolean;
  location?: TodoLocation;
  photoUri?: string;
}

/**
 * Datos para actualizar un TODO (PATCH - parcial)
 */
export interface UpdateTodoData {
  title?: string;
  completed?: boolean;
  location?: TodoLocation;
  photoUri?: string;
}

/**
 * Respuesta de la API para operaciones de TODO
 */
interface TodoApiResponse {
  success: boolean;
  data?: Todo;
  error?: string;
}

/**
 * Respuesta de la API para listar TODOs
 */
interface TodoListApiResponse {
  success: boolean;
  data?: Todo[];
  count?: number;
  error?: string;
}

/**
 * Respuesta del servicio
 */
export interface TodoServiceResponse<T = Todo> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TodoService {
  getTodos: () => Promise<TodoServiceResponse<Todo[]>>;
  getTodo: (id: string) => Promise<TodoServiceResponse<Todo>>;
  createTodo: (todoData: CreateTodoData) => Promise<TodoServiceResponse<Todo>>;
  updateTodo: (id: string, todoData: UpdateTodoData) => Promise<TodoServiceResponse<Todo>>;
  deleteTodo: (id: string) => Promise<TodoServiceResponse<Todo>>;
}

/**
 * Crear instancia de Axios para peticiones a la API
 */
function createApiClient(): AxiosInstance {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://todo-list.dobleb.cl';

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor: Agregar token a las peticiones
  api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Interceptor: Manejar errores
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('[API Error]:', error.response?.data?.error || error.message);
      return Promise.reject(error);
    }
  );

  return api;
}

/**
 * Obtener servicio de TODO con todos los métodos
 */
export function getTodoService(): TodoService {
  const api = createApiClient();
  const TODOS_ENDPOINT = '/todos';

  return {
    /**
     * Obtener todas las tareas del usuario autenticado
     */
    async getTodos(): Promise<TodoServiceResponse<Todo[]>> {
      try {
        console.log('[TodoService] Obteniendo todas las tareas...');
        const { data } = await api.get<TodoListApiResponse>(TODOS_ENDPOINT);

        console.log('[TodoService] Respuesta:', JSON.stringify(data, null, 2));

        if (data.success && data.data) {
          console.log(`[TodoService] ${data.count || data.data.length} tareas obtenidas`);
          return { success: true, data: data.data };
        }

        return { success: false, error: 'No se recibieron datos' };
      } catch (error: any) {
        console.error('[TodoService] Error al obtener tareas:', error.message);
        console.error('[TodoService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al obtener las tareas'
        };
      }
    },

    /**
     * Obtener una tarea específica por ID
     */
    async getTodo(id: string): Promise<TodoServiceResponse<Todo>> {
      try {
        console.log(`[TodoService] Obteniendo tarea ${id}...`);
        const { data } = await api.get<TodoApiResponse>(`${TODOS_ENDPOINT}/${id}`);

        if (data.success && data.data) {
          console.log('[TodoService] Tarea obtenida:', data.data);
          return { success: true, data: data.data };
        }

        return { success: false, error: 'No se encontró la tarea' };
      } catch (error: any) {
        console.error(`[TodoService] Error al obtener tarea ${id}:`, error.message);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al obtener la tarea'
        };
      }
    },

    /**
     * Crear una nueva tarea
     */
    async createTodo(todoData: CreateTodoData): Promise<TodoServiceResponse<Todo>> {
      try {
        console.log('[TodoService] Creando nueva tarea:', todoData);
        const { data } = await api.post<TodoApiResponse>(TODOS_ENDPOINT, todoData);

        console.log('[TodoService] Respuesta de creación:', data);

        if (data.success && data.data) {
          console.log('[TodoService] Tarea creada exitosamente:', data.data);
          return { success: true, data: data.data };
        }

        return { success: false, error: data.error || 'Error al crear la tarea' };
      } catch (error: any) {
        console.error('[TodoService] Error al crear tarea:', error.message);
        console.error('[TodoService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al crear la tarea'
        };
      }
    },

    /**
     * Actualizar una tarea parcialmente (PATCH)
     */
    async updateTodo(id: string, todoData: UpdateTodoData): Promise<TodoServiceResponse<Todo>> {
      try {
        console.log(`[TodoService] Actualizando tarea ${id}:`, todoData);
        const { data } = await api.patch<TodoApiResponse>(`${TODOS_ENDPOINT}/${id}`, todoData);

        if (data.success && data.data) {
          console.log('[TodoService] Tarea actualizada exitosamente:', data.data);
          return { success: true, data: data.data };
        }

        return { success: false, error: data.error || 'Error al actualizar la tarea' };
      } catch (error: any) {
        console.error(`[TodoService] Error al actualizar tarea ${id}:`, error.message);
        console.error('[TodoService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al actualizar la tarea'
        };
      }
    },

    /**
     * Eliminar una tarea
     */
    async deleteTodo(id: string): Promise<TodoServiceResponse<Todo>> {
      try {
        console.log(`[TodoService] Eliminando tarea ${id}...`);
        const { data } = await api.delete<TodoApiResponse>(`${TODOS_ENDPOINT}/${id}`);

        if (data.success && data.data) {
          console.log('[TodoService] Tarea eliminada exitosamente:', data.data);
          return { success: true, data: data.data };
        }

        return { success: false, error: 'Error al eliminar la tarea' };
      } catch (error: any) {
        console.error(`[TodoService] Error al eliminar tarea ${id}:`, error.message);
        console.error('[TodoService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al eliminar la tarea'
        };
      }
    },
  };
}

export default getTodoService;
