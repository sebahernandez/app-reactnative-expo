import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Todo } from '@/hooks/use-todos';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#fff',
          borderColor: isDark ? '#333' : '#e0e0e0',
        },
      ]}>
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

      <View style={styles.content}>
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

      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: '#ff6b6b' }]}
        onPress={() => onDelete(todo.id)}
        activeOpacity={0.7}>
        <ThemedText style={styles.deleteButtonText}>×</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 24,
  },
});