import { useCallback, useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);

  const addTodo = useCallback((title: string) => {
    if (title.trim() === '') return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date(),
    };

    setTodos((prevTodos) => [newTodo, ...prevTodos]);
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const updateTodo = useCallback((id: string, title: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, title: title.trim() } : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  }, []);

  const getTotalCount = () => todos.length;
  const getCompletedCount = () => todos.filter((todo) => todo.completed).length;

  return {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    getTotalCount,
    getCompletedCount,
  };
};
