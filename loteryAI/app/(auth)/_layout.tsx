import { Stack } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If user is authenticated, redirect to home
  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}