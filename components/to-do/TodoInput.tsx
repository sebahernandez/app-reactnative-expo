import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TodoInputProps {
  onAddTodo: (title: string) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [input, setInput] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddTodo = () => {
    if (input.trim()) {
      onAddTodo(input);
      setInput('');
    }
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
          styles.input,
          {
            color: isDark ? '#fff' : '#000',
            borderColor: isDark ? '#444' : '#ddd',
          },
        ]}
        placeholder="Agregar un nuevo TODO..."
        placeholderTextColor={isDark ? '#888' : '#ccc'}
        value={input}
        onChangeText={setInput}
        onSubmitEditing={handleAddTodo}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#4CAF50' }]}
        onPress={handleAddTodo}
        activeOpacity={0.7}>
        <ThemedText style={styles.buttonText}>Agregar</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
