import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout, fetchUser } = useAuth();
  const router = useRouter();

  // Cargar datos del usuario al montar el componente (solo una vez)
  useEffect(() => {
    console.log('[Profile] Pantalla de perfil montada');
    console.log('[Profile] Usuario actual:', JSON.stringify(user, null, 2));
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo al montar el componente

  const handleLogout = () => {
    console.log('[Profile] Cerrando sesión');
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>👤</Text>
        </View>

        <Text style={styles.username}>
          {user?.name || user?.email || 'Usuario'}
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || 'No disponible'}</Text>
        </View>

        {user?.name && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
        )}

        {(user?.id || user?.userId) && (
          <View style={styles.infoSection}>
            <Text style={styles.label}>ID de Usuario:</Text>
            <Text style={styles.value}>{user.id || user.userId}</Text>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.label}>Estado:</Text>
          <Text style={styles.value}>
            {user ? '✓ Autenticado' : '⚠ Sin datos de usuario'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    fontSize: 60,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});