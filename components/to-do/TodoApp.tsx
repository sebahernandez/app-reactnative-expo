import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTodos } from '@/hooks/use-todos';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';

export const TodoApp: React.FC = () => {
  const {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    getTotalCount,
    getCompletedCount,
  } = useTodos();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0a0a0a' : '#f9f9f9' },
      ]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Mi TODO List
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {getCompletedCount()} / {getTotalCount()} completados
        </ThemedText>
      </View>

      <TodoInput onAddTodo={addTodo} />

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} />

      {todos.some((todo) => todo.completed) && (
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.clearButton,
              {
                backgroundColor: isDark ? '#333' : '#e8e8e8',
              },
            ]}
            onPress={clearCompleted}
            activeOpacity={0.7}>
            <ThemedText style={styles.clearButtonText}>Limpiar completados</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  clearButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  clearButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
