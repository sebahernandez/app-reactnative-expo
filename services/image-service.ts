import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

/**
 * Respuesta de la API para subida de imagen
 */
interface ImageUploadApiResponse {
  success: boolean;
  data?: {
    imageId: string;
    userId: string;
    url: string;
    filename: string;
    mimeType: string;
    size: number;
    createdAt: string;
  };
  error?: string;
}

/**
 * Respuesta del servicio de imágenes
 */
export interface ImageServiceResponse {
  success: boolean;
  imageUrl?: string;
  imageId?: string;
  error?: string;
}

export interface ImageService {
  uploadImage: (imageUri: string, filename?: string) => Promise<ImageServiceResponse>;
  getImageUrl: (userId: string, imageId: string) => string;
  deleteImage: (userId: string, imageId: string) => Promise<ImageServiceResponse>;
}

/**
 * Crear instancia de Axios para peticiones a la API
 */
function createApiClient(): AxiosInstance {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://todo-list.dobleb.cl';

  const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 segundos para subida de imágenes
    headers: {
      'Content-Type': 'multipart/form-data',
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
      console.error('[Image API Error]:', error.response?.data?.error || error.message);
      return Promise.reject(error);
    }
  );

  return api;
}

/**
 * Obtener servicio de imágenes
 */
export function getImageService(): ImageService {
  const api = createApiClient();
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://todo-list.dobleb.cl';
  const IMAGES_ENDPOINT = '/images';

  return {
    /**
     * Subir una imagen a la API
     * @param imageUri - URI de la imagen local
     * @param filename - Nombre del archivo (opcional)
     */
    async uploadImage(imageUri: string, filename?: string): Promise<ImageServiceResponse> {
      try {
        console.log('[ImageService] Subiendo imagen:', imageUri);

        // Crear FormData para enviar la imagen
        const formData = new FormData();

        // Obtener el nombre y tipo del archivo desde la URI
        const uriParts = imageUri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const fileName = filename || `photo_${Date.now()}.${fileType}`;

        // Agregar la imagen al FormData
        // En React Native, FormData espera un objeto con uri, type y name
        formData.append('image', {
          uri: imageUri,
          type: `image/${fileType}`,
          name: fileName,
        } as any);

        console.log('[ImageService] Enviando FormData...');
        const { data } = await api.post<ImageUploadApiResponse>(IMAGES_ENDPOINT, formData);

        console.log('[ImageService] Respuesta:', JSON.stringify(data, null, 2));

        if (data.success && data.data) {
          console.log('[ImageService] Imagen subida exitosamente:', data.data.url);
          return {
            success: true,
            imageUrl: data.data.url,
            imageId: data.data.imageId,
          };
        }

        return { success: false, error: data.error || 'Error al subir la imagen' };
      } catch (error: any) {
        console.error('[ImageService] Error al subir imagen:', error.message);
        console.error('[ImageService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al subir la imagen'
        };
      }
    },

    /**
     * Obtener la URL pública de una imagen
     * @param userId - ID del usuario propietario de la imagen
     * @param imageId - ID de la imagen
     */
    getImageUrl(userId: string, imageId: string): string {
      const url = `${API_BASE_URL}${IMAGES_ENDPOINT}/${userId}/${imageId}`;
      console.log('[ImageService] URL de imagen:', url);
      return url;
    },

    /**
     * Eliminar una imagen
     * @param userId - ID del usuario propietario de la imagen
     * @param imageId - ID de la imagen
     */
    async deleteImage(userId: string, imageId: string): Promise<ImageServiceResponse> {
      try {
        console.log(`[ImageService] Eliminando imagen ${imageId} del usuario ${userId}...`);
        const { data } = await api.delete<{ success: boolean; error?: string }>(
          `${IMAGES_ENDPOINT}/${userId}/${imageId}`
        );

        if (data.success) {
          console.log('[ImageService] Imagen eliminada exitosamente');
          return { success: true };
        }

        return { success: false, error: data.error || 'Error al eliminar la imagen' };
      } catch (error: any) {
        console.error('[ImageService] Error al eliminar imagen:', error.message);
        console.error('[ImageService] Error Response:', error.response?.data);
        return {
          success: false,
          error: error.response?.data?.error || 'Error al eliminar la imagen'
        };
      }
    },
  };
}

export default getImageService;
