import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTodos } from '@/hooks/use-todos';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';

export const TodoApp: React.FC = () => {
  const { user } = useAuth();
  const {
    todos,
    isLoading,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    clearCompleted,
    getTotalCount,
    getCompletedCount,
  } = useTodos(user?.name|| '');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!user) {
    return (
      <View style={styles.center}>
        <ThemedText>Debes estar autenticado</ThemedText>
      </View>
    );
  }

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
        <ThemedText style={styles.userInfo}>Usuario: {user.name}</ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : (
        <>
          <TodoInput onAddTodo={addTodo} />
          <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} onEdit={updateTodo} />

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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 6,
  },
  userInfo: {
    fontSize: 12,
    opacity: 0.5,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  clearButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  clearButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
});
