import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { session, isLoading } = useAuth();
  
  // Redirect to the appropriate screen based on auth state
  if (!isLoading) {
    if (session) {
      return <Redirect href="/(tabs)" />;
    } else {
      return <Redirect href="/(auth)/login" />;
    }
  }
  
  // Return null while checking auth state
  return null;
}