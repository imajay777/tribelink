import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

import { lightColors, darkColors, ColorScheme } from '@/constants/colors';

const THEME_STORAGE_KEY = '@theme_mode';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useRNColorScheme();
  // Force light mode for now; dark mode is commented out temporarily.
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'auto'>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        setThemeMode(stored as 'light' | 'dark' | 'auto');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Temporarily disable changing theme; keep API as a no-op so callers won't break.
  const setTheme = async (_mode: 'light' | 'dark' | 'auto') => {
    // intentionally no-op while dark mode is commented out
    return;
  };

  // Force active theme to light. Dark mode support is commented out for now.
  const activeTheme: 'light' | 'dark' = 'light';
  const colors: ColorScheme = lightColors;

  // Toggle is disabled while dark mode is commented out.
  const toggleTheme = async () => {
    // no-op
    return;
  };

  return {
    themeMode,
    activeTheme,
    isDark: false,
    colors,
    setTheme,
    toggleTheme,
    isLoading,
  };
});
