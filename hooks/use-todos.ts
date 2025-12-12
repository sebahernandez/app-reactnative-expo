import { useCallback, useEffect, useState } from 'react';
import { getImageService } from '../services/image-service';
import { getImageService as getImageSvc, getTodoService } from '../services';
import type { Todo as ApiTodo, TodoLocation as ApiTodoLocation } from '../services';

export interface TodoLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface Todo {
  id: string;
  title: string;
  imageUri?: string;
  location?: TodoLocation;
  username: string;
  completed: boolean;
  createdAt: string;
  photoUri?: string;
  updatedAt?: string;
}

export const useTodos = (currentUsername: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('[useTodos] Cargando tareas desde la API...');

      const todoService = getTodoService();
      const result = await todoService.getTodos();

      if (result.success && result.data) {
        // Convertir TODOs de la API al formato del hook
        const mappedTodos: Todo[] = result.data.map((apiTodo) => ({
          id: apiTodo.id,
          title: apiTodo.title,
          completed: apiTodo.completed,
          imageUri: apiTodo.photoUri,
          photoUri: apiTodo.photoUri,
          location: apiTodo.location,
          username: currentUsername,
          createdAt: apiTodo.createdAt,
          updatedAt: apiTodo.updatedAt,
        }));

        console.log(`[useTodos] ${mappedTodos.length} tareas cargadas`);
        setTodos(mappedTodos);
      } else {
        console.error('[useTodos] Error al cargar tareas:', result.error);
        setTodos([]);
      }
    } catch (error) {
      console.error('[useTodos] Error cargando tareas:', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUsername]);

  // Cargar tareas desde la API al montar el componente
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(
    async (title: string, imageUri?: string, location?: TodoLocation) => {
      if (title.trim() === '') return;

      try {
        console.log('[useTodos] Creando nueva tarea...');

        let photoUri = imageUri;

        // Si hay una imagen, subirla primero
        if (imageUri) {
          console.log('[useTodos] Subiendo imagen...');
          const imageService = getImageSvc();
          const uploadResult = await imageService.uploadImage(imageUri);

          if (uploadResult.success && uploadResult.imageUrl) {
            photoUri = uploadResult.imageUrl;
            console.log('[useTodos] Imagen subida:', photoUri);
          } else {
            console.error('[useTodos] Error al subir imagen:', uploadResult.error);
            // Continuar sin imagen si falla la subida
            photoUri = undefined;
          }
        }

        const todoService = getTodoService();
        const result = await todoService.createTodo({
          title: title.trim(),
          completed: false,
          location: location ? { latitude: location.latitude, longitude: location.longitude } : undefined,
          photoUri,
        });

        if (result.success && result.data) {
          console.log('[useTodos] Tarea creada exitosamente');
          // Recargar todas las tareas para obtener la lista actualizada
          await loadTodos();
        } else {
          console.error('[useTodos] Error al crear tarea:', result.error);
        }
      } catch (error) {
        console.error('[useTodos] Error al agregar tarea:', error);
      }
    },
    [loadTodos]
  );

  const updateTodo = useCallback(
    async (id: string, title?: string, imageUri?: string, location?: TodoLocation) => {
      try {
        console.log(`[useTodos] Actualizando tarea ${id}...`);

        let photoUri: string | undefined = undefined;

        // Si hay una nueva imagen, subirla primero
        if (imageUri) {
          console.log('[useTodos] Subiendo nueva imagen...');
          const imageService = getImageSvc();
          const uploadResult = await imageService.uploadImage(imageUri);

          if (uploadResult.success && uploadResult.imageUrl) {
            photoUri = uploadResult.imageUrl;
            console.log('[useTodos] Nueva imagen subida:', photoUri);
          } else {
            console.error('[useTodos] Error al subir nueva imagen:', uploadResult.error);
          }
        }

        const todoService = getTodoService();
        const updateData: any = {};

        if (title !== undefined) updateData.title = title.trim();
        if (photoUri !== undefined) updateData.photoUri = photoUri;
        if (location !== undefined) {
          updateData.location = { latitude: location.latitude, longitude: location.longitude };
        }

        const result = await todoService.updateTodo(id, updateData);

        if (result.success && result.data) {
          console.log('[useTodos] Tarea actualizada exitosamente');
          // Recargar todas las tareas para obtener la lista actualizada
          await loadTodos();
        } else {
          console.error('[useTodos] Error al actualizar tarea:', result.error);
        }
      } catch (error) {
        console.error('[useTodos] Error al actualizar tarea:', error);
      }
    },
    [loadTodos]
  );

  const removeTodo = useCallback(
    async (id: string) => {
      try {
        console.log(`[useTodos] Eliminando tarea ${id}...`);
        const todoService = getTodoService();
        const result = await todoService.deleteTodo(id);

        if (result.success) {
          console.log('[useTodos] Tarea eliminada exitosamente');
          // Actualizar el estado local inmediatamente para mejor UX
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        } else {
          console.error('[useTodos] Error al eliminar tarea:', result.error);
        }
      } catch (error) {
        console.error('[useTodos] Error al eliminar tarea:', error);
      }
    },
    []
  );

  const toggleTodo = useCallback(
    async (id: string) => {
      try {
        console.log(`[useTodos] Alternando estado de tarea ${id}...`);

        // Encontrar la tarea actual
        const todo = todos.find((t) => t.id === id);
        if (!todo) {
          console.error('[useTodos] Tarea no encontrada');
          return;
        }

        // Actualizar el estado local inmediatamente para mejor UX
        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );

        const todoService = getTodoService();
        const result = await todoService.updateTodo(id, {
          completed: !todo.completed,
        });

        if (result.success) {
          console.log('[useTodos] Tarea actualizada exitosamente');
        } else {
          console.error('[useTodos] Error al actualizar tarea:', result.error);
          // Revertir el cambio local si falla
          setTodos((prevTodos) =>
            prevTodos.map((t) => (t.id === id ? { ...t, completed: todo.completed } : t))
          );
        }
      } catch (error) {
        console.error('[useTodos] Error al alternar tarea:', error);
      }
    },
    [todos]
  );

  const clearCompleted = useCallback(async () => {
    try {
      console.log('[useTodos] Eliminando tareas completadas...');
      const completedTodos = todos.filter((todo) => todo.completed);

      const todoService = getTodoService();

      // Eliminar todas las tareas completadas
      const deletePromises = completedTodos.map((todo) =>
        todoService.deleteTodo(todo.id)
      );

      await Promise.all(deletePromises);

      console.log('[useTodos] Tareas completadas eliminadas');

      // Actualizar el estado local
      setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
    } catch (error) {
      console.error('[useTodos] Error al eliminar tareas completadas:', error);
    }
  }, [todos]);

  const getTotalCount = () => todos.length;
  const getCompletedCount = () => todos.filter((todo) => todo.completed).length;

  return {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    getTotalCount,
    getCompletedCount,
    loadTodos,
  };
};
