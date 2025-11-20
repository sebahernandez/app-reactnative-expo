import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

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
}

const STORAGE_KEY = '@eva1_todos';

export const useTodos = (currentUsername: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTodos) {
        const allTodos = JSON.parse(storedTodos) as Todo[];
        // Filtrar solo las tareas del usuario actual
        const userTodos = allTodos.filter((todo) => todo.username === currentUsername);
        setTodos(userTodos);
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUsername]);

  // Cargar tareas desde AsyncStorage al montar el componente
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const saveTodos = useCallback(
    async (newTodos: Todo[]) => {
      try {
        // Obtener todas las tareas de todos los usuarios
        const storedTodos = await AsyncStorage.getItem(STORAGE_KEY);
        const allTodos = storedTodos ? JSON.parse(storedTodos) : [];

        // Reemplazar las tareas del usuario actual
        const otherUsersTodos = allTodos.filter((todo: Todo) => todo.username !== currentUsername);
        const updatedAllTodos = [...otherUsersTodos, ...newTodos];

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllTodos));
        setTodos(newTodos);
      } catch (error) {
        console.error('Error guardando tareas:', error);
      }
    },
    [currentUsername]
  );

  const addTodo = useCallback(
    (title: string, imageUri?: string, location?: TodoLocation) => {
      if (title.trim() === '') return;

      const newTodo: Todo = {
        id: Date.now().toString(),
        title: title.trim(),
        imageUri,
        location,
        username: currentUsername,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      const updatedTodos = [newTodo, ...todos];
      saveTodos(updatedTodos);
    },
    [todos, currentUsername, saveTodos]
  );

  const removeTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      saveTodos(updatedTodos);
    },
    [todos, saveTodos]
  );

  const toggleTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(updatedTodos);
    },
    [todos, saveTodos]
  );

  const clearCompleted = useCallback(() => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    saveTodos(updatedTodos);
  }, [todos, saveTodos]);

  const getTotalCount = () => todos.length;
  const getCompletedCount = () => todos.filter((todo) => todo.completed).length;

  return {
    todos,
    isLoading,
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    getTotalCount,
    getCompletedCount,
    loadTodos,
  };
};
