'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useThemeManager() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : 'system';
  const isDark =
    currentTheme === 'dark' ||
    (currentTheme === 'system' && systemTheme === 'dark');

  const toggleTheme = () => {
    if (currentTheme === 'light') {
      setTheme('dark');
    } else if (currentTheme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => setTheme('system');

  return {
    theme: currentTheme,
    isDark,
    mounted,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    setTheme,
  };
}

// Hook for detecting system theme changes
export function useSystemTheme() {
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', updateSystemTheme);

    return () => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, []);

  return systemTheme;
}

// Hook for theme-aware color values
export function useThemeColors() {
  const { isDark } = useThemeManager();

  return {
    primary: isDark ? 'hsl(263 70% 50.4%)' : 'hsl(262 83% 58%)',
    secondary: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(210 40% 96%)',
    background: isDark ? 'hsl(222.2 84% 4.9%)' : 'hsl(0 0% 100%)',
    foreground: isDark ? 'hsl(210 40% 98%)' : 'hsl(222.2 84% 4.9%)',
    muted: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(210 40% 96%)',
    border: isDark ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
    success: 'hsl(142 76% 36%)',
    warning: 'hsl(38 92% 50%)',
    destructive: isDark ? 'hsl(0 62.8% 30.6%)' : 'hsl(0 84.2% 60.2%)',
  };
}
