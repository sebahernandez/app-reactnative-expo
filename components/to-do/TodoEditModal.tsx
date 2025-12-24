import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Todo, TodoLocation } from '@/hooks/use-todos';
import { pickImageFromCamera, pickImageFromGallery } from '@/utils/imageHandler';
import { getCurrentLocation } from '@/utils/locationHandler';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface TodoEditModalProps {
  visible: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSave: (id: string, title: string, imageUri?: string, location?: TodoLocation) => void;
}

export const TodoEditModal: React.FC<TodoEditModalProps> = ({
  visible,
  todo,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [location, setLocation] = useState<TodoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Inicializar el formulario con los datos del TODO
  useEffect(() => {
    if (todo && visible) {
      setTitle(todo.title);
      setImageUri(todo.photoUri || null);
      setLocation(todo.location || null);
      setImageChanged(false);
    }
  }, [todo, visible]);

  const handleSave = () => {
    if (title.trim() && todo) {
      onSave(
        todo.id,
        title,
        imageChanged ? (imageUri || undefined) : undefined,
        imageChanged ? (location || undefined) : undefined
      );
      onClose();
    }
  };

  const handleCameraPress = async () => {
    setIsLoading(true);
    const result = await pickImageFromCamera();
    if (result) {
      setImageUri(result);
      setImageChanged(true);
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
      setImageChanged(true);
      // Capturar ubicación automáticamente al seleccionar foto
      const locationResult = await getCurrentLocation();
      if (locationResult) {
        setLocation(locationResult);
      }
    }
    setIsLoading(false);
  };

  const handleRemoveImage = () => {
    setImageUri(null);
    setLocation(null);
    setImageChanged(true);
  };

  if (!todo) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: isDark ? '#1a1a1a' : '#fff',
            },
          ]}>
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Editar Tarea</ThemedText>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Campo de título */}
            <ThemedText style={styles.label}>Título</ThemedText>
            <TextInput
              style={[
                styles.titleInput,
                {
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#444' : '#ddd',
                  backgroundColor: isDark ? '#2a2a2a' : '#f5f5f5',
                },
              ]}
              placeholder="Título de la tarea..."
              placeholderTextColor={isDark ? '#888' : '#ccc'}
              value={title}
              onChangeText={setTitle}
            />

            {/* Vista previa de imagen */}
            <ThemedText style={[styles.label, styles.labelSpacing]}>Imagen</ThemedText>
            {imageUri && (
              <View style={styles.previewContainer}>
                <Image source={{ uri: imageUri }} style={styles.preview} />
                <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
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

            {/* Botones de captura de imagen */}
            <View style={styles.buttonSection}>
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

            {/* Nota sobre la ubicación */}
            {imageChanged && (
              <View style={styles.infoBox}>
                <ThemedText style={styles.infoText}>
                  Al cambiar la imagen, la ubicación se actualizará automáticamente
                </ThemedText>
              </View>
            )}
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: '#4CAF50' }]}
              onPress={handleSave}
              disabled={!title.trim()}>
              <ThemedText style={styles.footerButtonText}>Guardar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerButton, { backgroundColor: '#666' }]}
              onPress={onClose}>
              <ThemedText style={styles.footerButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelSpacing: {
    marginTop: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
  buttonSection: {
    marginVertical: 12,
    gap: 6,
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
  infoBox: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  infoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
