import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { UserProvider } from '@/contexts/UserContext';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="onboarding/creator" 
        options={{ 
          headerShown: true,
          title: 'Creator Setup',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="onboarding/brand" 
        options={{ 
          headerShown: true,
          title: 'Brand Setup',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="(brand-tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="discover" 
        options={{ 
          headerShown: true,
          title: 'Discover',
          presentation: 'card'
        }} 
      />
      <Stack.Screen 
        name="updates" 
        options={{ 
          headerShown: true,
          title: 'Updates',
          presentation: 'card'
        }} 
      />
    </Stack>
  );
}

function ThemedLayout() {
  const { colors } = useTheme();
  
  useEffect(() => {
    // Temporarily disable changing the system background color —
    // this was causing crashes on some devices when navigating to Profile.
    // SystemUI.setBackgroundColorAsync(colors.background);
    SplashScreen.hideAsync();
  }, [colors.background]);

  return <RootLayoutNav />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <ThemedLayout />
          </GestureHandlerRootView>
        </UserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
