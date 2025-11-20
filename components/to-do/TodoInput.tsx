/**
 * GUÍA DE TAMAÑOS DE BOTONES (Estandarizado para UX/UI consistente)
 * 
 * - Botones principales (Agregar, Cancelar, Limpiar): 48px height
 * - Botones de acción (Cámara, Galería, Ubicación): 48px height
 * - Botones flotantes/FAB (+): 48x48px
 * - Botones pequeños (×, remover): 40x40px
 * - Checkbox: 24x24px
 */

import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TodoLocation } from '@/hooks/use-todos';
import { pickImageFromCamera, pickImageFromGallery } from '@/utils/imageHandler';
import { getCurrentLocation } from '@/utils/locationHandler';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface TodoInputProps {
  onAddTodo: (title: string, imageUri?: string, location?: TodoLocation) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<TodoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandForm, setExpandForm] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddTodo = async () => {
    if (title.trim()) {
      onAddTodo(title, imageUri || undefined, location || undefined);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setImageUri(null);
    setLocation(null);
    setExpandForm(false);
  };

  const handleCameraPress = async () => {
    setIsLoading(true);
    const result = await pickImageFromCamera();
    if (result) {
      setImageUri(result);
      // Capturar ubicación automáticamente al tomar foto
      const locationResult = await getCurrentLocation();
      if (locationResult) {
        setLocation(locationResult);
      }
    }
    setIsLoading(false);
  };

  const handleGalleryPress = async () => {
    setIsLoading(true);
    const result = await pickImageFromGallery();
    if (result) {
      setImageUri(result);
      // Capturar ubicación automáticamente al seleccionar foto
      const locationResult = await getCurrentLocation();
      if (locationResult) {
        setLocation(locationResult);
      }
    }
    setIsLoading(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5',
          borderColor: isDark ? '#333' : '#ddd',
        },
      ]}>
      <TextInput
        style={[
          styles.titleInput,
          {
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        placeholder="Título de la tarea..."
        placeholderTextColor={isDark ? '#888' : '#ccc'}
        value={title}
        onChangeText={setTitle}
      />

      {!expandForm ? (
        <TouchableOpacity
          style={[styles.expandButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => setExpandForm(true)}>
          <ThemedText style={styles.buttonText}>+</ThemedText>
        </TouchableOpacity>
      ) : (
        <ScrollView style={styles.expandedForm} scrollEnabled={false}>
          {/* Foto preview con ubicación */}
          {imageUri && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.preview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setImageUri(null)}>
                <ThemedText style={styles.removeButtonText}>×</ThemedText>
              </TouchableOpacity>
              
              {/* Ubicación debajo de la foto */}
              {location && (
                <View style={styles.locationBadge}>
                  <ThemedText style={styles.locationBadgeText}>{location.address}</ThemedText>
                </View>
              )}
            </View>
          )}

          {/* SECCIÓN: Captura de Foto y Ubicación */}
          <View style={styles.buttonSection}>
            {/* Botón: Tomar Foto (solo borde) */}
            <TouchableOpacity
              style={[styles.outlineButton, { borderColor: '#2196F3' }]}
              onPress={handleCameraPress}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#2196F3" size="small" />
              ) : (
                <ThemedText style={[styles.outlineButtonText, { color: '#2196F3' }]}>
                  Tomar Foto
                </ThemedText>
              )}
            </TouchableOpacity>

            {/* Botón: Galería */}
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              onPress={handleGalleryPress}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <ThemedText style={styles.actionButtonText}>Galería</ThemedText>
              )}
            </TouchableOpacity>
          </View>

          {/* SECCIÓN: Confirmar/Cancelar */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleAddTodo}
              disabled={!title.trim()}>
              <ThemedText style={styles.confirmButtonText}>Agregar Tarea</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#666' }]}
              onPress={() => setExpandForm(false)}>
              <ThemedText style={styles.confirmButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  expandButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  expandedForm: {
    gap: 12,
  },
  buttonSection: {
    marginVertical: 12,
    gap: 6,
  },
  previewContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  locationBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FF9800',
    borderRadius: 6,
  },
  locationBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  outlineButton: {
    width: '100%',
    height: 48,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  actionButton: {
    width: '100%',
    height: 48,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
