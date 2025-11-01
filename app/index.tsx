import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const destination = user ? '/(tabs)' : '/(auth)/login';
    router.replace(destination);
  }, [user, isLoading, router]);

  return null;
}