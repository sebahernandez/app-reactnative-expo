import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Todo, TodoLocation } from '@/hooks/use-todos';
import { useState } from 'react';
import { Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TodoEditModal } from './TodoEditModal';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, photoUri?: string, location?: TodoLocation) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  return (
    <>
      {/* Modal para editar TODO */}
      <TodoEditModal
        visible={editModalVisible}
        todo={todo}
        onClose={() => setEditModalVisible(false)}
        onSave={onEdit}
      />

      {/* Modal para ver foto a pantalla completa */}
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}>
          <Image
            source={{ uri: todo.photoUri }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>

      {/* Contenido principal */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: isDark ? '#1a1a1a' : '#fff',
            borderColor: isDark ? '#333' : '#e0e0e0',
          },
        ]}>
        {/* Foto */}
        {todo.photoUri && (
          <TouchableOpacity onPress={() => setImageModalVisible(true)}>
            <Image source={{ uri: todo.photoUri }} style={styles.image} />
          </TouchableOpacity>
        )}

        {/* Contenido principal */}
        <View style={styles.mainContent}>
        {/* Checkbox y título */}
        <View style={styles.titleRow}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              {
                backgroundColor: todo.completed ? '#4CAF50' : 'transparent',
                borderColor: todo.completed ? '#4CAF50' : isDark ? '#666' : '#bbb',
              },
            ]}
            onPress={() => onToggle(todo.id)}
            activeOpacity={0.6}>
            {todo.completed && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </TouchableOpacity>

          <View style={styles.textContent}>
            <ThemedText
              style={[
                styles.text,
                {
                  textDecorationLine: todo.completed ? 'line-through' : 'none',
                  opacity: todo.completed ? 0.6 : 1,
                },
              ]}>
              {todo.title}
            </ThemedText>
          </View>
        </View>

        {/* Ubicación */}
        {todo.location && (
          <View style={styles.locationContainer}>
            <ThemedText style={styles.locationText}>📍 {todo.location.address}</ThemedText>
            <ThemedText style={styles.coordinatesText}>
              {todo.location.latitude.toFixed(4)}, {todo.location.longitude.toFixed(4)}
            </ThemedText>
          </View>
        )}

        {/* Fecha de creación */}
        <ThemedText style={styles.dateText}>
          {new Date(todo.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </ThemedText>
      </View>

      {/* Botones de acción */}
      <View style={styles.actionButtons}>
        {/* Botón editar */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
          onPress={() => setEditModalVisible(true)}
          activeOpacity={0.7}>
          <ThemedText style={styles.actionButtonText}>✎</ThemedText>
        </TouchableOpacity>

        {/* Botón eliminar */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#ff6b6b' }]}
          onPress={() => onDelete(todo.id)}
          activeOpacity={0.7}>
          <ThemedText style={styles.actionButtonText}>×</ThemedText>
        </TouchableOpacity>
      </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  mainContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    flexShrink: 0,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textContent: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  locationContainer: {
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    opacity: 0.7,
  },
  coordinatesText: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  dateText: {
    fontSize: 11,
    opacity: 0.5,
    marginTop: 6,
  },
  actionButtons: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});