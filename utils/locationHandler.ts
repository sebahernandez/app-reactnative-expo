import { TodoLocation } from '@/hooks/use-todos';
import * as Location from 'expo-location';

export const getCurrentLocation = async (): Promise<TodoLocation | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permiso de ubicación denegado');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    // Obtener dirección desde coordenadas (geocodificación inversa)
    const reverseGeocodeResult = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    let address = 'Ubicación desconocida';
    if (reverseGeocodeResult && reverseGeocodeResult.length > 0) {
      const result = reverseGeocodeResult[0];
      address = `${result.city || ''}, ${result.region || ''}, ${result.country || ''}`.trim();
    }

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address,
    };
  } catch (error) {
    console.error('Error obteniendo ubicación:', error);
    return null;
  }
};
